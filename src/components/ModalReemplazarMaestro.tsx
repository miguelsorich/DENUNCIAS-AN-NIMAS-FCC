import React from 'react';
import { AlertTriangle, X, RefreshCw } from 'lucide-react';
import { MaestroOfertaVigente, ValidacionImportacion } from '../types';

interface ModalReemplazarMaestroProps {
  maestroExistente: MaestroOfertaVigente;
  nuevoResultado: ValidacionImportacion;
  nuevoNombreArchivo: string;
  nuevoSemestre: string;
  onConfirmarReemplazo: () => void;
  onCancelar: () => void;
}

export const ModalReemplazarMaestro: React.FC<ModalReemplazarMaestroProps> = ({
  maestroExistente,
  nuevoResultado,
  nuevoNombreArchivo,
  nuevoSemestre,
  onConfirmarReemplazo,
  onCancelar,
}) => {
  return (
    <div
      id="modal-confirmar-reemplazo"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-titulo-reemplazar"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <button
            type="button"
            onClick={onCancelar}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors"
            title="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          <h3 id="modal-titulo-reemplazar" className="text-lg font-bold text-slate-900 leading-snug">
            Ya existe un Maestro de Oferta cargado. ¿Desea reemplazarlo con el nuevo archivo?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600">
            Al reemplazar, la oferta académica actual será actualizada con los {nuevoResultado.totalFilas} registros del nuevo archivo seleccionado para el semestre vigente.
          </p>
        </div>

        {/* Comparativa informativa */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs space-y-3">
          <div>
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block mb-1">
              Maestro actual en sistema
            </span>
            <div className="flex justify-between text-slate-700">
              <span>Semestre: <strong>{maestroExistente.semestre}</strong></span>
              <span><strong>{maestroExistente.totalRegistros}</strong> registros</span>
            </div>
            <p className="text-slate-500 text-[11px] mt-0.5">
              Archivo: {maestroExistente.nombreArchivo} ({maestroExistente.fechaImportacion})
            </p>
          </div>

          <div className="border-t border-slate-200 pt-2.5">
            <span className="font-bold text-blue-800 uppercase tracking-wider text-[10px] block mb-1">
              Nuevo archivo a importar
            </span>
            <div className="flex justify-between text-slate-800">
              <span>Semestre: <strong>{nuevoSemestre}</strong></span>
              <span className="text-blue-900 font-bold"><strong>{nuevoResultado.totalFilas}</strong> registros</span>
            </div>
            <p className="text-slate-500 text-[11px] mt-0.5">
              Archivo: {nuevoNombreArchivo}
            </p>
          </div>
        </div>

        {/* Botones requeridos: Cancelar y Reemplazar Maestro de Oferta */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            id="btn-cancelar-reemplazo"
            onClick={onCancelar}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-colors cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="button"
            id="btn-confirmar-reemplazar-maestro"
            onClick={onConfirmarReemplazo}
            className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-sm shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reemplazar Maestro de Oferta</span>
          </button>
        </div>
      </div>
    </div>
  );
};
