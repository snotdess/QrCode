const StudentDashboard = ({ fullname, matNo, sidebarCollapsed }) => {
    return (
        <div
            className={`min-h-screen mx-auto px-8 py-2 lg:px-8 lg:py-4   transition-all ${
                sidebarCollapsed
                  ? " md:ml-[35px] lg:ml-[60px]"
                    : " md:ml-[220px] lg:ml-[140px]"
            }`}
        >
            <h1 className="text-2xl font-semibold">Welcome, {fullname}</h1>
            <p className="text-md text-gray-600">
                Matriculation Number: {matNo}
            </p>
            {/* Add more content as needed */}
        </div>
    );
};

export default StudentDashboard;
