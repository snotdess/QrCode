// function to handle search
export const handleSearch = (value, originalData, setFilteredData) => {
    if (!value) {
        setFilteredData(originalData); // Reset to original data when search is empty
    } else {
        const searchResult = originalData.filter((patient) =>
            Object.values(patient)
                .join(" ")
                .toLowerCase()
                .includes(value.toLowerCase()),
        );
        setFilteredData(searchResult);
    }
};
