import React, { createContext, useContext, useEffect, useState } from 'react';
import { setAuthToken } from '../api/client';

type AuthCtx = {
  token?: string;
  setToken: (t?: string) => void;
};

const Ctx = createContext<AuthCtx>({ setToken: () => {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | undefined>(undefined);

  const setToken = (t?: string) => {
    setTokenState(t);
    setAuthToken(t);
  };

  useEffect(() => {
    const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
    if (saved) setToken(saved);
  }, []);

  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      token ? localStorage.setItem('token', token) : localStorage.removeItem('token');
    }
  }, [token]);

  return <Ctx.Provider value={{ token, setToken }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
