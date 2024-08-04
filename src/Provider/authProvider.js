import axios from "axios";
import { createContext, useContext, useMemo, useReducer, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

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
      axios.defaults.headers.common['Authorization'] = `Bearer ${action.payload}`;
      return { ...state, token: action.payload };
    case ACTIONS.clearToken:
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
      return { ...state, token: null };
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
  token: localStorage.getItem("token"),
  user: JSON.parse(localStorage.getItem("user")),
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialData);

  const setToken = (newToken) => dispatch({ type: ACTIONS.setToken, payload: newToken });
  const clearToken = () => dispatch({ type: ACTIONS.clearToken });
  const setUser = (userData) => dispatch({ type: ACTIONS.setUser, payload: userData });
  const clearUser = () => dispatch({ type: ACTIONS.clearUser });

  const contextValue = useMemo(() => ({
    ...state, setToken, clearToken, setUser, clearUser,
  }), [state]);

  useEffect(() => {
    if (state.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
    }
  }, [state.token]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
