import React from "react";
import { Collapse } from "antd";
import { faqData } from "../../services/faq";
import { CustomPanel, CustomParagraph, CustomTitle } from "../CustomTypography";

const FaqSection = () => {
    return (
        <div className="min-h-screen">
            <CustomTitle className="text-center mb-6">
                Frequently Asked Questions
            </CustomTitle>
            <Collapse accordion className="max-w-[800px] mx-auto">
                {faqData.map((faq, index) => (
                    <CustomPanel header={faq.question} key={index}>
                        <CustomParagraph className="text-[0.95rem] leading-6">
                            {faq.answer}
                        </CustomParagraph>
                    </CustomPanel>
                ))}
            </Collapse>
        </div>
    );
};

export default FaqSection;
