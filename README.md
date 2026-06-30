# Vehicle Passport (Public Demo)

**Vehicle Passport** is a decentralized asset tokenization and verification platform. This repository contains the **simplified, client-side demonstration** of the platform's frontend architecture. 

It is designed to showcase enterprise-grade UI/UX patterns, Web3-ready context management, and Role-Based Access Control (RBAC) in a safe, interactive sandbox environment.

## ⚠️ Project Status: Public Demo
To ensure security and compliance, all real-world backend integrations, private API endpoints, and direct blockchain write-access have been abstracted. This version is intended for portfolio demonstration and UI testing purposes only.

## Key Features
- **Simulated Web3 Wallet Context:** Manages connection status, user roles, and authentication tokens via a mock provider.
- **Dynamic RBAC (Role-Based Access Control):** Navigation and feature availability update in real-time based on the user's role (Owner, Technician, Admin).
- **Interactive Role Switcher:** A debug utility built into the sidebar, allowing evaluators to test interface states for all user roles instantly.
- **Internationalization (i18n):** Multi-language support (IT/EN) with dynamic asset loading.
- **Responsive UI/UX:** Built with React, TypeScript, and Material UI, featuring a robust, scalable component architecture.

## Getting Started

Follow these instructions to run the demo locally on your machine.

### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone [https://github.com/yenomack/Vehicle-passport-frontend-public.git](https://github.com/yenomack/Vehicle-passport-frontend-public.git)
   cd Vehicle-passport-frontend-public
Install dependencies:

Bash
npm install
# or
yarn install
Running the Demo
Start the development server:

Bash
npm run dev
# or
yarn dev
Open your browser and navigate to http://localhost:5173 (or the port specified in your terminal).

Built With
React (Vite)

TypeScript

Material UI (MUI)

i18next

React Router

Developed for portfolio showcase purposes. Please note that this is a mocked simulation.
