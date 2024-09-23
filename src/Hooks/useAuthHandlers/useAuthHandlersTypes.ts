/**
 * Data required for user operations such as registration and login.
 * 
 * @interface UserData
 * @property {string} email - The user's email address.
 * @property {string} password - The user's password.
 * @property {string} [first_name] - The user's first name (optional).
 * @property {string} [last_name] - The user's last name (optional).
 */
export interface UserData {
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
}

/**
 * Represents a user in the system.
 * 
 * @interface User
 * @property {string} first_name - The user's first name.
 * @property {string} last_name - The user's last name.
 * @property {string} email - The user's email address.
 * @property {string} user_id - A unique identifier for the user.
 */
export interface User {
    first_name: string;
    last_name: string;
    email: string;
    user_id: string;
}

/**
 * Props for handling authentication-related state and actions.
 * 
 * @interface UseAuthHandlersProps
 * @property {function} setAccessToken - Function to update the access token.
 * @property {function} setUser - Function to update the current user.
 * @property {boolean} isLoginSelected - Indicates if the login form is selected (true) or if the signup form is selected (false).
 */
export interface UseAuthHandlersProps {
    setAccessToken: (token: string) => void;
    setUser: (user: User) => void;
    isLoginSelected: boolean;
}

/**
 * Props for the TestComponent.
 * @interface TestComponentProps
 * @property {(token: string) => void} setAccessToken - Function to set the access token.
 * @property {(user: any) => void} setUser - Function to set the user information.
 * @property {boolean} isLoginSelected - Indicates whether the login or signup form is selected.
 */
export interface TestComponentProps {
    setAccessToken: (token: string) => void;
    setUser: (user: any) => void;
    isLoginSelected: boolean;
}
