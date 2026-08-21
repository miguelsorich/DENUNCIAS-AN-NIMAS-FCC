import React from 'react';
import { MaestroOfertaVigente, ReporteInasistencia, DenunciaVarias, ModalidadEstudio } from '../types';
import { BusquedaSeleccionClase } from './BusquedaSeleccionClase';
import { DenunciasVarias } from './DenunciasVarias';
import { DenunciaVirtualForm } from './DenunciaVirtualForm';
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
  Sparkles,
  Building2,
  Laptop,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  HelpCircle,
  Video,
  FileText,
  MessageSquareQuote
} from 'lucide-react';

export type SubmoduloEstudiante = 'inasistencia' | 'denuncias-varias';

interface PortalEstudianteProps {
  modalidadActiva: ModalidadEstudio | null;
  onCambiarModalidad: (modalidad: ModalidadEstudio | null) => void;
  submoduloActivo: SubmoduloEstudiante;
  onCambiarSubmodulo: (submodulo: SubmoduloEstudiante) => void;
  maestroVigente: MaestroOfertaVigente | null;
  maestroVirtual: MaestroOfertaVigente | null;
  onGuardarMaestroVirtual: (nuevoMaestro: MaestroOfertaVigente) => void;
  onRegistrarReporteInasistencia: (reporte: ReporteInasistencia) => void;
  onRegistrarDenunciaVarias: (denuncia: DenunciaVarias) => void;
  onIrAAdmin?: () => void;
}

export const PortalEstudiante: React.FC<PortalEstudianteProps> = ({
  modalidadActiva,
  onCambiarModalidad,
  submoduloActivo,
  onCambiarSubmodulo,
  maestroVigente,
  maestroVirtual,
  onGuardarMaestroVirtual,
  onRegistrarReporteInasistencia,
  onRegistrarDenunciaVarias,
  onIrAAdmin,
}) => {
  // PANTALLA PRINCIPAL: Si no hay modalidad seleccionada, SOLO mostrar las 2 opciones
  if (modalidadActiva === null) {
    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        {/* Banner de Bienvenida y Garantía de Anonimato */}
        <section className="bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-md shadow-blue-950/10 border border-blue-900/40 relative overflow-hidden">
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
                Selecciona tu modalidad de estudio para registrar inasistencias o reportar irregularidades académicas en un entorno completamente separado y confidencial.
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
                <span>Entornos aislados por modalidad</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECCIÓN PRINCIPAL: 2 OPCIONES CLARAS DE MODALIDAD */}
        <section className="space-y-3" aria-labelledby="titulo-selector-modalidad">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 px-1">
            <div>
              <h2 id="titulo-selector-modalidad" className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                ¿En qué modalidad está tu materia o grupo?
              </h2>
              <p className="text-xs text-slate-500">
                Elige tu modalidad para acceder a su oferta académica y formulario correspondiente.
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-600 bg-slate-200/70 px-2.5 py-1 rounded-lg self-start sm:self-auto">
              2 Opciones Disponibles
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* OPCIÓN 1: MODALIDAD PRESENCIAL */}
            <div
              id="tarjeta-modalidad-presencial"
              onClick={() => onCambiarModalidad('presencial')}
              className="rounded-2xl p-5 sm:p-6 border-2 border-slate-200 bg-white hover:bg-blue-50/20 hover:border-blue-800 hover:shadow-lg transition-all cursor-pointer relative flex flex-col justify-between group"
            >
              <div className="space-y-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-blue-50 text-blue-900 border border-blue-200 group-hover:bg-blue-900 group-hover:text-white transition-colors">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-950 transition-colors">
                      Modalidad Presencial
                    </h3>
                    <span className="text-xs font-semibold text-blue-800">
                      Campus Universitario & Aulas Físicas
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Para materias dictadas en aulas físicas de la facultad. Registra inasistencias docentes en horario de clases o reporta cobros de libros y seminarios obligatorios.
                </p>

                {/* Características de la Modalidad Presencial */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-2 text-slate-700 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-700" />
                    <span>Reporte de inasistencia docente en aula (Con validación de horario)</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-700" />
                    <span>Denuncias de cobros de libros y seminarios obligatorios</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-700" />
                    <span>Maestro de Oferta: <strong>{maestroVigente?.registros?.length || 0} clases presenciales</strong></span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">
                  Hacer clic para ingresar
                </span>
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 bg-blue-900 hover:bg-blue-800 text-white shadow-xs group-hover:translate-x-0.5"
                >
                  <span>Ingresar a Presencial</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* OPCIÓN 2: MODALIDAD VIRTUAL */}
            <div
              id="tarjeta-modalidad-virtual"
              onClick={() => onCambiarModalidad('virtual')}
              className="rounded-2xl p-5 sm:p-6 border-2 border-slate-200 bg-white hover:bg-indigo-50/20 hover:border-indigo-800 hover:shadow-lg transition-all cursor-pointer relative flex flex-col justify-between group"
            >
              <div className="space-y-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-indigo-50 text-indigo-800 border border-indigo-200 group-hover:bg-indigo-800 group-hover:text-white transition-colors">
                    <Laptop className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-indigo-950 transition-colors">
                      Modalidad Virtual
                    </h3>
                    <span className="text-xs font-semibold text-indigo-800">
                      Plataformas Digitales (Teams • Moodle • Zoom)
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Para materias y grupos virtuales. Evalúa si el docente responde dudas a tiempo, sube materiales didácticos o se conecta a sesiones sincrónicas.
                </p>

                {/* Características de la Modalidad Virtual */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-2 text-slate-700 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-700" />
                    <span>¿El docente responde a consultas en plataforma de forma oportuna?</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-700" />
                    <span>¿Sube sus materiales y recursos académicos a tiempo?</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-700" />
                    <span>Maestro de Oferta Virtual: <strong>{maestroVirtual?.registros?.length || 0} clases virtuales</strong></span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">
                  Hacer clic para ingresar
                </span>
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 bg-indigo-800 hover:bg-indigo-700 text-white shadow-xs group-hover:translate-x-0.5"
                >
                  <span>Ingresar a Virtual</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </section>
      </div>
    );
  }

  // PANTALLA DESPLEGADA: Cuando el estudiante eligió una modalidad
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Barra de Navegación Superior con botón para Volver a Elegir Modalidad */}
      <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs ${
        modalidadActiva === 'presencial'
          ? 'bg-blue-50/90 border-blue-200 text-blue-950'
          : 'bg-indigo-50/90 border-indigo-200 text-indigo-950'
      }`}>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onCambiarModalidad(null)}
            className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors cursor-pointer flex items-center gap-1.5 font-bold text-xs shadow-2xs"
            title="Volver a la selección de modalidad"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Volver a modalidades</span>
          </button>

          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white ${
              modalidadActiva === 'presencial' ? 'bg-blue-900 shadow-xs' : 'bg-indigo-800 shadow-xs'
            }`}>
              {modalidadActiva === 'presencial' ? <Building2 className="w-4 h-4" /> : <Laptop className="w-4 h-4" />}
            </div>
            <div>
              <span className="text-[11px] uppercase font-bold tracking-wider opacity-80 block">
                Entorno Activo
              </span>
              <span className="text-sm sm:text-base font-black">
                {modalidadActiva === 'presencial' 
                  ? '🏛️ Modalidad Presencial (Campus Universitario)' 
                  : '💻 Modalidad Virtual (Plataformas Digitales)'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => onCambiarModalidad(modalidadActiva === 'presencial' ? 'virtual' : 'presencial')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
              modalidadActiva === 'presencial'
                ? 'bg-white hover:bg-blue-100 text-blue-900 border-blue-300'
                : 'bg-white hover:bg-indigo-100 text-indigo-900 border-indigo-300'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>
              {modalidadActiva === 'presencial' ? 'Cambiar a Modalidad Virtual' : 'Cambiar a Modalidad Presencial'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onCambiarModalidad(null)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white/70 hover:bg-white border border-slate-200 transition-colors cursor-pointer"
          >
            Inicio
          </button>
        </div>
      </div>

      {/* VISTA SEGÚN LA MODALIDAD SELECCIONADA (SEPARACIÓN TOTAL) */}
      {modalidadActiva === 'presencial' ? (
        <div className="space-y-6">
          {/* Submódulos de Modalidad Presencial */}
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
                    1. Inasistencia Docente en Aula
                  </h3>
                  {submoduloActivo === 'inasistencia' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-900">
                      Activo
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 leading-normal">
                  Busca tu materia en el Maestro Presencial y notifica que el docente no llegó al aula durante el horario de clase.
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
                    2. Denuncias Varias (Presencial)
                  </h3>
                  {submoduloActivo === 'denuncias-varias' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-900">
                      Activo
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 leading-normal">
                  Reporta cobros forzosos de libros físicos, seminarios obligatorios pagados u otras irregularidades en el campus.
                </p>
              </div>
            </button>
          </div>

          {/* Contenido del Submódulo Presencial Seleccionado */}
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
      ) : (
        /* VISTA DE MODALIDAD VIRTUAL (100% AISLADA DE PRESENCIAL) */
        <div className="space-y-6">
          <DenunciaVirtualForm
            maestroVirtual={maestroVirtual}
            onGuardarMaestroVirtual={onGuardarMaestroVirtual}
            onRegistrarDenuncia={onRegistrarDenunciaVarias}
          />
        </div>
      )}
    </div>
  );
};
