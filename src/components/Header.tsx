import React, { useState } from 'react';
import { Shield, GraduationCap, Lock, LogOut, ShieldCheck, EyeOff } from 'lucide-react';
import { LogoFacultad } from './LogoFacultad';

export type PortalActivo = 'estudiante' | 'admin';

interface HeaderProps {
  portalActivo: PortalActivo;
  onCambiarPortal: (portal: PortalActivo) => void;
  isAdminAutenticado: boolean;
  onCerrarSesionAdmin?: () => void;
  totalDenuncias?: number;
}

export const Header: React.FC<HeaderProps> = ({ 
  portalActivo, 
  onCambiarPortal,
  isAdminAutenticado,
  onCerrarSesionAdmin,
  totalDenuncias = 0,
}) => {
  const [clickCountLogo, setClickCountLogo] = useState(0);

  // Acceso discreto: 3 clics seguidos en el escudo facultativo activan el portal de administración
  const handleLogoClick = (e: React.MouseEvent) => {
    if (e.altKey) {
      onCambiarPortal(portalActivo === 'admin' ? 'estudiante' : 'admin');
      return;
    }

    setClickCountLogo((prev) => {
      const nuevo = prev + 1;
      if (nuevo >= 3) {
        onCambiarPortal('admin');
        return 0;
      }
      return nuevo;
    });

    // Resetear contador si no completa 3 clics en 1.5 segundos
    setTimeout(() => {
      setClickCountLogo(0);
    }, 1500);
  };

  return (
    <header className="bg-white border-b border-slate-200/90 sticky top-0 z-30 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3">
        <div className="flex items-center justify-between gap-3">
          
          {/* Logo Oficial y Membrete Institucional (con acceso discreto por triple clic o Alt+Clic) */}
          <div 
            onClick={handleLogoClick}
            className="flex items-center gap-3 sm:gap-3.5 cursor-pointer group select-none"
            title="Voz Anónima - Facultad de Ciencias Contables UAGRM"
          >
            <LogoFacultad className="w-11 h-13 sm:w-12 sm:h-14 shrink-0 transition-transform group-hover:scale-105" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight tracking-tight">
                  Voz Anónima
                </h1>
                <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-blue-900 text-white uppercase tracking-wider">
                  FCC
                </span>
              </div>
              <p className="text-xs sm:text-[13px] font-bold text-blue-900 leading-none mt-0.5">
                Habla con confianza • UAGRM
              </p>
            </div>
          </div>

          {/* Lado derecho del encabezado */}
          <div className="flex items-center gap-3">
            {/* Si está en el portal de estudiante y es un usuario normal: Insignia limpia de Anonimato */}
            {portalActivo === 'estudiante' && !isAdminAutenticado && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
                <EyeOff className="w-4 h-4 text-emerald-600" />
                <span>Canal Estudiantil 100% Anónimo</span>
              </div>
            )}

            {/* Si el administrador ya tiene sesión activa: Indicador para retornar a su panel */}
            {isAdminAutenticado && (
              <div className="flex items-center gap-2">
                {portalActivo === 'estudiante' ? (
                  <button
                    type="button"
                    onClick={() => onCambiarPortal('admin')}
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-xs hover:bg-slate-800 transition-all cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Panel Administrador Activo</span>
                    {totalDenuncias > 0 && (
                      <span className="text-[10px] bg-blue-600 px-1.5 py-0.2 rounded-full font-bold">
                        {totalDenuncias}
                      </span>
                    )}
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onCambiarPortal('estudiante')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer"
                    >
                      <GraduationCap className="w-4 h-4 text-blue-900" />
                      <span>Ver Vista Estudiantes</span>
                    </button>
                    {onCerrarSesionAdmin && (
                      <button
                        type="button"
                        onClick={onCerrarSesionAdmin}
                        className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                        title="Cerrar sesión de administrador"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden sm:inline">Cerrar Sesión</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
