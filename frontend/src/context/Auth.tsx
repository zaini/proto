import React, { createContext, useState, useEffect } from "react";
import { decode } from "jsonwebtoken";
import axios, { AxiosResponse } from "axios";

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
  login: (accessToken: string) => {},
  logout: () => {},
});

const AuthProvider = (props: any) => {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/getUser", { withCredentials: true })
      .then((res: AxiosResponse) => {
        console.log(res);
        if (res.data) {
          console.log(" data", res.data);
          setUser(res.data);
        }
      });
  }, []);

  const login = (accessToken: string) => {
    localStorage.setItem(TOKEN_STORE_KEY, accessToken);
    const userData = decode(accessToken) as string;
    setUser(userData);
  };

  const logout = () => {
    axios
      .get("http://localhost:5000/auth/logout", { withCredentials: true })
      .then((res: AxiosResponse) => {
        if (res.data === "done") {
          console.log(res.data);
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
        login,
        logout,
      }}
      {...props}
    />
  );
};

export { AuthContext, AuthProvider };
