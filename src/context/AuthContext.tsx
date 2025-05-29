/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { UseAuthInterface } from "@/types/UserAuth.type";
import React, { useState, useContext, createContext, useEffect } from "react";

const AuthContext = createContext<UseAuthInterface | null>(null);

export const AuthProvider = ({ children }: any) => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const userToken = localStorage.getItem("token");
    setToken(userToken);
    const id = localStorage.getItem("userId");
    setUserId(id);
  }, []);

  const login = (resToken: string) => {
    localStorage.setItem("token", resToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setToken(null);
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ userId, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
