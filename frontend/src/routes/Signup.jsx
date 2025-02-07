
import { Image } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormComponent from "../components/Form/FormComponent";
import Loader from "../components/Loader/Loader";
import { handleSignup } from "../utils/auth"; // Import the new function

const Signup = ({ userType }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const fields =
        userType === "lecturer"
            ? [
                  {
                      label: "Lecturer FullName",
                      name: "name",
                      type: "text",
                      placeholder: "Enter your fullname",
                      required: true,
                  },
                  {
                      label: "Lecturer Email",
                      name: "email",
                      type: "email",
                      placeholder: "Enter your email",
                      required: true,
                  },
                  {
                      label: "Lecturer Department",
                      name: "department",
                      type: "text",
                      placeholder: "Enter your department",
                      required: true,
                  },
                  {
                      label: "Lecturer Password",
                      name: "password",
                      type: "password",
                      placeholder: "Enter your password",
                      required: true,
                  },
              ]
            : [
                  {
                      label: "Student Matric Number",
                      name: "matric_number",
                      type: "text",
                      placeholder: "Enter your matric number",
                      required: true,
                  },
                  {
                      label: "Student FullName",
                      name: "name",
                      type: "text",
                      placeholder: "Enter your fullname",
                      required: true,
                  },
                  {
                      label: "Student Email",
                      name: "email",
                      type: "email",
                      placeholder: "Enter your email",
                      required: true,
                  },
                  {
                      label: "Student Password",
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
                    title={`${
                        userType.charAt(0).toUpperCase() + userType.slice(1)
                    } Signup`}
                    fields={fields}
                    onSubmit={(formData) =>
                        handleSignup(userType, formData, navigate, setLoading)
                    }
                    submitButtonText={loading ? <Loader /> : "Register"}
                    redirect={{
                        text: "Already Have an Account? Login Here",
                        path: `/${userType}/login`,
                    }}
                />
            </div>

            <div className="md:flex-[35%] lg:flex-[45%] w-[100%] flex items-center justify-center">
                <Image
                    src={`/${
                        userType.charAt(0).toUpperCase() + userType.slice(1)
                    } Signup.png`}
                    alt="Signup Illustration"
                    className="md:block hidden"
                />
            </div>
        </div>
    );
};

export default Signup;
