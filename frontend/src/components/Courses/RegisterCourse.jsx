import { Button, Form, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
    createLectureCourse,
    createStudentCourse,
    getLecturerCourseCode,
} from "../../api/api";
import useAuth from "../../hooks/useAuth";
import CourseFormFields from "./CourseFormFields"; // Import the modularized form fields

const RegisterCourse = ({
    userRole,
    isModalVisible,
    setIsModalVisible,
    onCourseRegistered,
}) => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);

    useAuth();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                const response = await getLecturerCourseCode();
                setCourses(response?.lecturer_courses || []);
            } catch (error) {
                toast.error(
                    error.response || "Failed to fetch courses. Try again.",
                );
            } finally {
                setLoading(false);
            }
        };

        if (userRole === "student" && isModalVisible) {
            fetchCourses();
        }
    }, [isModalVisible, userRole]);

    const handleSubmit = async (values) => {
        try {
            const formData = { ...values };

            if (userRole === "student") {
                const [courseCode, lecturerName] = values.course.split("-");
                formData.course_code = courseCode;
                formData.lecturer_name = lecturerName;
            }

            if (userRole === "lecturer") {
                await createLectureCourse(formData);
                toast.success("Course registered successfully!");
            } else if (userRole === "student") {
                await createStudentCourse(formData);
                toast.success("Course registered successfully!");
            } else {
                toast.error("User not authenticated");
                navigate("/onboarding");
                return;
            }

            form.resetFields();
            setIsModalVisible(false);
            onCourseRegistered(); // Trigger reload after registration
            navigate("/courses");
        } catch (error) {
            toast.error(error || "Failed to register the course. Try again.");
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        toast.info("Closed Course Registration Form");
        setTimeout(() => {
            navigate("/courses");
        }, 500);
    };

    return (
        <Modal
            title="Register New Course"
            visible={isModalVisible}
            onCancel={handleCancel}
            footer={[
                <div
                    key="footer"
                    className="flex items-center justify-between gap-1"
                >
                    <Button
                        type="primary"
                        danger
                        onClick={handleCancel}
                        className="rounded-md text-white py-4 px-4"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        form="register-course-form"
                        className="text-white py-4 px-4 rounded-md"
                    >
                        Register Course
                    </Button>
                </div>,
            ]}
            closeIcon={null}
        >
            <Form
                id="register-course-form"
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <CourseFormFields
                    userRole={userRole}
                    courses={courses}
                    loading={loading}
                />
            </Form>
        </Modal>
    );
};


export default RegisterCourse;
