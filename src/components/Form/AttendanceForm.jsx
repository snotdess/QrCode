// import { Button, Form, Input } from "antd";
// import { useState } from "react";
// import useLocation from "../../hooks/location/useLocation";
// import {
//     handleGetLocation,
//     submitAttendance,
// } from "../../utils/attendanceHandler";
// import QRCodeScanner from "../QRCode/QRCodeScanner";
// import Loader from "../Loader/Loader";


// const AttendanceForm = ({ onSuccess, onCancel }) => {
//     const [form] = Form.useForm();
//     const { fetchingLocation, fetchLocation } = useLocation();
//     const [scannedData, setScannedData] = useState(null);
//     const [isScannerOpen, setIsScannerOpen] = useState(false);
//     const [loading, setLoading] = useState(false);

//     const customFont = { fontFamily: "Roboto, sans-serif" };

//     return (
//         <Form
//             form={form}
//             layout="vertical"
//             onFinish={() => {
//                 setLoading(true); // Start loading
//                 setTimeout(async () => {
//                     await submitAttendance(
//                         form,
//                         scannedData,
//                         onSuccess,
//                         setScannedData,
//                     );
//                     setLoading(false); // Stop loading after submission
//                 }, 500); // Show loading for 0.5s
//             }}
//             style={customFont}
//         >
//             <Form.Item
//                 label={<span style={customFont}>Matric Number</span>}
//                 name="matric_number"
//                 rules={[
//                     {
//                         required: true,
//                         message: "Please enter your matric number",
//                     },
//                 ]}
//             >
//                 <Input
//                     placeholder="Enter your matric number"
//                     style={customFont}
//                 />
//             </Form.Item>

//             {/* QR Code Scanner Component */}
//             <Form.Item label={<span style={customFont}>QR Code</span>}>
//                 <QRCodeScanner
//                     scannedData={scannedData}
//                     setScannedData={setScannedData}
//                     form={form}
//                     isScannerOpen={isScannerOpen}
//                     setIsScannerOpen={setIsScannerOpen}
//                 />
//             </Form.Item>

//             <Form.Item label={<span style={customFont}>Get Location</span>}>
//                 <Button
//                     type="dashed"
//                     onClick={() => handleGetLocation(fetchLocation, form)}
//                     loading={fetchingLocation}
//                     style={customFont}
//                 >
//                     {fetchingLocation ? "Fetching..." : "Get Current Location"}
//                 </Button>
//             </Form.Item>

//             <Form.Item
//                 label={<span style={customFont}>Student Latitude</span>}
//                 name="student_latitude"
//                 rules={[
//                     {
//                         required: true,
//                         message: "Please get your current latitude",
//                     },
//                 ]}
//             >
//                 <Input
//                     disabled
//                     style={{ backgroundColor: "#fff", ...customFont }}
//                 />
//             </Form.Item>

//             <Form.Item
//                 label={<span style={customFont}>Student Longitude</span>}
//                 name="student_longitude"
//                 rules={[
//                     {
//                         required: true,
//                         message: "Please get your current longitude",
//                     },
//                 ]}
//             >
//                 <Input
//                     disabled
//                     style={{ backgroundColor: "#fff", ...customFont }}
//                 />
//             </Form.Item>

//             <div className="flex items-center justify-between">
//                 <Form.Item>
//                     <Button
//                         onClick={onCancel}
//                         type="primary"
//                         danger
//                         style={customFont}
//                     >
//                         Cancel
//                     </Button>
//                 </Form.Item>

//                 <Form.Item>
//                     <Button type="primary" htmlType="submit" style={customFont}>
//                         { loading ? <Loader /> : "Submit Attendance" }
//                     </Button>
//                 </Form.Item>
//             </div>
//         </Form>
//     );
// };

// export default AttendanceForm;



import { Button, Form, Input } from "antd";
import { useState } from "react";
import useLocation from "../../hooks/location/useLocation";
import {
    handleGetLocation,
    submitAttendance,
} from "../../utils/attendanceHandler";
import QRCodeScanner from "../QRCode/QRCodeScanner";
import Loader from "../Loader/Loader";
import useUserInfo from "../../hooks/userInfo/useUserInfo";

const AttendanceForm = ({ onSuccess, onCancel }) => {
    const [form] = Form.useForm();
    const { fetchingLocation, fetchLocation } = useLocation();
    const [scannedData, setScannedData] = useState(null);
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [ loading, setLoading ] = useState( false );
    const { matNo } = useUserInfo();

    const customFont = { fontFamily: "Roboto, sans-serif" };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={() => {
                setLoading(true);
                setTimeout(async () => {
                    await submitAttendance(
                        form,
                        scannedData,
                        onSuccess,
                        setScannedData,
                    );
                    setLoading(false);
                }, 500);
            }}
            style={customFont}
        >

            <Form.Item label={ <span style={ customFont }>Student matric Number: {matNo} </span> }>
            </Form.Item>

            {/* QR Code Scanner Component */}
            <Form.Item className="mt-[-2rem]" label={<span style={customFont}>QR Code</span>}>
                <QRCodeScanner
                    scannedData={scannedData}
                    setScannedData={setScannedData}
                    form={form}
                    isScannerOpen={isScannerOpen}
                    setIsScannerOpen={setIsScannerOpen}
                />
            </Form.Item>

            <Form.Item label={<span style={customFont}>Get Location</span>}>
                <Button
                    type="dashed"
                    onClick={() => handleGetLocation(fetchLocation, form)}
                    loading={fetchingLocation}
                    style={customFont}
                >
                    {fetchingLocation ? "Fetching..." : "Get Current Location"}
                </Button>
            </Form.Item>

            <Form.Item
                label={<span style={customFont}>Student Latitude</span>}
                name="student_latitude"
                rules={[
                    { required: true, message: "Please get your latitude" },
                ]}
            >
                <Input
                    disabled
                    style={{ backgroundColor: "#fff", ...customFont }}
                />
            </Form.Item>

            <Form.Item
                label={<span style={customFont}>Student Longitude</span>}
                name="student_longitude"
                rules={[
                    { required: true, message: "Please get your longitude" },
                ]}
            >
                <Input
                    disabled
                    style={{ backgroundColor: "#fff", ...customFont }}
                />
            </Form.Item>

            <div className="flex items-center justify-between">
                <Form.Item>
                    <Button
                        onClick={onCancel}
                        type="primary"
                        danger
                        style={customFont}
                    >
                        Cancel
                    </Button>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" style={customFont}>
                        {loading ? <Loader /> : "Submit Attendance"}
                    </Button>
                </Form.Item>
            </div>
        </Form>
    );
};

export default AttendanceForm;
