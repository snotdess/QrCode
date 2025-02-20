from fastapi import HTTPException


class CustomAttendanceError(HTTPException):
    def __init__(self, status_code, detail=None):
        super().__init__(status_code, detail)


class AttendanceAuthError(CustomAttendanceError):
    def __init__(self):
        super().__init__(403, "You can only mark attendance for yourself.")

class MarkedAttendanceError(CustomAttendanceError):
    def __init__(self):
        super().__init__(403, "You have already marked attendance for this session.")

class LocationRangeError(CustomAttendanceError):
    def __init__(self):
        super().__init__(422, "Student is not within the valid location range.")
