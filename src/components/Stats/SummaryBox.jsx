// SummaryBox.jsx

import { Card } from "antd";
import React from "react";
import useDynamicSubtitleLevel from "../../hooks/typography/useDynamicSubtitleLevel";
import { CustomParagraph, CustomSubtitle } from "../CustomTypography";

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
            className="flex flex-col items-start justify-center md:h-[140px]"
            style={{
                borderColor: color,
            }}
        >
            <CustomSubtitle
                level={subtitleLevel}
                style={{
                    marginBottom: "8px",
                }}
            >
                {formattedTitle}
            </CustomSubtitle>
            <CustomParagraph
                style={{
                    fontSize: "0.9rem",
                }}
            >
                {value}
            </CustomParagraph>
        </Card>
    );
};

export default SummaryBox;
