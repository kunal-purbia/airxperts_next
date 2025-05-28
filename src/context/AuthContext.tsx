"use client";
import React, { useState, useContext, createContext, useEffect } from "react";

const AuthContext: any = createContext(null);

export const AuthProvider = ({ children }: any) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const userToken = localStorage.getItem("token");
    setToken(userToken);
  }, []);

  const login = (resToken: string) => {
    localStorage.setItem("token", resToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
