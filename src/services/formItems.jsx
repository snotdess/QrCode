// src/services/formItems.js

import { Button, Input, Select } from "antd";

export const getFormItems = (courses, getLocation, fetchingLocation) => [
    {
        label: "Course Code",
        name: "course_code",
        component: (
            <Select placeholder="Select a course">
                {courses.map((course) => (
                    <Select.Option
                        key={course.course_code}
                        value={course.course_code}
                    >
                        {course.course_code}
                    </Select.Option>
                ))}
            </Select>
        ),
        rules: [{ required: true, message: "Please select a course." }],
    },
    {
        label: "Latitude",
        name: "latitude",
        component: <Input placeholder="Latitude" readOnly />,
    },
    {
        label: "Longitude",
        name: "longitude",
        component: <Input placeholder="Longitude" readOnly />,
    },
    {
        component: (
            <Button
                className="mb-5"
                onClick={() => getLocation(fetchingLocation)}
                loading={fetchingLocation}
            >
                Get Location
            </Button>
        ),
        noFormItem: true, // This is not wrapped in a Form.Item
    },
];
