// emailValidator.js

/**
 * Validates an email address against a specified domain.
 * Returns an error message if the email does not match the domain, otherwise returns null.
 */
export const validateEmail = (email, domain) => {
    const emailPattern = new RegExp(
        `^[a-zA-Z0-9._%+-]+@${domain.replace(".", "\\.")}$`,
    );
    if (!emailPattern.test(email)) {
        return `Email must end with '@${domain}'.`;
    }
    return null;
};

/**
 * Validates a student email address against the student domain of Babcock University.
 */
export const validateStudentEmail = (email) =>
    validateEmail(email, "student.babcock.edu.ng");

/**
 * Validates a lecturer email address against the lecturer domain of Babcock University.
 */
export const validateLecturerEmail = (email) =>
    validateEmail(email, "babcock.edu.ng");
