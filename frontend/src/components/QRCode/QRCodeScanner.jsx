// QRCodeScanner.jsx
import React from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Descriptions, Upload } from "antd";
import { handleImageUpload, processQRCode } from "../../utils/qrcode/qrcode";

const {Item}= Descriptions

const QRCodeScanner = ({
    scannedData,
    setScannedData,
    form,
    setIsScannerOpen,
}) => {
    return (
        <>
            <div className="flex items-center justify-between">
                <Button
                    type="primary"
                    onClick={() => setIsScannerOpen(true)}
                    style={{ marginBottom: "10px" }}
                >
                    Open QR Scanner
                </Button>
                <Upload
                    accept="image/*"
                    showUploadList={false}
                    beforeUpload={(file) =>
                        handleImageUpload(file, (data) =>
                            processQRCode(
                                data,
                                setScannedData,
                                form,
                                setIsScannerOpen,
                            ),
                        )
                    }
                >
                    <Button icon={<UploadOutlined />} type="dashed" danger>
                        Upload QR Code Image
                    </Button>
                </Upload>
            </div>

            {scannedData && (
                <Descriptions
                    title="Scanned Data"
                    bordered
                    column={1}
                    style={{ marginTop: "20px" }}
                >
                    <Item label="Course Code">
                        {scannedData.course_code}
                    </Item>
                    <Item label="Generated Time">
                        {scannedData.generated_at}
                    </Item>
                </Descriptions>
            )}
        </>
    );
};

export default QRCodeScanner;
