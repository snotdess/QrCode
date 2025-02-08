from datetime import datetime
from typing import List
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql import func
from fastapi import HTTPException
from utils import filter_records
from models import Lecturer, Course, LecturerCourses, StudentCourses


class LecturerCourseService:
    @staticmethod
    async def create_course_for_lecturer(
        course, db: AsyncSession, current_lecturer: Lecturer
    ):
        lecturer_courses = await db.execute(
            select(LecturerCourses).where(
                LecturerCourses.lecturer_id == current_lecturer.lecturer_id
            )
        )

        if len(lecturer_courses.scalars().all()) >= 2:
            raise HTTPException(status_code=400, detail="Max Course Limit Reached.")

        existing_course = await filter_records(
            Course, db, course_code=course.course_code
        )

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

        lecturer_course = await filter_records(
            LecturerCourses,
            db,
            course_code=course.course_code,
            lecturer_id=current_lecturer.lecturer_id,
        )

        if lecturer_course:
            raise HTTPException(
                status_code=400, detail="Lecturer already associated with this course."
            )

        new_lecturer_course = LecturerCourses(
            lecturer_id=current_lecturer.lecturer_id,
            course_code=course.course_code,
        )
        db.add(new_lecturer_course)
        await db.commit()

        return new_course

    @staticmethod
    async def fetch_courses_for_lecturer(db: AsyncSession, lecturer_id: int):
        result = await db.execute(
            select(Course)
            .join(LecturerCourses, LecturerCourses.course_code == Course.course_code)
            .where(LecturerCourses.lecturer_id == lecturer_id)
        )
        return result.scalars().all()

    @staticmethod
    async def get_courses_for_lecturer(
        db: AsyncSession, current_lecturer: Lecturer
    ) -> List[Course]:
        if not current_lecturer:
            raise HTTPException(
                status_code=403,
                detail="You must be logged in as a lecturer to access course information.",
            )
        return (
            await LecturerCourseService.fetch_courses_for_lecturer(
                db, current_lecturer.lecturer_id
            )
            or []
        )

    @staticmethod
    async def get_courses_stats(db: AsyncSession, current_lecturer: Lecturer):
        if not current_lecturer:
            raise HTTPException(
                status_code=403,
                detail="You must be logged in as a lecturer to access course information.",
            )

        courses = await LecturerCourseService.fetch_courses_for_lecturer(
            db, current_lecturer.lecturer_id
        )

        return {
            "total_courses": len(courses),
            "total_credits": (
                sum(course.course_credits for course in courses) if courses else 0
            ),
        }

    @staticmethod
    async def get_lecturer_courses(db: AsyncSession):
        result = await db.execute(
            select(Lecturer.lecturer_name, Course.course_code, Course.course_name)
            .join(LecturerCourses, Lecturer.lecturer_id == LecturerCourses.lecturer_id)
            .join(Course, LecturerCourses.course_code == Course.course_code)
        )
        lecturer_courses = result.fetchall()

        return (
            [
                {
                    "lecturer_name": row[0],
                    "course_code": row[1],
                    "course_name": row[2],
                }
                for row in lecturer_courses
            ]
            if lecturer_courses
            else {"message": "No lecturer-course records found."}
        )

    @staticmethod
    async def get_lecturer_course_students(
        db: AsyncSession, current_lecturer: Lecturer
    ):
        if not current_lecturer:
            raise HTTPException(
                status_code=403,
                detail="You must be logged in as a lecturer to access this information.",
            )

        courses = await LecturerCourseService.fetch_courses_for_lecturer(
            db, current_lecturer.lecturer_id
        )

        return (
            [
                {
                    "course_name": course.course_name,
                    "total_students": await db.scalar(
                        select(func.count(StudentCourses.matric_number)).where(
                            StudentCourses.course_code == course.course_code
                        )
                    )
                    or 0,
                }
                for course in courses
            ]
            if courses
            else {"message": "No courses found for the lecturer."}
        )
