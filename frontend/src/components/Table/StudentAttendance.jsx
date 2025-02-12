import React from "react";
import { Table, Empty } from "antd";

const StudentAttendance = ({ attendanceData, pagination, onTableChange }) => {
    // Extract unique dates from attendance records.
    const uniqueDates = [
        ...new Set(
            attendanceData?.attendance.flatMap((student) =>
                Object.keys(student.attendance),
            ),
        ),
    ];

    // Define table columns dynamically.
    const columns = [
        {
            title: "S/N",
            dataIndex: "serialNumber",
            key: "serialNumber",
            width: 4,
        },
        {
            title: "Full Name",
            dataIndex: "fullName",
            key: "fullName",
            width: 30,
        },
        {
            title: "Matric Number",
            dataIndex: "matricNumber",
            key: "matricNumber",
            width: 4,
        },
        ...uniqueDates.map((date) => ({
            title: date,
            dataIndex: date,
            key: date,
            render: (text) => (
                <span
                    className={
                        text === "Present" ? "text-green-500" : "text-red-500"
                    }
                >
                    {text}
                </span>
            ),
            width: 4,
        })),
    ];

    // Format data for the table.
    const tableData = attendanceData?.attendance.map((student, index) => ({
        key: index,
        serialNumber: index + 1,
        fullName: student.full_name,
        matricNumber: student.matric_number,
        ...Object.fromEntries(
            uniqueDates.map((date) => [
                date,
                student.attendance[date] || "Absent",
            ]),
        ),
    }));

    // If there is no attendance data, render Empty.
    if (
        !attendanceData ||
        !attendanceData.attendance ||
        attendanceData.attendance.length === 0
    ) {
        return <Empty description="No attendance data available" />;
    }

    return (
        <Table
            dataSource={tableData}
            columns={columns}
            pagination={pagination}
            onChange={onTableChange}
            bordered
            scroll={{ x: true }}
            className="mt-4 whitespace-pre"
        />
    );
};

export default StudentAttendance;
