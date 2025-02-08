from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, Depends
from fastapi_limiter.depends import RateLimiter  # Import rate limiter
from datetime import datetime, timedelta
from models import Lecturer, Student
from utils import get_password_hash, create_access_token, verify_password
import re


async def get_record(model, filter_condition, db: AsyncSession):
    """Reusable function to fetch a single record from the database."""
    query = select(model).where(filter_condition)
    result = await db.execute(query)
    return result.scalars().first()



def validate_password(password: str):
    """Ensure password meets security requirements."""
    if len(password) < 8:
        raise HTTPException(
            status_code=400, detail="Password must be at least 8 characters long."
        )
    if not re.search(r"\d", password):
        raise HTTPException(
            status_code=400, detail="Password must contain at least one digit."
        )
    if not re.search(r"[A-Z]", password):
        raise HTTPException(
            status_code=400,
            detail="Password must contain at least one uppercase letter.",
        )
    if not re.search(r"[a-z]", password):
        raise HTTPException(
            status_code=400,
            detail="Password must contain at least one lowercase letter.",
        )
    if not re.search(r"[!@#$%^&*()_+\-=\[\]{}|;:'\",.<>?/]", password):
        raise HTTPException(
            status_code=400,
            detail="Password must contain at least one special character (!@#$%^&* etc.).",
        )


class AuthenticationService:
    """Handles authentication logic for both lecturers and students."""

    @staticmethod
    async def register_lecturer(lecturer_data, db: AsyncSession):
        email = lecturer_data.lecturer_email.lower()  # Ensure case insensitivity

        if await get_record(Lecturer, Lecturer.lecturer_email == email, db):
            raise HTTPException(status_code=400, detail="Email already registered.")

        validate_password(lecturer_data.lecturer_password)  # Validate password

        new_lecturer = Lecturer(
            lecturer_name=lecturer_data.lecturer_name,
            lecturer_email=email,
            lecturer_department=lecturer_data.lecturer_department,
            lecturer_password=get_password_hash(lecturer_data.lecturer_password),
        )
        db.add(new_lecturer)
        await db.commit()

        return {
            "message": "Lecturer successfully registered.",
            "lecturer_email": new_lecturer.lecturer_email,
        }

    @staticmethod
    async def login_lecturer(
        lecturer_data,
        db: AsyncSession,
        rate_limit: Depends = Depends(RateLimiter(times=5, seconds=60)),
    ):
        email = lecturer_data.lecturer_email.lower()  # Ensure case insensitivity

        db_lecturer = await get_record(Lecturer, Lecturer.lecturer_email == email, db)
        if not db_lecturer:
            raise HTTPException(
                status_code=404, detail="No lecturer found with this email."
            )

        if not verify_password(
            lecturer_data.lecturer_password, db_lecturer.lecturer_password
        ):
            raise HTTPException(
                status_code=401, detail="Incorrect password. Please try again."
            )

        token = create_access_token(data={"sub": db_lecturer.lecturer_email})

        return {
            "token": token,
            "lecturer_name": db_lecturer.lecturer_name,
            "lecturer_email": db_lecturer.lecturer_email,
            "lecturer_department": db_lecturer.lecturer_department,
        }

    @staticmethod
    async def change_lecturer_password(data, db: AsyncSession):
        email = data.email.lower()  # Ensure case insensitivity

        lecturer = await get_record(Lecturer, Lecturer.lecturer_email == email, db)
        if not lecturer:
            raise HTTPException(
                status_code=404, detail="Lecturer with this email does not exist."
            )

        validate_password(data.new_password)  # Validate password

        lecturer.lecturer_password = get_password_hash(data.new_password)
        db.add(lecturer)
        await db.commit()
        await db.refresh(lecturer)

        return {"message": "Password updated successfully."}

    @staticmethod
    async def student_signup(student_data, db: AsyncSession):
        student_email = student_data.student_email.lower()  # Ensure case insensitivity
        matric_number = (
            student_data.matric_number.upper()
        )  # Ensure case consistency for matric number

        if await get_record(Student, Student.matric_number == matric_number, db):
            raise HTTPException(status_code=400, detail="Student already registered.")

        validate_password(student_data.student_password)  # Validate password

        new_student = Student(
            matric_number=matric_number,
            student_fullname=student_data.student_fullname,
            student_email=student_email,
            student_password=get_password_hash(student_data.student_password),
        )
        db.add(new_student)
        await db.commit()

        return {"message": "Student registered successfully."}

    @staticmethod
    async def student_login(
        student_data,
        db: AsyncSession,
        rate_limit: Depends = Depends(RateLimiter(times=5, seconds=60)),
    ):
        matric_number = (
            student_data.matric_number.upper()
        )  # Ensure case consistency for matric number

        db_student = await get_record(
            Student, Student.matric_number == matric_number, db
        )
        if not db_student:
            raise HTTPException(
                status_code=401, detail="No student found with this matric number."
            )

        if not verify_password(
            student_data.student_password, db_student.student_password
        ):
            raise HTTPException(
                status_code=401, detail="Incorrect password. Please try again."
            )

        token = create_access_token(data={"sub": db_student.student_email})

        return {
            "token": token,
            "matric_number": db_student.matric_number,
            "student_fullname": db_student.student_fullname,
            "student_email": db_student.student_email,
        }

    @staticmethod
    async def change_student_password(data, db: AsyncSession):
        email = data.email.lower()  # Ensure case insensitivity

        student = await get_record(Student, Student.student_email == email, db)
        if not student:
            raise HTTPException(
                status_code=404, detail="Student with this email does not exist."
            )

        validate_password(data.new_password)  # Validate password

        student.student_password = get_password_hash(data.new_password)
        db.add(student)
        await db.commit()
        await db.refresh(student)

        return {"message": "Password updated successfully."}
