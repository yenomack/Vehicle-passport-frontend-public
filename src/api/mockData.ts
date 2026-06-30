// src/api/mockData.ts

export const MOCK_INTERVENTIONS = [
  { 
    id: 101, 
    type: "Full Service", 
    date: "2026-04-10",
    technician: "Tech_01",
    hash: "0xabc123..." 
  },
  { 
    id: 102, 
    type: "Brake Pad Replacement", 
    date: "2026-06-20",
    technician: "Tech_02",
    hash: "0xdef456..." 
  }
];

export const MOCK_VEHICLES = [
  { 
    tokenId: "1", 
    vin: "VF1357924680", 
    brand: "Toyota", 
    model: "Yaris Hybrid", 
    year: "2024", 
    owner: "0x123...abc" 
  },
  { 
    tokenId: "2", 
    vin: "VF2468013579", 
    brand: "Fiat", 
    model: "500e", 
    year: "2023", 
    owner: "0x456...def" 
  }
];

export const MOCK_TECHNICIANS = [
  { wallet: "0xTech1...", name: "John Doe", status: "Authorized" },
  { wallet: "0xTech2...", name: "Jane Smith", status: "Pending" }
];