/**
 * Represents a user in the system.
 * @interface User
 * @property {string} first_name - The first name of the user.
 * @property {string} last_name - The last name of the user.
 * @property {string} email - The email address of the user.
 * @property {string} user_id - The unique identifier for the user.
 */
export interface User {
    first_name: string;
    last_name: string;
    email: string;
    user_id: string;
}

/**
 * Represents the authentication state of the application.
 * @interface AuthState
 * @property {string | null} accessToken - The access token for authenticated requests, or null if not authenticated.
 * @property {User | null} user - The authenticated user object, or null if not authenticated.
 */
export interface AuthState {
    accessToken: string | null;
    user: User | null;
}

/**
 * Represents actions that can be performed on the authentication state.
 * @type {Object} AuthAction
 * @property {"setToken"} type - Action type to set the access token.
 * @property {string} payload - The new access token.
 * @property {"clearToken"} type - Action type to clear the access token.
 * @property {"setUser"} type - Action type to set the authenticated user.
 * @property {User} payload - The user object to set.
 * @property {"clearUser"} type - Action type to clear the authenticated user.
 */
export type AuthAction = 
| { type: "setToken"; payload: string }
| { type: "clearToken" }
| { type: "setUser"; payload: User }
| { type: "clearUser" };

/**
 * Represents the context type for authentication state and actions.
 * @interface AuthContextType
 * @extends AuthState
 * @property {function(string): void} setAccessToken - Function to set the access token.
 * @property {function(): void} clearAccessToken - Function to clear the access token.
 * @property {function(User): void} setUser - Function to set the authenticated user.
 * @property {function(): void} clearUser - Function to clear the authenticated user.
 */
export interface AuthContextType extends AuthState {
    setAccessToken: (token: string) => void;
    clearAccessToken: () => void;
    setUser: (userData: User) => void;
    clearUser: () => void;
}
