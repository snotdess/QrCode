import axios from "axios";

// Create Axios instance
const api = axios.create({
    baseURL: "http://127.0.0.1:8000", // Replace with your backend base URL
    headers: {
        "Content-Type": "application/json",
    },
});

// Function to set Authorization token
export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common["Authorization"];
    }
};

// Generic API call for signup or login
const handleAuth = async (endpoint, data) => {
    try {
        const response = await api.post(endpoint, data);
        return response.data; // Assume { access_token, token_type }
    } catch (error) {
        throw error.response?.data?.detail || "An error occurred.";
    }
};

// Generic API call for request actions
const handleRequest = async (endpoint, data, isDataNeeded = true) => {
    try {
        const response = await api.post(endpoint, data, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
        });
        return isDataNeeded ? response.data : response; // Return response data
    } catch (error) {
        throw error.response?.data?.detail || "An error occurred.";
    }
};

// Generic API call for course-data actions
const fetchData = async (endpoint, isDataNeeded = true) => {
    try {
        const response = await api.get(endpoint, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
        });

        // Conditional return based on the flag
        return isDataNeeded ? response.data : response; // Use .data or the entire response
    } catch (error) {
        console.error(`Error fetching data from ${endpoint}:`, error);
        throw (
            error.response?.data?.detail ||
            "An error occurred while fetching data."
        );
    }
};

// Exposed functions for lectuer signup
export const Lecturersignup = (data) => handleAuth("/lecturer/signup", data);

// Exposed functions for student signup
export const Studentsignup = (data) => handleAuth("/student/signup", data);

// Exposed functions for lectuer login
export const Lecturerlogin = (data) => handleAuth("/lecturer/login", data);

// Exposed functions for student login
export const Studentlogin = (data) => handleAuth("/student/login", data);

// API calls for lecturer course creation
export const createLectureCourse = (data) =>
    handleRequest("/lecturer/courses", data, true);

// API calls for student course registration
export const createStudentCourse = (data) =>
    handleRequest("/student/enroll", data, true);

// API calls for lecturer fetching course info
export const getLecturerCourse = () => fetchData("/lecturer/course_info", true);

// API calls for lecturer fetching course info
export const getStudentCourse = () =>
    fetchData("/student/student_courses", false); // Returns full response

// API call for getting course stats
export const getLecturerCourseStats = () =>
    fetchData("/lecturer/course_stats", true);

// API call to fetch student course statistics
export const getStudentCourseStats = () =>
    fetchData("/student/course_stats", true);

// API call for getting lecturer and course code
export const getLecturerCourseCode = () =>
    fetchData("/lecturer/lecturer_courses", true);

// API call to get lecturer courses with total student count
export const getLecturerCourseStudents = () =>
    fetchData("/lecturer/lecturer_course_students", true);

// // API calls for qrcode creation
export const generateQRCode = (data) =>
    handleRequest("/lecturer/generate_qr_code", data, true);

// API call to get the latest QR code for a course
export const getLecturerLatestQRCodes = async () => {
    return fetchData("/lecturer/latest_qr_codes", false);
};

// export const getLecturerLatestQRCodes = async () => {
//     try {
//         const response = await api.get("/lecturer/latest_qr_codes", {
//             headers: {
//                 Authorization: `Bearer ${localStorage.getItem("access_token")}`,
//             },
//         });


//         return response;
//     } catch (error) {
//         throw error;
//     }
// };

// API call for deleting QR code
export const deleteQRCode = async (course_name) => {
    try {
        const response = await api.delete(
            `/lecturer/delete_qr_code?course_name=${course_name}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                        "access_token",
                    )}`,
                },
            },
        );
        return response.data;
    } catch (error) {
        throw error?.response?.data?.detail;
    }
};

// API call to fetch lecturer's attendance records
export const getLecturerAttendance = async (course_code) => {
    const encodedCourseCode = encodeURIComponent(course_code); // Encode spaces
    return fetchData(`/lecturer/attendance/${encodedCourseCode}`, true);
};

export const logout = async () => {
    try {
        const response = await api.post("/auth/logout", null, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
        });
        // Clear the stored token and data
        localStorage.clear();
        setAuthToken(null); // Remove token from headers

        return response.data.message;
    } catch (error) {
        console.error("Error during logout:", error);
        throw (
            error.response?.data?.detail || "An error occurred during logout."
        );
    }
};

export default api;
