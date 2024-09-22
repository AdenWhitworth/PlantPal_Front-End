/**
 * Props for the form data used in authentication.
 *
 * @interface FormData
 * @property {string} [firstName] - The first name of the user (optional).
 * @property {string} [lastName] - The last name of the user (optional).
 * @property {string} [email] - The email address of the user (optional).
 * @property {string} [password] - The password entered by the user (optional).
 * @property {string} [confirmPassword] - The confirmed password entered by the user (optional).
 */
export interface FormData {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}