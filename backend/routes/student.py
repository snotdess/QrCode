# #### app/routes/student.py

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db

# from sqlalchemy import select, func
from models import Student
from typing import List
from schemas import (
    StudentCreate,
    StudentLogin,
    ChangePassword,
    StudentToken,
    AttendanceCreate,
    EnrollRequest,
    EnrollResponse,
    CourseDetails,
)
from utils import get_current_student
from services.student_service import (
    student_signup_service,
    student_login_service,
    change_password_service,
    enroll_student_service,
    scan_qr_service,
    get_student_courses_service,
    get_student_course_stats,
)

router = APIRouter()


# **Student Signup Route**
@router.post("/signup")
async def student_signup(student: StudentCreate, db: AsyncSession = Depends(get_db)):
    """
    API endpoint for student signup.
    """
    return await student_signup_service(student, db)


# **Student Login Route**
@router.post("/login", response_model=StudentToken)
async def student_login(student: StudentLogin, db: AsyncSession = Depends(get_db)):
    """
    API endpoint for student login.
    """
    result = await student_login_service(student, db)

    return StudentToken(
        access_token=result["token"],
        token_type="bearer",
        role="student",
        matric_number=result["matric_number"],
        student_fullname=result["student_fullname"],
        student_email=result["student_email"],
    )


# **Student Change Password Route**
@router.put("/change-password", status_code=200)
async def change_password(data: ChangePassword, db: AsyncSession = Depends(get_db)):
    """
    API endpoint to change the password for a student.
    """
    return await change_password_service(data, db)


# **Student Enroll Course Route**
@router.post("/enroll", response_model=EnrollResponse)
async def enroll_student(
    enrollment_data: EnrollRequest, db: AsyncSession = Depends(get_db)
):
    """
    API endpoint to enroll a student in a course with a specific lecturer.
    """
    enrollment_response = await enroll_student_service(enrollment_data, db)
    return enrollment_response


# **Scan QR Code for Attendance Route**
@router.post("/scan-qr")
async def scan_qr(
    attendance_data: AttendanceCreate,
    db: AsyncSession = Depends(get_db),
    current_student: Student = Depends(get_current_student),
):
    """
    API endpoint to mark attendance via QR code scanning.
    """
    return await scan_qr_service(attendance_data, db)


# **Get Student's Enrolled Courses Route**
@router.get("/student_courses", response_model=List[CourseDetails])
async def get_student_courses(
    db: AsyncSession = Depends(get_db),
    current_student: Student = Depends(get_current_student),
):
    """
    API endpoint to retrieve the courses a student is enrolled in along with course code, name, credits, and lecturer name.
    """
    return await get_student_courses_service(current_student, db)


@router.get("/course_stats")
async def student_course_stats(
    db: AsyncSession = Depends(get_db), current_student=Depends(get_current_student)
):
    return await get_student_course_stats(db, current_student)


@router.get("/me")
async def get_logged_in_student(
    current_student: Student = Depends(get_current_student),
):
    return {
        "matric_number": current_student.matric_number,
        "FullName": current_student.student_fullname,
        "Student Email": current_student.student_email,
    }
