// src/pages/Admin/Technicians.tsx
import { useState, useEffect } from "react";
// Import rimosso: api da axiosInstance
import { authorizeTechnician, revokeTechnician } from "../../api/technicians";
import { useWallet } from "../../context/WalletContext";
import { useTranslation } from "react-i18next"; 

import {
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  Grid,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Snackbar,
  Alert as MuiAlert
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
/**
 * @TODO_REAL_PROJECT: In the production environment, this module manages Role-Based Access Control (RBAC) 
 * by interacting with Smart Contracts on the blockchain to dynamically assign or revoke mechanic permissions.
 * * PUBLIC DEMO VERSION: UI state management remains fully functional. Network and ledger requests 
 * are simulated locally to demonstrate the admin flow without exposing backend endpoints.
 */
export default function Technicians() {
  const { address, roles, connected, ready } = useWallet();
  const { t, i18n } = useTranslation(); 

  const [techWallet, setTechWallet] = useState("");
  const [loading, setLoading] = useState(false);
  const [technicians, setTechnicians] = useState<string[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning" | "info";
  }>({
    open: false,
    message: "",
    severity: "success"
  });

  // -----------------------------
  // CARICA LISTA TECNICI AUTORIZZATI (MOCK PER DEMO PUBBLICA)
  // -----------------------------
  async function loadTechnicians() {
    try {
      console.debug("[Technicians Demo] Loading mock technicians list...");
      // Simula il tempo di risposta del server
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // Inseriamo dinamicamente l'indirizzo corrente per far testare il badge "TU" al recruiter
      const mockList = [
        address || "0x71C7656EC7ab88b098defB751B7401B5f6d14503",
        "0xDemoTechnicianWallet000000000000000000001",
        "0xDemoTechnicianWallet000000000000000000002"
      ];
      
      setTechnicians(mockList);
    } catch (err) {
      console.error("[Technicians Demo] Error loading technicians:", err);
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => {
    if (ready && connected && roles.includes("admin")) {
      loadTechnicians();
    }
  }, [ready, connected, roles]);

  // -----------------------------
  // HELPER GESTIONE TOAST
  // -----------------------------
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

  // -----------------------------
  // AUTORIZZA TECNICO (MOCK)
  // -----------------------------
  async function authorize() {
    if (!ready) return showToast(t("technicians.systemNotReady"), "warning");
    if (!connected || !address) return showToast(t("technicians.walletNotConnected"), "error");
    if (!roles.includes("admin")) return showToast(t("technicians.unauthorizedAuthorize"), "error");
    if (!/^0x[a-fA-F0-9]{40}$/.test(techWallet)) return showToast(t("technicians.invalidWallet"), "warning");

    setLoading(true);
    try {
      // Usa l'API astratta simulata
      const res = await authorizeTechnician(techWallet);
      
      if (res.success) {
        showToast(t("technicians.authSuccess"), "success");
        // Aggiorna la lista locale per mostrare l'interattività nella demo
        setTechnicians((prev) => [...prev, techWallet]);
        setTechWallet("");
      }
    } catch (err: any) {
      showToast(t("technicians.authError") + (err?.response?.data?.error || err.message), "error");
    } finally {
      setLoading(false);
    }
  }

  // -----------------------------
  // REVOCA TECNICO (MOCK)
  // -----------------------------
  async function revoke(wallet: string) {
    if (!ready) return showToast(t("technicians.systemNotReady"), "warning");
    if (!connected || !address) return showToast(t("technicians.walletNotConnected"), "error");
    if (!roles.includes("admin")) return showToast(t("technicians.unauthorizedRevoke"), "error");

    setLoading(true);
    try {
      // Usa l'API astratta simulata
      const res = await revokeTechnician(wallet);
      
      if (res.success) {
        showToast(t("technicians.revokeSuccess"), "success");
        // Rimuove l'elemento dalla lista locale per mostrare l'interattività
        setTechnicians((prev) => prev.filter((w) => w !== wallet));
      }
    } catch (err: any) {
      showToast(t("technicians.revokeError") + (err?.response?.data?.error || err.message), "error");
    } finally {
      setLoading(false);
    }
  }

  // -----------------------------
  // LOADING PAGE
  // -----------------------------
  if (!ready) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  const isEn = i18n.language?.startsWith("en") || document.documentElement.lang?.startsWith("en");
  const userBadgeLabel = isEn ? "YOU" : "TU";

  // -----------------------------
  // UI PRINCIPALE
  // -----------------------------
  return (
    <Paper sx={{ p: 4, maxWidth: 700, width: "100%", margin: "0 auto" }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        {t("technicians.title")} 
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label={t("technicians.labelWallet")} 
            value={techWallet}
            onChange={(e) => setTechWallet(e.target.value)}
            fullWidth
            disabled={loading || !connected || !roles.includes("admin")}
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            fullWidth
            onClick={authorize}
            disabled={loading || !connected || !roles.includes("admin")}
            startIcon={loading ? <CircularProgress size={18} /> : null}
          >
            {loading ? t("technicians.btnLoading") : t("technicians.btnAuthorize")}
          </Button>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h5" sx={{ mb: 2 }}>
        {t("technicians.listTitle")} 
      </Typography>

      {loadingList ? (
        <CircularProgress />
      ) : technicians.length === 0 ? (
        <Typography>{t("technicians.emptyList")}</Typography> 
      ) : (
        <List>
          {technicians.map((wallet) => {
            const isCurrentUser = !!address && wallet.toLowerCase() === address.toLowerCase();

            return (
              <ListItem
                key={wallet}
                disablePadding
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  py: 1.5,
                  px: 2,
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: "action.hover"
                  }
                }}
              >
                <ListItemText 
                  primary={
                    <Typography sx={{ fontFamily: "monospace", wordBreak: "break-all", pr: 2 }}>
                      {wallet}
                    </Typography>
                  } 
                  sx={{ my: 0 }}
                />

                <Box 
                  sx={{ 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    height: "40px",
                    width: "80px", 
                    ml: 1
                  }}
                >
                  {!isCurrentUser ? (
<IconButton onClick={() => revoke(wallet)} disabled={loading}>
  <DeleteIcon />
</IconButton>
                  ) : (
                    <Box
                      sx={{
                        backgroundColor: "primary.light",
                        color: "primary.contrastText",
                        px: 1.8,
                        height: "26px",
                        display: "flex",
                        alignItems: "center", 
                        justifyContent: "center",
                        borderRadius: "12px",
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                        letterSpacing: "0.5px",
                        whiteSpace: "nowrap"
                      }}
                    >
                      {t("technicians.currentUserBadge", userBadgeLabel)}
                    </Box>
                  )}
                </Box>
              </ListItem>
            );
          })}
        </List>
      )}

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