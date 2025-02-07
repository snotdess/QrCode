import React, { useState } from "react";
import { getLecturerAttendance } from "../api/api"; // Import API function

const AttendancePage = () => {
    const [courseCode, setCourseCode] = useState("");
    const [attendanceData, setAttendanceData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFetchAttendance = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getLecturerAttendance(courseCode);
            console.log(data);

            setAttendanceData(data);
        } catch (err) {
            setError(err.message || "Error fetching data");
        }
        setLoading(false);
    };

    return (
        <div>
            <h2>Lecturer Attendance</h2>
            <input
                type="text"
                placeholder="Enter Course Code"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
            />
            <button onClick={handleFetchAttendance} disabled={loading}>
                {loading ? "Loading..." : "Fetch Attendance"}
            </button>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {attendanceData && (
                <>
                    {attendanceData.attendance.length === 0 ? (
                        <p>No attendance data available.</p> // ✅ Show message when no data
                    ) : (
                        <table border="1">
                            <thead>
                                <tr>
                                    <th>Matric Number</th>
                                    <th>Full Name</th>
                                    {attendanceData.attendance.length > 0 &&
                                        Object.keys(
                                            attendanceData.attendance[0]
                                                .attendance,
                                        ).map((date) => (
                                            <th key={date}>{date}</th>
                                        ))}
                                </tr>
                            </thead>
                            <tbody>
                                {attendanceData.attendance.map((student) => (
                                    <tr key={student.matric_number}>
                                        <td>{student.matric_number}</td>
                                        <td>{student.full_name}</td>
                                        {Object.values(student.attendance).map(
                                            (status, index) => (
                                                <td key={index}>{status}</td>
                                            ),
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </>
            )}
        </div>
    );
};

export default AttendancePage;
