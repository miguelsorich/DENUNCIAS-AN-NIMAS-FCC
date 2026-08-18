import React, { useState } from 'react';
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
  FileCheck2,
  Camera,
  Eye,
  X
} from 'lucide-react';

interface ReporteInasistenciaConfirmacionProps {
  reporte: ReporteInasistencia;
  onRealizarOtroReporte: () => void;
}

export const ReporteInasistenciaConfirmacion: React.FC<ReporteInasistenciaConfirmacionProps> = ({
  reporte,
  onRealizarOtroReporte,
}) => {
  const [verFotoModal, setVerFotoModal] = useState<boolean>(false);

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

            {/* Fotografía de prueba adjunta */}
            {reporte.imagenAdjunta && (
              <div className="sm:col-span-2 pt-2 border-t border-slate-100">
                <span className="text-slate-400 text-xs uppercase block font-semibold mb-1.5 flex items-center gap-1">
                  <Camera className="w-3.5 h-3.5 text-blue-900" />
                  Prueba fotográfica adjunta:
                </span>
                <div className="flex items-center gap-3 bg-white p-2.5 rounded-lg border border-slate-200">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-slate-300 shrink-0 bg-slate-200">
                    <img
                      src={reporte.imagenAdjunta}
                      alt="Prueba adjunta"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 min-w-0 text-xs">
                    <span className="font-bold text-slate-800 block truncate">
                      {reporte.imagenNombre || 'evidencia_fotografica.jpg'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setVerFotoModal(true)}
                      className="text-[11px] font-bold text-blue-900 hover:underline cursor-pointer flex items-center gap-1 mt-0.5"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Ver foto completa</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

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

      {/* Modal visor de foto */}
      {verFotoModal && reporte.imagenAdjunta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-5 shadow-2xl border border-slate-200 space-y-3 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-blue-900" />
                Fotografía adjunta como prueba
              </span>
              <button
                type="button"
                onClick={() => setVerFotoModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[65vh] overflow-auto flex items-center justify-center bg-slate-900 rounded-xl p-2">
              <img
                src={reporte.imagenAdjunta}
                alt="Prueba completa"
                className="max-h-[60vh] max-w-full object-contain rounded"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="flex items-center justify-end text-xs pt-1">
              <button
                type="button"
                onClick={() => setVerFotoModal(false)}
                className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
