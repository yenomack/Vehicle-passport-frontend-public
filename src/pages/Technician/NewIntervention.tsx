// src/pages/Technician/NewIntervention.tsx
import { useState, useRef } from "react"; 
import { useWallet } from "../../context/WalletContext";
// API astratta mockata
import { createIntervention } from "../../api/interventions"; 
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
  IconButton,
  Snackbar,        
  Alert as MuiAlert 
} from "@mui/material";

import DeleteIcon from "../../assets/icons/delete.svg";

/**
 * @TODO_REAL_PROJECT: In the production environment, this module uploads technical documentation 
 * (PDFs) and intervention metadata to a secure backend, which triggers decentralized 
 * notarization services and updates the vehicle's NFT history on the blockchain.
 * * PUBLIC DEMO VERSION: UI state management and form handling remain fully functional, 
 * but data submission is routed to the local mock abstraction layer.
 */
export default function NewIntervention() {
  const { address, roles, connected, ready } = useWallet();
  const { t } = useTranslation(); 

  const [form, setForm] = useState({
    tokenId: "",
    chilometraggio: "",
    tipo_intervento: "",
    reportType: ""
  });

  const [pdfFile, setPdfFile] = useState<File | null>(null);
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
    const f = e.target.files?.[0] ?? null;
    setPdfFile(f);
  }

  function removeFile() {
    setPdfFile(null);
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
      showToast(t("newIntervention.loading"), "warning");
      return;
    }

    if (!connected || !address) {
      showToast(t("newIntervention.walletNotConnected"), "error");
      return;
    }

    if (!roles.includes("tecnico") && !roles.includes("admin")) {
      showToast(t("newIntervention.accessDenied"), "error");
      return;
    }

    if (!form.tokenId || !form.reportType || !pdfFile) {
      showToast(t("newIntervention.requiredFields"), "warning");
      return;
    }

    if (!/^\d+$/.test(String(form.tokenId))) {
      showToast(t("newIntervention.invalidTokenId"), "warning");
      return;
    }

    setSubmitting(true);

    try {
      const fd = new FormData();
      fd.append("tokenId", form.tokenId);
      fd.append("chilometraggio", form.chilometraggio || "");
      fd.append("tipo_intervento", form.tipo_intervento || "");
      fd.append("reportType", form.reportType);
      fd.append("pdf", pdfFile);

      // Invocazione API astratta
      const res = await createIntervention(fd);

      if (res.success) {
        showToast(t("newIntervention.success"), "success");
        console.debug("[NewIntervention Demo] Response:", res.data);
        setForm({ tokenId: "", chilometraggio: "", tipo_intervento: "", reportType: "" });
        removeFile(); 
      }

    } catch (err: any) {
      console.error("[NewIntervention Demo] Error:", err);
      showToast(t("newIntervention.errorFallback"), "error");
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
    <Paper 
      sx={{ 
        p: 4, 
        maxWidth: 700,         
        width: "100%", 
        marginLeft: 0,         
        marginRight: "auto",
        boxSizing: "border-box"
      }}
    >
      <Typography variant="h4" sx={{ mb: 2 }}>
        {t("newIntervention.title")} 
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={2}>
        
        <Grid item xs={12}>
          <TextField
            label={t("newIntervention.labelTokenId")} 
            name="tokenId"
            onChange={update}
            value={form.tokenId}
            fullWidth
            disabled={submitting}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label={t("newIntervention.labelMileage")} 
            name="chilometraggio"
            onChange={update}
            value={form.chilometraggio}
            fullWidth
            disabled={submitting}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label={t("newIntervention.labelInterventionType")} 
            name="tipo_intervento"
            onChange={update}
            value={form.tipo_intervento}
            fullWidth
            disabled={submitting}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label={t("newIntervention.labelReportType")} 
            name="reportType"
            onChange={update}
            value={form.reportType}
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
            {t("newIntervention.btnUploadPdf")} 
            <input
              type="file"
              accept="application/pdf"
              hidden
              ref={fileInputRef} 
              onChange={handleFile}
            />
          </Button>

          {pdfFile && (
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 1, p: 1, bgcolor: "#f5f5f5", borderRadius: 1 }}>
              <Typography variant="body2" sx={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                {t("newIntervention.fileSelected")} <strong>{pdfFile.name}</strong> 
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
            sx={{ mt: 2, py: 1.5 }} 
            disabled={submitting || !connected || (!roles.includes("tecnico") && !roles.includes("admin"))}
            startIcon={submitting ? <CircularProgress size={18} /> : null}
          >
            {submitting ? t("newIntervention.btnSubmitLoading") : t("newIntervention.btnSubmit")}
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