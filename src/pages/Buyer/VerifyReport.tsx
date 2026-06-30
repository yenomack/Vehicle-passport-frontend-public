// src/pages/Buyer/VerifyReport.tsx
import { useState } from "react";
// Import rimosso: api da axiosInstance
import { compare } from "../../api/verify"; 
import jsQR from "jsqr";
import * as pdfjsLib from "pdfjs-dist";
import { useTranslation } from "react-i18next"; 

import {
  Paper,
  Typography,
  Button,
  Divider,
  CircularProgress,
  Grid,
  Box,
  Snackbar,        
  Alert as MuiAlert 
} from "@mui/material";

// Configurazione del worker per il parsing asincrono dei PDF
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

/**
 * @TODO_REAL_PROJECT: In production, this component communicates with the blockchain via a secure 
 * backend to perform a cryptographic cross-match of the PDF's hash against immutable ledger entries.
 * * PUBLIC DEMO VERSION: The advanced client-side PDF parsing and QR extraction remains fully 
 * functional to showcase frontend data-processing capabilities. The network comparison is simulated locally.
 */
export default function VerifyReport() {
  const { t } = useTranslation(); 
  const [parsedData, setParsedData] = useState<any>(null);
  const [result, setResult] = useState<any>(null);
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
  // PARSING PDF E DECODIFICA MATRICE QR CODE (Client-Side)
  // ------------------------------------------------------------
  async function handlePDFUpload(e: any) {
    const file = e.target.files[0];
    if (!file) return;

    setParsedData(null);
    setResult(null);

    try {
      const pdfBuffer = await file.arrayBuffer();

      // Ingestione dello stream binario del PDF ed estrazione della prima pagina
      const pdf = await pdfjsLib.getDocument({ data: pdfBuffer }).promise;
      const page = await pdf.getPage(1);

      // Rendering della pagina su un Canvas virtuale a scala maggiorata per aumentare l'accuratezza del QR
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: ctx, viewport }).promise;

      // Estrazione della mappa dei pixel dal contesto 2D del Canvas
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Analisi della matrice d'immagine tramite l'algoritmo jsQR
      const qr = jsQR(imageData.data, canvas.width, canvas.height);

      if (!qr) {
        showToast(t("verifyReport.qrNotFound"), "error");
        return;
      }

      // Parsing del payload JSON racchiuso all'interno del QR Code decodificato
      let qrPayload;
      try {
        qrPayload = JSON.parse(qr.data);
      } catch {
        showToast(t("verifyReport.invalidQr"), "error");
        return;
      }

      setParsedData(qrPayload);
      showToast(t("verifyReport.fileSelected") || "PDF parsed successfully", "info");

    } catch (err: any) {
      console.error("[VerifyReport Demo] PDF Parsing error:", err);
      showToast("Error processing PDF file", "error");
    }
  }

  // ------------------------------------------------------------
  // CRYPTOGRAPHIC VERIFICATION (MOCK)
  // ------------------------------------------------------------
  async function submit() {
    if (!parsedData) {
      showToast(t("verifyReport.uploadFirst"), "warning");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // Chiama l'API astratta simulata invece del backend reale
      const res = await compare(parsedData.tokenId);

      // Simuliamo la struttura dati complessa che il backend reale avrebbe restituito
      const mockVerificationResult = {
        match: res.isAuthentic,
        recalculatedHash: parsedData.contentHash || "0x89abcdef1234567890abcdef1234567890abcdef1234567890abcdef12345678",
        onchainHashes: [
          parsedData.contentHash || "0x89abcdef1234567890abcdef1234567890abcdef1234567890abcdef12345678",
          "0xOldHashHistoryMock00000000000000000000000000000000000000000000"
        ]
      };

      setResult(mockVerificationResult);
      
      if (mockVerificationResult.match) {
        showToast(t("verifyReport.reportAuthentic"), "success");
      } else {
        showToast(t("verifyReport.reportNotAuthentic"), "error");
      }
    } catch (err: any) {
      const errorMsg = err?.response?.data?.error || err.message;
      showToast(t("verifyReport.verificationError") + ": " + errorMsg, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Paper sx={{ p: 4, maxWidth: 700, margin: "0 auto" }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        {t("verifyReport.title")} 
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Button variant="outlined" component="label" fullWidth disabled={loading}>
            {t("verifyReport.btnUpload")} 
            <input type="file" accept="application/pdf" hidden onChange={handlePDFUpload} />
          </Button>
        </Grid>

        {parsedData && (
          <Grid item xs={12}>
            <Paper sx={{ p: 2, bgcolor: "#f8f9fa", border: "1px solid #e9ecef" }}>
              <Typography sx={{ mb: 1 }}>
                <strong>{t("verifyReport.tokenLabel")}</strong> {parsedData.tokenId}
              </Typography>
              <Typography sx={{ wordBreak: "break-all" }}>
                <strong>{t("verifyReport.hashLabel")}</strong> {parsedData.contentHash}
              </Typography>
            </Paper>
          </Grid>
        )}

        <Grid item xs={12}>
          <Button 
            variant="contained" 
            size="large" 
            fullWidth 
            onClick={submit} 
            disabled={loading || !parsedData}
            sx={{ py: 1.5 }}
          >
            {t("verifyReport.btnVerify")} 
          </Button>
        </Grid>

        {loading && (
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", py: 2 }}>
            <CircularProgress />
          </Grid>
        )}

        {result && (
          <Grid item xs={12}>
            <Paper sx={{ p: 2, mt: 1, border: `1px solid ${result.match ? "#4caf50" : "#f44336"}` }}>
              <Typography variant="h6" sx={{ mb: 1 }}>{t("verifyReport.resultTitle")}</Typography>

              {result.match ? (
                <Typography sx={{ color: "green", fontWeight: "bold" }}>
                  {t("verifyReport.reportAuthentic")} 
                </Typography>
              ) : (
                <Typography sx={{ color: "red", fontWeight: "bold" }}>
                  {t("verifyReport.reportNotAuthentic")} 
                </Typography>
              )}

              <Divider sx={{ my: 2 }} />

              <Typography variant="body2" sx={{ fontWeight: "bold", mb: 0.5 }}>
                {t("verifyReport.recalculatedHash")}
              </Typography>
              <Typography sx={{ fontFamily: "monospace", wordBreak: "break-all", bgcolor: "#f5f5f5", p: 1, borderRadius: 1, fontSize: "0.85rem" }}>
                {result.recalculatedHash}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body2" sx={{ fontWeight: "bold", mb: 0.5 }}>
                {t("verifyReport.onchainHashes")}
              </Typography>
              <Box sx={{ bgcolor: "#f5f5f5", p: 1, borderRadius: 1 }}>
                {(result.onchainHashes ?? []).length === 0 ? (
                  <Typography variant="body2" sx={{ color: "text.secondary", fontStyle: "italic" }}>No hashes found on-chain</Typography>
                ) : (
                  (result.onchainHashes ?? []).map((h: string, i: number) => (
                    <Typography key={i} sx={{ fontFamily: "monospace", wordBreak: "break-all", fontSize: "0.85rem", mb: i === result.onchainHashes.length - 1 ? 0 : 0.5 }}>
                      • {h}
                    </Typography>
                  ))
                )}
              </Box>
            </Paper>
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