// src/vite-env.d.ts (o global.d.ts)

/**
 * @TODO_REAL_PROJECT: This type definition facilitates interaction with the browser-injected 
 * Web3 provider (e.g., MetaMask). It ensures TypeScript compatibility when accessing 
 * the 'ethereum' object within the window scope.
 */
interface Window {
  ethereum?: any;
}