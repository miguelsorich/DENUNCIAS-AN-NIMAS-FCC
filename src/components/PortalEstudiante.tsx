import React from 'react';
import { MaestroOfertaVigente, ReporteInasistencia, DenunciaVarias } from '../types';
import { BusquedaSeleccionClase } from './BusquedaSeleccionClase';
import { DenunciasVarias } from './DenunciasVarias';
import { 
  BookOpen, 
  Layers, 
  ShieldCheck, 
  Lock, 
  GraduationCap, 
  CheckCircle2, 
  AlertCircle,
  EyeOff,
  Clock,
  Sparkles
} from 'lucide-react';

export type SubmoduloEstudiante = 'inasistencia' | 'denuncias-varias';

interface PortalEstudianteProps {
  submoduloActivo: SubmoduloEstudiante;
  onCambiarSubmodulo: (submodulo: SubmoduloEstudiante) => void;
  maestroVigente: MaestroOfertaVigente | null;
  onRegistrarReporteInasistencia: (reporte: ReporteInasistencia) => void;
  onRegistrarDenunciaVarias: (denuncia: DenunciaVarias) => void;
  onIrAAdmin?: () => void;
}

export const PortalEstudiante: React.FC<PortalEstudianteProps> = ({
  submoduloActivo,
  onCambiarSubmodulo,
  maestroVigente,
  onRegistrarReporteInasistencia,
  onRegistrarDenunciaVarias,
  onIrAAdmin,
}) => {
  return (
    <div className="space-y-6">
      {/* Banner de Bienvenida y Garantía de Anonimato */}
      <section className="bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-md shadow-blue-950/10 border border-blue-900/40 relative overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800/70 border border-blue-700/60 text-blue-200 text-xs font-bold uppercase tracking-wider">
              <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
              <span>Portal de la Comunidad Estudiantil</span>
            </div>

            {/* Insignia de 100% Anónimo */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
              <EyeOff className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Anónimo y Confidencial</span>
            </div>
          </div>

          <div className="space-y-1.5 max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Voz Anónima — Habla con confianza
            </h2>
            <p className="text-sm text-blue-100/90 leading-relaxed">
              Plataforma oficial para registrar inasistencias docentes y reportar irregularidades académicas sin solicitar ningún dato personal ni rastrear tu identidad.
            </p>
          </div>

          {/* Garantías de seguridad */}
          <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-blue-200/80 border-t border-blue-800/60">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Sin registro de cuenta ni correos</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Sin almacenamiento de IP</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Revisión directa por el Decanato</span>
            </div>
          </div>
        </div>
      </section>

      {/* Selector de Módulos para Estudiantes (Pestañas visuales de alta jerarquía) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Opción 1: Reporte de Inasistencia Docente */}
        <button
          type="button"
          id="btn-submodulo-inasistencia"
          onClick={() => onCambiarSubmodulo('inasistencia')}
          className={`p-4 sm:p-5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-4 ${
            submoduloActivo === 'inasistencia'
              ? 'bg-white border-blue-900 ring-2 ring-blue-900/15 shadow-md shadow-blue-900/5'
              : 'bg-white/80 hover:bg-white border-slate-200/80 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
            submoduloActivo === 'inasistencia'
              ? 'bg-blue-900 text-white shadow-sm'
              : 'bg-blue-50 text-blue-900'
          }`}>
            <BookOpen className="w-6 h-6" />
          </div>

          <div className="space-y-1 flex-1">
            <div className="flex items-center justify-between">
              <h3 className={`text-base font-bold transition-colors ${
                submoduloActivo === 'inasistencia' ? 'text-blue-950' : 'text-slate-900'
              }`}>
                Inasistencia Docente
              </h3>
              {submoduloActivo === 'inasistencia' && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-900">
                  Activo
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 leading-normal">
              Busca tu materia, grupo y docente para notificar que no se presentó a clases.
            </p>
          </div>
        </button>

        {/* Opción 2: Denuncias Varias */}
        <button
          type="button"
          id="btn-submodulo-denuncias-varias"
          onClick={() => onCambiarSubmodulo('denuncias-varias')}
          className={`p-4 sm:p-5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-4 ${
            submoduloActivo === 'denuncias-varias'
              ? 'bg-white border-blue-900 ring-2 ring-blue-900/15 shadow-md shadow-blue-900/5'
              : 'bg-white/80 hover:bg-white border-slate-200/80 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
            submoduloActivo === 'denuncias-varias'
              ? 'bg-blue-900 text-white shadow-sm'
              : 'bg-indigo-50 text-indigo-900'
          }`}>
            <Layers className="w-6 h-6" />
          </div>

          <div className="space-y-1 flex-1">
            <div className="flex items-center justify-between">
              <h3 className={`text-base font-bold transition-colors ${
                submoduloActivo === 'denuncias-varias' ? 'text-blue-950' : 'text-slate-900'
              }`}>
                Denuncias Varias
              </h3>
              {submoduloActivo === 'denuncias-varias' && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-900">
                  Activo
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 leading-normal">
              Reporta cobros forzosos de libros, seminarios obligatorios u otras faltas.
            </p>
          </div>
        </button>
      </div>

      {/* Contenido del Submódulo Seleccionado */}
      <div className="transition-all">
        {submoduloActivo === 'inasistencia' && (
          <BusquedaSeleccionClase
            maestroVigente={maestroVigente}
            onRegistrarReporte={onRegistrarReporteInasistencia}
            onIrAAdmin={onIrAAdmin}
          />
        )}

        {submoduloActivo === 'denuncias-varias' && (
          <DenunciasVarias
            maestroVigente={maestroVigente}
            onRegistrarDenuncia={onRegistrarDenunciaVarias}
          />
        )}
      </div>
    </div>
  );
};
