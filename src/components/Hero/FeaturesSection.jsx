import { forwardRef } from "react";
import { Card } from "antd";
import {
    CustomParagraph,
    CustomSubtitle,
    CustomTitle,
} from "../CustomTypography";
import { features } from "../../services/features";

const FeaturesSection = forwardRef((props, ref) => {
    return (
        <div
            ref={ref} // ✅ This allows scrolling to work
            className="my-4 py-20 text-center px-6 md:px-16 bg-gray-50"
        >
            <CustomTitle className="text-4xl font-bold text-gray-800 mb-10">
                Why Choose Our System?
            </CustomTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 container mx-auto">
                {features.map((feature, index) => (
                    <Card
                        key={index}
                        className="p-6 shadow-lg hover:shadow-xl transition duration-300"
                    >
                        {feature.icon}
                        <CustomSubtitle className="mt-4">
                            {feature.title}
                        </CustomSubtitle>
                        <CustomParagraph className="text-gray-600">
                            {feature.description}
                        </CustomParagraph>
                        <CustomParagraph className="text-gray-600">
                            {feature.benefit}
                        </CustomParagraph>
                    </Card>
                ))}
            </div>
        </div>
    );
});

export default FeaturesSection;
