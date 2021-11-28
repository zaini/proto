import React, { createContext, useState, useEffect } from "react";
import { decode } from "jsonwebtoken";
import axios, { AxiosResponse } from "axios";

const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const TOKEN_STORE_KEY = "authToken";

interface AuthState {
  user: any;
}

const initialState: AuthState = {
  user: null,
};

if (localStorage.getItem(TOKEN_STORE_KEY)) {
  const decodedToken = decode(localStorage.getItem(TOKEN_STORE_KEY) as string);
  if (decodedToken && (decodedToken as any).exp * 1000 < Date.now()) {
    localStorage.removeItem(TOKEN_STORE_KEY);
  } else {
    initialState.user = decodedToken;
  }
}

// Define the auth context with some default values for type inferences
const AuthContext = createContext({
  user: null,
  // login: (accessToken: string) => {},
  logout: () => {},
});

const AuthProvider = (props: any) => {
  const [user, setUser] = useState<string | null>(null);

  // Login
  useEffect(() => {
    axios
      .get(`${REACT_APP_BACKEND_URL}/getUserToken`, { withCredentials: true })
      .then((res: AxiosResponse) => {
        const accessToken = res.data;
        if (res.data) {
          localStorage.setItem(TOKEN_STORE_KEY, accessToken);
          const userData = decode(accessToken) as string;
          setUser(userData);
        }
      });
  }, []);

  const logout = () => {
    axios
      .get(`${REACT_APP_BACKEND_URL}/auth/logout`, { withCredentials: true })
      .then((res: AxiosResponse) => {
        if (res.data === "done") {
          window.location.href = "/";
        }
      });
    localStorage.removeItem(TOKEN_STORE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        logout,
      }}
      {...props}
    />
  );
};

export { AuthContext, AuthProvider };
