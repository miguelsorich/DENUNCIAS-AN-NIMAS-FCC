import React from 'react';

interface LogoFacultadProps {
  className?: string;
  alt?: string;
}

export const LogoFacultad: React.FC<LogoFacultadProps> = ({ 
  className = "w-12 h-14",
  alt = "Escudo Oficial Facultad de Ciencias Contables, Auditoría, Sistemas de Control de Gestión y Finanzas - UAGRM"
}) => {
  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`} title={alt}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 540 640" 
        className="w-full h-full object-contain"
        aria-label={alt}
        role="img"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Path for text along the blue oval perimeter */}
          <path
            id="pathCurvedTextFacultad"
            d="M 90,340 C 65,100 475,100 450,340"
            fill="none"
          />
          
          {/* Subtle gradient for depth */}
          <linearGradient id="goldWingGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFDE17" />
            <stop offset="100%" stopColor="#F58220" />
          </linearGradient>

          <filter id="subtleShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* 1. Laurel Wreath (Ramas de Laurel Verdes con Frutos Rojos) */}
        {/* Crossed Ribbon Base */}
        <g id="ribbon-base">
          <path 
            d="M 270,555 C 255,570 215,610 185,635 C 205,638 228,628 245,605 C 258,588 268,568 270,555 Z" 
            fill="#8D5524" 
            stroke="#5C3615" 
            strokeWidth="1.5" 
          />
          <path 
            d="M 270,555 C 285,570 325,610 355,635 C 335,638 312,628 295,605 C 282,588 272,568 270,555 Z" 
            fill="#8D5524" 
            stroke="#5C3615" 
            strokeWidth="1.5" 
          />
          <ellipse cx="270" cy="565" rx="20" ry="12" fill="#9E622B" stroke="#5C3615" strokeWidth="1.5" />
        </g>

        {/* Left Laurel Branch */}
        <g id="laurel-left" fill="#009245" stroke="#006837" strokeWidth="1.2" strokeLinejoin="round">
          <path d="M 255,555 C 215,550 170,520 135,475 C 155,475 175,465 180,448 C 150,455 125,438 105,408 C 125,408 145,395 150,378 C 120,385 95,360 80,325 C 100,325 120,312 125,295 C 95,302 70,272 58,232 C 78,232 98,220 102,202 C 72,202 52,168 45,128 C 65,132 82,122 88,105 C 65,100 50,70 50,38 C 68,50 88,50 100,38 C 82,20 75,-2 78,-25 C 98,-8 118,-2 135,-8 C 122,10 125,32 142,44 C 118,62 115,90 130,112 C 108,125 105,160 122,182 C 102,200 100,240 120,262 C 102,285 102,325 125,348 C 110,370 112,410 142,432 C 130,455 142,495 175,518 C 162,535 180,560 215,568 Z" transform="translate(15, 30)" />
          
          {/* Berries (Frutos rojos con brillo) */}
          <g id="berries-left">
            <circle cx="155" cy="510" r="9" fill="#E31B23" stroke="#B01219" strokeWidth="1" />
            <circle cx="152" cy="507" r="2.5" fill="#FFFFFF" opacity="0.8" />
            
            <circle cx="125" cy="435" r="9" fill="#E31B23" stroke="#B01219" strokeWidth="1" />
            <circle cx="122" cy="432" r="2.5" fill="#FFFFFF" opacity="0.8" />

            <circle cx="95" cy="360" r="9" fill="#E31B23" stroke="#B01219" strokeWidth="1" />
            <circle cx="92" cy="357" r="2.5" fill="#FFFFFF" opacity="0.8" />

            <circle cx="75" cy="275" r="9" fill="#E31B23" stroke="#B01219" strokeWidth="1" />
            <circle cx="72" cy="272" r="2.5" fill="#FFFFFF" opacity="0.8" />

            <circle cx="68" cy="190" r="9" fill="#E31B23" stroke="#B01219" strokeWidth="1" />
            <circle cx="65" cy="187" r="2.5" fill="#FFFFFF" opacity="0.8" />

            <circle cx="72" cy="115" r="9" fill="#E31B23" stroke="#B01219" strokeWidth="1" />
            <circle cx="69" cy="112" r="2.5" fill="#FFFFFF" opacity="0.8" />

            <circle cx="98" cy="48" r="9" fill="#E31B23" stroke="#B01219" strokeWidth="1" />
            <circle cx="95" cy="45" r="2.5" fill="#FFFFFF" opacity="0.8" />
          </g>
        </g>

        {/* Right Laurel Branch */}
        <g id="laurel-right" fill="#009245" stroke="#006837" strokeWidth="1.2" strokeLinejoin="round">
          <path d="M 285,555 C 325,550 370,520 405,475 C 385,475 365,465 360,448 C 390,455 415,438 435,408 C 415,408 395,395 390,378 C 420,385 445,360 460,325 C 440,325 420,312 415,295 C 445,302 470,272 482,232 C 462,232 442,220 438,202 C 468,202 488,168 495,128 C 475,132 458,122 452,105 C 475,100 490,70 490,38 C 472,50 452,50 440,38 C 458,20 465,-2 462,-25 C 442,-8 422,-2 405,-8 C 418,10 415,32 398,44 C 422,62 425,90 410,112 C 432,125 435,160 418,182 C 438,200 440,240 420,262 C 438,285 438,325 415,348 C 430,370 428,410 398,432 C 410,455 398,495 365,518 C 378,535 360,560 325,568 Z" transform="translate(-15, 30)" />
          
          {/* Berries (Frutos rojos con brillo) */}
          <g id="berries-right">
            <circle cx="385" cy="510" r="9" fill="#E31B23" stroke="#B01219" strokeWidth="1" />
            <circle cx="382" cy="507" r="2.5" fill="#FFFFFF" opacity="0.8" />
            
            <circle cx="415" cy="435" r="9" fill="#E31B23" stroke="#B01219" strokeWidth="1" />
            <circle cx="412" cy="432" r="2.5" fill="#FFFFFF" opacity="0.8" />

            <circle cx="445" cy="360" r="9" fill="#E31B23" stroke="#B01219" strokeWidth="1" />
            <circle cx="442" cy="357" r="2.5" fill="#FFFFFF" opacity="0.8" />

            <circle cx="465" cy="275" r="9" fill="#E31B23" stroke="#B01219" strokeWidth="1" />
            <circle cx="462" cy="272" r="2.5" fill="#FFFFFF" opacity="0.8" />

            <circle cx="472" cy="190" r="9" fill="#E31B23" stroke="#B01219" strokeWidth="1" />
            <circle cx="469" cy="187" r="2.5" fill="#FFFFFF" opacity="0.8" />

            <circle cx="468" cy="115" r="9" fill="#E31B23" stroke="#B01219" strokeWidth="1" />
            <circle cx="465" cy="112" r="2.5" fill="#FFFFFF" opacity="0.8" />

            <circle cx="442" cy="48" r="9" fill="#E31B23" stroke="#B01219" strokeWidth="1" />
            <circle cx="439" cy="45" r="2.5" fill="#FFFFFF" opacity="0.8" />
          </g>
        </g>

        {/* 2. Outer Royal Blue Oval Ring */}
        <ellipse 
          cx="270" 
          cy="295" 
          rx="205" 
          ry="265" 
          fill="#16378C" 
          stroke="#0F2664" 
          strokeWidth="2.5" 
        />

        {/* 3. Inner Red Oval */}
        <ellipse 
          cx="270" 
          cy="295" 
          rx="155" 
          ry="212" 
          fill="#E31B23" 
          stroke="#B01219" 
          strokeWidth="2" 
        />

        {/* 4. White Curved Faculty Name on Blue Ring */}
        <text 
          fill="#FFFFFF" 
          fontFamily="'Arial Black', 'Trebuchet MS', Arial, sans-serif" 
          fontWeight="900" 
          fontSize="15" 
          letterSpacing="1.2"
        >
          <textPath href="#pathCurvedTextFacultad" startOffset="50%" textAnchor="middle">
            FACULTAD DE CIENCIAS CONTABLES, AUDITORIA, SISTEMA DE CONTROL DE GESTIÓN Y FINANZAS
          </textPath>
        </text>

        {/* 5. Golden Caduceus Wings with Grid Hatching */}
        <g id="wings-gold" filter="url(#subtleShadow)">
          {/* Left Wing */}
          <path 
            d="M 270,135 Q 220,90 165,120 Q 200,158 230,155 Q 255,150 270,142 Z" 
            fill="url(#goldWingGrad)" 
            stroke="#B57C00" 
            strokeWidth="1.5" 
          />
          {/* Left Wing Grid Lines */}
          <path d="M 245,125 L 190,118 M 255,135 L 205,138 M 262,142 L 225,150" stroke="#8C5F00" strokeWidth="1.2" fill="none" />
          <path d="M 215,108 L 220,145 M 190,120 L 202,145 M 240,108 L 245,150" stroke="#8C5F00" strokeWidth="1.2" fill="none" />

          {/* Right Wing */}
          <path 
            d="M 270,135 Q 320,90 375,120 Q 340,158 310,155 Q 285,150 270,142 Z" 
            fill="url(#goldWingGrad)" 
            stroke="#B57C00" 
            strokeWidth="1.5" 
          />
          {/* Right Wing Grid Lines */}
          <path d="M 295,125 L 350,118 M 285,135 L 335,138 M 278,142 L 315,150" stroke="#8C5F00" strokeWidth="1.2" fill="none" />
          <path d="M 325,108 L 320,145 M 350,120 L 338,145 M 300,108 L 295,150" stroke="#8C5F00" strokeWidth="1.2" fill="none" />
        </g>

        {/* 6. Central Caduceus Staff with White Sphere */}
        <line x1="270" y1="100" x2="270" y2="310" stroke="#FFFFFF" strokeWidth="5.5" strokeLinecap="round" />
        <circle cx="270" cy="100" r="10" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="1.5" />
        <circle cx="267" cy="97" r="3" fill="#FFFFFF" />

        {/* 7. Open White Book */}
        <g id="open-book" filter="url(#subtleShadow)">
          {/* Book Shadow */}
          <path 
            d="M 162,168 Q 215,160 268,175 Q 321,160 378,168 L 378,280 Q 321,272 268,287 Q 215,272 162,280 Z" 
            fill="#000000" 
            opacity="0.3" 
            transform="translate(0, 4)" 
          />
          {/* Book Base (Pages Edge) */}
          <path 
            d="M 160,168 L 160,278 Q 215,270 268,285 Q 321,270 376,278 L 376,168 Q 321,160 268,175 Q 215,160 160,168 Z" 
            fill="#F3F4F6" 
            stroke="#1F2937" 
            strokeWidth="2.5" 
          />
          {/* Book Cover White Surface */}
          <path 
            d="M 164,170 L 164,272 Q 215,264 268,279 Q 321,264 372,272 L 372,170 Q 321,163 268,177 Q 215,163 164,170 Z" 
            fill="#FFFFFF" 
            stroke="#111827" 
            strokeWidth="1.5" 
          />
          {/* Central Spine Line */}
          <line x1="268" y1="177" x2="268" y2="283" stroke="#4B5563" strokeWidth="2.2" />

          {/* Left Pages Lines */}
          <path d="M 180,192 Q 220,186 256,194 M 180,208 Q 220,202 256,210 M 180,224 Q 220,218 256,226 M 180,240 Q 220,234 256,242 M 180,256 Q 220,250 256,258" stroke="#9CA3AF" strokeWidth="1.5" fill="none" />
          {/* Right Pages Lines */}
          <path d="M 280,194 Q 316,186 356,192 M 280,210 Q 316,202 356,208 M 280,226 Q 316,218 356,224 M 280,242 Q 316,234 356,240 M 280,258 Q 316,250 356,256" stroke="#9CA3AF" strokeWidth="1.5" fill="none" />
        </g>

        {/* 8. White Serpents Entwined on the Staff */}
        <g id="caduceus-serpents" fill="#FFFFFF" stroke="#111827" strokeWidth="2.2" strokeLinejoin="round">
          {/* Left Serpent Head */}
          <path d="M 261,162 Q 248,150 234,158 Q 228,168 238,178 Q 252,180 263,172 Z" />
          <circle cx="242" cy="164" r="2.2" fill="#111827" />

          {/* Left Serpent Coils */}
          <path d="M 261,173 Q 236,195 248,220 Q 262,242 276,230 Q 290,218 272,195 Q 261,180 261,173 Z" />
          <path d="M 270,230 Q 248,252 260,274 Q 270,296 270,310 L 267,310 Q 264,290 250,270 Q 238,248 264,230 Z" />

          {/* Right Serpent Head */}
          <path d="M 279,162 Q 292,150 306,158 Q 312,168 302,178 Q 288,180 277,172 Z" />
          <circle cx="298" cy="164" r="2.2" fill="#111827" />

          {/* Right Serpent Coils */}
          <path d="M 279,173 Q 304,195 292,220 Q 278,242 264,230 Q 250,218 268,195 Q 279,180 279,173 Z" />
          <path d="M 270,230 Q 292,252 280,274 Q 270,296 270,310 L 273,310 Q 276,290 290,270 Q 302,248 276,230 Z" />
        </g>

        {/* Lower Staff Tip */}
        <line x1="270" y1="280" x2="270" y2="315" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />

        {/* 9. UAGRM & SANTA CRUZ - BOLIVIA Typography */}
        <g id="uagrm-text" filter="url(#subtleShadow)">
          <text 
            x="270" 
            y="368" 
            textAnchor="middle" 
            fontFamily="'Arial Black', Impact, 'Trebuchet MS', sans-serif" 
            fontWeight="900" 
            fontSize="46" 
            fill="#FFFFFF" 
            letterSpacing="2"
          >
            UAGRM
          </text>
          <text 
            x="270" 
            y="398" 
            textAnchor="middle" 
            fontFamily="'Arial Black', 'Trebuchet MS', Arial, sans-serif" 
            fontWeight="900" 
            fontSize="15" 
            fill="#FFFFFF" 
            letterSpacing="1"
          >
            SANTA CRUZ - BOLIVIA
          </text>
        </g>
      </svg>
    </div>
  );
};
