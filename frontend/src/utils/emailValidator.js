// emailValidator.js

export const validateEmail = (email, domain) => {
    const emailPattern = new RegExp(
        `^[a-zA-Z0-9._%+-]+@${domain.replace(".", "\\.")}$`,
    );
    if (!emailPattern.test(email)) {
        return `Email must end with '@${domain}'.`;
    }
    return null;
};

export const validateStudentEmail = (email) =>
    validateEmail(email, "student.babcock.edu.ng");

export const validateLecturerEmail = (email) =>
    validateEmail(email, "babcock.edu.ng");
