import React, { useState } from 'react';
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
  MapPin,
  Camera,
  Eye,
  X
} from 'lucide-react';

interface DenunciasVariasConfirmacionProps {
  denuncia: DenunciaVarias;
  onRealizarOtraDenuncia: () => void;
}

export const DenunciasVariasConfirmacion: React.FC<DenunciasVariasConfirmacionProps> = ({
  denuncia,
  onRealizarOtraDenuncia,
}) => {
  const [verFotoModal, setVerFotoModal] = useState<boolean>(false);
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
              <strong className="text-blue-900 text-base">{denuncia.tipoDenuncia}</strong>
            </div>

            {/* Fecha automática */}
            <div>
              <span className="text-slate-400 text-xs uppercase block font-semibold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-700" />
                Fecha automática:
              </span>
              <span className="font-semibold text-slate-900 capitalize">{denuncia.fechaRegistro}</span>
            </div>

            {/* Fotografía de prueba adjunta */}
            {denuncia.imagenAdjunta && (
              <div className="pt-2 border-t border-slate-200">
                <span className="text-slate-400 text-xs uppercase block font-semibold mb-1.5 flex items-center gap-1">
                  <Camera className="w-3.5 h-3.5 text-blue-900" />
                  Prueba fotográfica adjunta:
                </span>
                <div className="flex items-center gap-3 bg-white p-2.5 rounded-lg border border-slate-200">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-slate-300 shrink-0 bg-slate-200">
                    <img
                      src={denuncia.imagenAdjunta}
                      alt="Prueba adjunta"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 min-w-0 text-xs">
                    <span className="font-bold text-slate-800 block truncate">
                      {denuncia.imagenNombre || 'evidencia_denuncia.jpg'}
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

      {/* Modal visor de foto */}
      {verFotoModal && denuncia.imagenAdjunta && (
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
                src={denuncia.imagenAdjunta}
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
