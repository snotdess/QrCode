import { Form, Input, Select } from "antd";
import React from "react";
import { commonFields } from "../../utils/table/tableHeaders";


const CourseFormFields = ({ userRole, courses, loading }) => {
    const { Item } = Form;

    if (userRole === "lecturer" || userRole === "student") {
        return (
            <>
                {commonFields[userRole].map(
                    ({ label, name, placeholder, type }) => (
                        <Item
                            key={name}
                            label={label}
                            name={name}
                            rules={[
                                {
                                    required: true,
                                    message: `Please enter ${label.toLowerCase()}.`,
                                },
                            ]}
                        >
                            <Input
                                type={type || "text"}
                                placeholder={placeholder}
                            />
                        </Item>
                    ),
                )}
                {userRole === "student" && (
                    <Item
                        label="Select Course"
                        name="course"
                        rules={[
                            {
                                required: true,
                                message: "Please select a course.",
                            },
                        ]}
                    >
                        <Select
                            placeholder="Select a course"
                            loading={loading}
                            options={courses.map(
                                ({
                                    course_code,
                                    course_name,
                                    lecturer_name,
                                }) => ({
                                    value: `${course_code}-${lecturer_name}`,
                                    label: `${course_code} ${course_name} by ${lecturer_name}`,
                                }),
                            )}
                        />
                    </Item>
                )}
            </>
        );
    }
    return null;
};

export default CourseFormFields;
