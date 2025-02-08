// // components/QRCode/LatestQRCodes.jsx

import { DeleteOutlined, DownloadOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Table } from "antd";
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { deleteQRCode, getLecturerLatestQRCodes } from "../../api/api";

const LatestQRCodes = () => {
    const [qrCodes, setQRCodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const canvasRefs = useRef({});

    useEffect(() => {
        const fetchQRCodes = async () => {
            try {
                const data = await getLecturerLatestQRCodes();
                if (data) {
                    setQRCodes(data);
                } else {
                    setQRCodes([]);
                }
            } catch (error) {
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
        },
    ];

    return (
        <div className="my-[2.5rem]">
            {/* Render QR codes off-screen for download */}
            <div
                style={{
                    position: "absolute",
                    left: "-9999px",
                    visibility: "hidden",
                }}
            >
                {qrCodes.map((record) => (
                    <QRCodeCanvas
                        key={record.course_name}
                        value={record.qr_code_link}
                        size={100}
                        level="H"
                        includeMargin={true}
                        ref={(canvas) => {
                            if (canvas) {
                                canvasRefs.current[record.course_name] = canvas;
                            }
                        }}
                    />
                ))}
            </div>

            <Table
                columns={columns}
                dataSource={qrCodes}
                loading={loading}
                rowKey="course_name"
                className="mt-6"
                pagination={{ pageSize: 5 }}
            />
        </div>
    );
};

export default LatestQRCodes;
