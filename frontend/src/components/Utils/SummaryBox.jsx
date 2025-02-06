import { Card, Typography } from "antd";
import React from "react";

const { Title, Paragraph } = Typography;

const SummaryBox = ({ title, value, color }) => {
    return (
        <Card
            className="flex flex-col lg:w-[50%]  h-[120px] md:h-[140px] items-start justify-center"
            style={{
                borderColor: color,
            }}
        >
            <Title
                level={5}
                style={{
                    fontFamily: "Roboto",
                    marginBottom: "8px",
                    textAlign: "center",
                    fontSize: "1.03rem",
                    whiteSpace: "nowrap",
                }}
            >
                {title}
            </Title>
            <Paragraph
                style={{
                    fontFamily: "Roboto",
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                }}
            >
                {value}
            </Paragraph>
        </Card>
    );
};

export default SummaryBox;
