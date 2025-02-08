import React from "react";
import { Route, Routes } from "react-router-dom";
import Course from "../routes/Course/Course";
import Dashboard from "../routes/Dashboard/Dashboard";
import FAQ from "../routes/Faq/FAQ";
import HomePage from "../routes/Home/HomePage";
import Login from "../routes/Auth/Login";
import Onboarding from "../routes/Onboarding";
import QRcode from "../routes/QRcode/QRcode";
import Signup from "../routes/Auth/Signup";

export const routes = [
    { path: "/", element: <HomePage /> },
    { path: "/faq", element: <FAQ /> },
    { path: "/onboarding", element: <Onboarding /> },
    {
        path: "/lecturer/login",
        element: <Login userType="lecturer" />,
    },
    {
        path: "/student/login",
        element: <Login userType="student" />,
    },
    { path: "/lecturer/signup", element: <Signup userType="lecturer" /> },
    { path: "/student/signup", element: <Signup userType="student" /> },
    { path: "/dashboard", element: <Dashboard /> },
    { path: "/courses", element: <Course /> },
    { path: "/create_qrcode", element: <QRcode /> },
];

// Helper function to render routes dynamically
export const renderRoutes = (routes, userInfo) => (
    <Routes>
        {routes.map((route, index) => (
            <Route
                key={index}
                path={route.path}
                element={React.cloneElement(route.element, { ...userInfo })}
            />
        ))}
    </Routes>
);
