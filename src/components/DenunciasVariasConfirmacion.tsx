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
  GraduationCap,
  BookOpen,
  Calendar,
  MapPin
} from 'lucide-react';

interface DenunciasVariasConfirmacionProps {
  denuncia: DenunciaVarias;
  onRealizarOtraDenuncia: () => void;
}

export const DenunciasVariasConfirmacion: React.FC<DenunciasVariasConfirmacionProps> = ({
  denuncia,
  onRealizarOtraDenuncia,
}) => {
  const docenteVal = denuncia.docente || denuncia.docenteDenunciado || 'No especificado';

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
            Denuncia enviada correctamente
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
        <div className="max-w-xl mx-auto bg-slate-50 border border-slate-200 rounded-xl p-5 text-left text-xs sm:text-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4 text-emerald-700" />
              Detalle de la denuncia registrada
            </span>
            <span className="text-[11px] font-mono font-semibold text-slate-500">
              ID: {denuncia.id}
            </span>
          </div>

          <div className="space-y-3.5 text-slate-700">
            {/* Docente */}
            <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-2">
              <div>
                <span className="text-slate-400 text-xs uppercase block font-semibold flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-blue-700" />
                  Docente denunciado:
                </span>
                <strong className="text-slate-900 text-base block mt-0.5">
                  {docenteVal}
                </strong>
              </div>

              {/* Detalles de la clase */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px] uppercase font-semibold">Materia:</span>
                  <span className="font-bold text-slate-900 block">
                    {denuncia.nombreMateria || 'No especificado'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] uppercase font-semibold">Sigla / Grupo:</span>
                  <span className="font-bold text-blue-900 block font-mono">
                    {denuncia.sigla ? `${denuncia.sigla} - Gr. ${denuncia.grupo || '-'}` : 'No especificado'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] uppercase font-semibold">Día / Horario:</span>
                  <span className="text-slate-800 font-medium block">
                    {denuncia.dia ? `${denuncia.dia} ${denuncia.horario ? `(${denuncia.horario})` : ''}` : 'No especificado'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] uppercase font-semibold">Aula:</span>
                  <span className="text-slate-800 font-medium block">
                    {denuncia.aula || 'No especificado'}
                  </span>
                </div>
              </div>
            </div>

            {/* Tipo de denuncia */}
            <div>
              <span className="text-slate-400 text-xs uppercase block font-semibold flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-blue-700" />
                Tipo de denuncia:
              </span>
              <strong className="text-slate-900 text-base">{denuncia.tipoDenuncia}</strong>
            </div>

            {/* Fecha automática */}
            <div>
              <span className="text-slate-400 text-xs uppercase block font-semibold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-700" />
                Fecha automática:
              </span>
              <span className="font-semibold text-slate-900 capitalize">{denuncia.fechaRegistro}</span>
            </div>

            {/* Comentario */}
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
