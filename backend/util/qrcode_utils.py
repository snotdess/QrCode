from backend.config import settings
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from backend.utils import filter_records
from backend.models import (
    Student,
    Course,
    StudentCourses,
    QRCode,
    AttendanceRecords,
)
from sqlalchemy import select, func
from geopy.distance import geodesic
from backend.errors.auth_errors import StudentNotFoundError
from backend.errors.qr_code_errors import HourlyQRCodeError, QRCodeNotFoundError
from backend.errors.course_errors import CourseNotFoundError, StudentEnrolledError


# --------------------
# Helper Functions
# --------------------


def is_within_timeframe(qr_time: datetime) -> bool:
    """
    Check if the QR code was generated within the last hour.
    """
    return datetime.utcnow() - qr_time <= timedelta(hours=1)


def build_qr_code_url(course_code, lecturer_id, latitude, longitude, generated_at):
    """
    Construct the QR code URL with query parameters.
    """
    base_url = settings.BASE_URL.strip("/")
    return (
        f"{base_url}/?course_code={course_code}"
        f"&lecturer_id={lecturer_id}"
        f"&latitude={latitude}"
        f"&longitude={longitude}"
        f"&generated_at={generated_at}"
    )


def get_current_utc_time():
    return datetime.utcnow()


def get_start_of_current_hour():
    now = get_current_utc_time()
    return now.replace(minute=0, second=0, microsecond=0)


async def check_recent_qr_code(
    db: AsyncSession, course_code, lecturer_id, time_threshold=timedelta(hours=1)
):
    """
    Ensure that a QR code was not generated within the last given time threshold.
    """
    one_hour_ago = get_current_utc_time() - time_threshold
    existing_qr_code = await filter_records(
        QRCode, db, course_code=course_code, lecturer_id=lecturer_id
    )

    if existing_qr_code and existing_qr_code.generation_time >= one_hour_ago:
        HourlyQRCodeError()

    return existing_qr_code


def is_within_timeframe(qr_time: datetime) -> bool:
    """Check if the QR code was generated within the last hour."""
    return datetime.utcnow() - qr_time <= timedelta(hours=1)


async def get_student(db: AsyncSession, matric_number: str) -> Student:
    result = await db.execute(
        select(Student).where(Student.matric_number == matric_number)
    )
    student = result.scalars().first()
    if not student:
        raise StudentNotFoundError()
    return student


async def get_course(db: AsyncSession, course_code: str) -> Course:
    result = await db.execute(select(Course).where(Course.course_code == course_code))
    course = result.scalars().first()
    if not course:
        raise CourseNotFoundError()
    return course


async def check_enrollment(
    db: AsyncSession, matric_number: str, course_code: str
) -> StudentCourses:
    result = await db.execute(
        select(StudentCourses).where(
            (StudentCourses.matric_number == matric_number)
            & (StudentCourses.course_code == course_code)
        )
    )
    enrollment = result.scalars().first()
    if not enrollment:
        raise StudentEnrolledError()
    return enrollment


async def get_latest_qr_code(
    db: AsyncSession, course_code: str, lecturer_id: int
) -> QRCode:
    result = await db.execute(
        select(QRCode)
        .where(
            (QRCode.course_code == course_code) & (QRCode.lecturer_id == lecturer_id)
        )
        .order_by(QRCode.generation_time.desc())
    )
    qr_code = result.scalars().first()
    if not qr_code:
        QRCodeNotFoundError()
    return qr_code


async def get_existing_attendance(
    db: AsyncSession,
    matric_number: str,
    course_code: str,
    session_start: datetime,
    session_end: datetime,
):
    result = await db.execute(
        select(AttendanceRecords).where(
            (AttendanceRecords.matric_number == matric_number)
            & (AttendanceRecords.course_code == course_code)
            & (AttendanceRecords.date >= session_start)
            & (AttendanceRecords.date < session_end)
        )
    )
    return result.scalars().first()


async def mark_absence(
    db: AsyncSession, matric_number: str, course_code: str, now: datetime
) -> None:
    absence = AttendanceRecords(
        matric_number=matric_number,
        course_code=course_code,
        status="Absent",
        geo_location="",  # Optionally set a default geolocation
        date=now,
    )
    db.add(absence)
    await db.commit()


def is_within_distance(
    student_lat: float,
    student_lon: float,
    qr_lat: float,
    qr_lon: float,
    max_distance: float = 50,
) -> bool:
    student_location = (round(student_lat, 2), round(student_lon, 2))
    lecturer_location = (round(qr_lat, 2), round(qr_lon, 2))
    distance = geodesic(student_location, lecturer_location).meters
    return distance <= max_distance
