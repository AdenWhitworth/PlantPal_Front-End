/**
 * Represents user data in the system.
 * 
 * @interface UserData
 * @property {string} [email] - The user's email address.
 * @property {string} [password] - The user's password, typically hashed.
 * @property {string} [first_name] - The user's first name.
 * @property {string} [last_name] - The user's last name.
 * @property {string} [resetToken] - The token used for password reset functionality.
 * @property {string} [user_id] - A unique identifier for the user.
 */
export interface UserData {
    email?: string;
    password?: string;
    first_name?: string;
    last_name?: string;
    resetToken?: string;
    user_id?: string;
}