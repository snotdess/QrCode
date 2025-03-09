import { MenuOutlined, XOutlined } from "@ant-design/icons";
import { Image } from "antd";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CustomButton, CustomParagraph } from "../CustomTypography";

const Navbar = () => {
    const navigate = useNavigate();
    const customFontFamily = "Roboto, sans-serif";

    const reDirect = () => {
        navigate("/onboarding");
    };

    const [open, setOpen] = useState(false);

    const menu = (prev) => {
        setOpen((prev) => !prev);
    };
    return (
        <nav className="flex items-center justify-between lg:ml-[1.5rem] lg:mr-[1.5rem]">
            <Link to={"/"} className="flex items-center justify-center">
                <Image src="/logo2.jpg" width={ 50 } className="rounded-3xl" preview={ false} />

                <CustomParagraph className="flex mt-3 items-center justify-center ml-2">
                    Geo
                    <span className="text-blue-600 font-bold">QR</span>
                </CustomParagraph>
            </Link>

            <section className=" hidden md:flex gap-9">
                <Link
                    style={{
                        fontFamily: customFontFamily,
                    }}
                    to={"/"}
                >
                    Home
                </Link>
                <Link
                    style={{
                        fontFamily: customFontFamily,
                    }}
                    to={"/faq"}
                >
                    FAQ
                </Link>
            </section>
            <section className="right">
                <CustomButton
                    type="primary"
                    className="my-[1.2rem] py-[0.3rem] shadow-lg h-[2.5rem] hidden md:block outline-none hover:border-b-[#32de84] text-white"
                    onClick={ reDirect }

                >
                    Try It Now
                </CustomButton>
            </section>

            <section className=" cursor-pointer md:hidden" onClick={menu}>
                {open ? (
                    <XOutlined
                        className={`${open ? "opacity-100" : "opacity-0"}`}
                    />
                ) : (
                    <MenuOutlined
                        className={`${open ? "opacity-0" : "opacity-100"}`}
                    />
                )}
            </section>

            {open && (
                <div
                    className={` ${
                        open ? "translate-y-0" : "translate-y-[100%]"
                    }  transition-all ease-out duration-300 mt-2 rounded-lg z-100 place-items-center gap-3 p-[2rem] flex flex-col bg-gray-100 m-3 items-start absolute right-0 top-10 text-[0.9rem]  z-[99]`}
                    onClick={menu}
                >
                    <Link to={"/"}>Home</Link>
                    <Link to={"/faq"}>FAQ</Link>
                    <CustomButton
                        type="primary"
                        className="my-[0.9rem] py-[0rem] shadow-lg h-[2.5rem] md:hidden outline-none hover:border-b-[#32de84] text-white"
                        onClick={reDirect}
                    >
                        Try It Now
                    </CustomButton>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
