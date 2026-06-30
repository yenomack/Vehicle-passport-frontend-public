// src/App.tsx
import AppRouter from "./router/AppRouter";
import { WalletProvider } from "./context/WalletContext";

/**
 * @TODO_REAL_PROJECT: The root Application component. It initializes the 
 * global dependency injection chain (WalletProvider) and the routing tree (AppRouter).
 * * PUBLIC DEMO VERSION: Structure preserved to maintain clean composition patterns.
 */
export default function App() {
  return (
    <WalletProvider>
      <AppRouter />
    </WalletProvider>
  );
}