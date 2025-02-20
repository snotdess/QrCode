
import { Layout, Table } from "antd";
import React from "react";
import { getCourseTableHeaders } from "../../utils/table/tableHeaders";

const SelectedCourseTable = ({
    courses,
    pagination,
    handleTableChange,
    userRole,
}) => {
    const { Content } = Layout;
    const customFontFamily = "Roboto, sans-serif";

    // Retrieve the headers and filter out the attendance_score column
    const filteredHeaders = getCourseTableHeaders(userRole).filter(
        (column) => column.dataIndex !== "attendance_score",
    );

    // Define table columns with the custom font applied
    const columns = [
        {
            title: <span style={{ fontFamily: customFontFamily }}>S/N</span>,
            key: "sn",
            render: (_text, _record, index) =>
                (pagination.current - 1) * pagination.pageSize + index + 1,
            width: "5%",
        },
        ...filteredHeaders.map((column) => ({
            ...column,
            title: (
                <span style={{ fontFamily: customFontFamily }}>
                    {column.title}
                </span>
            ),
            render: (text) => (
                <span style={{ fontFamily: customFontFamily }}>{text}</span>
            ),
        })),
    ];

    return (
        <Content
            className="my-[2.5rem]"
            style={{ fontFamily: customFontFamily }}
        >
            <Table
                style={{
                    whiteSpace: "nowrap",
                    marginBottom: "24px",
                    fontFamily: customFontFamily,
                }}
                columns={columns}
                dataSource={courses}
                rowKey="course_code"
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: courses.length,
                    onChange: handleTableChange,
                    showSizeChanger: true,
                    pageSizeOptions: ["5", "10"],
                    style: { fontFamily: customFontFamily },
                }}
                bordered
                scroll={{ x: true }}
            />
        </Content>
    );
};

export default SelectedCourseTable;
