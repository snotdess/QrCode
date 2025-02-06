// hooks/useLocation.js
import { useState } from "react";
import { getLocation } from "../utils/location";

const useLocation = () => {
    const [fetchingLocation, setFetchingLocation] = useState(false);

    const fetchLocation = (form) => {
        getLocation(setFetchingLocation, form);
    };

    return {
        fetchingLocation,
        fetchLocation,
    };
};

export default useLocation;
