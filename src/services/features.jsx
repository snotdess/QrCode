import {
    ClockCircleOutlined,
    QrcodeOutlined,
    SafetyOutlined,
    MobileOutlined,
    BarChartOutlined,
} from "@ant-design/icons";


export const features = [
    {
        icon: <QrcodeOutlined className="text-4xl text-blue-500" />,
        title: "QR Code Based",
        description:
            "Generate unique QR codes for seamless attendance marking.",
        benefit: "Eliminates manual errors and speeds up attendance tracking.",
    },
    {
        icon: <SafetyOutlined className="text-4xl text-blue-500" />,
        title: "Secure & Reliable",
        description: "All data is encrypted and securely stored in the cloud.",
        benefit:
            "Ensures data privacy and protection against unauthorized access.",
    },
    {
        icon: <ClockCircleOutlined className="text-4xl text-blue-500" />,
        title: "Automated Reports",
        description:
            "Generate detailed attendance reports with a single click.",
        benefit:
            "Saves time by providing instant access to attendance records.",
    },
    {
        icon: <MobileOutlined className="text-4xl text-blue-500" />,
        title: "Mobile Friendly",
        description: "Access and manage attendance on any device with ease.",
        benefit:
            "Provides flexibility for both students and lecturers on the go.",
    },
    {
        icon: <BarChartOutlined className="text-4xl text-blue-500" />,
        title: "Real-Time Tracking",
        description: "Monitor attendance records instantly with live updates.",
        benefit:
            "Ensures accurate and up-to-date attendance data at all times.",
    },
];
