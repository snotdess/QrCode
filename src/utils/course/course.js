import { toast } from "react-toastify";
import { getLecturerCourse, getStudentCourse } from "../../api/api"; // Import API functions
import * as XLSX from "xlsx"

// Fetch courses for lecturers
export const fetchLecturerCourses = async () => {
    try {
        const response = await getLecturerCourse();
        return response;
    } catch (error) {
        toast.error(`${error}`);
        return [];
    }
};

const fetchStudentCourses = async () => {
    try {
        const response = await getStudentCourse();
        console.log(response);

        return response.data;
    } catch (error) {
        // toast.error("Failed to load courses. Please try again.");
        toast.error(`${error}`);
        console.log(error);

        return [];
    }
};

export const fetchAndSetCourses = async ({
    userRole,
    navigate,
    setCourses,
    setError,
    setLoading,
}) => {
    setLoading(true);
    try {
        let coursesData = [];

        if (userRole === "student") {
            coursesData = await fetchStudentCourses();
            console.log("Fetched Courses Data:", coursesData); // Log data
        } else {
            toast.error("User not allowed.");
            navigate("/onboarding");
            return;
        }

        if (!coursesData || coursesData.length === 0) {
            console.warn("No courses found."); // Warn if empty
            setCourses([]); // Ensure it's an empty array
            setError("No courses available.");
        } else {
            setCourses(coursesData);
        }
    } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses.");
    } finally {
        setLoading(false);
    }
};


// Export attendance data to Excel
export const exportAttendance = (attendanceData, courseCode) => {
    if (!attendanceData?.attendance) return;

    // Get unique dates and sort them in ascending order
    const uniqueDates = [
        ...new Set(
            attendanceData.attendance.flatMap((student) =>
                Object.keys(student.attendance),
            ),
        ),
    ].sort();

    const totalDays = uniqueDates.length;

    const exportData = attendanceData.attendance.map((student, index) => {
        let row = {
            "S/N": index + 1,
            "Full Name": student.full_name,
            "Matric Number": student.matric_number,
        };

        let presentCount = 0;

        uniqueDates.forEach((date) => {
            const isPresent = student.attendance[date] === "Present";
            row[date] = isPresent ? 1 : 0;
            if (isPresent) presentCount++;
        });

        // Calculate attendance percentage
        const attendancePercentage =
            totalDays > 0 ? ((presentCount / totalDays) * 100).toFixed(2) : 0;

        // Assign attendance score (0 to 5 scale)
        let attendanceScore = 0;
        if (attendancePercentage >= 90) attendanceScore = 5;
        else if (attendancePercentage >= 80) attendanceScore = 4;
        else if (attendancePercentage >= 70) attendanceScore = 3;
        else if (attendancePercentage >= 60) attendanceScore = 2;
        else if (attendancePercentage >= 50) attendanceScore = 1;
        else attendanceScore = 0;

        row["Attendance Percentage"] = `${attendancePercentage}%`;
        row["Attendance Score"] = attendanceScore;

        return row;
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");

    const fileName = `${
        attendanceData.course_name || courseCode
    }_attendance.xlsx`;
    XLSX.writeFile(wb, fileName);
};
