import { toast } from "react-toastify";

// Utility function to get the current location of the user
export const getLocation = (setFetchingLocation, form) => {
    setFetchingLocation(true); // Set fetchingLocation to true while fetching
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude.toFixed(2);
                const long = position.coords.longitude.toFixed(2);

                // Set the fetched location in the form
                form.setFieldsValue({
                    latitude: lat,
                    longitude: long,
                });
                setFetchingLocation(false); // Set fetchingLocation to false after fetching
            },
            (error) => {
                console.error("Error getting location:", error);
                toast.error("Failed to fetch location.");
                setFetchingLocation(false); // Reset fetchingLocation if there's an error
            },
        );
    } else {
        toast.error("Geolocation is not supported by this browser.");
        setFetchingLocation(false); // Reset fetchingLocation if geolocation is not supported
    }
};
