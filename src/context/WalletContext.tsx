import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { registerDisconnect } from "./WalletContextHelper";

type WalletContextValue = {
  address: string | null;
  connected: boolean;
  loading: boolean;
  roles: string[];
  ready: boolean;
  token: string | null;
  connect: () => Promise<boolean>;
  disconnect: () => void;
  debugSwitchRole: (role: string) => void;
};

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

const LOCAL_KEY = "wallet_connected";
const TOKEN_KEY = "auth_token";
const ROLES_KEY = "auth_roles";

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<string[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const clearClientStorage = async () => {
    localStorage.removeItem(LOCAL_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLES_KEY);
  };

  const disconnect = useCallback(async () => {
    setAddress(null);
    setConnected(false);
    setRoles([]);
    setToken(null);
    await clearClientStorage();
    setReady(true);
  }, []);

  useEffect(() => {
    registerDisconnect(disconnect);
  }, [disconnect]);

  const connect = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    const mockAddress = "0x71C7656EC7ab88b098defB751B7401B5f6d14503";
    const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock.demo";
    const defaultRoles = ["proprietario"];
    
    setToken(mockToken);
    setRoles(defaultRoles);
    setAddress(mockAddress);
    setConnected(true);
    localStorage.setItem(LOCAL_KEY, "1");
    localStorage.setItem(TOKEN_KEY, mockToken);
    localStorage.setItem(ROLES_KEY, JSON.stringify(defaultRoles));
    setLoading(false);
    setReady(true);
    return true;
  }, []);

  const debugSwitchRole = (role: string) => {
    const newRoles = [role];
    setRoles(newRoles);
    localStorage.setItem(ROLES_KEY, JSON.stringify(newRoles));
  };

  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    const savedRoles = localStorage.getItem(ROLES_KEY);
    if (savedToken) {
      setToken(savedToken);
      setRoles(JSON.parse(savedRoles || "[]"));
      setAddress("0x71C7656EC7ab88b098defB751B7401B5f6d14503");
      setConnected(true);
    }
    setReady(true);
  }, []);

  return (
    <WalletContext.Provider value={{ address, connected, loading, roles, ready, token, connect, disconnect, debugSwitchRole }}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within a WalletProvider");
  return ctx;
};