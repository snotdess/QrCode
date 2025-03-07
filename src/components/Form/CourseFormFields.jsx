import { Form, Input, Select } from "antd";
import React from "react";
import { commonFields } from "../../utils/table/tableHeaders";
import useUserInfo from "../../hooks/userInfo/useUserInfo";
const CourseFormFields = ({ userRole, courses, loading }) => {
    const { Item } = Form;
    const customFontFamily = "Roboto, sans-serif";
    const {matNo}= useUserInfo()

    if (userRole === "lecturer" || userRole === "student") {
        return (
            <>
                {commonFields[userRole].map(
                    ({ label, name, placeholder, type }) => (
                        <Item
                            key={name}
                            label={
                                <span style={{ fontFamily: customFontFamily }}>
                                    {label}
                                </span>
                            }
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
                                style={{ fontFamily: customFontFamily }}
                            />
                        </Item>
                    ),
                )}
                {userRole === "student" && (
                    <>

                        <Item label={ <span style={ {
                            fontFamily: customFontFamily
                        }}>Student Matric Number: { matNo}</span>}>
                        </Item>

                        <Item
                            className="mt-[-2rem]"
                            label={
                                <span style={{ fontFamily: customFontFamily }}>
                                    Select Course
                                </span>
                            }
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
                                style={{ fontFamily: customFontFamily }}
                            />
                        </Item>
                    </>
                )}
            </>
        );
    }
    return null;
};

export default CourseFormFields;
