import { DeleteOutlined, DownloadOutlined } from "@ant-design/icons";
import { Button, Empty, Popconfirm, Table } from "antd";
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { deleteQRCode, getLecturerLatestQRCodes } from "../../api/api";
import Loader from "../Loader/Loader";

const LatestQRCodes = () => {
    const [qrCodes, setQRCodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const canvasRefs = useRef({});

    if (loading) {
        <Loader />;
    }

    useEffect(() => {
        const fetchQRCodes = async () => {
            try {
                const data = await getLecturerLatestQRCodes();
                const response = data?.data || [];

                if (response.length > 0) {
                    setQRCodes(response);
                } else {
                    toast.info(`No QR Codes found.`);
                }
            } catch (error) {
                toast.error(`${error}`);
            } finally {
                setLoading(false);
            }
        };

        fetchQRCodes();
    }, []);

    const downloadQRCode = (courseName) => {
        const canvas = canvasRefs.current[courseName];
        if (canvas && canvas.toDataURL) {
            const dataURL = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = dataURL;
            link.download = `${courseName}_QRCode.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            toast.error("QR Code download failed.");
        }
    };

    const handleDelete = async (courseName) => {
        try {
            await deleteQRCode(courseName);
            setQRCodes((prevQRCodes) =>
                prevQRCodes.filter((qr) => qr.course_name !== courseName),
            );
            toast.success(`QR Code for ${courseName} deleted successfully.`);
        } catch (error) {
            toast.error(`Failed to delete QR Code: ${error}`);
        }
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
                    title={`Delete QR Code for ${record.course_name}?`}
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
                {qrCodes.map((record, index) => (
                    <QRCodeCanvas
                        key={`${record.course_name}-${index}`} // Ensure uniqueness
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

            {/* Show Empty component when no QR codes exist */}
            {qrCodes?.length === 0 && !loading ? (
                <Empty description="No QR Codes Available" />
            ) : (
                <Table
                    columns={columns}
                    dataSource={Array.isArray(qrCodes) ? qrCodes : []}
                    loading={loading}
                    rowKey="course_name"
                    className="mt-6"
                    pagination={{ pageSize: 5 }}
                />
            )}
        </div>
    );
};

export default LatestQRCodes;
