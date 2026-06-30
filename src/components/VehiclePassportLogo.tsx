// src/components/VehiclePassportLogo.tsx
import React from "react";

/**
 * @TODO_REAL_PROJECT: In the production application, branding components might dynamically 
 * fetch localized graphical assets, tenant themes, or verify structural integrity via CDN.
 * * PUBLIC DEMO VERSION: Pure functional UI component utilizing inline SVG vectors 
 * to maintain a zero-dependency, high-performance local rendering for the portfolio.
 */

interface LogoProps {
  size?: number;
  showText?: boolean;
}

export default function VehiclePassportLogo({ size = 42, showText = true }: LogoProps) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "14px", userSelect: "none" }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: "drop-shadow(0px 4px 10px rgba(16, 185, 129, 0.15))", flexShrink: 0 }}
      >
        {/* Sfondo dello scudo istituzionale */}
        <path
          d="M50 90C50 90 85 70 85 35V15L50 5L15 15V35C15 70 50 90 50 90Z"
          fill="#111827"
        />
        
        {/* Sigillo circolare interno (Doppio anello stile passaporto biometrico) */}
        <circle cx="50" cy="42" r="26" stroke="#34d399" strokeWidth="1.5" opacity="0.4" />
        <circle cx="50" cy="42" r="23" stroke="#10b981" strokeWidth="2" />
        <circle cx="50" cy="42" r="20" fill="#1f2937" />

        {/* Silhouette frontale dell'auto racchiusa nel sigillo */}
        {/* Tetto e Cristallo */}
        <path d="M41 30H59L63 38H37L41 30Z" fill="#ffffff" />
        {/* Corpo vettura */}
        <path d="M34 40C34 38.5 35 38 36.5 38H63.5C65 38 66 38.5 66 40V49H34V40Z" fill="#ffffff" />
        
        {/* Fari anteriori (Verde Smeraldo Brillante) */}
        <circle cx="39" cy="43" r="2.5" fill="#10b981" />
        <circle cx="61" cy="43" r="2.5" fill="#10b981" />
        
        {/* Ruote */}
        <rect x="37" y="49" width="6" height="4" fill="#4b5563" />
        <rect x="57" y="49" width="6" height="4" fill="#4b5563" />

        {/* Arco di scansione orbitale che avvolge il sigillo */}
        <path
          d="M22 52C16 38 22 21 37 15C45 12 56 13 65 18"
          stroke="#34d399"
          strokeWidth="3"
          strokeLinecap="round"
        />
        
        {/* Spunta di validazione notarile integrata nello scudo */}
        <path
          d="M40 72L47 78L64 61"
          stroke="#10b981"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {showText && (
        <div style={{ display: "flex", flexDirection: "column", textAlign: "left", lineHeight: "1", fontFamily: "system-ui, sans-serif" }}>
          <div style={{ fontSize: "1.6rem", letterSpacing: "-0.5px", display: "flex", alignItems: "baseline" }}>
            <span style={{ fontWeight: "400", color: "#111827" }}>Vehicle</span>
            <span style={{ fontWeight: "800", color: "#10b981", marginLeft: "2px" }}>Passport</span>
          </div>
          <span style={{ fontSize: "0.68rem", fontWeight: "700", letterSpacing: "2.5px", color: "#10b981", marginTop: "5px" }}>
            OFFICIAL DIGITAL VERIFICATION
          </span>
        </div>
      )}
    </div>
  );
}