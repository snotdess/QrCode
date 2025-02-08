// import React from "react";
// import { UploadOutlined } from "@ant-design/icons";
// import { Button, Descriptions, Upload, Modal } from "antd";
// import QrScanner from "react-qr-scanner"; // Ensure this is properly installed

// import { handleImageUpload, processQRCode } from "../../utils/qrcode/qrcode";

// const { Item } = Descriptions;

// const QRCodeScanner = ({
//     scannedData,
//     setScannedData,
//     form,
//     isScannerOpen,
//     setIsScannerOpen,
// }) => {
//     const handleScan = (data) => {
//         if (data) {
//             try {
//                 const parsedData = JSON.parse(data.text);
//                 setScannedData(parsedData);
//                 form.setFieldsValue({
//                     course_code: parsedData.course_code,
//                     generated_at: parsedData.generated_at,
//                 });
//                 setIsScannerOpen(false); // Close modal after successful scan
//             } catch (error) {
//                 console.error("Invalid QR Code:", error);
//             }
//         }
//     };

//     const handleError = (error) => {
//         console.error("QR Scanner Error:", error);
//     };

//     return (
//         <>
//             <div className="flex items-center justify-between">
//                 <Button
//                     type="primary"
//                     onClick={() => setIsScannerOpen(true)}
//                     style={{ marginBottom: "10px" }}
//                 >
//                     Open QR Scanner
//                 </Button>
//                 <Upload
//                     accept="image/*"
//                     showUploadList={false}
//                     beforeUpload={(file) =>
//                         handleImageUpload(file, (data) =>
//                             processQRCode(
//                                 data,
//                                 setScannedData,
//                                 form,
//                                 setIsScannerOpen,
//                             ),
//                         )
//                     }
//                 >
//                     <Button icon={<UploadOutlined />} type="dashed" danger>
//                         Upload QR Code Image
//                     </Button>
//                 </Upload>
//             </div>

//             {/* QR Scanner Modal */}
//             <Modal
//                 title="Scan QR Code"
//                 open={isScannerOpen}
//                 onCancel={() => setIsScannerOpen(false)}
//                 footer={null}
//                 centered
//             >
//                 <QrScanner
//                     delay={300}
//                     onError={handleError}
//                     onScan={handleScan}
//                     style={{ width: "100%" }}
//                 />
//             </Modal>

//             {scannedData && (
//                 <Descriptions
//                     title="Scanned Data"
//                     bordered
//                     column={1}
//                     style={{ marginTop: "20px" }}
//                 >
//                     <Item label="Course Code">{scannedData.course_code}</Item>
//                     <Item label="Generated Time">
//                         {scannedData.generated_at}
//                     </Item>
//                 </Descriptions>
//             )}
//         </>
//     );
// };

// export default QRCodeScanner;



import React, { useRef, useState } from "react";
import { UploadOutlined, CameraOutlined } from "@ant-design/icons";
import { Button, Descriptions, Upload, Modal } from "antd";
import jsQR from "jsqr";
import { toast } from "react-toastify";
import { processQRCode } from "../../utils/qrcode/qrcode";

const { Item } = Descriptions;

const QRCodeScanner = ({ scannedData, setScannedData, form }) => {
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const startCamera = () => {
        setIsCameraOpen(true);
        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        });
    };

    const captureAndProcessImage = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const context = canvasRef.current.getContext("2d");
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
            <div className="flex items-center justify-between">
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
                    <Button icon={<UploadOutlined />} type="dashed" danger>
                        Upload QR Code Image
                    </Button>
                </Upload>
            </div>

            {/* Camera Modal */}
            <Modal
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
