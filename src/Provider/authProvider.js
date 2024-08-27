import axios from "axios";
import { createContext, useContext, useMemo, useReducer, useEffect } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const ACTIONS = {
  setAccessToken: "setToken",
  clearAccessToken: "clearToken",
  setUser: "setUser",
  clearUser: "clearUser",
};

const authReducer = (state, action) => {
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
      console.error(`Unhandled action type: ${action.type}`);
      return state;
  }
};

const initialData = {
  accessToken: localStorage.getItem("accessToken"),
  user: JSON.parse(localStorage.getItem("user")),
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialData);

  const setAccessToken = (newToken) => dispatch({ type: ACTIONS.setAccessToken, payload: newToken });
  const clearAccessToken = () => dispatch({ type: ACTIONS.clearAccessToken });
  const setUser = (userData) => dispatch({ type: ACTIONS.setUser, payload: userData });
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
