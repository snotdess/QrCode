from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from models import (
    Lecturer,
    Course,
    LecturerCourses,
    StudentCourses,
    AttendanceRecords,
    Student,
    LecturerCourses,
)
from utils import get_password_hash, create_access_token, verify_password
from fastapi import HTTPException
from typing import Dict


async def register_lecturer(lecturer_data, db: AsyncSession):
    query = select(Lecturer).where(
        Lecturer.lecturer_email == lecturer_data.lecturer_email
    )
    result = await db.execute(query)
    existing_lecturer = result.scalars().first()

    if existing_lecturer:
        raise HTTPException(status_code=400, detail="Email already registered.")

    hashed_password = get_password_hash(lecturer_data.lecturer_password)
    new_lecturer = Lecturer(
        lecturer_name=lecturer_data.lecturer_name,
        lecturer_email=lecturer_data.lecturer_email,
        lecturer_department=lecturer_data.lecturer_department,
        lecturer_password=hashed_password,
    )
    db.add(new_lecturer)
    await db.commit()
    await db.refresh(new_lecturer)

    return {
        "message": "Lecturer successfully registered.",
        "lecturer_email": new_lecturer.lecturer_email,
    }

async def login_lecturer(lecturer_data, db: AsyncSession):
    # Query to find lecturer by email
    query = select(Lecturer).where(
        Lecturer.lecturer_email == lecturer_data.lecturer_email
    )
    result = await db.execute(query)
    db_lecturer = result.scalars().first()

    # Raise exception if lecturer not found
    if not db_lecturer:
        raise HTTPException(status_code=404, detail="Lecturer not found.")

    # Raise exception if the password is incorrect
    if not verify_password(
        lecturer_data.lecturer_password, db_lecturer.lecturer_password
    ):
        raise HTTPException(status_code=401, detail="Incorrect password.")

    # Generate token if authentication is successful
    token = create_access_token(data={"sub": db_lecturer.lecturer_email})

    return {
        "token": token,
        "lecturer_id": db_lecturer.lecturer_id,
        "lecturer_name": db_lecturer.lecturer_name,
        "lecturer_email": db_lecturer.lecturer_email,
        "lecturer_department": db_lecturer.lecturer_department,
    }


async def change_lecturer_password(data, db: AsyncSession):
    query = select(Lecturer).where(Lecturer.lecturer_email == data.email)
    result = await db.execute(query)
    lecturer = result.scalars().first()

    if not lecturer:
        raise HTTPException(
            status_code=404, detail="Lecturer with this email does not exist"
        )

    lecturer.lecturer_password = get_password_hash(data.new_password)
    db.add(lecturer)
    await db.commit()
    await db.refresh(lecturer)

    return {"message": "Password updated successfully"}


async def get_attendance_service(course_code: str, current_lecturer, db: AsyncSession):
    # Find the course by course_code instead of course_name
    course_query = select(Course).where(
        func.trim(Course.course_code) == func.trim(course_code)
    )
    course_result = await db.execute(course_query)
    course = course_result.scalars().first()

    if not course:
        return {
            "course_name": course_code,
            "attendance": [],
        }  # ✅ Return empty response instead of message

    # Check if the lecturer is assigned to the course
    lecturer_course_query = select(LecturerCourses).where(
        (LecturerCourses.course_code == course.course_code)
        & (LecturerCourses.lecturer_id == current_lecturer.lecturer_id)
    )
    lecturer_course_result = await db.execute(lecturer_course_query)
    lecturer_course = lecturer_course_result.scalars().first()

    if not lecturer_course:
        raise HTTPException(
            status_code=403, detail="You are not assigned to this course."
        )

    # Find students enrolled in the course
    student_query = (
        select(Student.matric_number, Student.student_fullname)
        .join(StudentCourses, Student.matric_number == StudentCourses.matric_number)
        .where(StudentCourses.course_code == course.course_code)
    )
    student_result = await db.execute(student_query)
    students = student_result.fetchall()

    if not students:
        return {
            "course_name": course.course_name,
            "attendance": [],
        }  # ✅ Fix missing response structure

    # Get the last 5 attendance dates
    date_query = (
        select(AttendanceRecords.date)
        .where(AttendanceRecords.course_code == course.course_code)
        .order_by(AttendanceRecords.date.desc())
        .limit(5)
    )
    date_result = await db.execute(date_query)
    recent_dates = [record[0].strftime("%Y-%m-%d") for record in date_result.fetchall()]

    if not recent_dates:
        return {"course_name": course.course_name, "attendance": []}  # ✅ Fix

    # Fetch attendance records for students
    attendance_query = select(
        AttendanceRecords.matric_number,
        AttendanceRecords.date,
        AttendanceRecords.status,
    ).where(AttendanceRecords.course_code == course.course_code)
    attendance_result = await db.execute(attendance_query)
    attendance_records = attendance_result.fetchall()

    if not attendance_records:
        return {"course_name": course.course_name, "attendance": []}  # ✅ Fix

    # Organize attendance data
    attendance_dict: Dict[str, Dict] = {
        student[0]: {
            "matric_number": student[0],
            "full_name": student[1],
            "attendance": {
                date: "Absent" for date in recent_dates
            },  # Default to Absent
        }
        for student in students
    }

    for record in attendance_records:
        matric_no, date, status = record
        formatted_date = date.strftime("%Y-%m-%d")
        if formatted_date in recent_dates:
            attendance_dict[matric_no]["attendance"][formatted_date] = status

    # Convert to list for response
    return {
        "course_name": course.course_name,
        "attendance": list(attendance_dict.values()),
    }  # ✅ Ensure correct structure
