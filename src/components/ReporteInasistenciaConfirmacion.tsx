import React from 'react';
import { ReporteInasistencia } from '../types';
import { 
  CheckCircle2, 
  RotateCcw, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  MapPin, 
  BookOpen, 
  UserX,
  FileCheck2
} from 'lucide-react';

interface ReporteInasistenciaConfirmacionProps {
  reporte: ReporteInasistencia;
  onRealizarOtroReporte: () => void;
}

export const ReporteInasistenciaConfirmacion: React.FC<ReporteInasistenciaConfirmacionProps> = ({
  reporte,
  onRealizarOtroReporte,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
      {/* Tarjeta principal de Éxito / Confirmación */}
      <section 
        id="tarjeta-confirmacion-reporte"
        className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-emerald-300 shadow-sm text-center space-y-5"
      >
        <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-1 max-w-md mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-emerald-950">
            Reporte enviado correctamente.
          </h1>
          <p className="text-sm text-slate-600">
            La inasistencia ha sido registrada de manera segura y anónima en el sistema de la facultad.
          </p>
        </div>

        {/* Indicador visible de Anonimato */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-200 text-blue-900 rounded-full text-xs font-bold shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-blue-700" />
          <span>Tu reporte es anónimo. Ningún dato personal fue registrado.</span>
        </div>

        {/* Resumen del reporte emitido */}
        <div className="max-w-xl mx-auto bg-slate-50 border border-slate-200 rounded-xl p-5 text-left text-xs sm:text-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4 text-emerald-700" />
              Detalle del reporte registrado
            </span>
            <span className="text-[11px] font-mono font-semibold text-slate-500">
              ID: {reporte.id}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
            <div>
              <span className="text-slate-400 text-xs uppercase block font-semibold">Docente:</span>
              <strong className="text-slate-900">{reporte.docente}</strong>
            </div>

            <div>
              <span className="text-slate-400 text-xs uppercase block font-semibold">Materia:</span>
              <span className="font-semibold text-slate-900">{reporte.nombreMateria}</span>
            </div>

            <div>
              <span className="text-slate-400 text-xs uppercase block font-semibold">Sigla y Grupo:</span>
              <span className="font-mono font-bold text-slate-900">{reporte.sigla} — Gr. {reporte.grupo}</span>
            </div>

            <div>
              <span className="text-slate-400 text-xs uppercase block font-semibold">Horario y Aula:</span>
              <span className="text-slate-900">{reporte.dia} {reporte.horario} (Aula {reporte.aula})</span>
            </div>

            <div className="sm:col-span-2 pt-1 border-t border-slate-100">
              <span className="text-slate-400 text-xs uppercase block font-semibold">Fecha del reporte:</span>
              <span className="font-semibold text-slate-900 capitalize">{reporte.fechaReporte}</span>
            </div>

            <div className="sm:col-span-2">
              <span className="text-slate-400 text-xs uppercase block font-semibold">Estado:</span>
              <span className="inline-flex items-center gap-1 text-red-700 font-bold">
                <UserX className="w-3.5 h-3.5" />
                El docente no asistió a esta clase
              </span>
            </div>

            {reporte.comentario && (
              <div className="sm:col-span-2 pt-1 border-t border-slate-100">
                <span className="text-slate-400 text-xs uppercase block font-semibold">Comentario registrado:</span>
                <p className="text-slate-800 italic bg-white p-2.5 rounded-lg border border-slate-200 mt-1">
                  &quot;{reporte.comentario}&quot;
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Botón de acción: Realizar otro reporte */}
        <div className="pt-2">
          <button
            type="button"
            id="btn-realizar-otro-reporte"
            onClick={onRealizarOtroReporte}
            className="px-6 py-3 bg-blue-900 hover:bg-blue-800 active:bg-blue-950 text-white rounded-xl font-bold text-sm shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Realizar otro reporte</span>
          </button>
        </div>
      </section>
    </div>
  );
};
