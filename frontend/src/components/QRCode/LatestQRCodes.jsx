// LatestQRCodes.jsx

import { DeleteOutlined, DownloadOutlined } from "@ant-design/icons";
import { Button, Empty, Popconfirm, Table } from "antd";
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useRef, useState } from "react";
import {
    downloadQRCode,
    fetchQRCodes,
    handleDelete,
} from "../../utils/qrcode/qrcode";
import Loader from "../Loader/Loader";

const LatestQRCodes = () => {
    const [qrCodes, setQRCodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const canvasRefs = useRef({});

    // Fetch QR codes when the component mounts
    useEffect(() => {
        fetchQRCodes({ setQRCodes, setLoading });
    }, []);

    const handleDownload = (courseName) => {
        downloadQRCode(courseName, canvasRefs);
    };

    const handleDeleteQRCode = (courseName) => {
        handleDelete(courseName, setQRCodes);
    };

    const columns = [
        {
            title: "S/N",
            dataIndex: "sn",
            key: "sn",
            render: (_, __, index) => index + 1,
        },
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
                    onClick={() => handleDownload(record.course_name)}
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
                    title={`Delete QR Code for ${record.course_name}?`}
                    onConfirm={() => handleDeleteQRCode(record.course_name)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button type="primary" danger icon={<DeleteOutlined />} />
                </Popconfirm>
            ),
        },
    ];

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="my-[2rem]">
            {/* Render QR codes off-screen for download */}
            <div
                style={{
                    position: "absolute",
                    left: "-9999px",
                    visibility: "hidden",
                }}
            >
                {qrCodes.map((record, index) => (
                    <QRCodeCanvas
                        key={`${record.course_name}-${index}`}
                        value={record.qr_code_link}
                        size={300}
                        level="H"
                        includeMargin={true}
                        ref={(canvas) => {
                            if (canvas && canvas.toDataURL) {
                                canvasRefs.current[record.course_name] = canvas;
                            }
                        }}
                    />
                ))}
            </div>

            {/* Show an Empty component when no QR codes exist */}
            {qrCodes.length === 0 ? (
                <Empty description="No QR Codes Available" />
            ) : (
                <Table
                    columns={columns}
                    dataSource={Array.isArray(qrCodes) ? qrCodes : []}
                    rowKey="course_name"
                    className="mt-6"
                    pagination={{ pageSize: 5 }}
                    bordered
                    scroll={{ x: true }}
                />
            )}
        </div>
    );
};

export default LatestQRCodes;
