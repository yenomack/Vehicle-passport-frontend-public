// src/pages/Owner/VehicleHistory.tsx
import { useState, useEffect } from "react";
// Import rimosso: api da axiosInstance
import { useWallet } from "../../context/WalletContext";
import { useTranslation } from "react-i18next"; 

import {
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  CircularProgress,
  Grid,
  Box,
  MenuItem,
  Snackbar,        
  Alert as MuiAlert 
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
/**
 * @TODO_REAL_PROJECT: In the production environment, this module queries the backend to execute complex 
 * relational joins (Interventions + Reports + Blockchain Notarizations) and generates certified PDFs on the fly.
 * * PUBLIC DEMO VERSION: Relational mapping logic and database schemas are hidden. The UI relies on 
 * simulated network latency and mock datasets to demonstrate the historical tracking flow safely.
 */
export default function VehicleHistory() {
  const { address, connected, ready } = useWallet();
  const { t, i18n } = useTranslation(); 

  const [vehicles, setVehicles] = useState<any[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [history, setHistory] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  // INITIAL LOAD: MOCK VEHICLES LIST
  // ------------------------------------------------------------
  useEffect(() => {
    let mounted = true;

    setVehicles([]);
    setSelectedVehicle("");
    setTokenId("");
    setHistory(null);
    setError(null);

    if (!ready || !connected || !address) {
      setLoadingVehicles(false);
      return () => { mounted = false };
    }

    setLoadingVehicles(true);

    // Simulazione del caricamento dei veicoli posseduti dal wallet connesso
    setTimeout(() => {
      if (!mounted) return;
      const mockVehicles = [
        { id_veicolo: 1, marca: "Lamborghini", modello: "Aventador", token_id: 101 },
        { id_veicolo: 2, marca: "Fiat", modello: "500e", token_id: 102 }
      ];
      setVehicles(mockVehicles);
      setLoadingVehicles(false);
    }, 800);

    return () => {
      mounted = false;
    };
  }, [address, connected, ready, t]);

  function showToast(message: string, severity: "success" | "error" | "warning" | "info" = "success") {
    setToast({ open: true, message, severity });
  }

  function handleCloseToast(event?: React.SyntheticEvent | Event, reason?: string) {
    if (reason === "clickaway") return;
    setToast({ ...toast, open: false });
  }

  function handleVehicleSelect(e: any) {
    const idVeicolo = e.target.value;
    setSelectedVehicle(idVeicolo);

    const v = vehicles.find((x) => String(x.id_veicolo) === String(idVeicolo));
    if (v) {
      setTokenId(String(v.token_id));
      setHistory(null);
    } else {
      setTokenId("");
    }
  }

  // ------------------------------------------------------------
  // FETCH HISTORY: MOCK RELATIONAL MERGE
  // ------------------------------------------------------------
  async function fetchHistory() {
    setError(null);

    if (!tokenId) return showToast(t("vehicleHistory.alertSelectVehicle"), "warning");
    if (!ready) return showToast(t("vehicleHistory.alertSystemNotReady"), "warning");
    if (!connected || !address) return showToast(t("vehicleHistory.alertWalletNotConnected"), "error");

    setLoading(true);
    
    try {
      // Simula il calcolo del backend e l'estrazione dalla blockchain
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const v = vehicles.find((x) => String(x.token_id) === String(tokenId));
      
      const mockHistoryData = {
        veicolo: { 
          marca: v?.marca || "Unknown", 
          modello: v?.modello || "Unknown", 
          anno: 2022, 
          wallet_proprietario: address 
        },
        interventi: [
          {
            tipo: "Tagliando Ufficiale e Certificazione",
            tecnico: "0xDemoTechnicianWallet000000000000000000001",
            timestamp: new Date().toISOString(),
            hash: "0x89abcdef1234567890abcdef1234567890abcdef1234567890abcdef12345678",
            chilometraggio: 15430,
            schedaTecnica: "ipfs://QmDemoHash1234567890" // Dato simulato
          }
        ]
      };

      setHistory(mockHistoryData);
      showToast(t("verifyReport.resultTitle") + " OK", "success");
    } catch (err: any) {
      console.error("[VehicleHistory Demo] Error:", err);
      const msgErrore = t("vehicleHistory.errorFetchHistory");
      setError(msgErrore);
      showToast(msgErrore, "error");
    } finally {
      setLoading(false);
    }
  }

  // ------------------------------------------------------------
  // DOWNLOAD PDF: MOCK VIRTUAL BLOB GENERATION
  // ------------------------------------------------------------
  async function downloadPDF() {
    if (!ready) return showToast(t("vehicleHistory.alertSystemNotReady"), "warning");
    if (!connected || !address) return showToast(t("vehicleHistory.alertWalletNotConnected"), "error");
    if (!tokenId) return showToast(t("vehicleHistory.alertSelectVehicle"), "warning");

    try {
      showToast("Generating secure PDF...", "info");
      
      // Simula il tempo di rendering del PDF sul server
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const currentLang = (i18n.language || "it").split("-")[0].toLowerCase();
      const langParam = currentLang === "en" ? "en" : "it";

      // Creazione di un file virtuale lato client per completare la simulazione
      const mockPdfContent = `%PDF-1.4\n1 0 obj\n<< /Title (Vehicle Passport Demo) >>\nendobj\n% This is a mock PDF generated for the portfolio demo.\n%%EOF`;
      const blob = new Blob([mockPdfContent], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const fileName = langParam === "en" 
        ? `vehicle_history_${tokenId}_demo.pdf` 
        : `storico_veicolo_${tokenId}_demo.pdf`;

      const a = document.createElement("a");
      a.href = url;
      a.download = fileName; 
      a.click();

      window.URL.revokeObjectURL(url);
      showToast("PDF Downloaded successfully", "success");

    } catch (err: any) {
      console.error("[VehicleHistory Demo] PDF Error:", err);
      showToast(t("vehicleHistory.errorDownload"), "error");
    }
  }

  return (
    <Paper 
      sx={{ 
        p: 4, 
        maxWidth: 1200,      
        width: "100%", 
        marginLeft: 0,       
        marginRight: "auto",
        boxSizing: "border-box"
      }}
    >
      <Typography variant="h4" sx={{ mb: 2 }}>
        {t("vehicleHistory.title")}
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={2} alignItems="center">
        
        {/* LISTA VEICOLI */}
        <Grid item xs={12} md={8}>
          {loadingVehicles ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <CircularProgress size={20} />
              <Typography>{t("vehicleHistory.loadingVehicles")}</Typography>
            </Box>
          ) : (
            <>
              {vehicles.length === 0 ? (
                <Typography color="textSecondary">
                  {connected ? t("vehicleHistory.noVehiclesFound") : t("vehicleHistory.connectWalletPrompt")}
                </Typography>
              ) : (
                <TextField
                  select
                  label={t("vehicleHistory.selectLabel")}
                  value={selectedVehicle}
                  onChange={handleVehicleSelect}
                  fullWidth
                >
                  <MenuItem value="">{t("vehicleHistory.selectPlaceholder")}</MenuItem>
                  {vehicles.map((v) => (
                    <MenuItem key={v.id_veicolo} value={v.id_veicolo}>
                      {v.marca} {v.modello} (token {v.token_id})
                    </MenuItem>
                  ))}
                </TextField>
              )}
            </>
          )}
        </Grid>

        {/* CERCA */}
        <Grid item xs={12} md={4}>
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={fetchHistory}
            disabled={loading || loadingVehicles || vehicles.length === 0}
            startIcon={<SearchIcon />}
          >
            {loading ? t("vehicleHistory.btnSearchLoading") : t("vehicleHistory.btnSearch")}
          </Button>
        </Grid>

        {/* DOWNLOAD */}
        <Grid item xs={12}>
          <Button
            variant="outlined"
            size="large"
            fullWidth
            onClick={downloadPDF}
            disabled={!history || loading}
          >
            {t("vehicleHistory.btnDownload")}
          </Button>
        </Grid>

        {/* LOADING DETTAGLIO */}
        {loading && (
          <Grid item xs={12}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, py: 1 }}>
              <CircularProgress size={24} />
              <Typography>{t("vehicleHistory.btnSearchLoading")}</Typography>
            </Box>
          </Grid>
        )}

        {/* ERROR */}
        {error && (
          <Grid item xs={12}>
            <Typography color="error">{error}</Typography>
          </Grid>
        )}

        {/* DATI VEICOLO */}
        {history?.veicolo && (
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">{t("vehicleHistory.vehicleDataTitle")}</Typography>
              <Typography><strong>{t("vehicleHistory.labelBrand")}</strong> {history.veicolo.marca}</Typography>
              <Typography><strong>{t("vehicleHistory.labelModel")}</strong> {history.veicolo.modello}</Typography>
              <Typography><strong>{t("vehicleHistory.labelYear")}</strong> {history.veicolo.anno}</Typography>
              <Typography sx={{ wordBreak: "break-all" }}><strong>{t("vehicleHistory.labelOwner")}</strong> {history.veicolo.wallet_proprietario}</Typography>
            </Paper>
          </Grid>
        )}

        {/* INTERVENTI */}
        {history?.interventi?.length > 0 && (
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mt: 3 }}>
              {t("vehicleHistory.interventionsTitle")}
            </Typography>

            <Grid container spacing={2}>
              {history.interventi.map((i: any, idx: number) => (
                <Grid item xs={12} key={idx}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      <strong>{t("vehicleHistory.interventionSubtitle")}{idx + 1}</strong>
                    </Typography>

                    <Typography><strong>{t("vehicleHistory.labelType")}</strong> {i.tipo}</Typography>
                    <Typography sx={{ wordBreak: "break-all" }}><strong>{t("vehicleHistory.labelTxHash")}</strong> {i.hash}</Typography>
                    <Typography>
                      <strong>{t("vehicleHistory.labelTimestamp")}</strong>{" "}
                      {isNaN(Date.parse(i.timestamp)) ? "N/D" : new Date(i.timestamp).toLocaleString()}
                    </Typography>
                    <Typography sx={{ wordBreak: "break-all" }}><strong>{t("vehicleHistory.labelTechnician")}</strong> {i.tecnico}</Typography>
                    <Typography><strong>{t("newIntervention.labelMileage")}:</strong> {i.chilometraggio} km</Typography>

                    {i.schedaTecnica && (
                      <Typography sx={{ whiteSpace: "pre-line", mt: 1, wordBreak: "break-all" }}>
                        <strong>{t("vehicleHistory.labelTechSheet")}</strong><br />
                        <a href={i.schedaTecnica} target="_blank" rel="noreferrer" style={{ color: "#1976d2" }}>
                          {i.schedaTecnica}
                        </a>
                      </Typography>
                    )}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>
        )}

        {/* NESSUN RISULTATO */}
        {history && !history.veicolo && (!history.interventi || history.interventi.length === 0) && (
          <Grid item xs={12}>
            <Typography>{t("vehicleHistory.noHistory")}</Typography>
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