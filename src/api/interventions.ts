// src/api/interventions.ts
import { MOCK_INTERVENTIONS } from "./mockData";

/**
 * @TODO_REAL_PROJECT: In the production environment, this module communicates with a 
 * secure REST API to digitally sign maintenance logs and map them to blockchain ledger immutability.
 * * PUBLIC DEMO VERSION: This implementation provides a zero-dependency structural simulation
 * for portfolio evaluation and testing.
 */

export async function createIntervention(formData: FormData) {
  console.debug("[Interventions API Demo] Simulating record synchronization...");
  
  // Simuliamo l'interazione con il mock
  console.log("Existing mock interventions count:", MOCK_INTERVENTIONS.length);
  
  // Simula la latenza di rete
  await new Promise((resolve) => setTimeout(resolve, 600));
  
  return {
    success: true,
    message: "Maintenance log successfully simulated and written to the mock history.",
    data: { 
      id: Date.now(), 
      type: formData.get("type")?.toString() || "Standard Service",
      // Aggiungiamo un riferimento al mock per rendere l'import utile
      mockReference: MOCK_INTERVENTIONS[0]?.type 
    }
  };
}