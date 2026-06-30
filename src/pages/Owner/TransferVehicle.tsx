// src/pages/Owner/TransferVehicle.tsx
import { useState } from "react";
// Importazioni rimosse: ethers, abi.json, api (axiosInstance)
import { transferVehicle } from "../../api/transfer";
import { useWallet } from "../../context/WalletContext";
import { useTranslation } from "react-i18next"; 

import {
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  Grid,
  CircularProgress,
  Box,
  Snackbar,
  Alert as MuiAlert
} from "@mui/material";

/**
 * @TODO_REAL_PROJECT: In the production environment, this module interacts directly with the Web3 provider (MetaMask),
 * calculates optimal EIP-1559 gas fees dynamically, executes the smart contract 'transferFrom' method, 
 * and synchronizes the transaction receipt with the relational backend database securely.
 * * PUBLIC DEMO VERSION: Web3 provider and smart contract interactions are completely mocked. 
 * The UI simulates the multi-step transaction process (gas calculation, mining wait, db sync) 
 * to showcase advanced asynchronous state management.
 */
export default function TransferVehicle() {
  const { address, connected, ready } = useWallet();
  const { t, i18n } = useTranslation(); 

  const [form, setForm] = useState({
    to: "",
    tokenId: ""
  });
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning" | "info";
  }>({
    open: false,
    message: "",
    severity: "success"
  });

  function update(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // ------------------------------------------------------------
  // HELPER GESTIONE TOAST
  // ------------------------------------------------------------
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

  // ------------------------------------------------------------
  // SIMULAZIONE DEL FLUSSO WEB3 E TRASFERIMENTO
  // ------------------------------------------------------------
  async function submit() {
    if (!ready) {
      showToast(t("transferVehicle.systemNotReady"), "warning");
      return;
    }
    if (!connected || !address) {
      showToast(t("transferVehicle.walletNotConnected"), "error");
      return;
    }

    if (!form.to || !form.tokenId) {
      showToast(t("transferVehicle.requiredFields"), "warning");
      return;
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(form.to)) {
      showToast(t("transferVehicle.invalidAddress"), "warning");
      return;
    }

    setLoading(true);

    try {
      // Stringhe localizzate per la simulazione del flusso
      const isEn = i18n.language?.startsWith("en") || document.documentElement.lang?.startsWith("en");
      const gasInfoMsg = isEn ? "Calculating optimal network fees..." : "Calcolo parametri di rete e Base Fee in corso...";
      const txPendingMsg = isEn ? "Transaction sent. Waiting for blockchain confirmation..." : "Transazione firmata! In attesa di conferma sulla Blockchain...";
      const syncDbMsg = isEn ? "Syncing database..." : "Sincronizzazione database in corso...";
      
      // 1. Simula l'interrogazione dell'oracolo per il calcolo del Gas
      showToast(gasInfoMsg, "info");
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // 2. Simula l'attesa per l'inclusione della transazione nel blocco (Mining)
      showToast(txPendingMsg, "info");
      await new Promise((resolve) => setTimeout(resolve, 2500));

      // 3. Simula l'aggiornamento del backend relazionale
      showToast(syncDbMsg, "info");
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 4. Chiama l'API astratta mockata per concludere l'operazione
      const mockTxHash = "0x" + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');
      const res = await transferVehicle(form.to, Number(form.tokenId), mockTxHash);

      if (res.success) {
        showToast(t("transferVehicle.success"), "success");
        console.debug("[Transfer Demo] Mock response:", res.data);
        setForm({ to: "", tokenId: "" });
      }

    } catch (err: any) {
      const errorMsg = err?.response?.data?.error || err?.message || err;
      showToast(t("transferVehicle.error") + errorMsg, "error");
      console.error("[Transfer Demo] Errore durante il trasferimento:", err);
    } finally {
      setLoading(false);
    }
  }

  if (!ready) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 4, maxWidth: 700, width: "100%", margin: "0 auto" }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        {t("transferVehicle.title")} 
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label={t("transferVehicle.labelTo")} 
            name="to"
            value={form.to}
            onChange={update}
            fullWidth
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label={t("transferVehicle.labelTokenId")} 
            name="tokenId"
            value={form.tokenId}
            onChange={update}
            fullWidth
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={submit}
            disabled={loading || !connected}
            startIcon={loading ? <CircularProgress size={18} /> : null}
          >
            {loading ? t("transferVehicle.btnLoading") : t("transferVehicle.btnTransfer")}
          </Button>
        </Grid>
      </Grid>

      {/* --- COMPONENTE TOAST CENTRALIZZATO --- */}
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