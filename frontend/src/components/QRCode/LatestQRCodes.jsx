import { DeleteOutlined, DownloadOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Table, Typography } from "antd";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { deleteQRCode, getLecturerLatestQRCodes } from "../../api/api";

const { Title } = Typography;

const LatestQRCodes = () => {
    const [qrCodes, setQRCodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const canvasRefs = useRef({});

    useEffect(() => {
        const fetchQRCodes = async () => {
            try {
                const data = await getLecturerLatestQRCodes();
                setQRCodes(data);
            } catch (error) {
                toast.error("Failed to fetch QR Codes");
            } finally {
                setLoading(false);
            }
        };

        fetchQRCodes();
    }, []);

    const downloadQRCode = (courseName) => {
        const canvas = canvasRefs.current[courseName];
        if (canvas) {
            const dataURL = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = dataURL;
            link.download = `${courseName}_QRCode.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handleDelete = async (courseName) => {
        try {
            await deleteQRCode(courseName);
            setQRCodes((prevQRCodes) =>
                prevQRCodes.filter((qr) => qr.course_name !== courseName),
            );
            toast.success("QR Code deleted successfully");
        } catch (error) {
            toast.error("Failed to delete QR Code");
        }
    };

    const columns = [
        {
            title: "Course Name",
            dataIndex: "course_name",
            key: "course_name",
            width: "2%",
        },

        {
            title: "Download",
            key: "download",
            render: (_, record) => (
                <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    onClick={() => downloadQRCode(record.course_name)}
                >
                    Download
                </Button>
            ),
            width: "3%",
        },
        {
            title: "Delete",
            key: "action",
            render: (_, record) => (
                <Popconfirm
                    title="Are you sure you want to delete this QR code?"
                    onConfirm={() => handleDelete(record.course_name)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button type="primary" danger icon={<DeleteOutlined />} />
                </Popconfirm>
            ),
            width: "3%",
        },
    ];

    return (
        <div className="p-5 min-h-screen">
            <Table
                columns={columns}
                dataSource={qrCodes}
                loading={loading}
                rowKey="course_name"
                className=""
                pagination={{ pageSize: 2 }}
            />
        </div>
    );
};

export default LatestQRCodes;
