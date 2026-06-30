// src/router/RequireRole.tsx
import { Navigate } from "react-router-dom";
import { useWallet } from "../context/WalletContext";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

/**
 * @TODO_REAL_PROJECT: This component acts as a high-level authorization gate. 
 * It intercepts navigation to protected routes and validates the user's on-chain 
 * authorization claims (RBAC) stored in the session context.
 * * PUBLIC DEMO VERSION: Pure architectural utility component. Ensures that navigation 
 * constraints are respected during the demo flow.
 */
export default function RequireRole({
  roles: allowedRoles,
  children
}: {
  roles: string[];
  children: React.ReactNode;
}) {
  const { roles, address, connected, ready } = useWallet();

  // Show loader until Web3 session is fully initialized
  if (!ready) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
        <CircularProgress />
      </Box>
    );
  }

  // Redirect to login if not authenticated
  if (!connected || !address) return <Navigate to="/" replace />;

  // Wildcard access for unrestricted routes
  if (allowedRoles.includes("*")) return <>{children}</>;

  // Intersection check: verify if the user's roles match required permissions
  const hasAccess = roles.some(r => allowedRoles.includes(r));

  // Redirect to dashboard home if unauthorized
  if (!hasAccess) return <Navigate to="/home" replace />;

  return <>{children}</>;
}