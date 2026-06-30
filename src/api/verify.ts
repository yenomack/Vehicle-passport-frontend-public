// src/api/verify.ts
import { MOCK_VEHICLES, MOCK_INTERVENTIONS } from "./mockData";

/**
 * @TODO_REAL_PROJECT: In the real platform, this engine processes advanced binary extraction, 
 * metadata comparison, and multi-layered hash verification against ledger entries.
 * * PUBLIC DEMO VERSION: This implementation provides an isolated sandbox mock,
 * simulating complex cryptographic document analysis without requiring the backend infrastructure.
 */

/**
 * Simulates submitting a document asset for layout parsing and structural entity extraction.
 */
export async function parsePDF(formData: FormData) {
  console.debug("[Verify API Demo] Simulating PDF binary extraction and layout parsing...");
  
  // Simula un'elaborazione pesante per dare un feedback realistico
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  return {
    success: true,
    extractedVin: "ZHWBU45D0KLA00123",
    extractedHash: "0x89abcdef1234567890abcdef1234567890abcdef1234567890abcdef12345678",
    message: "PDF parsed and cryptographic signatures extracted successfully (Mocked)."
  };
}

/**
 * Simulates comparing current token attributes against historical on-chain ledger records.
 */
export async function compare(tokenId: number) {
  console.debug(`[Verify API Demo] Simulating ledger comparison for Token ID: ${tokenId}`);
  
  // Simula il tempo di esecuzione di una query complessa sulla blockchain
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  // Recupera il primo veicolo dal mock come default o usa il tokenId
  const matchingRecord = MOCK_VEHICLES[0] || { tokenId: tokenId.toString(), status: "VERIFIED" };
  
  return {
    isAuthentic: true,
    matchingRecord,
    history: MOCK_INTERVENTIONS,
    message: "Token attributes match on-chain ledger records."
  };
}