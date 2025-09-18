import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    userId: null,
    roles: [],
    privileges: [],
    authToken: null,
  });

  const login = (userData) => {
    setAuthState({
      userId: userData.userId,
      roles: userData.roles,
      privileges: userData.privileges,
      authToken: userData.authToken,
    });
  };

  const logout = () =>
    setAuthState({
      userId: null,
      roles: [],
      privileges: [],
      authToken: null,
    });

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
