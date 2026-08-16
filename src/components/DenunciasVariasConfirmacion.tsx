import React from 'react';
import { DenunciaVarias } from '../types';
import { 
  CheckCircle2, 
  RotateCcw, 
  ShieldCheck, 
  FileCheck2, 
  Clock, 
  Tag, 
  MessageSquare,
  GraduationCap
} from 'lucide-react';

interface DenunciasVariasConfirmacionProps {
  denuncia: DenunciaVarias;
  onRealizarOtraDenuncia: () => void;
}

export const DenunciasVariasConfirmacion: React.FC<DenunciasVariasConfirmacionProps> = ({
  denuncia,
  onRealizarOtraDenuncia,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
      {/* Tarjeta principal de Confirmación */}
      <section 
        id="tarjeta-confirmacion-denuncia-varias"
        className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-emerald-300 shadow-sm text-center space-y-5"
      >
        <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-1 max-w-md mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-emerald-950">
            Denuncia enviada correctamente.
          </h1>
          <p className="text-sm text-slate-600">
            Tu reporte ha sido registrado de forma confidencial y anónima en el sistema institucional.
          </p>
        </div>

        {/* Indicador visible de Anonimato */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-200 text-blue-900 rounded-full text-xs font-bold shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-blue-700" />
          <span>Tu denuncia es anónima. Ningún dato personal fue registrado.</span>
        </div>

        {/* Resumen de la denuncia registrada */}
        <div className="max-w-xl mx-auto bg-slate-50 border border-slate-200 rounded-xl p-5 text-left text-xs sm:text-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4 text-emerald-700" />
              Detalle de la denuncia registrada
            </span>
            <span className="text-[11px] font-mono font-semibold text-slate-500">
              ID: {denuncia.id}
            </span>
          </div>

          <div className="space-y-3 text-slate-700">
            <div>
              <span className="text-slate-400 text-xs uppercase block font-semibold flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-blue-700" />
                Docente denunciado:
              </span>
              <strong className="text-slate-900 text-base">
                {denuncia.docenteDenunciado || 'No especificado'}
              </strong>
            </div>

            <div>
              <span className="text-slate-400 text-xs uppercase block font-semibold flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-blue-700" />
                Tipo de denuncia:
              </span>
              <strong className="text-slate-900 text-base">{denuncia.tipoDenuncia}</strong>
            </div>

            <div>
              <span className="text-slate-400 text-xs uppercase block font-semibold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-700" />
                Fecha automática:
              </span>
              <span className="font-semibold text-slate-900 capitalize">{denuncia.fechaRegistro}</span>
            </div>

            {denuncia.comentario && (
              <div className="pt-1 border-t border-slate-200">
                <span className="text-slate-400 text-xs uppercase block font-semibold flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-blue-700" />
                  Comentario o descripción:
                </span>
                <p className="text-slate-800 bg-white p-3 rounded-lg border border-slate-200 mt-1 whitespace-pre-wrap leading-relaxed">
                  {denuncia.comentario}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Opción para realizar otra denuncia */}
        <div className="pt-2">
          <button
            type="button"
            id="btn-realizar-otra-denuncia"
            onClick={onRealizarOtraDenuncia}
            className="px-6 py-3 bg-blue-900 hover:bg-blue-800 active:bg-blue-950 text-white rounded-xl font-bold text-sm shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Realizar otra denuncia</span>
          </button>
        </div>
      </section>
    </div>
  );
};
