import { Card, Typography } from "antd";
import React from "react";
import { CustomParagraph, CustomSubtitle, CustomTitle } from "../CustomTypography";


const { Title, Paragraph } = Typography;

const ChoiceCard = ({ icon, title, paragraph, onClick, className }) => {
    return (
        <Card
            className={`flex flex-col items-start justify-center space-y-2 p-4 bg-gray-50 rounded-lg w-full mx-auto hover:scale-105 transition-all duration-100 ease-in-out ${className}`}
            onClick={onClick}
        >
            <span>{icon}</span>

            <Typography className="mt-2 md:mt-5">
                <CustomSubtitle>
                    {title}
                </CustomSubtitle>

                <CustomParagraph>{paragraph}</CustomParagraph>
            </Typography>
        </Card>
    );
};

export default ChoiceCard;
