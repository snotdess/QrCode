

// import React, { useRef, useState } from "react";
// import { useLocation } from "react-router-dom";
// import { ToastContainer } from "react-toastify";
// import Footer from "./components/Footer/Footer";
// import Navbar from "./components/Navbar/Navbar";
// import Sidebar from "./components/Sidebar/SideBar";
// import { renderRoutes, routes } from "./config/routesConfig";
// import useUserInfo from "./hooks/userInfo/useUserInfo";
// import NotFound from "./routes/NotFound";

// const App = () => {
//     const featuresRef = useRef(null);
//     const location = useLocation();
//     const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
//     const {
//         fullname,
//         setFullname,
//         email,
//         setEmail,
//         userRole,
//         setUserRole,
//         matNo,
//         setMatNo,
//     } = useUserInfo();

//     // Define routes that hide the navbar
//     const hideNavbarRoutes = [
//         "/lecturer/login",
//         "/student/login",
//         "/onboarding",
//         "/lecturer/signup",
//         "/student/signup",
//         "/dashboard",
//         "/courses",
//         "/selected_courses",
//         "/create_qrcode",
//         "/attendance",
//     ];

//     // Determine if navbar should be hidden based on the current route
//     const shouldHideNavbar = hideNavbarRoutes.some((route) =>
//         location.pathname.startsWith(route),
//     );

//     // Show sidebar for specific routes (like /courses and its nested routes)
//     const shouldShowSidebar =
//         location.pathname.startsWith("/courses") ||
//         location.pathname === "/dashboard" ||
//         location.pathname === "/create_qrcode" ||
//         location.pathname === "/attendance" ||
//         location.pathname === "/selected_courses";

//     // Check if current route is a 404 (not found) page
//     const isNotFoundPage = !routes.some(
//         (route) => route.path === location.pathname,
//     );

//     return (
//         <div className="mx-auto">
//             {/* Conditionally render Navbar */}
//             {!shouldHideNavbar && !isNotFoundPage && <Navbar featuresRef={featuresRef} />}

//             {/* Conditionally render Sidebar */}
//             {shouldShowSidebar && !isNotFoundPage && (
//                 <Sidebar
//                     collapsed={sidebarCollapsed}
//                     setCollapsed={setSidebarCollapsed}
//                 />
//             )}

//             {/* Render Routes */}
//             {isNotFoundPage ? (
//                 <NotFound />
//             ) : (
//                 renderRoutes(routes, {
//                     fullname,
//                     setFullname,
//                     email,
//                     setEmail,
//                     userRole,
//                     setUserRole,
//                     matNo,
//                     setMatNo,
//                     sidebarCollapsed,
//                     setSidebarCollapsed,
//                 })
//             )}

//             {/* Toast Notifications */}
//             <ToastContainer position="top-right" autoClose={1500} />

//             {/* Conditionally render Footer */}
//             {!shouldHideNavbar && !isNotFoundPage && (
//                 <Footer sidebarCollapsed={sidebarCollapsed} />
//             )}
//         </div>
//     );
// };

// export default App;


import React, { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/SideBar";
import { renderRoutes, routes } from "./config/routesConfig";
import useUserInfo from "./hooks/userInfo/useUserInfo";
import NotFound from "./routes/NotFound";

const App = () => {
    const featuresRef = useRef(null); // ✅ Create reference

    const location = useLocation();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
    const {
        fullname,
        setFullname,
        email,
        setEmail,
        userRole,
        setUserRole,
        matNo,
        setMatNo,
    } = useUserInfo();

    const hideNavbarRoutes = [
        "/lecturer/login",
        "/student/login",
        "/onboarding",
        "/lecturer/signup",
        "/student/signup",
        "/dashboard",
        "/courses",
        "/selected_courses",
        "/create_qrcode",
        "/attendance",
    ];

    const shouldHideNavbar = hideNavbarRoutes.some((route) =>
        location.pathname.startsWith(route),
    );

    const shouldShowSidebar =
        location.pathname.startsWith("/courses") ||
        location.pathname === "/dashboard" ||
        location.pathname === "/create_qrcode" ||
        location.pathname === "/attendance" ||
        location.pathname === "/selected_courses";

    const isNotFoundPage = !routes.some(
        (route) => route.path === location.pathname,
    );

    return (
        <div className="mx-auto">
            {!shouldHideNavbar && !isNotFoundPage && (
                <Navbar featuresRef={featuresRef} />
            )}

            {shouldShowSidebar && !isNotFoundPage && (
                <Sidebar
                    collapsed={sidebarCollapsed}
                    setCollapsed={setSidebarCollapsed}
                />
            )}

            {isNotFoundPage ? (
                <NotFound />
            ) : (
                renderRoutes(routes, {
                    fullname,
                    setFullname,
                    email,
                    setEmail,
                    userRole,
                    setUserRole,
                    matNo,
                    setMatNo,
                    sidebarCollapsed,
                    setSidebarCollapsed,
                    featuresRef, // ✅ Pass featuresRef into routes
                })
            )}

            <ToastContainer position="top-right" autoClose={1500} />

            {!shouldHideNavbar && !isNotFoundPage && (
                <Footer sidebarCollapsed={sidebarCollapsed} />
            )}
        </div>
    );
};

export default App;
