
import { useEffect, useState } from "react";

const useDynamicHeadingLevel = () => {
    const getHeadingLevel = (width) => {
        if (width < 576) return 5; // Extra small devices
        if (width >= 576 && width < 768) return 4; // Small devices
        if (width >= 768 && width < 992) return 3; // Medium devices
        if (width >= 992 && width < 1252) return 2; // large devices
        return 1; // Extra Large devices
    };

    const [headingLevel, setHeadingLevel] = useState(
        getHeadingLevel(window.innerWidth),
    );

    useEffect(() => {
        const handleResize = () => {
            setHeadingLevel(getHeadingLevel(window.innerWidth));
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return headingLevel;
};

export default useDynamicHeadingLevel;
