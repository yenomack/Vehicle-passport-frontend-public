// src/components/Sidebar.tsx
import { Link } from "react-router-dom";
import { 
  Typography, 
  ButtonBase, 
  Box, 
  CircularProgress, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  type SelectChangeEvent 
} from "@mui/material";
import { useWallet } from "../context/WalletContext";
import { useTranslation } from "react-i18next";

export default function Sidebar() {
  const { roles, ready, debugSwitchRole } = useWallet();
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (event: SelectChangeEvent) => i18n.changeLanguage(event.target.value);
  const currentLang = i18n.language.split('-')[0] || "it";

  if (!ready) {
    return (
      <Box sx={{ width: 250, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh", borderRight: "1px solid #eee" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      width: 250, 
      height: "100vh", 
      background: "#fff", 
      display: "flex", 
      flexDirection: "column", 
      borderRight: "1px solid #eee" 
    }}>
      
      {/* SEZIONE SUPERIORE (Scrollabile se il contenuto diventa troppo lungo) */}
      <Box sx={{ p: 3, flexGrow: 1, overflowY: "auto" }}>
        {/* DEBUG ROLE SWITCHER */}
        <Box sx={{ mb: 4, p: 1.5, borderRadius: 2, background: "#f8f9fa", border: "1px dashed #ccc" }}>
          <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 1 }}>DEBUG: Role Switcher</Typography>
          <Select fullWidth size="small" value={roles[0] || "proprietario"} onChange={(e) => debugSwitchRole(e.target.value)}>
            <MenuItem value="proprietario">Owner</MenuItem>
            <MenuItem value="tecnico">Technician</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
        </Box>

        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>{t("sidebar.menu")}</Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {(roles.includes("tecnico") || roles.includes("admin")) && (
            <SidebarItem to="/technician/new-intervention" label={t("sidebar.registerIntervention")} />
          )}
          {!roles.includes("utente") && (
            <SidebarItem to="/owner/vehicle-history" label={t("sidebar.vehicleHistory")} />
          )}
          {roles.includes("proprietario") && (
            <SidebarItem to="/owner/transfer" label={t("sidebar.transferVehicle")} />
          )}
          <SidebarItem to="/buyer/verify-report" label={t("sidebar.verifyReport")} />
          {roles.includes("admin") && (
            <>
              <SidebarItem to="/admin/create-vehicle" label={t("sidebar.createVehicle")} />
              <SidebarItem to="/admin/technicians" label={t("sidebar.manageTechnicians")} />
            </>
          )}
        </Box>
      </Box>

      {/* SEZIONE INFERIORE (Fissa) */}
      <Box sx={{ p: 3, borderTop: "1px solid #eee" }}>
        <FormControl fullWidth size="small">
          <InputLabel>{t("sidebar.language")}</InputLabel>
          <Select value={currentLang} label={t("sidebar.language")} onChange={handleLanguageChange}>
            <MenuItem value="it">Italiano</MenuItem>
            <MenuItem value="en">English</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
}

function SidebarItem({ to, label }: { to: string; label: string }) {
  return (
    <ButtonBase component={Link} to={to} sx={{ width: "100%", justifyContent: "flex-start", padding: "10px", borderRadius: 1, "&:hover": { backgroundColor: "#f0f0f0" } }}>
      {label}
    </ButtonBase>
  );
}