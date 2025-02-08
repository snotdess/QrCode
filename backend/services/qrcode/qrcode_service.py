from datetime import datetime, timedelta
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models import QRCode, Course, LecturerCourses
from schemas import QRCodeSchema
from config import settings
from utils import filter_records


class QRCodeService:
    @staticmethod
    async def generate_qr_code(qr_code_data, db: AsyncSession, current_lecturer):
        if not current_lecturer:
            raise HTTPException(
                status_code=403,
                detail="You must be logged in as a lecturer to generate a QR code.",
            )

        # Check if the course exists
        course = await filter_records(Course, db, course_code=qr_code_data.course_code)
        if not course:
            raise HTTPException(
                status_code=404,
                detail=f"Course with code '{qr_code_data.course_code}' does not exist.",
            )

        # Verify lecturer association with the course
        lecturer_course = await filter_records(
            LecturerCourses,
            db,
            course_code=qr_code_data.course_code,
            lecturer_id=current_lecturer.lecturer_id,
        )
        if not lecturer_course:
            raise HTTPException(
                status_code=403,
                detail="You are not authorized to generate a QR code for this course.",
            )

        # Check for existing QR codes in the past hour
        one_hour_ago = datetime.utcnow() - timedelta(hours=1)
        existing_qr_code = await db.execute(
            select(QRCode).where(
                QRCode.course_code == qr_code_data.course_code,
                QRCode.lecturer_id == current_lecturer.lecturer_id,
                QRCode.generation_time >= one_hour_ago,
            )
        )
        if existing_qr_code.scalars().first():
            raise HTTPException(
                status_code=400,
                detail="QR Code already generated for this course within the last hour.",
            )

        # Construct QR Code URL
        base_url = settings.BASE_URL.strip("/")
        generation_timestamp = datetime.utcnow().isoformat()
        qr_code_url = (
            f"{base_url}/?course_code={qr_code_data.course_code}"
            f"&lecturer_id={current_lecturer.lecturer_id}"
            f"&latitude={qr_code_data.latitude}"
            f"&longitude={qr_code_data.longitude}"
            f"&generated_at={generation_timestamp}"
        )

        # Create new QR code entry
        new_qr_code = QRCode(
            course_code=qr_code_data.course_code,
            lecturer_id=current_lecturer.lecturer_id,
            generation_time=datetime.utcnow(),
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
        """Fetch the latest QR codes for all courses assigned to a lecturer within the last hour."""
        one_hour_ago = datetime.utcnow() - timedelta(hours=1)

        # Get all courses assigned to the lecturer
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

        # Fetch latest QR codes for those courses
        qr_code_result = await db.execute(
            select(QRCode)
            .where(
                QRCode.course_code.in_(lecturer_courses),
                QRCode.generation_time >= one_hour_ago,
            )
            .order_by(QRCode.generation_time.desc())
        )
        qr_codes = qr_code_result.scalars().all()

        if not qr_codes:
            return []

        # Fetch course names
        course_names_result = await db.execute(
            select(Course.course_code, Course.course_name).where(
                Course.course_code.in_(lecturer_courses)
            )
        )
        course_name_mapping = {
            row.course_code: row.course_name for row in course_names_result.all()
        }

        base_url = settings.BASE_URL.strip("/")

        return [
            QRCodeSchema(
                course_name=course_name_mapping.get(qr.course_code, "Unknown Course"),
                qr_code_link=(
                    f"https://{base_url}/?course_code={qr.course_code}"
                    f"&lecturer_id={qr.lecturer_id}"
                    f"&latitude={qr.latitude}"
                    f"&longitude={qr.longitude}"
                    f"&generated_at={qr.generation_time.isoformat()}"
                ),
                generation_time=qr.generation_time,
            )
            for qr in qr_codes
        ]

    @staticmethod
    async def delete_qr_code(course_name: str, db: AsyncSession, current_lecturer):
        if not current_lecturer:
            raise HTTPException(
                status_code=403,
                detail="You must be logged in as a lecturer to delete a QR code.",
            )

        # Get the course using course_name
        course = await filter_records(Course, db, course_name=course_name)
        if not course:
            raise HTTPException(
                status_code=404, detail=f"Course '{course_name}' does not exist."
            )

        # Verify that the lecturer is assigned to the course
        lecturer_course = await filter_records(
            LecturerCourses,
            db,
            course_code=course.course_code,
            lecturer_id=current_lecturer.lecturer_id,
        )
        if not lecturer_course:
            raise HTTPException(
                status_code=403,
                detail="You are not authorized to delete a QR code for this course.",
            )

        # Fetch and delete the QR Code
        qr_code = await filter_records(
            QRCode,
            db,
            course_code=course.course_code,
            lecturer_id=current_lecturer.lecturer_id,
        )
        if not qr_code:
            raise HTTPException(
                status_code=404,
                detail=f"No QR code found for course '{course_name}' generated by you.",
            )

        await db.delete(qr_code)
        await db.commit()

        return {"detail": f"QR Code for course '{course_name}' deleted successfully."}
