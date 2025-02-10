from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List
from fastapi import HTTPException
from models import (
    Student,
    Course,
    StudentCourses,
    QRCode,
    AttendanceRecords,
    LecturerCourses,
    Lecturer,
)
from schemas import AttendanceCreate, StudentAttendanceRecord
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
            & (AttendanceRecords.date >= one_hour_ago)
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


async def get_student_attendance_details(
    db: AsyncSession, current_student: Student
) -> List[StudentAttendanceRecord]:
    # Query total QR code generations per course (total attendance sessions)
    total_qr_stmt = select(
        QRCode.course_code, func.count().label("total_sessions")
    ).group_by(QRCode.course_code)
    total_qr_result = await db.execute(total_qr_stmt)
    total_sessions = dict(total_qr_result.all())  # {course_code: total_sessions}

    # Query student's attendance count per course
    student_attendance_stmt = (
        select(
            AttendanceRecords.course_code,
            Course.course_name,
            Course.semester,
            Course.course_credits,
            Lecturer.lecturer_name,
            func.count().label("attended_sessions"),
        )
        .join(Course, Course.course_code == AttendanceRecords.course_code)
        .join(LecturerCourses, LecturerCourses.course_code == Course.course_code)
        .join(Lecturer, Lecturer.lecturer_id == LecturerCourses.lecturer_id)
        .where(AttendanceRecords.matric_number == current_student.matric_number)
        .group_by(
            AttendanceRecords.course_code,
            Course.course_name,
            Course.semester,
            Course.course_credits,
            Lecturer.lecturer_name,
        )
    )

    student_attendance_result = await db.execute(student_attendance_stmt)
    attendance_records = student_attendance_result.all()

    # Calculate attendance percentage
    attendance_data = []
    for record in attendance_records:
        total_sessions_count = total_sessions.get(
            record.course_code, 1
        )  # Avoid division by zero
        attendance_percentage = (record.attended_sessions / total_sessions_count) * 100

        attendance_data.append(
            StudentAttendanceRecord(
                matric_number=current_student.matric_number,
                course_name=record.course_name,
                course_code=record.course_code,
                lecturer_name=record.lecturer_name,
                course_credits=record.course_credits,
                semester=record.semester,
                attendance_score=round(
                    attendance_percentage, 2
                ),  # Round for cleaner output
            )
        )

    return attendance_data


# async def get_student_attendance_details(
#     db: AsyncSession, current_student: Student
# ) -> List[StudentAttendanceRecord]:
#     # Fetch attendance records for the student
#     stmt = (
#         select(
#             AttendanceRecords.course_code,
#             Course.course_name,
#             Course.semester,
#             Lecturer.lecturer_name,
#         )
#         .join(Course, Course.course_code == AttendanceRecords.course_code)
#         .join(LecturerCourses, LecturerCourses.course_code == Course.course_code)
#         .join(Lecturer, Lecturer.lecturer_id == LecturerCourses.lecturer_id)
#         .where(AttendanceRecords.matric_number == current_student.matric_number)
#     )

#     result = await db.execute(stmt)
#     attendance_records = result.all()

#     # Calculate attendance score (counting records and multiplying by 100)
#     attendance_data = {}
#     for record in attendance_records:
#         course_code = record.course_code
#         if course_code not in attendance_data:
#             attendance_data[course_code] = StudentAttendanceRecord(
#                 matric_number=current_student.matric_number,
#                 course_name=record.course_name,
#                 course_code=course_code,
#                 lecturer_name=record.lecturer_name,
#                 semester=record.semester,
#                 attendance_score=0,
#             )
#         attendance_data[
#             course_code
#         ].attendance_score += 100  # Multiply by 100 for each record

#     return list(attendance_data.values())
