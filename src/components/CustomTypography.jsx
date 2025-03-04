// Import necessary modules
import { Button, Collapse, Typography } from "antd";
import React from "react";
import "../../src/index.css";
import useDynamicHeadingLevel from "../hooks/typography/useDynamicHeadingLevel";
import useDynamicSubtitleLevel from "../hooks/typography/useDynamicSubtitleLevel";
// Destructure Title and Paragraph from Typography
const { Title, Paragraph, Link } = Typography;
const { Panel } = Collapse;

// Define the custom font family
const customFontFamily = { fontFamily: "Roboto, sans-serif" };

// Reusable Title Component
const CustomTitle = ({ children, className }) => {
    const headingLevel = useDynamicHeadingLevel();
    return (
        <Title
            className={className}
            level={headingLevel}
            style={{ fontFamily: customFontFamily }}
        >
            {children}
        </Title>
    );
};

// Reusable Paragraph Component
const CustomParagraph = ({ children, className, onClick }) => (
    <Paragraph
        onClick={onClick}
        className={className}
        style={{ fontFamily: customFontFamily }}
    >
        {children}
    </Paragraph>
);

// Reusable Subtitle Component
const CustomSubtitle = ({ children, color, className }) => {
    const subtitleLevel = useDynamicSubtitleLevel();
    return (
        <Title
            className={`${className}`}
            level={subtitleLevel}
            style={{ fontFamily: customFontFamily, color: color }}
        >
            {children}
        </Title>
    );
};

const CustomButton = ({
    children,
    onClick,
    className = "",
    type = "default",
    ...props
}) => (
    <Button
        type={type}
        onClick={onClick}
        className={`custom-button ${className}`}
        {...props}
    >
        {children}
    </Button>
);

// Reusable Panel Component using Ant Design's Collapse.Panel
const CustomPanel = ({ header, children, ...props }) => (
    <Panel
        header={<span style={{ fontFamily: customFontFamily }}>{header}</span>}
        {...props}
    >
        <div style={{ fontFamily: customFontFamily }}>{children}</div>
    </Panel>
);

// Export the components
export {
    CustomButton,
    CustomPanel,
    CustomParagraph,
    CustomSubtitle,
    CustomTitle,
};
