import { Table } from "antd";
import React from "react";
import Loader from "../Loader/Loader";

const AttendanceTable = ({
    attendance,
    loading,
    pagination,
    onTableChange,
    columns,
}) => {
    // Define custom font style
    const customFontStyle = { fontFamily: "Roboto, sans-serif" };

    // Define the S/N column
    const snColumn = {
        title: <span style={customFontStyle}>S/N</span>,
        key: "sn",
        width: "5%",
        render: (text, record, index) =>
            (pagination.current - 1) * pagination.pageSize + index + 1,
    };

    // Function to determine the color based on the attendance score
    const getScoreColor = (score) => {
        if (score >= 0 && score <= 59) {
            return "red"; // Red for scores 0-59
        } else if (score >= 60 && score <= 74) {
            return "orange"; // Yellow/Orange for scores 60-74
        } else if (score >= 75 && score <= 100) {
            return "green"; // Green for scores 75-100
        }
        return "black"; // Default color
    };

    // Modify the columns to include custom rendering for the Attendance Score
    const modifiedColumns = columns.map((column) => {
        if (column.dataIndex === "attendance_score") {
            return {
                ...column,
                title: <span style={customFontStyle}>{column.title}</span>,
                render: (score) => (
                    <span
                        style={{
                            color: getScoreColor(score),
                            ...customFontStyle,
                        }}
                    >
                        {score}%
                    </span>
                ),
            };
        }
        return {
            ...column,
            title: <span style={customFontStyle}>{column.title}</span>,
            render: (text) => <span style={customFontStyle}>{text}</span>,
        };
    });

    // Combine S/N column with the modified columns
    const tableColumns = [snColumn, ...modifiedColumns];

    return (
        <Table
            className="whitespace-pre"
            columns={tableColumns}
            dataSource={attendance}
            rowKey="matric_number"
            loading={loading ? <Loader /> : false}
            pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: attendance.length,
                onChange: onTableChange,
                showSizeChanger: true,
                pageSizeOptions: ["5", "10"],
            }}
            bordered
            scroll={{ x: true }}
            style={customFontStyle} // Apply custom font to the whole table
        />
    );
};

export default AttendanceTable;
