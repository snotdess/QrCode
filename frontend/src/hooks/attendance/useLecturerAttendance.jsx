import { useEffect, useState } from "react";
import { getLecturerAttendance } from "../../api/api";

export const useLecturerAttendance = (courseCode) => {
    const [attendanceData, setAttendanceData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!courseCode) return;
        const fetchAttendance = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getLecturerAttendance(courseCode);
                setAttendanceData(data);
            } catch (err) {
                setError("Failed to fetch attendance data.");
            } finally {
                setLoading(false);
            }
        };

        fetchAttendance();
    }, [courseCode]);

    return { attendanceData, loading, error };
};
