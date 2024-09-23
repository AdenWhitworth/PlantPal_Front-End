import axios from "axios";
import React, { createContext, useContext, useMemo, useReducer, useEffect, ReactNode } from "react";
import { AuthContextType, AuthState, AuthAction, User } from "./AuthProviderTypes";

/**
 * Context for authentication state and actions.
 * @type {React.Context<AuthContextType | undefined>}
 */
const AuthContext: React.Context<AuthContextType | undefined> = createContext<AuthContextType | undefined>(undefined);

/**
 * Custom hook to access the AuthContext.
 * @returns {AuthContextType} The authentication context value.
 * @throws {Error} If used outside of an AuthProvider.
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const ACTIONS = {
  setAccessToken: "setToken" as const,
  clearAccessToken: "clearToken" as const,
  setUser: "setUser" as const,
  clearUser: "clearUser" as const,
};

/**
 * Reducer function to manage authentication state.
 * 
 * @function
 * @param {AuthState} state - The current authentication state.
 * @param {AuthAction} action - The action to be handled.
 * @returns {AuthState} The updated authentication state.
 * @throws {Error} If an unhandled action type is provided.
 */
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case ACTIONS.setAccessToken:
      localStorage.setItem("accessToken", action.payload);
      axios.defaults.headers.common['Authorization'] = `Bearer ${action.payload}`;
      return { ...state, accessToken: action.payload };

    case ACTIONS.clearAccessToken:
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("accessToken");
      return { ...state, accessToken: null };

    case ACTIONS.setUser:
      localStorage.setItem("user", JSON.stringify(action.payload));
      return { ...state, user: action.payload };

    case ACTIONS.clearUser:
      localStorage.removeItem("user");
      return { ...state, user: null };

    default:
      throw new Error(`Unhandled action type: ${state}`);
  }
};

/**
 * Initial state for the authentication context.
 * @type {AuthState}
 */
const initialData: AuthState = {
  accessToken: localStorage.getItem("accessToken") || null,
  user: (() => {
    const user = localStorage.getItem("user");
    return user && user !== 'undefined' ? JSON.parse(user) : null;
  })(),
};

/**
 * AuthProvider component to provide authentication context to its children.
 * @param {{ children: ReactNode }} props - The props for the provider component.
 * @returns {JSX.Element} The provider with authentication context.
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }: { children: ReactNode; }): JSX.Element => {
  const [state, dispatch] = useReducer(authReducer, initialData);

  const setAccessToken = (newToken: string) => dispatch({ type: ACTIONS.setAccessToken, payload: newToken });
  const clearAccessToken = () => dispatch({ type: ACTIONS.clearAccessToken });
  const setUser = (userData: User) => dispatch({ type: ACTIONS.setUser, payload: userData });
  const clearUser = () => dispatch({ type: ACTIONS.clearUser });

  const contextValue = useMemo(() => ({
    ...state, 
    setAccessToken,
    clearAccessToken,
    setUser,
    clearUser,
  }), [state]); 

  /**
   * Effect that sets the default Authorization header for Axios when the access token changes.
   * This ensures that all outgoing requests include the current access token.
   */
  useEffect(() => {
    if (state.accessToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${state.accessToken}`;
    }
  }, [state.accessToken]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};


