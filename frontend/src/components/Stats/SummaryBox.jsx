// SummaryBox.jsx

import { Card, Typography } from "antd";
import React from "react";
import useDynamicSubtitleLevel from "../../hooks/typography/useDynamicSubtitleLevel";

const { Title, Paragraph } = Typography;

const SummaryBox = ({ title, value, color }) => {
    const subtitleLevel = useDynamicSubtitleLevel();

    // Words to keep lowercase
    const lowercaseWords = ["and", "or"];

    // Capitalize words properly & fully capitalize "AI"
    const formattedTitle = title
        .toLowerCase()
        .split(" ")
        .map((word, index) =>
            word.toLowerCase() === "ai"
                ? "AI"
                : lowercaseWords.includes(word) && index !== 0
                ? word
                : word.charAt(0).toUpperCase() + word.slice(1),
        )
        .join(" ");

    return (
        <Card
            className="flex flex-col items-start justify-center h-[140px]"
            style={{
                borderColor: color,
            }}
        >
            <Title
                level={subtitleLevel}
                style={{
                    fontFamily: "Robotto",
                    marginBottom: "8px",
                }}
            >
                {formattedTitle}
            </Title>
            <Paragraph
                style={{
                    fontFamily: "Robotto",
                    fontSize: "0.9rem",
                    fontWeight: "bold",
                }}
            >
                {value}
            </Paragraph>
        </Card>
    );
};

export default SummaryBox;
