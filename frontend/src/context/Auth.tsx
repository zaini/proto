import React, { createContext, useState } from "react";
import { decode } from "jsonwebtoken";

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

  const login = (accessToken: string) => {
    localStorage.setItem(TOKEN_STORE_KEY, accessToken);
    const userData = decode(accessToken) as string;
    setUser(userData);
  };

  const logout = () => {
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
