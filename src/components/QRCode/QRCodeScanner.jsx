// QRCodeScanner.jsx

import { CameraOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Descriptions, Modal, Upload } from "antd";
import jsQR from "jsqr";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import { processQRCode, handleImageUpload } from "../../utils/qrcode/qrcode";

const { Item } = Descriptions;

const QRCodeScanner = ({ scannedData, setScannedData, form }) => {
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);


    const startCamera = async () => {
        setIsCameraOpen(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: { exact: "environment" } }, // Use back camera
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (error) {
            toast.error("Camera access denied or unavailable.");
            setIsCameraOpen(false);
        }
    };


    const captureAndProcessImage = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const context = canvasRef.current.getContext("2d", {
            willReadFrequently: true,
        });
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);

        const imageData = context.getImageData(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height,
        );
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
            processQRCode(code.data, setScannedData, form, setIsCameraOpen);
        } else {
            toast.error("No QR Code detected.");
        }

        stopCamera();
    };

    const stopCamera = () => {
        if (videoRef.current?.srcObject) {
            let tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
        }
        setIsCameraOpen(false);
    };

    return (
        <>
            <div className="flex w-full gap-3 items-center justify-between">
                <Button
                    type="primary"
                    icon={<CameraOutlined />}
                    onClick={startCamera}
                >
                    Snap QR Code
                </Button>
                <Upload
                    accept="image/*"
                    showUploadList={false}
                    beforeUpload={(file) =>
                        handleImageUpload(file, (data) =>
                            processQRCode(data, setScannedData, form),
                        )
                    }
                >
                    <Button
                        icon={<UploadOutlined />}
                        type="dashed"
                        style={{
                            borderColor: "blue",
                        }}
                    >
                        Upload Image
                    </Button>
                </Upload>
            </div>

            {/* Camera Modal */}
            {/* <Modal
                open={isCameraOpen}
                onCancel={stopCamera}
                footer={null}
                centered
            >
                <video ref={videoRef} autoPlay playsInline />
                <canvas ref={canvasRef} style={{ display: "none" }} />
                <Button type="primary" onClick={captureAndProcessImage} block>
                    Capture
                </Button>
            </Modal> */}

            <Modal
                open={isCameraOpen}
                onCancel={stopCamera}
                footer={null}
                centered
            >
                <div style={{ position: "relative" }}>
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        style={{ width: "100%" }}
                    />
                    <canvas ref={canvasRef} style={{ display: "none" }} />
                    <Button
                        type="primary"
                        onClick={captureAndProcessImage}
                        style={{
                            position: "absolute",
                            bottom: "10px",
                            left: "50%",
                            transform: "translateX(-50%)",
                        }}
                    >
                        Capture
                    </Button>
                </div>
            </Modal>

            {scannedData && (
                <Descriptions
                    title="Scanned Data"
                    bordered
                    column={1}
                    style={{ marginTop: "20px" }}
                >
                    <Item label="Course Code">{scannedData.course_code}</Item>
                    <Item label="Generated Time">
                        {scannedData.generated_at}
                    </Item>
                </Descriptions>
            )}
        </>
    );
};

export default QRCodeScanner;
