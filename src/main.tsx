// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "./i18n";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./theme/theme";

/**
 * @TODO_REAL_PROJECT: Application entry point. Initializes the global ThemeProvider
 * for Material UI and mounts the main React application tree.
 * * PUBLIC DEMO VERSION: Structure preserved to maintain core application initialization.
 */
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </StrictMode>
);