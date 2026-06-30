// src/pages/Login.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../context/WalletContext";
import { useTranslation } from "react-i18next"; 

import VehiclePassportLogo from "../components/VehiclePassportLogo";

import {
  Paper,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Box,
  Snackbar,        
  Alert as MuiAlert 
} from "@mui/material";

/**
 * @TODO_REAL_PROJECT: The production Login page implements a secure Web3 authentication handshake.
 * It enforces cryptographic wallet verification and redirects users based on their on-chain RBAC roles.
 * * PUBLIC DEMO VERSION: The UI showcases the authentication entry point and handles session 
 * initialization via the mocked WalletContext sandbox.
 */
export default function Login() {
  const { connect, connected, ready } = useWallet();
  const navigate = useNavigate();
  const { t } = useTranslation(); 

  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning" | "info";
  }>({
    open: false,
    message: "",
    severity: "success"
  });

  useEffect(() => {
    if (ready && connected) {
      navigate("/home", { replace: true });
    }
  }, [ready, connected, navigate]);

  function showToast(message: string, severity: "success" | "error" | "warning" | "info" = "success") {
    setToast({
      open: true,
      message,
      severity
    });
  }

  function handleCloseToast(event?: React.SyntheticEvent | Event, reason?: string) {
    if (reason === "clickaway") return;
    setToast({ ...toast, open: false });
  }

  async function handleConnect() {
    try {
      await connect();
    } catch (err: any) {
      console.error("[Login Demo] Connection error:", err);
      const errorMsg = err?.message || t("vehicleHistory.errorDownload"); 
      showToast(errorMsg, "error");
    }
  }

  if (!ready) {
    return (
      <Box sx={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 16
      }}
    >
      <Paper sx={{ p: 4, maxWidth: 400, width: "100%", textAlign: "center" }}>
        <Grid container spacing={2}>
          
          <Grid item xs={12}>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <VehiclePassportLogo size={46} showText={true} />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body1">
              {t("login.subtitle")} 
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              size="large"
              onClick={handleConnect}
              fullWidth
            >
              {t("login.btnConnect")} 
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <MuiAlert 
          onClose={handleCloseToast} 
          severity={toast.severity} 
          variant="filled" 
          sx={{ width: "100%", borderRadius: "8px", fontWeight: 500 }}
        >
          {toast.message}
        </MuiAlert>
      </Snackbar>
    </div>
  );
}