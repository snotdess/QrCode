from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, func
from fastapi import HTTPException
from models import Student, Course, StudentCourses, QRCode, AttendanceRecords, LecturerCourses, Lecturer
from utils import get_password_hash, create_access_token, verify_password
from datetime import datetime, timedelta
from geopy.distance import geodesic

async def get_record(model, filter_condition, db):
    query = select(model).where(filter_condition)
    result = await db.execute(query)
    return result.scalars().first()

async def student_signup_service(student_data, db: AsyncSession):
    if await get_record(Student, Student.matric_number == student_data.matric_number, db):
        raise HTTPException(status_code=400, detail="Student already registered.")

    new_student = Student(
        matric_number=student_data.matric_number,
        student_fullname=student_data.student_fullname,
        student_email=student_data.student_email,
        student_password=get_password_hash(student_data.student_password),
    )
    db.add(new_student)
    await db.commit()
    await db.refresh(new_student)
    return {"message": "Student Registered Successfully"}

async def student_login_service(student_data, db: AsyncSession):
    db_student = await get_record(Student, Student.matric_number == student_data.matric_number, db)
    if not db_student or not verify_password(student_data.student_password, db_student.student_password):
        raise HTTPException(status_code=401, detail="Invalid credentials.")

    token = create_access_token(data={"sub": db_student.student_email})
    return {
        "token": token,
        "matric_number": db_student.matric_number,
        "student_fullname": db_student.student_fullname,
        "student_email": db_student.student_email,
    }

async def change_password_service(data, db: AsyncSession):
    student = await get_record(Student, Student.student_email == data.email, db)
    if not student:
        raise HTTPException(status_code=404, detail="Student with this email does not exist")

    student.student_password = get_password_hash(data.new_password)
    db.add(student)
    await db.commit()
    return {"message": "Password updated successfully"}

async def enroll_student_service(enrollment_data, db: AsyncSession):
    student = await get_record(Student, Student.matric_number == enrollment_data.matric_number, db)
    course = await get_record(Course, Course.course_code == enrollment_data.course_code, db)
    lecturer = await get_record(Lecturer, Lecturer.lecturer_name == enrollment_data.lecturer_name, db)

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    if not lecturer:
        raise HTTPException(status_code=404, detail="Lecturer not found")

    lecturer_course = await get_record(
        LecturerCourses,
        and_(LecturerCourses.course_code == enrollment_data.course_code, LecturerCourses.lecturer_id == lecturer.lecturer_id),
        db
    )
    if not lecturer_course:
        raise HTTPException(status_code=400, detail="The selected lecturer is not associated with the course")

    if await get_record(StudentCourses, and_(
        StudentCourses.matric_number == enrollment_data.matric_number,
        StudentCourses.course_code == enrollment_data.course_code), db):
        raise HTTPException(status_code=400, detail="Student is already enrolled in this selected course")

    new_enrollment = StudentCourses(matric_number=enrollment_data.matric_number, course_code=enrollment_data.course_code)
    db.add(new_enrollment)
    await db.commit()

    return {
        "matric_number": enrollment_data.matric_number,
        "course_code": enrollment_data.course_code,
        "lecturer_name": lecturer.lecturer_name,
        "message": f"Student {enrollment_data.matric_number} successfully enrolled in {enrollment_data.course_code} with Lecturer {lecturer.lecturer_name}"
    }


async def scan_qr_service(attendance_data, db: AsyncSession):
    student = await get_record(Student, Student.matric_number == attendance_data.matric_number, db)
    course = await get_record(Course, Course.course_code == attendance_data.course_code, db)
    student_course = await get_record(StudentCourses, and_(
        StudentCourses.matric_number == attendance_data.matric_number,
        StudentCourses.course_code == attendance_data.course_code), db)
    qr_code = await get_record(QRCode, QRCode.course_code == attendance_data.course_code, db)

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    if not student_course:
        raise HTTPException(status_code=403, detail="Student is not enrolled in this course")
    if not qr_code:
        raise HTTPException(status_code=404, detail="QR code not found for this course")

    if datetime.utcnow() > qr_code.generation_time + timedelta(hours=1):
        raise HTTPException(status_code=400, detail="QR code has expired")

    if geodesic((attendance_data.latitude, attendance_data.longitude), (qr_code.latitude, qr_code.longitude)).meters > 50:
        raise HTTPException(status_code=400, detail="You are not in the valid attendance zone")

    if await get_record(AttendanceRecords, and_(
        AttendanceRecords.matric_number == attendance_data.matric_number,
        AttendanceRecords.course_code == attendance_data.course_code,
        AttendanceRecords.date > datetime.utcnow() - timedelta(hours=1)), db):
        raise HTTPException(status_code=400, detail="Attendance already marked within the last hour")

    new_attendance = AttendanceRecords(
        matric_number=attendance_data.matric_number,
        course_code=attendance_data.course_code,
        status="Present",
        geo_location=f"{attendance_data.latitude},{attendance_data.longitude}",
        date=datetime.utcnow()
    )
    db.add(new_attendance)
    await db.commit()
    return {"message": "Attendance marked successfully"}

async def get_student_courses_service(current_student: Student, db: AsyncSession):
    query = (
        select(
            StudentCourses.course_code, Course.course_name, Course.course_credits,
            Course.semester, Lecturer.lecturer_name
        )
        .join(Course, StudentCourses.course_code == Course.course_code)
        .join(LecturerCourses, LecturerCourses.course_code == Course.course_code)
        .join(Lecturer, LecturerCourses.lecturer_id == Lecturer.lecturer_id)
        .where(StudentCourses.matric_number == current_student.matric_number)
    )
    result = await db.execute(query)
    courses = result.fetchall()

    if not courses:
        raise HTTPException(status_code=404, detail="No courses found for the student.")

    return [{
        "course_code": c.course_code, "course_name": c.course_name,
        "course_credits": c.course_credits, "semester": c.semester,
        "lecturer_name": c.lecturer_name
    } for c in courses]


async def get_student_course_stats(db:AsyncSession, current_student: Student):
    pass
