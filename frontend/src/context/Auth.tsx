import React, { createContext, useState, useEffect } from "react";
import { decode } from "jsonwebtoken";
import axios, { AxiosResponse } from "axios";
import { AccountType } from "../utils";

const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const TOKEN_STORE_KEY = "authToken";
const ACCOUNT_TYPE_STORE_KEY = "accountType";

// Remove local token if it has expired
if (localStorage.getItem(TOKEN_STORE_KEY)) {
  const decodedToken = decode(localStorage.getItem(TOKEN_STORE_KEY) as string);
  if (decodedToken && (decodedToken as any).exp * 1000 < Date.now()) {
    localStorage.removeItem(TOKEN_STORE_KEY);
  }
}

// If user has logged in before, set their initial account type to the same as last
let initialAccountType = AccountType.Learner;
if (localStorage.getItem(ACCOUNT_TYPE_STORE_KEY)) {
  initialAccountType = localStorage.getItem(
    ACCOUNT_TYPE_STORE_KEY
  ) as AccountType;
}

// Define the auth context with some default values for type inferences
const AuthContext = createContext({
  user: null,
  logout: () => {},
  accountType: null,
  setAccountType: (_: AccountType | null) => {},
});

const AuthProvider = (props: any) => {
  const [user, setUser] = useState<string | null>(null);
  const [accountType, setAccountTypeState] = useState<AccountType | null>(null);

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
          setAccountTypeState(initialAccountType);
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

  const setAccountType = (type: AccountType | null) => {
    setAccountTypeState(type);
    localStorage.removeItem(ACCOUNT_TYPE_STORE_KEY);
    if (type) {
      localStorage.setItem(ACCOUNT_TYPE_STORE_KEY, `${type}`);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        logout,
        accountType,
        setAccountType,
      }}
      {...props}
    />
  );
};

export { AuthContext, AuthProvider };
