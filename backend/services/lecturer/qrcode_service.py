from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models import QRCode, Course, LecturerCourses
from schemas import QRCodeSchema
from utils import filter_records
from util.qrcode_utils import build_qr_code_url, get_current_utc_time, get_start_of_current_hour, check_recent_qr_code
from util.lecturer_utils import get_course_by_identifier, validate_lecturer_course, validate_lecturer


# --------------------
# QRCodeService Class
# --------------------

class QRCodeService:
    @staticmethod
    async def generate_qr_code(qr_code_data, db: AsyncSession, current_lecturer):
        # Validate that the current user is a lecturer.
        await validate_lecturer(current_lecturer)

        # Retrieve course using its course_code and verify lecturer assignment.
        course = await get_course_by_identifier(db, qr_code_data.course_code, "course_code")
        await validate_lecturer_course(db, course.course_code, current_lecturer.lecturer_id)

        # Check for an existing QR code generated within the last hour.
        await check_recent_qr_code(db, course.course_code, current_lecturer.lecturer_id)

        generation_time = get_current_utc_time()
        qr_code_url = build_qr_code_url(
            course_code=qr_code_data.course_code,
            lecturer_id=current_lecturer.lecturer_id,
            latitude=qr_code_data.latitude,
            longitude=qr_code_data.longitude,
            generated_at=generation_time.isoformat()
        )

        new_qr_code = QRCode(
            course_code=qr_code_data.course_code,
            lecturer_id=current_lecturer.lecturer_id,
            generation_time=generation_time,
            latitude=qr_code_data.latitude,
            longitude=qr_code_data.longitude,
            url=qr_code_url,
        )

        db.add(new_qr_code)
        await db.commit()
        await db.refresh(new_qr_code)
        return new_qr_code

    @staticmethod
    async def get_latest_qr_codes(lecturer_id: int, db: AsyncSession):
        start_of_current_hour = get_start_of_current_hour()

        # Retrieve course codes assigned to the lecturer.
        course_results = await db.execute(
            select(LecturerCourses.course_code).where(
                LecturerCourses.lecturer_id == lecturer_id
            )
        )
        lecturer_courses = course_results.scalars().all()

        if not lecturer_courses:
            raise HTTPException(
                status_code=404, detail="No courses assigned to this lecturer."
            )

        # Retrieve QR codes generated within the current hour.
        qr_code_result = await db.execute(
            select(QRCode)
            .where(
                QRCode.course_code.in_(lecturer_courses),
                QRCode.generation_time >= start_of_current_hour,
            )
            .order_by(QRCode.generation_time.desc())
        )
        qr_codes = qr_code_result.scalars().all()

        if not qr_codes:
            return []

        # Retrieve course names for the lecturer's courses.
        course_names_result = await db.execute(
            select(Course.course_code, Course.course_name).where(
                Course.course_code.in_(lecturer_courses)
            )
        )
        course_name_mapping = {
            row.course_code: row.course_name for row in course_names_result.all()
        }

        # Construct and return the response.
        return [
            QRCodeSchema(
                course_name=course_name_mapping.get(qr.course_code, "Unknown Course"),
                qr_code_link=build_qr_code_url(
                    course_code=qr.course_code,
                    lecturer_id=qr.lecturer_id,
                    latitude=qr.latitude,
                    longitude=qr.longitude,
                    generated_at=qr.generation_time.isoformat()
                ),
                generation_time=qr.generation_time,
            )
            for qr in qr_codes
        ]

    @staticmethod
    async def delete_qr_code(course_name: str, db: AsyncSession, current_lecturer):
        await validate_lecturer(current_lecturer)

        # Retrieve the course using its name and verify lecturer assignment.
        course = await get_course_by_identifier(db, course_name, "course_name")
        await validate_lecturer_course(db, course.course_code, current_lecturer.lecturer_id)

        # Find the QR code associated with the course and lecturer.
        qr_code = await filter_records(
            QRCode,
            db,
            course_code=course.course_code,
            lecturer_id=current_lecturer.lecturer_id,
        )
        if not qr_code:
            raise HTTPException(
                status_code=404,
                detail=f"No QR code found for course '{course_name}' generated by you."
            )

        await db.delete(qr_code)
        await db.commit()

        return {"detail": f"QR Code for course '{course_name}' deleted successfully."}
