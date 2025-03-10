import { Empty, Table } from "antd";
import React from "react";

const StudentAttendanceTable = ({
    attendanceData,
    pagination,
    onTableChange,
}) => {
    const customFontFamily = "Roboto, sans-serif";

    // Extract all unique dates from the attendance data
    const uniqueDates = [
        ...new Set(
            attendanceData.flatMap((student) =>
                student.attendance ? Object.keys(student.attendance) : [],
            ),
        ),
    ];

    // Define table columns
    const columns = [
        {
            title: "S/N",
            dataIndex: "serialNumber",
            key: "serialNumber",
            width: 50,
            render: (text) => (
                <span style={{ fontFamily: customFontFamily }}>{text}</span>
            ),
        },
        {
            title: "Full Name",
            dataIndex: "full_name",
            key: "full_name",
            width: 200,
            render: (text) => (
                <span style={{ fontFamily: customFontFamily }}>{text}</span>
            ),
        },
        {
            title: "Matric Number",
            dataIndex: "matric_number",
            key: "matric_number",
            width: 120,
            render: (text) => (
                <span style={{ fontFamily: customFontFamily }}>{text}</span>
            ),
        },
        // Dynamic columns for each unique date
        ...uniqueDates.map((date) => ({
            title: date,
            dataIndex: date,
            key: date,
            width: 100,
            render: (text) => (
                <span
                    style={{ fontFamily: customFontFamily }}
                    className={
                        text === "Present"
                            ? "text-green-500 font-semibold"
                            : "text-red-500 font-semibold"
                    }
                >
                    {text}
                </span>
            ),
        })),
        // New column for current attendance count
        {
            title: "Current Attendance Score",
            dataIndex: "presentCount",
            key: "presentCount",
            width: 150,
            render: (text) => (
                <span style={{ fontFamily: customFontFamily }}>{text}</span>
            ),
        },
        // New column for current attendance percentage with conditional color
        {
            title: "Current Attendance Percentage",
            dataIndex: "attendancePercentage",
            key: "attendancePercentage",
            width: 150,
            render: (text) => {
                const percentage = parseFloat(text);
                const colorClass =
                    percentage >= 75 && percentage <= 100
                        ? "text-green-500 font-semibold"
                        : "text-red-500 font-semibold";
                return (
                    <span
                        style={{ fontFamily: customFontFamily }}
                        className={colorClass}
                    >
                        {text}%
                    </span>
                );
            },
        },
    ];

    // Prepare table data by mapping each student to a row
    const tableData = attendanceData.map((student, index) => {
        // Count the number of "Present" entries
        const presentCount = uniqueDates.reduce((count, date) => {
            return (
                count +
                (student.attendance && student.attendance[date] === "Present"
                    ? 1
                    : 0)
            );
        }, 0);

        // Total number of days based on uniqueDates length
        const totalDays = uniqueDates.length;
        // Calculate attendance percentage (to fixed 2 decimals)
        const attendancePercentage =
            totalDays > 0
                ? ((presentCount / totalDays) * 100).toFixed(2)
                : "0.00";

        return {
            key: index,
            serialNumber: index + 1,
            full_name: student.full_name,
            matric_number: student.matric_number,
            // Map attendance for each date
            ...Object.fromEntries(
                uniqueDates.map((date) => [
                    date,
                    student.attendance && student.attendance[date]
                        ? student.attendance[date]
                        : "Absent",
                ]),
            ),
            presentCount,
            attendancePercentage,
        };
    });

    // Handle pagination change
    const handleTableChange = (pagination) => {
        onTableChange(pagination.current, pagination.pageSize);
    };

    // Show empty state if no attendance data is available
    if (!attendanceData.length) {
        return (
            <Empty
                description="No attendance data available"
                style={{ fontFamily: customFontFamily }}
            />
        );
    }

    return (
        <Table
            dataSource={tableData}
            columns={columns}
            pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: attendanceData.length,
                showSizeChanger: true,
                pageSizeOptions: ["5", "10", "20"],
            }}
            onChange={handleTableChange} 
            bordered
            scroll={{ x: "max-content" }}
            className="mt-4 whitespace-pre"
            style={{ fontFamily: customFontFamily }}
        />
    );
};

export default StudentAttendanceTable;
