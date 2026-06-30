// src/pages/Home.tsx
import { useState } from "react";
import { Paper, Typography, Grid, Box, Button, Snackbar, Alert as MuiAlert } from "@mui/material";
import { Link } from "react-router-dom";
import { useWallet } from "../context/WalletContext";
import { useTranslation } from "react-i18next"; 

/**
 * @TODO_REAL_PROJECT: The home dashboard dynamically renders navigation cards based on the 
 * user's verified role within the decentralized identity framework.
 * * PUBLIC DEMO VERSION: Pure presentation component showcasing clean UI layout 
 * and responsive grid patterns. Navigation logic remains fully compliant with RBAC (Role-Based Access Control).
 */
export default function Home() {
  const { roles, ready } = useWallet();
  const { t } = useTranslation(); 

  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning" | "info";
  }>({
    open: false,
    message: "",
    severity: "info"
  });

  function handleCloseToast(event?: React.SyntheticEvent | Event, reason?: string) {
    if (reason === "clickaway") return;
    setToast({ ...toast, open: false });
  }

  if (!ready) {
    return (
      <Paper sx={{ p: 4, maxWidth: 1200, width: "100%", marginLeft: 0 }}>
        <Typography>{t("home.loading")}</Typography>
      </Paper>
    );
  }

  return (
    <Paper 
      sx={{ 
        p: 4, 
        width: "100%", 
        maxWidth: 1200,    
        marginLeft: 0,      
        marginRight: "auto", 
        boxSizing: "border-box"
      }}
    >

      {/* INTRO ALLINEATO A SINISTRA */}
      <Box sx={{ width: { xs: "100%", md: "70%" }, mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
          {t("home.welcome")}
        </Typography>

        <Typography variant="body1" color="text.secondary">
          {t("home.description")}
        </Typography>
      </Box>

      {/* CARD GRID */}
      <Grid container spacing={3}> 

        {/* STORICO VEICOLO */}
        {(roles.includes("proprietario") || roles.includes("admin")) && (
          <Grid item xs={12} sm={6} md={6} lg={4}>
            <CardBox
              title={t("sidebar.vehicleHistory")}
              desc={t("home.descHistory")}
              to="/owner/vehicle-history"
              btn={t("home.btnHistory")}
            />
          </Grid>
        )}

        {/* REGISTRA INTERVENTO */}
        {(roles.includes("tecnico") || roles.includes("admin")) && (
          <Grid item xs={12} sm={6} md={6} lg={4}>
            <CardBox
              title={t("sidebar.registerIntervention")}
              desc={t("home.descIntervention")}
              to="/technician/new-intervention"
              btn={t("home.btnIntervention")}
            />
          </Grid>
        )}

        {/* TRASFERISCI VEICOLO */}
        {roles.includes("proprietario") && (
          <Grid item xs={12} sm={6} md={6} lg={4}>
            <CardBox
              title={t("sidebar.transferVehicle")}
              desc={t("home.descTransfer")}
              to="/owner/transfer"
              btn={t("home.btnTransfer")}
            />
          </Grid>
        )}

        {/* VERIFICA REPORT */}
        <Grid item xs={12} sm={6} md={6} lg={4}>
          <CardBox
            title={t("sidebar.verifyReport")}
            desc={t("home.descVerify")}
            to="/buyer/verify-report"
            btn={t("home.btnVerify")}
          />
        </Grid>

        {/* CREA VEICOLO */}
        {roles.includes("admin") && (
          <Grid item xs={12} sm={6} md={6} lg={4}>
            <CardBox
              title={t("sidebar.createVehicle")}
              desc={t("home.descCreate")}
              to="/admin/create-vehicle"
              btn={t("home.btnCreate")}
            />
          </Grid>
        )}

        {/* GESTIONE TECNICI */}
        {roles.includes("admin") && (
          <Grid item xs={12} sm={6} md={6} lg={4}>
            <CardBox
              title={t("sidebar.manageTechnicians")}
              desc={t("home.descManageTech")}
              to="/admin/technicians"
              btn={t("home.btnManageTech")}
            />
          </Grid>
        )}

      </Grid>

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
    </Paper>
  );
}

interface CardBoxProps {
  title: string;
  desc: string;
  to: string;
  btn: string;
}

function CardBox({ title, desc, to, btn }: CardBoxProps) {
  return (
    <Box
      sx={{
        p: 3, 
        borderRadius: 2.5, 
        border: "1px solid #ddd",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between", 
        boxShadow: "0 2px 5px rgba(0,0,0,0.03)",
        height: "100%", 
        boxSizing: "border-box"
      }}
    >
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
          {title} 
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mt: 1.5, mb: 3, fontSize: "0.95rem", lineHeight: 1.4 }}>
          {desc} 
        </Typography>
      </Box>

      <Button 
        variant="contained" 
        size="medium" 
        component={Link} 
        to={to} 
        sx={{ 
          alignSelf: "flex-start", 
          px: 3,
          py: 0.8
        }}
      >
        {btn} 
      </Button>
    </Box>
  );
}