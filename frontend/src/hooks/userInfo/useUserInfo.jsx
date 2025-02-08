import { useEffect, useState } from "react";

const useUserInfo = () => {
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [userRole, setUserRole] = useState("");
    const [matNo, setMatNo] = useState("");
    const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

    useEffect(() => {
        const updateUserInfo = () => {
            setFullname(localStorage.getItem("fullname") || "");
            setEmail(localStorage.getItem("email") || "");
            setUserRole(localStorage.getItem("userRole") || "");
            setMatNo(localStorage.getItem("matric_number") || "");
        };

        updateUserInfo();
    }, []);

    return {
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
    };
};

export default useUserInfo;
