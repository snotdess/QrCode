#### app/routes/lecturer.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
from models import Lecturer
from schemas import LecturerCreate, LecturerLogin, LecturerToken, ChangePassword, CourseCreate, CourseResponse, QRCodeCreate, QRCodeResponse, CourseStats, LecturerCoursesListResponse
from utils import  get_current_lecturer
from services.lecturer_service import register_lecturer, login_lecturer, change_lecturer_password, create_course_for_lecturer, generate_qr_code_service, delete_qr_code_service, get_courses_for_lecturer, get_courses_stats, get_lecturer_courses
from typing import List


router = APIRouter()

# # **Lecturer Signup Route**
@router.post("/signup")
async def lecturer_signup(
    lecturer: LecturerCreate, db: AsyncSession = Depends(get_db)
):
    response = await register_lecturer(lecturer, db)
    return response

# # **Lecturer Login Route**
@router.post("/login", response_model=LecturerToken)
async def lecturer_login(
    lecturer: LecturerLogin, db: AsyncSession = Depends(get_db),
) -> LecturerToken:

    result = await login_lecturer(lecturer, db)

    return LecturerToken(
        access_token=result["token"],
        token_type="bearer",
        role="lecturer",
        lecturer_name = result["lecturer_name"],
        lecturer_email=result["lecturer_email"],
        lecturer_department=result["lecturer_department"],
    )

# #**Lecturer Change Password Route**
@router.put("/change-password", status_code=200)
async def change_password(
    data: ChangePassword, db: AsyncSession = Depends(get_db)
) -> dict[str, str]:
    return await change_lecturer_password(data, db)

# #**Lecturer Courses Creation Route**
@router.post("/courses", response_model=CourseResponse)
async def create_course(
    course: CourseCreate,
    db: AsyncSession = Depends(get_db),
    current_lecturer: Lecturer = Depends(get_current_lecturer),
):
    return await create_course_for_lecturer(course, db, current_lecturer)

# #**Lecturer QRCODE Creation Route**
@router.post("/generate_qr_code", response_model=QRCodeResponse)
async def generate_qr_code(
    qr_code_data: QRCodeCreate,
    db: AsyncSession = Depends(get_db),
    current_lecturer: Lecturer = Depends(get_current_lecturer),
):
    return await generate_qr_code_service(qr_code_data, db, current_lecturer)

# Lecturer QR Code Deletion Route
@router.delete("/delete_qr_code", status_code=204)
async def delete_qr_code(
    course_code: str,
    lecturer_name: str,
    db: AsyncSession = Depends(get_db),
    current_lecturer: Lecturer = Depends(get_current_lecturer),
):
    return await delete_qr_code_service(course_code, lecturer_name, db, current_lecturer)


@router.get("/course_info", response_model=List[CourseCreate])
async def get_course_info(
    db: AsyncSession = Depends(get_db),
    current_lecturer: Lecturer = Depends(get_current_lecturer)
):
    # Call the service to get courses
    courses = await get_courses_for_lecturer(db, current_lecturer)
    return courses

# Endpoint to get course statistics
@router.get("/course_stats", response_model=CourseStats)
async def get_course_stats(
    db: AsyncSession = Depends(get_db),
    current_lecturer: Lecturer = Depends(get_current_lecturer)
):
    # Call on the service to get course stats
    courses_stats = await get_courses_stats(db, current_lecturer)
    return courses_stats


@router.get("/lecturer_courses", response_model=LecturerCoursesListResponse)
async def fetch_lecturer_courses(db: AsyncSession = Depends(get_db)):
    """
    API route to fetch all lecturers and their registered course codes.
    """
    lecturer_courses = await get_lecturer_courses(db)
    return {"lecturer_courses": lecturer_courses}


# @router.get("/me")
# async def get_logged_in_lecturer(current_lecturer: Lecturer = Depends(get_current_lecturer), response_model=LecturerResponse):

#     details = LecturerResponse(
#         lecturer_name= current_lecturer.lecturer_name,
#         lecturer_email= current_lecturer.lecturer_email,
#         lecturer_department= current_lecturer.lecturer_department,
#         role = "lecturer"
#     )

#     return details
