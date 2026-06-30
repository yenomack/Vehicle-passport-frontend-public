🚗 Vehicle Passport
Vehicle Passport è una piattaforma decentralizzata per la tokenizzazione e la verifica dello storico dei veicoli. Il progetto integra la tecnologia Blockchain (NFT/EVM) con un'infrastruttura web moderna per garantire l'immutabilità e la trasparenza dei dati relativi alla manutenzione e alla proprietà dei veicoli.

🚀 Panoramica Tecnologica
Questa applicazione è stata sviluppata con uno stack tecnologico di livello enterprise per garantire scalabilità, sicurezza e una User Experience fluida:

Frontend: React 19 + TypeScript.

Routing & Auth: Gestione avanzata dei ruoli (RBAC) tramite react-router-dom e sessioni Web3.

Interazione Blockchain: Integrazione con ethers.js per firme di transazioni e gestione contratti.

Design System: Interfaccia UI costruita con Material UI (MUI) e un tema personalizzato coerente con il brand.

Parsing Avanzato: Elaborazione client-side di PDF e QR Code tramite pdfjs-dist e jsQR.

Internazionalizzazione: Supporto nativo multilingua (Italiano/Inglese) tramite i18next.

🛠 Caratteristiche Principali
Sicurezza Blockchain: Gestione dinamica dei gas fee (EIP-1559) per transazioni ottimizzate.

Data Integrity: Verifica crittografica dello storico veicoli tramite comparazione di hash on-chain e off-chain.

RBAC (Role-Based Access Control): Sistema di routing protetto basato sui ruoli utente (Proprietario, Tecnico, Admin, Acquirente).

UX Professionale: Gestione centralizzata dei feedback utente tramite Snackbar e stati di caricamento asincroni ottimizzati.

📦 Setup & Installazione
Per eseguire il progetto in locale:

Clona il repository.

Installa le dipendenze:

Bash
npm install
Avvia l'ambiente di sviluppo:

Bash
npm run dev
🏗 Architettura del Progetto
Il progetto segue un'architettura modulare rigorosa:

/src/api: Layer di astrazione per le richieste API.

/src/context: Gestione dello stato globale per l'autenticazione Web3.

/src/layouts: Componenti di layout per mantenere la coerenza UI/UX.

/src/router: Logica di protezione delle rotte e RBAC.

/src/theme: Configurazione centralizzata del Design System Material UI.

📝 Note per lo sviluppatore
Questo progetto è strutturato per separare nettamente la logica di business dalle interfacce di presentazione, facilitando il testing e la manutenzione su larga scala.