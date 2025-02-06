// import dayGridPlugin from "@fullcalendar/daygrid";
// import FullCalendar from "@fullcalendar/react";
// import { Button, Empty, Typography } from "antd";
// import React, { useEffect, useState } from "react";
// import { CSVLink } from "react-csv";
// import { IoIosNotificationsOutline } from "react-icons/io";
// import Footer from "../components/Footer";
// import Loader from "../components/Loader";
// import NotificationCard from "../components/Notificationcard";
// import PatientTable from "../components/PatientTable";
// import SearchBar from "../components/SearchBar";
// import SummaryBox from "../components/SummaryBox";
// import useAuth from "../hooks/useAuth";
// import { fetchData } from "../services/dashboard";

// import { handleSearch } from "../utils/search";

// const Dashboard = ({ sidebarCollapsed, username }) => {
//     const [filteredData, setFilteredData] = useState([]);
//     const [originalData, setOriginalData] = useState([]);
//     const [greeting, setGreeting] = useState("Good Morning"); // State for dynamic greeting
//     const [summaryData, setSummaryData] = useState([
//         { title: "Total Patients", value: 0, color: "#034694" },
//         { title: "Normal Case", value: 0, color: "#6CB4EE" },
//         { title: "Benign Case", value: 0, color: "#3457D5" },
//         { title: "Malignant Case", value: 0, color: "#6495ED" },
//     ]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [showNotifications, setShowNotifications] = useState(false);

//     // Use the custom hook for authentication check
//     useAuth();

//     const notifications = log.map((item) => ({
//         message: item.action,
//         timestamp: item.created_at,
//         type: "info",
//     }));

//     const toggleNotifications = () => {
//         setShowNotifications(!showNotifications);
//     };

//     const updateGreeting = () => {
//         const hours = new Date().getHours();
//         if (hours < 12) {
//             setGreeting("Good Morning");
//         } else if (hours < 18) {
//             setGreeting("Good Afternoon");
//         } else {
//             setGreeting("Good Evening");
//         }
//     };

//     const { Title } = Typography;

//     useEffect(() => {
//         fetchData(
//             setSummaryData,
//             setOriginalData,
//             setFilteredData,
//             setLoading,
//             setError,
//         );
//         fetchLog();

//         updateGreeting(); // Update greeting when the component mounts

//         const intervalId = setInterval(updateGreeting, 60 * 1000); // Update every minute
//         return () => clearInterval(intervalId); // Cleanup interval on unmount
//     }, []);

//     if (loading) {
//         return <Loader />;
//     }

//     if (error) {
//         return <p className="text-red-500">{error}</p>;
//     }

//     // CSV Headers
//     const csvHeaders = [
//         { label: "S/N", key: "sn" },
//         { label: "Name", key: "name" },
//         { label: "Age", key: "age" },
//         { label: "Gender", key: "gender" },
//         { label: "Email", key: "email" },
//         { label: "Notes", key: "notes" },
//         { label: "Status", key: "status" },
//     ];

//     return (
//         <div
//             className={`min-h-screen py-2 lg:py-4 p-8 ${
//                 sidebarCollapsed
//                     ? "ml-[40px] md:ml-[70px]"
//                     : "md:ml-[200px] lg:ml-[150px]"
//             }`}
//             style={{ transition: "margin-left 0.3s" }}
//         >
//             <div>
//                 <div className="mb-8 text-left block md:flex md:items-center md:justify-between">
//                     <Title
//                         level={3}
//                         color="blue-gray"
//                         style={{ fontFamily: "Roboto, sans-serif" }}
//                     >
//                         {greeting}, {username || "."}
//                     </Title>
//                     <div className="flex items-center">
//                         <IoIosNotificationsOutline
//                             size={20}
//                             className="cursor-pointer absolute top-4 right-6 md:relative md:top-0 md:right-0"
//                             onClick={toggleNotifications}
//                         />
//                     </div>
//                 </div>

//                 {showNotifications && (
//                     <NotificationCard
//                         notifications={notifications}
//                         onClose={() => setShowNotifications(false)}
//                     />
//                 )}
//                 <div className="md:flex md:items-center md:justify-between">
//                     <div className="mb-8 w-[80%] md:w-[85%] lg:w-[50%]  grid grid-cols-1 md:grid-cols-2 gap-8">
//                         {summaryData &&
//                         summaryData.some((item) => item.value > 0) ? (
//                             summaryData.map((item, index) => (
//                                 <SummaryBox
//                                     key={index}
//                                     title={item.title}
//                                     value={item.value}
//                                     color={item.color}
//                                 />
//                             ))
//                         ) : (
//                             <Empty
//                                 className="flex flex-col items-center justify-center min-h-[30vh]"
//                                 style={{ width: "190px" }}
//                             ></Empty>
//                         )}
//                     </div>
//                     <div
//                         className="hidden lg:flex flex-col gap-4 justify-between mt-7 pt-1 ml-5"
//                         style={{ width: "350px", fontSize: "0.55rem" }}
//                     >
//                         <FullCalendar
//                             plugins={[dayGridPlugin]}
//                             initialView="dayGridMonth"
//                             height={200}
//                             className="z-[0]"
//                             contentHeight={"10px"}
//                             aspectRatio={0.7}
//                         />
//                     </div>
//                 </div>
//                 <div className="flex-[30%] p-1 mt-[4rem]">
//                     <div className="flex flex-col items-start justify-between md:flex-row md:items-center">
//                         <Title level={3} color="blue-gray" className="mb-2">
//                             Information
//                         </Title>

//                         <SearchBar
//                             placeholder="Search by name, email, or status"
//                             onSearch={(value) =>
//                                 handleSearch(
//                                     value,
//                                     originalData,
//                                     setFilteredData,
//                                 )
//                             }
//                         />
//                     </div>
//                     <PatientTable data={filteredData} />

//                     {/* Export Button */}
//                     <div className="mb-4 ">
//                         <Button type="primary" className="">
//                             <CSVLink
//                                 data={filteredData}
//                                 headers={csvHeaders}
//                                 filename="patient_data.csv"
//                                 style={{ color: "white" }}
//                             >
//                                 Export Data
//                             </CSVLink>
//                         </Button>
//                     </div>
//                 </div>
//                 <div className="my-4">
//                     <Footer className="mt-[6rem]" />
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Dashboard;

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import LecturerDashboard from "../components/Dashboard/LecturerDashboard";
// import StudentDashboard from "../components/Dashboard/StudentDashboard";
// import useAuth from "../hooks/useAuth";
// import Loader from '../components/Loader'

// const Dashboard = ({ fullname, userRole, matNo, sidebarCollapsed }) => {
//     const [dashboardComponent, setDashboardComponent] = useState(null);
//     const navigate = useNavigate();

//     useAuth();

//     useEffect(() => {
//         const role = userRole || localStorage.getItem("userRole");

//         // Redirect to login if no role is found
//         if (!role) {
//             navigate("/onboarding");
//             return;
//         }

//         // Dynamically set the dashboard component based on role
//         if (role === "student") {
//             setDashboardComponent(
//                 <StudentDashboard fullname={fullname} matNo={matNo} />,
//             );
//         } else if (role === "lecturer") {
//             setDashboardComponent(<LecturerDashboard fullname={fullname} />);
//         } else {
//             // Redirect to onboarding or error page for unknown roles
//             navigate("/onboarding");
//         }
//     }, [userRole, fullname, matNo, navigate]);

//     // Render the selected dashboard or a fallback loading state
//     return dashboardComponent || <Loader/>;
// };

// export default Dashboard;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LecturerDashboard from "../../components/Dashboard/LecturerDashboard";
import StudentDashboard from "../../components/Dashboard/StudentDashboard";
import Loader from "../../components/Loader/Loader";
import useAuth from "../../hooks/useAuth";
import useUserInfo from "../../hooks/useUserInfo";
const Dashboard = ({ sidebarCollapsed }) => {
    const [dashboardComponent, setDashboardComponent] = useState(null);
    const navigate = useNavigate();
    const { fullname, userRole, matNo } = useUserInfo();

    useAuth();

    useEffect(() => {
        const role = userRole || localStorage.getItem("userRole");

        // Redirect to login if no role is found
        if (!role) {
            navigate("/onboarding");
            return;
        }

        // Dynamically set the dashboard component based on role
        if (role === "student") {
            setDashboardComponent(
                <StudentDashboard
                    fullname={fullname}
                    matNo={matNo}
                    sidebarCollapsed={sidebarCollapsed}
                />,
            );
        } else if (role === "lecturer") {
            setDashboardComponent(
                <LecturerDashboard
                    fullname={fullname}
                    sidebarCollapsed={sidebarCollapsed}
                />,
            );
        } else {
            // Redirect to onboarding or error page for unknown roles
            navigate("/onboarding");
        }
    }, [userRole, fullname, matNo, navigate, sidebarCollapsed]);

    // Render the selected dashboard or a fallback loading state
    return dashboardComponent || <Loader />;
};

export default Dashboard;
