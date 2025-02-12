import { toast } from "react-toastify";
import { getLecturerCourse, getStudentCourse } from "../../api/api"; // Import API functions

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

const fetchStudentCourses = async () => {
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
        } else {
            toast.error("User not allowed.");
            navigate("/onboarding");
            return;
        }

        if (!coursesData || coursesData.length === 0) {
            setCourses([]);
            setError("No courses available.");
        } else {
            setCourses(coursesData);
        }
    } catch (err) {
        setError("Failed to load courses.");
    } finally {
        setLoading(false);
    }
};
