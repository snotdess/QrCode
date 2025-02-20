import { Layout, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getStudentAttendanceRecord } from "../../api/api";
import useDynamicSubtitleLevel from "../../hooks/typography/useDynamicSubtitleLevel";
import AttendanceTable from "../Table/AttendanceTable";
import { getCourseTableHeaders } from "../../utils/table/tableHeaders";

const StudentAttendance = ({ fullname }) => {
    const { Content } = Layout;
    const subtitle = useDynamicSubtitleLevel();
    const { Title } = Typography;
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

    // Fetch attendance records from the API
    const fetchAttendanceRecord = async () => {
        try {
            const response = await getStudentAttendanceRecord();
            setAttendance(response.data);
        } catch (error) {
            toast.error(`${error}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendanceRecord();
    }, []);

    // Adjust pagination pageSize based on screen size
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width >= 1024) {
                setPagination((prev) => ({ ...prev, pageSize: 10 }));
            } else {
                setPagination((prev) => ({ ...prev, pageSize: 5 }));
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Generate columns for student view
    const columns = getCourseTableHeaders("student");

    // Extract matric number from the first attendance record
    const matricNumber = attendance[0]?.matric_number || "N/A";

    // Handler for pagination changes
    const handleTableChange = (page, pageSize) => {
        setPagination({ current: page, pageSize });
    };

    return (
        <Content className=" my-[1.5rem]">
            <Title level={subtitle}>
                Attendance Record for Matric Number: {matricNumber}
            </Title>
            <AttendanceTable
                attendance={attendance}
                loading={loading}
                pagination={pagination}
                onTableChange={handleTableChange}
                columns={columns}
            />
        </Content>
    );
};

export default StudentAttendance;
