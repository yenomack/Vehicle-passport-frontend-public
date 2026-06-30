// src/vite-env.d.ts (o pdf.d.ts)

/**
 * @TODO_REAL_PROJECT: Type definitions for the PDF.js library to enable 
 * robust client-side PDF binary extraction and parsing.
 * * PUBLIC DEMO VERSION: Retained to ensure the zero-dependency parsing logic
 * (used in the VerifyReport page) compiles correctly in the demo environment.
 */

declare module "pdfjs-dist/build/pdf";
declare module "pdfjs-dist/build/pdf.worker.min.js?url";