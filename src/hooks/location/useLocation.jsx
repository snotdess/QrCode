import { useState } from "react";

const useLocation = () => {
    const [fetchingLocation, setFetchingLocation] = useState(false);

    const fetchLocation = () => {
        return new Promise((resolve, reject) => {
            setFetchingLocation(true);
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const location = {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        };
                        setFetchingLocation(false);
                        resolve(location);
                    },
                    (error) => {
                        console.error("Error getting location:", error);
                        setFetchingLocation(false);
                        reject(error);
                    },
                );
            } else {
                reject(
                    new Error("Geolocation is not supported by this browser."),
                );
                setFetchingLocation(false);
            }
        });
    };

    return {
        fetchingLocation,
        fetchLocation,
    };
};

export default useLocation;
