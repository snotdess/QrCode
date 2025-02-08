import { useEffect, useState } from "react";

const useDynamicSubtitleLevel = () => {
    const getSubtitleLevel = (width) => {
        if (width > 576) return 5; // Extra small devices
        return 5; // Medium and larger devices
    };

    const [subtitleLevel, setSubtitleLevel] = useState(
        getSubtitleLevel(window.innerWidth),
    );

    useEffect(() => {
        const handleResize = () => {
            setSubtitleLevel(getSubtitleLevel(window.innerWidth));
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return subtitleLevel;
};

export default useDynamicSubtitleLevel;
