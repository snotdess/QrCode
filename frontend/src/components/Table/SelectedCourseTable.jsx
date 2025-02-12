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
    // Retrieve the headers and filter out the attendance_score column
    const filteredHeaders = getCourseTableHeaders(userRole).filter(
        (column) => column.dataIndex !== "attendance_score",
    );

    const columns = [
        {
            title: "S/N",
            key: "sn",
            render: (_text, _record, index) =>
                (pagination.current - 1) * pagination.pageSize + index + 1,
            width: "5%",
        },
        ...filteredHeaders,
    ];

    return (
        <Content className=" my-[2.5rem]">
            <Table
                style={{ whiteSpace: "nowrap", marginBottom: "24px" }}
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
                }}
                bordered
                scroll={{ x: true }}
            />
        </Content>
    );
};

export default SelectedCourseTable;
