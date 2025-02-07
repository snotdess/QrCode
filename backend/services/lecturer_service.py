from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, func
from models import (
    Lecturer,
    Course,
    LecturerCourses,
    QRCode,
    StudentCourses,
    AttendanceRecords,
    Student,
)
from utils import get_password_hash, create_access_token, verify_password
from fastapi import HTTPException
from datetime import datetime, timedelta
from typing import List, Dict


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


async def create_course_for_lecturer(
    course, db: AsyncSession, current_lecturer: Lecturer
):
    # Check how many courses the lecturer is already assigned to
    lecturer_course_count_query = select(LecturerCourses).where(
        LecturerCourses.lecturer_id == current_lecturer.lecturer_id
    )
    result = await db.execute(lecturer_course_count_query)
    lecturer_courses = result.scalars().all()

    if len(lecturer_courses) >= 2:
        raise HTTPException(status_code=400, detail="Max Course Limit Reached.")

    # Check if the course already exists
    query = select(Course).where(Course.course_code == course.course_code)
    result = await db.execute(query)
    existing_course = result.scalars().first()

    if not existing_course:
        new_course = Course(
            course_code=course.course_code,
            course_name=course.course_name,
            course_credits=course.course_credits,
            semester=course.semester,
            creation_date=datetime.utcnow(),
        )
        db.add(new_course)
        await db.commit()
        await db.refresh(new_course)
    else:
        new_course = existing_course

    # Check if the lecturer is already assigned to this course
    lecturer_course_query = select(LecturerCourses).where(
        (LecturerCourses.course_code == course.course_code)
        & (LecturerCourses.lecturer_id == current_lecturer.lecturer_id)
    )
    lecturer_course_result = await db.execute(lecturer_course_query)
    lecturer_course = lecturer_course_result.scalars().first()

    if lecturer_course:
        raise HTTPException(
            status_code=400, detail="Lecturer already associated with this course."
        )

    # Assign the lecturer to the course
    new_lecturer_course = LecturerCourses(
        lecturer_id=current_lecturer.lecturer_id,
        course_code=course.course_code,
    )
    db.add(new_lecturer_course)
    await db.commit()

    return new_course


async def generate_qr_code_service(qr_code_data, db: AsyncSession, current_lecturer):
    if not current_lecturer:
        raise HTTPException(
            status_code=403,
            detail="You must be logged in as a lecturer to generate a QR code.",
        )

    # Check if the course exists
    query = select(Course).where(Course.course_code == qr_code_data.course_code)
    result = await db.execute(query)
    course = result.scalars().first()

    if not course:
        raise HTTPException(
            status_code=404,
            detail=f"Course with code '{qr_code_data.course_code}' does not exist.",
        )

    # Verify lecturer association with the course
    lecturer_course_query = select(LecturerCourses).where(
        (LecturerCourses.course_code == qr_code_data.course_code)
        & (LecturerCourses.lecturer_id == current_lecturer.lecturer_id)
    )
    lecturer_course_result = await db.execute(lecturer_course_query)
    lecturer_course = lecturer_course_result.scalars().first()

    if not lecturer_course:
        raise HTTPException(
            status_code=403,
            detail="You are not authorized to generate a QR code for this course.",
        )

    # Check if there is an existing QR code for the same lecturer and course in the last hour
    one_hour_ago = datetime.utcnow() - timedelta(hours=1)
    qr_code_query = select(QRCode).where(
        (QRCode.course_code == qr_code_data.course_code)
        & (QRCode.lecturer_id == current_lecturer.lecturer_id)
        & (QRCode.generation_time >= one_hour_ago)
    )
    qr_code_result = await db.execute(qr_code_query)
    existing_qr_code = qr_code_result.scalars().first()

    if existing_qr_code:
        raise HTTPException(
            status_code=400,
            detail="QR Code already generated for this course within the last hour.",
        )

    # Create a new QR code
    new_qr_code = QRCode(
        course_code=qr_code_data.course_code,
        lecturer_id=current_lecturer.lecturer_id,
        generation_time=datetime.utcnow(),
        latitude=qr_code_data.latitude,
        longitude=qr_code_data.longitude,
    )

    db.add(new_qr_code)
    await db.commit()
    await db.refresh(new_qr_code)

    return new_qr_code


async def delete_qr_code_service(
    course_code: str, lecturer_name: str, db: AsyncSession, current_lecturer
):
    if not current_lecturer:
        raise HTTPException(
            status_code=403,
            detail="You must be logged in as a lecturer to delete a QR code.",
        )

    # Verify lecturer's name
    if current_lecturer.lecturer_name != lecturer_name:
        raise HTTPException(
            status_code=403,
            detail="Lecturer name does not match the logged-in lecturer.",
        )

    # Check if the course exists
    course_query = select(Course).where(Course.course_code == course_code)
    course_result = await db.execute(course_query)
    course = course_result.scalars().first()

    if not course:
        raise HTTPException(
            status_code=404, detail=f"Course with code '{course_code}' does not exist."
        )

    # Fetch the QR Code for the given course and lecturer
    qr_code_query = select(QRCode).where(
        QRCode.course_code == course_code,
        QRCode.lecturer_id == current_lecturer.lecturer_id,
    )
    qr_code_result = await db.execute(qr_code_query)
    qr_code = qr_code_result.scalars().first()

    if not qr_code:
        raise HTTPException(
            status_code=404,
            detail=f"No QR code found for course '{course_code}' generated by you.",
        )

    # Delete the QR code
    await db.delete(qr_code)
    await db.commit()

    return {"detail": f"QR Code for course '{course_code}' deleted successfully."}


async def fetch_courses_for_lecturer(db: AsyncSession, lecturer_id: int):
    """
    Helper function to fetch courses for a given lecturer.
    """
    query = (
        select(Course)
        .join(LecturerCourses, LecturerCourses.course_code == Course.course_code)
        .where(LecturerCourses.lecturer_id == lecturer_id)
    )
    result = await db.execute(query)
    return result.scalars().all()


async def get_courses_for_lecturer(
    db: AsyncSession, current_lecturer: Lecturer
) -> List[Course]:
    """
    Get all courses associated with the current lecturer.
    """
    if not current_lecturer:
        raise HTTPException(
            status_code=403,
            detail="You must be logged in as a lecturer to access course information.",
        )

    # Fetch the courses associated with the lecturer
    courses = await fetch_courses_for_lecturer(db, current_lecturer.lecturer_id)

    # If no courses are found, return an empty list instead of a message
    if not courses:
        return []  # Return an empty list instead of a message

    return courses


async def get_courses_stats(db: AsyncSession, current_lecturer: Lecturer):
    """
    Get course statistics (total, and credits) for a lecturer.
    """
    if not current_lecturer:
        raise HTTPException(
            status_code=403,
            detail="You must be logged in as a lecturer to access course information.",
        )

    courses = await fetch_courses_for_lecturer(db, current_lecturer.lecturer_id)

    if not courses:
        return {"message": "No courses available for the current lecturer."}

    total_courses = len(courses)
    total_credits = sum(course.course_credits for course in courses)

    return {
        "total_courses": total_courses,
        "total_credits": total_credits,
    }


async def get_lecturer_courses(db: AsyncSession):
    """
    Fetches all lecturers and the associated course codes and names they have registered.
    """
    query = (
        select(
            Lecturer.lecturer_name, Course.course_code, Course.course_name
        )  # Adding course_name
        .join(LecturerCourses, Lecturer.lecturer_id == LecturerCourses.lecturer_id)
        .join(Course, LecturerCourses.course_code == Course.course_code)
    )
    result = await db.execute(query)
    lecturer_courses = result.fetchall()

    if not lecturer_courses:
        return {"message": "No lecturer-course records found."}

    return [
        {
            "lecturer_name": row[0],
            "course_code": row[1],
            "course_name": row[2],
        }  # Include course_name
        for row in lecturer_courses
    ]


async def get_lecturer_course_students(db: AsyncSession, current_lecturer: Lecturer):
    """
    Get the current lecturer's courses and the total number of students registered in each course.
    """
    if not current_lecturer:
        raise HTTPException(
            status_code=403,
            detail="You must be logged in as a lecturer to access this information.",
        )

    # Fetch courses for the lecturer
    courses = await fetch_courses_for_lecturer(db, current_lecturer.lecturer_id)

    if not courses:
        return {"message": "No courses found for the lecturer."}

    # Retrieve student count for each course
    course_student_counts = []
    for course in courses:
        query = select(func.count(StudentCourses.matric_number)).where(
            StudentCourses.course_code == course.course_code
        )
        result = await db.execute(query)
        student_count = result.scalar() or 0

        course_student_counts.append(
            {"course_name": course.course_name, "total_students": student_count}
        )

    return course_student_counts


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
