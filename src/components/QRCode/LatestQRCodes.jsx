import {
    DeleteOutlined,
    DownloadOutlined,
    EyeOutlined,
} from "@ant-design/icons";
import { QRCodeCanvas } from "qrcode.react";
import { Button, Empty, Popconfirm, Table, Modal, Typography } from "antd";
import { useEffect, useRef, useState } from "react";
import Loader from "../Loader/Loader";
import { downloadQRCode, fetchQRCodes, handleViewQRCode, handleDelete } from "../../utils/qrcode/qrcode";

const { Text } = Typography;

const LatestQRCodes = () => {
    const [qrCodes, setQRCodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedQRCode, setSelectedQRCode] = useState(null);
    const [selectedCourseName, setSelectedCourseName] = useState("");
    const canvasRefs = useRef({});

    useEffect(() => {
        fetchQRCodes({ setQRCodes, setLoading });
    }, []);

    const columns = [
        {
            title: "S/N",
            dataIndex: "sn",
            key: "sn",
            render: (_, __, index) => index + 1,
        },
        { title: "Course Name", dataIndex: "course_name", key: "course_name" },
        {
            title: "View",
            key: "view",
            render: (_, record) => (
                <Button
                    type="default"
                    icon={<EyeOutlined />}
                    onClick={() =>
                        handleViewQRCode(
                            record,
                            setSelectedQRCode,
                            setSelectedCourseName,
                            setModalVisible,
                        )
                    }
                >
                    View
                </Button>
            ),
        },

        {
            title: "Download",
            key: "download",
            render: (_, record) => (
                <div>
                    <QRCodeCanvas
                        value={record.course_name.trim()}
                        size={150}
                        level="H"
                        includeMargin={true}
                        ref={(el) =>
                            (canvasRefs.current[record.course_name] = el)
                        }
                    />
                    <Button
                        type="primary"
                        icon={<DownloadOutlined />}
                        onClick={() =>
                            downloadQRCode(record.course_name, canvasRefs)
                        }
                    >
                        Download
                    </Button>
                </div>
            ),
        },

        {
            title: "Delete",
            key: "action",
            render: (_, record) => (
                <Popconfirm
                    title={`Delete QR Code for ${record.course_name}?`}
                    onConfirm={() =>
                        handleDelete(record.course_name, setQRCodes)
                    }
                    okText="Yes"
                    cancelText="No"
                >
                    <Button type="primary" danger icon={<DeleteOutlined />} />
                </Popconfirm>
            ),
        },
    ];

    if (loading) return <Loader />;

    return (
        <div className="my-[2rem]">
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

            {/* View QR Code Modal */}
            <Modal
                title="QR Code Image"
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
                centered
            >
                <div style={{ textAlign: "center" }}>
                    <Text
                        strong
                        style={{
                            fontSize: "16px",
                            marginBottom: "10px",
                            display: "block",
                        }}
                    >
                        {selectedCourseName}
                    </Text>
                    {selectedQRCode && (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <QRCodeCanvas
                                value={selectedQRCode.trim()} // Trim to remove accidental spaces
                                size={250}
                                level="H"
                                includeMargin={true}
                            />
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default LatestQRCodes;
