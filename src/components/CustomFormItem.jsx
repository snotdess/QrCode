import { Form, Input } from "antd";
import React from "react";

const customFontFamily = "Roboto, sans-serif";

const CustomFormItem = ({
    label,
    name,
    required,
    placeholder,
    type = "text",
    ...props
}) => {
    return (
        <Form.Item
            label={
                <span style={{ fontFamily: customFontFamily }}>{label}</span>
            }
            name={name}
            rules={[
                {
                    required,
                    message: `Please enter ${label.toLowerCase()}!`,
                },
            ]}
            {...props}
        >
            {type === "password" ? (
                <Input.Password
                    placeholder={placeholder}
                    size="large"
                    style={{ fontFamily: customFontFamily }}
                />
            ) : (
                <Input
                    type={type}
                    placeholder={placeholder}
                    size="large"
                    style={{ fontFamily: customFontFamily }}
                />
            )}
        </Form.Item>
    );
};

export default CustomFormItem;
