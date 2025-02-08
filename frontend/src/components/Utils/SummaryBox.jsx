import { Card, Typography } from "antd";
import React from "react";

const { Title, Paragraph } = Typography;

const SummaryBox = ({ title, value, color }) => {
    return (
        <Card
            className="flex flex-col w-full lg:w-[80%]  h-[120px] md:h-[140px] items-start justify-center"
            style={{
                borderColor: color,
            }}
        >
            <Title
                style={{
                    fontFamily: "Robtto",
                    marginBottom: "8px",
                    fontSize: "18px"

                } }
                className=""
            >
                {title.toUpperCase()}
            </Title>
            <Paragraph
                style={{
                    fontFamily: "Robtto",
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
