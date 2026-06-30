// src/api/vehicles.ts

/**
 * @TODO_REAL_PROJECT: In the production environment, this module interacts with a secure REST API
 * to handle proprietary decentralized asset tokenization, smart contract interactions,
 * advanced metadata formatting, and cryptographic immutability checks.
 * * PUBLIC DEMO VERSION: This implementation provides a zero-dependency structural simulation
 * for portfolio evaluation and testing.
 */

/**
 * Simulates the creation of a new digital vehicle passport entry.
 * Demonstrates clean architecture, async handling, and UI state management.
 */
export async function createVehicle(formData: FormData) {
  console.debug("[Vehicles API Demo] Simulating vehicle passport creation...");
  
  // Simula un ritardo di rete per imitare il caricamento dei file (multipart/form-data) e l'elaborazione
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  // Estrazione sicura dei dati dal FormData per simulare una risposta coerente
  const brand = formData.get("brand")?.toString() || "Unknown Brand";
  const model = formData.get("model")?.toString() || "Unknown Model";

  return {
    success: true,
    message: "Vehicle Passport simulated successfully on the mock ledger.",
    data: { 
      id: Date.now(), 
      brand, 
      model, 
      status: "VERIFIED" 
    }
  };
}