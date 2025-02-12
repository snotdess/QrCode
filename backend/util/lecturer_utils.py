from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from models import Course, LecturerCourses
from utils import filter_records
from sqlalchemy.future import select
from sqlalchemy.sql import func

# --------------------
# Helper Functions
# --------------------


async def get_course_by_identifier(
    db: AsyncSession, identifier, identifier_type="course_code"
):
    """
    Retrieve a course based on its identifier (either course_code or course_name).
    """
    filter_kwargs = {identifier_type: identifier}
    course = await filter_records(Course, db, **filter_kwargs)
    if not course:
        raise HTTPException(
            status_code=404,
            detail=f"Course with {identifier_type} '{identifier}' does not exist.",
        )
    return course


async def validate_lecturer_course(db: AsyncSession, course_code, lecturer_id):
    """
    Check if a lecturer is assigned to a given course.
    """
    lecturer_course = await filter_records(
        LecturerCourses, db, course_code=course_code, lecturer_id=lecturer_id
    )
    if not lecturer_course:
        raise HTTPException(
            status_code=403,
            detail="You are not authorized to perform this action for this course.",
        )
    return lecturer_course


async def validate_lecturer(current_lecturer):
    if not current_lecturer:
        raise HTTPException(
            status_code=403, detail="You must be logged in as a lecturer."
        )

async def count_lecturer_courses(db: AsyncSession, lecturer_id: int) -> int:
    """Count the number of courses associated with a lecturer."""
    result = await db.execute(
        select(func.count(LecturerCourses.lecturer_id)).where(
            LecturerCourses.lecturer_id == lecturer_id
        )
    )
    return result.scalar() or 0
