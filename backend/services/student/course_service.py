from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from fastapi import HTTPException
from models import (
    Student,
    Course,
    StudentCourses,
    LecturerCourses,
    Lecturer,
)
from utils import filter_records


class CourseService:
    @staticmethod
    async def enroll_student(enrollment_data, db: AsyncSession):
        student = await filter_records(
            Student, db, matric_number=enrollment_data.matric_number
        )
        course = await filter_records(
            Course, db, course_code=enrollment_data.course_code
        )
        lecturer = await filter_records(
            Lecturer, db, lecturer_name=enrollment_data.lecturer_name
        )

        if not student:
            raise HTTPException(status_code=404, detail="Student not found")
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")
        if not lecturer:
            raise HTTPException(status_code=404, detail="Lecturer not found")

        lecturer_course = await filter_records(
            LecturerCourses,
            db,
            course_code=enrollment_data.course_code,
            lecturer_id=lecturer.lecturer_id,
        )

        if not lecturer_course:
            raise HTTPException(
                status_code=400,
                detail="The selected lecturer is not associated with the course",
            )

        if await filter_records(
            StudentCourses,
            db,
            matric_number=enrollment_data.matric_number,
            course_code=enrollment_data.course_code,
        ):
            raise HTTPException(
                status_code=400,
                detail="Student is already enrolled in this selected course",
            )

        new_enrollment = StudentCourses(
            matric_number=enrollment_data.matric_number,
            course_code=enrollment_data.course_code,
        )
        db.add(new_enrollment)
        await db.commit()

        return {
            "matric_number": enrollment_data.matric_number,
            "course_code": enrollment_data.course_code,
            "lecturer_name": lecturer.lecturer_name,
            "message": f"Student {enrollment_data.matric_number} successfully enrolled in {enrollment_data.course_code} with Lecturer {lecturer.lecturer_name}",
        }

    @staticmethod
    async def get_student_courses(current_student: Student, db: AsyncSession):
        query = (
            select(
                StudentCourses.course_code,
                Course.course_name,
                Course.course_credits,
                Course.semester,
                Lecturer.lecturer_name,
            )
            .join(Course, StudentCourses.course_code == Course.course_code)
            .join(LecturerCourses, LecturerCourses.course_code == Course.course_code)
            .join(Lecturer, LecturerCourses.lecturer_id == Lecturer.lecturer_id)
            .where(StudentCourses.matric_number == current_student.matric_number)
        )
        result = await db.execute(query)
        courses = result.fetchall()

        if not courses:
            raise HTTPException(
                status_code=404, detail="No courses found for the student."
            )

        return [
            {
                "course_code": c.course_code,
                "course_name": c.course_name,
                "course_credits": c.course_credits,
                "semester": c.semester,
                "lecturer_name": c.lecturer_name,
            }
            for c in courses
        ]

    @staticmethod
    async def get_student_course_stats(db: AsyncSession, current_student: Student):
        query = (
            select(
                func.count(StudentCourses.course_code).label("total_courses"),
                func.coalesce(func.sum(Course.course_credits), 0).label(
                    "total_credits"
                ),
            )
            .join(Course, StudentCourses.course_code == Course.course_code)
            .where(StudentCourses.matric_number == current_student.matric_number)
        )

        result = await db.execute(query)
        stats = result.fetchone()

        return {
            "total_courses": stats.total_courses,
            "total_credit_units": stats.total_credits,
        }
