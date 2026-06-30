// src/router/AppRouter.tsx
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import Login from "../pages/Login";
import Home from "../pages/Home";
import NewIntervention from "../pages/Technician/NewIntervention";
import VehicleHistory from "../pages/Owner/VehicleHistory";
import TransferVehicle from "../pages/Owner/TransferVehicle";
import VerifyReport from "../pages/Buyer/VerifyReport";
import Technicians from "../pages/Admin/Technicians";
import CreateVehicle from "../pages/Admin/CreateVehicle";

import DashboardLayout from "../layouts/DashboardLayout";
import RequireRole from "./RequireRole";
import { useWallet } from "../context/WalletContext";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

/**
 * @TODO_REAL_PROJECT: The AppRouter enforces strict navigation guards. It ensures that 
 * authenticated users are redirected based on their Role-Based Access Control (RBAC) 
 * claims and protects internal routes from unauthorized access attempts.
 * * PUBLIC DEMO VERSION: This configuration mirrors the production routing strategy 
 * while maintaining compatibility with the wallet-mocked sandbox environment.
 */
function RouterGuardedRoutes() {
  const { connected, ready, loading } = useWallet();
  const navigate = useNavigate();
  const location = useLocation();

  const publicPaths = [
    "/", 
    "/buyer/verify-report"
  ];

  useEffect(() => {
    if (!ready || loading) return;

    const currentPath = location.pathname;

    // Se è una rotta pubblica → non fare nulla
    if (publicPaths.includes(currentPath)) return;

    // Se NON connesso → torna al login
    if (!connected) {
      navigate("/", { replace: true });
      return;
    }

    // Se connesso e siamo su login → vai a home
    if (connected && currentPath === "/") {
      navigate("/home", { replace: true });
      return;
    }
  }, [connected, ready, loading, location.pathname, navigate]);

  if (!ready || loading) {
    return (
      <Box sx={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        path="/home"
        element={
          <DashboardLayout>
            <Home />
          </DashboardLayout>
        }
      />

      <Route
        path="/technician/new-intervention"
        element={
          <RequireRole roles={["tecnico", "admin"]}>
            <DashboardLayout>
              <NewIntervention />
            </DashboardLayout>
          </RequireRole>
        }
      />

      <Route
        path="/owner/vehicle-history"
        element={
          <RequireRole roles={["proprietario", "tecnico", "admin", "acquirente"]}>
            <DashboardLayout>
              <VehicleHistory />
            </DashboardLayout>
          </RequireRole>
        }
      />

      <Route
        path="/owner/transfer"
        element={
          <RequireRole roles={["proprietario"]}>
            <DashboardLayout>
              <TransferVehicle />
            </DashboardLayout>
          </RequireRole>
        }
      />

      <Route
        path="/buyer/verify-report"
        element={
          <DashboardLayout>
            <VerifyReport />
          </DashboardLayout>
        }
      />

      <Route
        path="/admin/technicians"
        element={
          <RequireRole roles={["admin"]}>
            <DashboardLayout>
              <Technicians />
            </DashboardLayout>
          </RequireRole>
        }
      />

      <Route
        path="/admin/create-vehicle"
        element={
          <RequireRole roles={["admin"]}>
            <DashboardLayout>
              <CreateVehicle />
            </DashboardLayout>
          </RequireRole>
        }
      />
    </Routes>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <RouterGuardedRoutes />
    </BrowserRouter>
  );
}