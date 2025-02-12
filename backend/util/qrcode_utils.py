from config import settings
from datetime import datetime, timedelta
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from utils import filter_records
from models import QRCode

# --------------------
# Helper Functions
# --------------------


def build_qr_code_url(course_code, lecturer_id, latitude, longitude, generated_at):
    """
    Construct the QR code URL with query parameters.
    """
    base_url = settings.BASE_URL.strip("/")
    return (
        f"{base_url}/?course_code={course_code}"
        f"&lecturer_id={lecturer_id}"
        f"&latitude={latitude}"
        f"&longitude={longitude}"
        f"&generated_at={generated_at}"
    )

def get_current_utc_time():
    return datetime.utcnow()

def get_start_of_current_hour():
    now = get_current_utc_time()
    return now.replace(minute=0, second=0, microsecond=0)

async def check_recent_qr_code(
    db: AsyncSession, course_code, lecturer_id, time_threshold=timedelta(hours=1)
):
    """
    Ensure that a QR code was not generated within the last given time threshold.
    """
    one_hour_ago = get_current_utc_time() - time_threshold
    existing_qr_code = await filter_records(
        QRCode, db, course_code=course_code, lecturer_id=lecturer_id
    )
    if existing_qr_code and existing_qr_code.generation_time >= one_hour_ago:
        raise HTTPException(
            status_code=400,
            detail="QR Code already generated for this course within the last hour.",
        )
    return existing_qr_code
