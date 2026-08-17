import React from 'react';

interface LogoFacultadProps {
  className?: string;
  alt?: string;
}

export const LogoFacultad: React.FC<LogoFacultadProps> = ({ 
  className = "w-12 h-14",
  alt = "Escudo Oficial Facultad de Ciencias Contables - UAGRM"
}) => {
  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`} title={alt}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 500 580" 
        className="w-full h-full object-contain"
        aria-label={alt}
        role="img"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Defs for text paths */}
        <defs>
          <path id="pathBlueTextTopComp" d="M 85,310 C 60,95 440,95 415,310" fill="none" />
        </defs>

        {/* Ribbon (Bottom) */}
        <g id="ribbon-comp" fill="#8D5524" stroke="#5C3615" strokeWidth="1.5">
          <path d="M 245,520 L 210,545 L 175,575 L 205,580 L 235,550 L 248,530 Z" />
          <path d="M 255,520 L 290,545 L 325,575 L 295,580 L 265,550 L 252,530 Z" />
          <path d="M 230,515 Q 250,505 270,515 Q 260,535 240,535 Z" fill="#9E622B" />
        </g>

        {/* Left Laurel Branch */}
        <g id="laurel-left-comp" fill="#009245" stroke="#006837" strokeWidth="1">
          <path d="M 235,510 C 200,505 165,480 140,445 C 155,445 170,435 175,420 C 150,425 130,410 115,385 C 130,385 145,375 150,360 C 125,365 105,345 90,315 C 105,315 120,305 125,290 C 100,295 80,270 70,235 C 85,235 100,225 105,210 C 80,210 65,180 60,145 C 75,148 90,140 95,125 C 75,120 65,95 65,65 C 80,75 95,75 105,65 C 88,50 82,30 85,10 C 100,25 115,30 130,25 C 118,40 120,60 135,70 C 115,85 112,110 125,128 C 105,140 102,170 118,190 C 100,205 98,240 115,260 C 100,280 100,315 120,335 C 108,355 110,390 135,410 C 125,430 135,465 165,485 C 155,500 170,520 200,525 Z" />
          <circle cx="145" cy="460" r="7.5" fill="#E31B23" stroke="#B01219" strokeWidth="1" />
          <circle cx="120" cy="395" r="7.5" fill="#E31B23" stroke="#B01219" strokeWidth="1" />
          <circle cx="95" cy="330" r="7.5" fill="#E31B23" stroke="#B01219" strokeWidth="1" />
          <circle cx="75" cy="255" r="7.5" fill="#E31B23" stroke="#B01219" strokeWidth="1" />
          <circle cx="68" cy="180" r="7.5" fill="#E31B23" stroke="#B01219" strokeWidth="1" />
          <circle cx="72" cy="110" r="7.5" fill="#E31B23" stroke="#B01219" strokeWidth="1" />
          <circle cx="92" cy="50" r="7.5" fill="#E31B23" stroke="#B01219" strokeWidth="1" />
        </g>

        {/* Right Laurel Branch */}
        <g id="laurel-right-comp" fill="#009245" stroke="#006837" strokeWidth="1">
          <path d="M 265,510 C 300,505 335,480 360,445 C 345,445 330,435 325,420 C 350,425 370,410 385,385 C 370,385 355,375 350,360 C 375,365 395,345 410,315 C 395,315 380,305 375,290 C 400,295 420,270 430,235 C 415,235 400,225 395,210 C 420,210 435,180 440,145 C 425,148 410,140 405,125 C 425,120 435,95 435,65 C 420,75 405,75 395,65 C 412,50 418,30 415,10 C 400,25 385,30 370,25 C 382,40 380,60 365,70 C 385,85 388,110 375,128 C 395,140 398,170 382,190 C 400,205 402,240 385,260 C 400,280 400,315 380,335 C 392,355 390,390 365,410 C 375,430 365,465 335,485 C 345,500 330,520 300,525 Z" />
          <circle cx="355" cy="460" r="7.5" fill="#E31B23" stroke="#B01219" strokeWidth="1" />
          <circle cx="380" cy="395" r="7.5" fill="#E31B23" stroke="#B01219" strokeWidth="1" />
          <circle cx="405" cy="330" r="7.5" fill="#E31B23" stroke="#B01219" strokeWidth="1" />
          <circle cx="425" cy="255" r="7.5" fill="#E31B23" stroke="#B01219" strokeWidth="1" />
          <circle cx="432" cy="180" r="7.5" fill="#E31B23" stroke="#B01219" strokeWidth="1" />
          <circle cx="428" cy="110" r="7.5" fill="#E31B23" stroke="#B01219" strokeWidth="1" />
          <circle cx="408" cy="50" r="7.5" fill="#E31B23" stroke="#B01219" strokeWidth="1" />
        </g>

        {/* Outer Blue Ring */}
        <ellipse cx="250" cy="265" rx="190" ry="245" fill="#1C3F94" stroke="#122B68" strokeWidth="2" />

        {/* Inner Red Oval */}
        <ellipse cx="250" cy="265" rx="142" ry="195" fill="#E31B23" stroke="#B31219" strokeWidth="2" />

        {/* White Text on Blue Ring */}
        <text fill="#FFFFFF" fontFamily="'Arial Black', 'Trebuchet MS', Arial, sans-serif" fontWeight="900" fontSize="14.5" letterSpacing="1.1">
          <textPath href="#pathBlueTextTopComp" startOffset="50%" textAnchor="middle">
            FACULTAD DE CIENCIAS CONTABLES, AUDITORIA, SISTEMA DE CONTROL DE GESTIÓN Y FINANZAS
          </textPath>
        </text>

        {/* Gold Wings */}
        <g id="wings-comp" fill="#FFCC00" stroke="#C69200" strokeWidth="1.2">
          <path d="M 250,118 Q 210,80 160,105 Q 190,135 215,135 Q 235,130 250,125 Z" />
          <path d="M 230,110 L 180,105 M 240,118 L 195,120 M 245,122 L 210,130" stroke="#B28000" strokeWidth="1" fill="none" />
          <path d="M 200,95 L 205,125 M 180,105 L 190,125 M 220,95 L 225,128" stroke="#B28000" strokeWidth="1" fill="none" />

          <path d="M 250,118 Q 290,80 340,105 Q 310,135 285,135 Q 265,130 250,125 Z" />
          <path d="M 270,110 L 320,105 M 260,118 L 305,120 M 255,122 L 290,130" stroke="#B28000" strokeWidth="1" fill="none" />
          <path d="M 300,95 L 295,125 M 320,105 L 310,125 M 280,95 L 275,128" stroke="#B28000" strokeWidth="1" fill="none" />
        </g>

        {/* Central Staff Line and Sphere */}
        <line x1="250" y1="85" x2="250" y2="280" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
        <circle cx="250" cy="85" r="9" fill="#FFFFFF" stroke="#CCCCCC" strokeWidth="1.5" />

        {/* Open Book */}
        <g id="book-comp">
          <path d="M 152,148 Q 200,140 248,154 Q 296,140 348,148 L 348,248 Q 296,240 248,254 Q 200,240 152,248 Z" fill="#000000" opacity="0.25" transform="translate(0, 3)" />
          <path d="M 150,148 L 150,248 Q 200,240 248,254 Q 296,240 346,248 L 346,148 Q 296,140 248,154 Q 200,140 150,148 Z" fill="#EAEAEA" stroke="#333333" strokeWidth="2.5" />
          <path d="M 154,150 L 154,242 Q 200,235 248,248 Q 296,235 342,242 L 342,150 Q 296,143 248,156 Q 200,143 154,150 Z" fill="#FFFFFF" stroke="#222222" strokeWidth="1.5" />
          <line x1="248" y1="156" x2="248" y2="248" stroke="#555555" strokeWidth="2" />
          <path d="M 168,170 Q 205,165 238,172 M 168,185 Q 205,180 238,187 M 168,200 Q 205,195 238,202 M 168,215 Q 205,210 238,217" stroke="#BBBBBB" strokeWidth="1.5" fill="none" />
          <path d="M 258,172 Q 290,165 328,170 M 258,187 Q 290,180 328,185 M 258,202 Q 290,195 328,200 M 258,217 Q 290,210 328,215" stroke="#BBBBBB" strokeWidth="1.5" fill="none" />
        </g>

        {/* Caduceus Serpents */}
        <g id="serpents-comp" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="2">
          {/* Left Snake */}
          <path d="M 242,145 Q 230,135 218,142 Q 212,152 222,160 Q 235,162 244,155 Z" />
          <circle cx="225" cy="147" r="1.8" fill="#1A1A1A" />
          <path d="M 242,155 Q 220,175 230,195 Q 242,215 255,205 Q 268,195 252,175 Q 242,162 242,155 Z" />
          <path d="M 250,205 Q 230,225 240,245 Q 250,265 250,278 L 248,278 Q 246,260 232,242 Q 222,222 245,205 Z" />

          {/* Right Snake */}
          <path d="M 258,145 Q 270,135 282,142 Q 288,152 278,160 Q 265,162 256,155 Z" />
          <circle cx="275" cy="147" r="1.8" fill="#1A1A1A" />
          <path d="M 258,155 Q 280,175 270,195 Q 258,215 245,205 Q 232,195 248,175 Q 258,162 258,155 Z" />
          <path d="M 250,205 Q 270,225 260,245 Q 250,265 250,278 L 252,278 Q 254,260 268,242 Q 278,222 255,205 Z" />
        </g>

        <line x1="250" y1="248" x2="250" y2="280" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" />

        {/* UAGRM & City Text */}
        <g id="uagrm-text-comp">
          <text x="250" y="325" textAnchor="middle" fontFamily="'Arial Black', Impact, Arial, sans-serif" fontWeight="900" fontSize="36" fill="#FFFFFF" letterSpacing="1.5">
            UAGRM
          </text>
          <text x="250" y="352" textAnchor="middle" fontFamily="'Arial Black', Arial, sans-serif" fontWeight="800" fontSize="13" fill="#FFFFFF" letterSpacing="0.8">
            SANTA CRUZ - BOLIVIA
          </text>
        </g>
      </svg>
    </div>
  );
};
