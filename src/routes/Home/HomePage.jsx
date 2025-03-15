import CallToAction from "../../components/Hero/CallToAction";
import FeaturesSection from "../../components/Hero/FeaturesSection";
import HeroSection from "../../components/Hero/HeroSection";
import HowItWorks from "../../components/Hero/HowItWorks";

const HomePage = ({ featuresRef }) => {
    return (
        <>
            <HeroSection />
            <FeaturesSection ref={featuresRef} />
            <HowItWorks />
            <CallToAction />
        </>
    );
};

export default HomePage;
