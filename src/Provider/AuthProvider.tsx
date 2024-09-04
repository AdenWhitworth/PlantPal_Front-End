import axios from "axios";
import { createContext, useContext, useMemo, useReducer, useEffect, ReactNode } from "react";

interface User {
  first_name: string;
  last_name: string;
  email: string;
  user_id: string;
}

interface AuthState {
  accessToken: string | null;
  user: User | null;
}

type AuthAction = 
  | { type: "setToken"; payload: string }
  | { type: "clearToken" }
  | { type: "setUser"; payload: User }
  | { type: "clearUser" };

interface AuthContextType extends AuthState {
  setAccessToken: (token: string) => void;
  clearAccessToken: () => void;
  setUser: (userData: User) => void;
  clearUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

const initialData: AuthState = {
  accessToken: localStorage.getItem("accessToken"),
  user: JSON.parse(localStorage.getItem("user") || "null"),
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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


