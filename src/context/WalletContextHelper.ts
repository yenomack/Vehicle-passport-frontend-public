// src/context/WalletContextHelper.ts

/**
 * @TODO_REAL_PROJECT: In the production environment, this helper bridges the React lifecycle 
 * with plain TypeScript modules (like the Axios interceptors). It allows network-level errors 
 * (e.g., a 401 Unauthorized or a revoked JWT) to trigger a global Wallet disconnect and session purge.
 * * PUBLIC DEMO VERSION: Retained to showcase architectural decoupling between UI and Network layers.
 */

let disconnectFn: null | (() => void) = null;

/**
 * Registers the React-bound disconnect function from the WalletContext.
 */
export function registerDisconnect(fn: () => void) {
  disconnectFn = fn;
}

/**
 * Executes the globally registered disconnect function.
 * Safe to call from non-React environments (e.g., Axios interceptors or WebSocket listeners).
 */
export function disconnectWallet() {
  if (disconnectFn) {
    console.debug("[WalletContextHelper] Forcing global wallet disconnect.");
    disconnectFn();
  }
}