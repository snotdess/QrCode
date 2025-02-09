import { toast } from "react-toastify";
import { getLecturerCourse, getStudentCourse } from "../api/api"; // Import API functions

// Fetch courses for lecturers
export const fetchLecturerCourses = async () => {
    try {
        const response = await getLecturerCourse();
        return response; // Return the courses fetched from the API
    } catch (error) {
        toast.error(f`${error.response}`);
        return []; // Return an empty array in case of error
    }
};

export const fetchStudentCourses = async () => {
    try {
        const response = await getStudentCourse();
        return response.data; // Return the courses fetched from the API
    } catch (error) {
        // toast.error("Failed to load courses. Please try again.");
        toast.error(f`${error.response}`);
        console.log(error);

        return []; // Return an empty array in case of error
    }
};

export const getCourseTableHeaders = (userRole) => {
    // Base columns for all users
    const baseHeaders = [
        {
            title: "Course Code",
            dataIndex: "course_code",
            key: "course_code",
            width: "15%",
            responsive: ["xs", "sm", "md", "lg"], // Visible on all screen sizes
        },
        {
            title: "Course Name",
            dataIndex: "course_name",
            key: "course_name",
            width: "20%",
            responsive: ["xs", "sm", "md", "lg"], // Visible on all screen sizes
        },
        {
            title: "Credits",
            dataIndex: "course_credits",
            key: "course_credits",
            width: "5%",
            responsive: ["xs", "sm", "md"], // Visible on larger screens (not visible on small screens)
        },
        {
            title: "Semester",
            dataIndex: "semester",
            key: "semester",
            width: "10%",
            responsive: ["sm", "md", "lg"], // Visible on medium and large screens only
        },
    ];

    // Add the Lecturer Name column if userRole is "student"
    if (userRole === "student") {
        baseHeaders.push(
            {
                title: "Lecturer Name",
                dataIndex: "lecturer_name", // Ensure the backend returns this field
                key: "lecturer_name",
                width: "15%",
                responsive: ["xs", "sm", "md", "lg"], // Visible on all screen sizes
            },
            {
                title: "Attendance Score",
                dataIndex: "attendance_score", // Ensure backend returns this field
                key: "attendance_score",
                width: "10%",
                responsive: ["xs", "sm", "md", "lg"], // Visible on all screen sizes
            },
        );
    }

    return baseHeaders;
};

export const commonFields = {
    lecturer: [
        {
            label: "Course Code",
            name: "course_code",
            placeholder: "Enter course code (e.g., CS101)",
        },
        {
            label: "Course Name",
            name: "course_name",
            placeholder: "Enter course name (e.g., Data Structures)",
        },
        {
            label: "Course Credits",
            name: "course_credits",
            placeholder: "Enter course credits (e.g., 3)",
            type: "number",
        },
        {
            label: "Semester",
            name: "semester",
            placeholder: "Enter semester (e.g., 2024/2025.1)",
        },
    ],
    student: [
        {
            label: "Matric Number",
            name: "matric_number",
            placeholder: "Enter matric number (e.g., 12345678)",
        },
    ],
};
