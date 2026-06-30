// src/layouts/DashboardLayout.tsx
import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useWallet } from "../context/WalletContext";
import { Box, AppBar, Toolbar, Typography, Button, CircularProgress } from "@mui/material";

// Importa il componente vettoriale del logo
import VehiclePassportLogo from "../components/VehiclePassportLogo";

/**
 * @TODO_REAL_PROJECT: In the production environment, the DashboardLayout orchestrates 
 * secure routing boundaries and synchronizes UI state with the active Web3 session.
 * * PUBLIC DEMO VERSION: Pure presentation component structured to showcase responsive 
 * Material UI patterns and seamless component composition.
 */

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const { address, connected, disconnect, ready } = useWallet();

  // Dynamic layout adjustments based on current route
  const isWidePage = location.pathname === "/technician/new-intervention";
  const isHome = location.pathname === "/" || location.pathname === "/home";

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <AppBar position="static" color="transparent" elevation={0}>
          <Toolbar sx={{ justifyContent: "space-between" }}>
            
            {/* Branding & Status Indicators */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <VehiclePassportLogo size={32} showText={true} />
              {!ready && <CircularProgress size={18} />}
            </Box>

            {/* Wallet Connection Status */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {connected && address ? (
                <>
                  <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                    {address}
                  </Typography>
                  <Button variant="outlined" size="small" onClick={() => disconnect()}>
                    Disconnect
                  </Button>
                </>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  Non connesso
                </Typography>
              )}
            </Box>
          </Toolbar>
        </AppBar>

        {/* Main Content Area with Dynamic Sizing */}
        <div
          style={{
            flex: 1,
            padding: 20,
            overflowY: "auto",
            overflowX: "hidden"
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-start"
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: isWidePage ? "80%" : isHome ? "100%" : "40%",
                paddingRight: 8,
                paddingLeft: 8,
                boxSizing: "border-box"
              }}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}