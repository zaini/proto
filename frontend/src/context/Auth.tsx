import React, { createContext } from "react";

const AuthContext = createContext({
  run: () => {},
});

const AuthProvider = (props: any) => {
  return (
    <AuthContext.Provider
      value={{
        run: () => {
          console.log("RUNNING FROM CONTEXT");
        },
      }}
      {...props}
    />
  );
};

export { AuthContext, AuthProvider };
