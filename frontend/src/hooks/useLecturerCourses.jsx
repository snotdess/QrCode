// hooks/useLecturerCourses.js
import { useState, useEffect } from "react";
import { fetchLecturerCourses } from "../utils/course";
import { toast } from "react-toastify";

const useLecturerCourses = () => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetchLecturerCourses();
                setCourses(response);
            } catch (error) {
                toast.error("Failed to fetch courses.");
            }
        };
        fetchCourses();
    }, []);

    return courses;
};

export default useLecturerCourses;
