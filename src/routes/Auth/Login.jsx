import { Image } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormComponent from "../../components/Form/FormComponent";
import Loader from "../../components/Loader/Loader";
import { handleLogin } from "../../utils/auth/auth";

const Login = ({
    userType = "student",
    setFullname,
    setMatNo,
    setEmail,
    setUserRole,
}) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const isStudent = userType === "student";

    const fields = isStudent
        ? [
              {
                  label: "Student Matric Number",
                  name: "matric_number",
                  type: "text",
                  placeholder: "Enter your matric number",
                  required: true,
              },
              {
                  label: "Student Password",
                  name: "password",
                  type: "password",
                  placeholder: "Enter your password",
                  required: true,
              },
          ]
        : [
              {
                  label: "Lecturer Email",
                  name: "email",
                  type: "email",
                  placeholder: "Enter your email",
                  required: true,
              },
              {
                  label: "Lecturer Password",
                  name: "password",
                  type: "password",
                  placeholder: "Enter your password",
                  required: true,
              },
          ];

    return (


        <div className="flex items-center justify-center min-h-screen">
            <div className="w-full md:w-[60%] flex flex-col justify-center items-center lg:flex-[55%]">
                <FormComponent
                    title={`${isStudent ? "Student" : "Lecturer"} Login`}
                    fields={fields}
                    onSubmit={(formData) =>
                        handleLogin(
                            userType,
                            formData,
                            setLoading,
                            navigate,
                            setFullname,
                            setMatNo,
                            setEmail,
                            setUserRole,
                        )
                    }
                    submitButtonText={loading ? <Loader /> : "Login"}
                    redirect={{
                        text: "Don't Have an Account? Signup Here",
                        path: isStudent
                            ? "/student/signup"
                            : "/lecturer/signup",
                    }}
                />
            </div>

            <div className="md:flex-[35%] lg:flex-[45%] w-[100%] flex items-center justify-center">
                <Image
                    src={
                        isStudent ? "/Student Login.png" : "/Lecturer Login.png"
                    }
                    preview={false}
                    alt={`${
                        isStudent ? "Student" : "Lecturer"
                    } Login Illustration`}
                    className="hidden md:block"
                />
            </div>
        </div>
    );
};

export default Login;
