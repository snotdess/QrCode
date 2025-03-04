import { useEffect, useState } from "react";
import { fetchLecturerCourses } from "../utils/course/course";

const useLecturerCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            setError(null);
            try {
                const coursesData = await fetchLecturerCourses();
                setCourses(coursesData || []); // ensure fallback to empty array
            } catch (err) {
                setError("Failed to fetch lecturer courses.");
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    return { courses, loading, error };
};
export default useLecturerCourses;
