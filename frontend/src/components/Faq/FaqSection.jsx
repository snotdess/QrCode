import { Collapse, Typography } from "antd";
import React from "react";
import { faqData } from "../../utils/faq";

const FaqSection = () => {
    const { Panel } = Collapse;
    const { Title } = Typography;
    return (
        <div className="min-h-screen">
            <Title level={3} className="text-center mb-6">
                Frequently Asked Questions
            </Title>
            <Collapse accordion className="max-w-[800px] mx-auto">
                {faqData.map((faq, index) => (
                    <Panel header={faq.question} key={index}>
                        <p className="text-[0.95rem] leading-6">{faq.answer}</p>
                    </Panel>
                ))}
            </Collapse>
        </div>
    );
};

export default FaqSection;
