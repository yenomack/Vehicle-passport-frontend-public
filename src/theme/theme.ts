// src/theme.ts
import { createTheme } from "@mui/material/styles";

/**
 * @TODO_REAL_PROJECT: Centralized Material UI Theme configuration. 
 * This ensures brand consistency across the entire application interface, 
 * mapping the identity system (colors, spacing, elevations) to the MUI components.
 * * PUBLIC DEMO VERSION: The design system is fully preserved to showcase 
 * the high-fidelity UI of the platform.
 */
export const theme = createTheme({
  palette: {
    primary: {
      main: "#10b981",       // Brand Emerald (Primary Interaction Color)
      light: "#34d399",      // Secondary Mint (States & Highlights)
      dark: "#059669",       // Deep Emerald (Hover & Active States)
      contrastText: "#ffffff", 
    },
    secondary: {
      main: "#1f2937",       // Dark Slate (Background/Text Accent)
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          border: "none",
        }
      }
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "transparent",
        }
      }
    }
  }
});