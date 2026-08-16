import React from 'react';
import { Shield, GraduationCap, Settings, Layers, BookOpen, ShieldAlert } from 'lucide-react';

export type ModuloActivo = 'inasistencia' | 'denuncias-varias' | 'admin';

interface HeaderProps {
  moduloActivo: ModuloActivo;
  onCambiarModulo: (modulo: ModuloActivo) => void;
  totalDenuncias?: number;
}

export const Header: React.FC<HeaderProps> = ({ 
  moduloActivo, 
  onCambiarModulo,
  totalDenuncias = 0,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-xs">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Facultad • Sistema de Denuncias Anónimas
              </p>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
                {moduloActivo === 'inasistencia' && 'Reporte de Inasistencia Docente'}
                {moduloActivo === 'denuncias-varias' && 'Denuncias varias — Realizar otra denuncia'}
                {moduloActivo === 'admin' && 'Administración — Panel de Gestión y Reportes'}
              </h1>
            </div>
          </div>

          {/* Navegación visible y diferenciada */}
          <nav aria-label="Navegación principal" className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start md:self-auto">
            {/* Opción 1: Reporte de Inasistencia Docente */}
            <button
              type="button"
              id="nav-reporte-inasistencia"
              onClick={() => onCambiarModulo('inasistencia')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                moduloActivo === 'inasistencia'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Reporte de Inasistencia Docente</span>
            </button>

            {/* Opción 2: Denuncias varias */}
            <button
              type="button"
              id="nav-denuncias-varias"
              onClick={() => onCambiarModulo('denuncias-varias')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                moduloActivo === 'denuncias-varias'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Denuncias varias</span>
            </button>

            {/* Opción 3: Administrador */}
            <button
              type="button"
              id="nav-admin-maestro"
              onClick={() => onCambiarModulo('admin')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                moduloActivo === 'admin'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
              title="Panel del Administrador"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
              {totalDenuncias > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  moduloActivo === 'admin'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}>
                  {totalDenuncias}
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
