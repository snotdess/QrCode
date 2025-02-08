import { toast } from "react-toastify";
import {
    Lecturerlogin,
    Lecturersignup,
    Studentlogin,
    Studentsignup,
} from "../../api/api";
import { validateLecturerEmail, validateStudentEmail } from "../email/emailValidator";

export const handleSignup = async (
    userType,
    formData,
    navigate,
    setLoading,
) => {
    setLoading(true);
    let emailError =
        userType === "lecturer"
            ? validateLecturerEmail(formData.email)
            : validateStudentEmail(formData.email);

    if (emailError) {
        toast.error(emailError);
        setLoading(false);
        return;
    }

    try {
        const response =
            userType === "lecturer"
                ? await Lecturersignup({
                      lecturer_name: formData.name,
                      lecturer_email: formData.email,
                      lecturer_department: formData.department,
                      lecturer_password: formData.password,
                  })
                : await Studentsignup({
                      matric_number: formData.matric_number,
                      student_fullname: formData.name,
                      student_email: formData.email,
                      student_password: formData.password,
                  });

        toast.success("Signup successful!");
        setTimeout(() => navigate(`/${userType}/login`), 1500);
    } catch (error) {
        toast.error(error?.response?.data?.detail || "Signup failed!");
    } finally {
        setLoading(false);
    }
};

export const handleLogin = async (
    userType,
    formData,
    setLoading,
    navigate,
    setFullname,
    setMatNo,
    setEmail,
    setUserRole,
) => {
    setLoading(true);
    const isStudent = userType === "student";

    if (!isStudent) {
        const emailError = validateLecturerEmail(formData.email);
        if (emailError) {
            toast.error(emailError);
            setLoading(false);
            return;
        }
    }

    try {
        const response = await (isStudent
            ? Studentlogin({
                  matric_number: formData.matric_number,
                  student_password: formData.password,
              })
            : Lecturerlogin({
                  lecturer_email: formData.email,
                  lecturer_password: formData.password,
              }));

        localStorage.setItem("access_token", response.access_token);
        localStorage.setItem("lecturer_id", response.lecturer_id);

        localStorage.setItem(
            "fullname",
            isStudent ? response.student_fullname : response.lecturer_name,
        );
        localStorage.setItem(
            "email",
            isStudent ? response.student_email : response.lecturer_email,
        );
        localStorage.setItem("userRole", response.role);

        if (isStudent) {
            localStorage.setItem("matric_number", response.matric_number);
            setMatNo(response.matric_number);
        }

        setFullname(response.fullname);
        setEmail(response.email);
        setUserRole(response.role);

        toast.success("Login successful!");
        navigate("/dashboard");
    } catch (error) {
        console.error(error);

        toast.error(error || "Login failed!");
    } finally {
        setLoading(false);
    }
};
