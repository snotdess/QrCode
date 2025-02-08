from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException
from models import (
    Student,
    Course,
    StudentCourses,
    QRCode,
    AttendanceRecords,
)
from schemas import AttendanceCreate
from datetime import datetime, timedelta
from geopy.distance import geodesic


def is_within_timeframe(qr_time: datetime) -> bool:
    """
    Check if the QR code was generated within the last hour.
    """
    return datetime.utcnow() - qr_time <= timedelta(hours=1)


async def scan_qr_service(attendance_data: AttendanceCreate, db: AsyncSession):
    # Check if student exists
    student = await db.execute(
        select(Student).where(Student.matric_number == attendance_data.matric_number)
    )
    student = student.scalars().first()
    if not student:
        raise HTTPException(status_code=403, detail="Student not found")

    # Check if course exists
    course = await db.execute(
        select(Course).where(Course.course_code == attendance_data.course_code)
    )
    course = course.scalars().first()
    if not course:
        raise HTTPException(status_code=403, detail="Course not found")

    # Check if student is enrolled in the course
    enrollment = await db.execute(
        select(StudentCourses).where(
            (StudentCourses.matric_number == attendance_data.matric_number)
            & (StudentCourses.course_code == attendance_data.course_code)
        )
    )
    enrollment = enrollment.scalars().first()
    if not enrollment:
        raise HTTPException(
            status_code=403, detail="Student is not enrolled in this course"
        )

    # Check if a valid QR code exists
    qr_code = await db.execute(
        select(QRCode)
        .where(
            (QRCode.course_code == attendance_data.course_code)
            & (QRCode.lecturer_id == attendance_data.lecturer_id)
        )
        .order_by(QRCode.generation_time.desc())  # Get the latest QR code
    )
    qr_code = qr_code.scalars().first()
    if not qr_code:
        raise HTTPException(status_code=403, detail="QR code not found for this course")

    # Check if the QR code is still valid (within 1 hour)
    if not is_within_timeframe(qr_code.generation_time):
        raise HTTPException(status_code=403, detail="QR code has expired")

    # Check if the student has already marked attendance in the past hour
    one_hour_ago = datetime.utcnow() - timedelta(hours=1)
    existing_attendance = await db.execute(
        select(AttendanceRecords).where(
            (AttendanceRecords.matric_number == attendance_data.matric_number)
            & (AttendanceRecords.course_code == attendance_data.course_code)
            & (AttendanceRecords.date >= one_hour_ago)  # Attendance within last hour
        )
    )
    existing_attendance = existing_attendance.scalars().first()
    if existing_attendance:
        raise HTTPException(
            status_code=403,
            detail="You have already marked attendance in the last hour.",
        )

    # Check geolocation distance
    student_location = (
        round(float(attendance_data.latitude), 2),
        round(float(attendance_data.longitude), 2),
    )
    lecturer_location = (round(qr_code.latitude, 2), round(qr_code.longitude, 2))

    distance = geodesic(student_location, lecturer_location).meters

    print("Distance", distance)
    if distance > 50:
        raise HTTPException(
            status_code=403, detail="Student is not within the valid location range"
        )

    # Record attendance
    new_attendance = AttendanceRecords(
        matric_number=attendance_data.matric_number,
        course_code=attendance_data.course_code,
        status="Present",
        geo_location=f"{attendance_data.latitude},{attendance_data.longitude}",
        date=datetime.utcnow(),
    )
    db.add(new_attendance)
    await db.commit()

    return {"message": "Attendance marked successfully"}
