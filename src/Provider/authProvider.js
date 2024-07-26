import axios from "axios";
import { createContext, useContext, useMemo, useReducer } from "react";

const AuthContext = createContext();

const ACTIONS = {
  setToken: "setToken",
  clearToken: "clearToken",
  setUser: "setUser",
  clearUser: "clearUser",
};

const authReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.setToken:
      
      localStorage.setItem("token", action.payload);
      axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

      return { ...state, token: action.payload };

    case ACTIONS.clearToken:
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");

      return { ...state, token: null };
    
    case ACTIONS.setUser:
      return { ...state, user: action.payload };

    case ACTIONS.clearUser:
      return { ...state, user: null };

    default:
      console.error(
        `You passed an action.type: ${action.type} which doesn't exist`
      );
  }
};

const initialData = {
  token: localStorage.getItem("token"),
  user: null,
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialData);

  const setToken = (newToken) => {
    dispatch({ type: ACTIONS.setToken, payload: newToken });
  };

  const clearToken = () => {
    dispatch({ type: ACTIONS.clearToken });
  };

  const setUser = (userData) => {
    dispatch({ type: ACTIONS.setUser, payload: userData });
  };

  const clearUser = () => {
    dispatch({ type: ACTIONS.clearUser });
  };

  const contextValue = useMemo(
    () => ({
      ...state,
      setToken,
      clearToken,
      setUser,
      clearUser,
    }),
    [state]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
