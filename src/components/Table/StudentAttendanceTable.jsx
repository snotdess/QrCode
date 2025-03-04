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
        ...uniqueDates.map((date) => ({
            title: date,
            dataIndex: date,
            key: date,
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
            width: 100,
        })),
    ];

    // Prepare table data by mapping each student to a row
    const tableData = attendanceData.map((student, index) => ({
        key: index,
        serialNumber: index + 1,
        full_name: student.full_name,
        matric_number: student.matric_number,
        ...Object.fromEntries(
            uniqueDates.map((date) => [
                date,
                student.attendance[date] || "Absent", // Default to "Absent" if no record
            ]),
        ),
    }));

    // Handle pagination change
    const handleTableChange = (page, pageSize) => {
        onTableChange({ current: page, pageSize });
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
                onChange: handleTableChange,
                showSizeChanger: true,
                pageSizeOptions: ["5", "10", "20"],
            }}
            bordered
            scroll={{ x: "max-content" }}
            className="mt-4 whitespace-pre"
            style={{ fontFamily: customFontFamily }}
        />
    );
};

export default StudentAttendanceTable;
