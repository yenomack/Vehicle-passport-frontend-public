// src/pages/Admin/CreateVehicle.tsx
import { useState, useRef } from "react"; 
// Axios rimosso. Importiamo l'astrazione sicura dell'API
import { createVehicle } from "../../api/vehicles"; 
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
  IconButton,
  Snackbar, 
  Alert as MuiAlert 
} from "@mui/material";

import DeleteIcon from "../../assets/icons/delete.svg";

/**
 * @TODO_REAL_PROJECT: In the production environment, this component handles decentralized 
 * asset tokenization by uploading multipart/form-data (including binary PDFs) to a secure 
 * backend that interacts with Web3 Smart Contracts.
 * * PUBLIC DEMO VERSION: UI state management and form handling remain fully functional, 
 * but network requests are routed to the local mock abstraction layer.
 */
export default function CreateVehicle() {
  const { address, roles, connected, ready } = useWallet();
  const { t } = useTranslation(); 

  const [form, setForm] = useState({
    vin: "",
    marca: "",
    modello: "",
    anno: "",
    walletProprietario: ""
  });

  const [initialPdf, setInitialPdf] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning" | "info";
  }>({
    open: false,
    message: "",
    severity: "success"
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  function update(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleFile(e: any) {
    if (e.target.files && e.target.files[0]) {
      setInitialPdf(e.target.files[0]);
    }
  }

  function removeFile() {
    setInitialPdf(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

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

  async function submit() {
    if (!ready) {
      showToast(t("createVehicle.loading"), "warning"); 
      return;
    }

    if (!connected || !address) {
      showToast(t("createVehicle.walletNotConnected"), "error"); 
      return;
    }

    if (!roles.includes("admin")) {
      showToast(t("createVehicle.unauthorized"), "error"); 
      return;
    }

    if (!form.vin || !form.marca || !form.modello || !form.anno || !form.walletProprietario) {
      showToast(t("createVehicle.requiredFields"), "warning"); 
      return;
    }

    setSubmitting(true);

    const fd = new FormData();
    fd.append("vin", form.vin);
    fd.append("marca", form.marca);
    fd.append("modello", form.modello);
    fd.append("anno", form.anno);
    fd.append("walletProprietario", form.walletProprietario);

    if (initialPdf) {
      fd.append("initialPdf", initialPdf);
    }

    try {
      // 🔄 Invio dei dati tramite l'API astratta mockata anziché chiamata di rete diretta
      const res = await createVehicle(fd);

      if (res.success) {
        showToast(t("createVehicle.success"), "success"); 
        console.debug("[CreateVehicle Demo] Mock response:", res.data);

        setForm({ vin: "", marca: "", modello: "", anno: "", walletProprietario: "" });
        removeFile(); 
      }
    } catch (err: any) {
      const errorMsg = err?.response?.data?.error || err.message || err;
      showToast(t("createVehicle.error") + errorMsg, "error"); 
      console.error("[CreateVehicle Demo] Error:", err);
    } finally {
      setSubmitting(false);
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
        {t("createVehicle.title")} 
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={2}>
        
        <Grid item xs={12}>
          <TextField
            label={t("createVehicle.labelVin")} 
            name="vin"
            onChange={update}
            value={form.vin}
            fullWidth
            disabled={submitting}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label={t("createVehicle.labelMarca")} 
            name="marca"
            onChange={update}
            value={form.marca}
            fullWidth
            disabled={submitting}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label={t("createVehicle.labelModello")} 
            name="modello"
            onChange={update}
            value={form.modello}
            fullWidth
            disabled={submitting}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label={t("createVehicle.labelAnno")} 
            name="anno"
            type="number"
            onChange={update}
            value={form.anno}
            fullWidth
            disabled={submitting}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label={t("createVehicle.labelWallet")} 
            name="walletProprietario"
            onChange={update}
            value={form.walletProprietario}
            fullWidth
            disabled={submitting}
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="outlined"
            component="label"
            fullWidth
            disabled={submitting}
          >
            {t("createVehicle.btnUploadPdf")} 
            <input
              type="file"
              accept="application/pdf"
              hidden
              ref={fileInputRef} 
              onChange={handleFile}
            />
          </Button>

          {initialPdf && (
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 1, p: 1, bgcolor: "#f5f5f5", borderRadius: 1 }}>
              <Typography variant="body2" sx={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                {t("createVehicle.fileSelected")} <strong>{initialPdf.name}</strong> 
              </Typography>
              <IconButton 
                edge="end" 
                aria-label="delete" 
                onClick={removeFile}
                disabled={submitting}
              >
                <img
                  src={DeleteIcon}
                  alt="delete"
                  width={22}
                  height={22}
                  style={{ opacity: submitting ? 0.5 : 1 }}
                />
              </IconButton>
            </Box>
          )}
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={submit}
            disabled={submitting || !connected || !roles.includes("admin")}
            startIcon={submitting ? <CircularProgress size={18} /> : null}
          >
            {submitting ? t("createVehicle.btnSubmitLoading") : t("createVehicle.btnSubmit")}
          </Button>
        </Grid>

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