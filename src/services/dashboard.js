// import { dashboardData, patientData } from "../api/api";


// // function to fecth data
// export const fetchData = async (
//     setSummaryData,
//     setOriginalData,
//     setFilteredData,
//     setLoading,
//     setError,
// ) => {
//     try {
//         // Fetch dashboard data
//         const dashboard = await dashboardData();
//         setSummaryData([
//             {
//                 title: "Total Patients",
//                 value: dashboard.total_patients,
//                 color: "#034694",
//             },
//             {
//                 title: "Normal Case",
//                 value: dashboard.normal_cases,
//                 color: "#6CB4EE",
//             },
//             {
//                 title: "Benign Case",
//                 value: dashboard.benign_cases,
//                 color: "#3457D5",
//             },
//             {
//                 title: "Malignant Case",
//                 value: dashboard.malignant_cases,
//                 color: "#6495ED",
//             },
//         ]);

//         // Fetch patient data
//         const patients = await patientData();
//         const formattedData = patients.map((item, index) => ({
//             key: index,
//             sn: index + 1,
//             name: item.patient_name,
//             age: item.patient_age,
//             gender: item.patient_gender,
//             email: item.patient_email,
//             notes: item.patient_notes,
//             status: item.prediction.endsWith("s")
//                 ? item.prediction.slice(0, -1)
//                 : item.prediction,
//         }));
//         setOriginalData(formattedData);
//         setFilteredData(formattedData); // Initialize filteredData with original data

//         // Simulate delay to stop loader after 2 second
//         setTimeout(() => {
//             setLoading(false);
//         }, 2000);
//     } catch (err) {
//         console.error("Error fetching data:", err);
//         setError("Failed to load data.");
//         setLoading(false);
//     }
// };
