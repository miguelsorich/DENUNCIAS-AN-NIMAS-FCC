import React from 'react';
import { DenunciaVarias } from '../types';
import { 
  CheckCircle2, 
  ShieldCheck, 
  EyeOff, 
  Laptop, 
  Calendar, 
  Clock, 
  MessageSquare, 
  FileText, 
  ArrowLeft,
  RotateCcw,
  Tag,
  GraduationCap
} from 'lucide-react';

interface DenunciaVirtualConfirmacionProps {
  denuncia: DenunciaVarias;
  onRealizarOtra: () => void;
}

export const DenunciaVirtualConfirmacion: React.FC<DenunciaVirtualConfirmacionProps> = ({
  denuncia,
  onRealizarOtra,
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-9 border border-emerald-200 shadow-lg space-y-6 animate-in fade-in zoom-in-95">
      {/* Banner Superior de Éxito */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold uppercase tracking-wider">
          <Laptop className="w-3.5 h-3.5 text-blue-900" />
          <span>Modalidad Virtual — Reporte Registrado</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          ¡Denuncia Virtual Registrada con Éxito!
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          Tu reporte ha sido ingresado al sistema de forma 100% anónima. Las autoridades facultativas darán seguimiento a la situación académica en la plataforma.
        </p>
      </div>

      {/* Resumen de la Denuncia Virtual */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4 text-xs sm:text-sm">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <span className="font-mono text-slate-500 text-xs">Código ID: {denuncia.id}</span>
          <span className="text-xs text-slate-500 font-medium">{denuncia.fechaRegistro}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-slate-400 text-xs uppercase block font-semibold">Materia / Sigla:</span>
            <strong className="text-slate-900 block">
              {denuncia.nombreMateria || 'Materia no especificada'}
            </strong>
            <span className="text-blue-900 font-mono text-xs font-bold">
              {denuncia.sigla} {denuncia.grupo ? `- Grupo ${denuncia.grupo}` : ''}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 text-xs uppercase block font-semibold">Docente:</span>
            <strong className="text-slate-900 block">
              {denuncia.docente || denuncia.docenteDenunciado || 'No especificado'}
            </strong>
          </div>
        </div>

        {/* Indicadores Clave de Modalidad Virtual */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
          <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[11px] text-slate-500 font-semibold block">
              ¿Responde a consultas oportunamente?
            </span>
            <span className={`inline-flex items-center gap-1 font-bold text-xs px-2 py-0.5 rounded-full ${
              denuncia.respondeConsultasOportunamente === 'SI'
                ? 'bg-emerald-100 text-emerald-800'
                : denuncia.respondeConsultasOportunamente === 'REGULAR'
                ? 'bg-amber-100 text-amber-900'
                : 'bg-red-100 text-red-900'
            }`}>
              {denuncia.respondeConsultasOportunamente === 'SI' && '✓ Sí, oportunamente'}
              {denuncia.respondeConsultasOportunamente === 'REGULAR' && '⚠️ Con retraso / Regular'}
              {denuncia.respondeConsultasOportunamente === 'NO' && '⛔ No responde a dudas'}
              {!denuncia.respondeConsultasOportunamente && 'No especificado'}
            </span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[11px] text-slate-500 font-semibold block">
              ¿Sube materiales / recursos a tiempo?
            </span>
            <span className={`inline-flex items-center gap-1 font-bold text-xs px-2 py-0.5 rounded-full ${
              denuncia.subeMaterialesATiempo === 'SI'
                ? 'bg-emerald-100 text-emerald-800'
                : denuncia.subeMaterialesATiempo === 'RETRASO'
                ? 'bg-amber-100 text-amber-900'
                : 'bg-red-100 text-red-900'
            }`}>
              {denuncia.subeMaterialesATiempo === 'SI' && '✓ Sí, a tiempo'}
              {denuncia.subeMaterialesATiempo === 'RETRASO' && '⚠️ Sube con retraso'}
              {denuncia.subeMaterialesATiempo === 'NO' && '⛔ No sube materiales'}
              {!denuncia.subeMaterialesATiempo && 'No especificado'}
            </span>
          </div>
        </div>

        {/* Motivo de denuncia */}
        <div className="pt-2 border-t border-slate-200">
          <span className="text-slate-400 text-xs uppercase block font-semibold">Motivo Principal:</span>
          <span className="font-bold text-slate-900 block mt-0.5">{denuncia.tipoDenuncia}</span>
        </div>

        {/* Comentario */}
        {denuncia.comentario && (
          <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Detalle reportado:</span>
            <p className="italic leading-relaxed">{denuncia.comentario}</p>
          </div>
        )}

        {/* Prueba adjunta */}
        {denuncia.imagenAdjunta && (
          <div className="flex items-center gap-2 text-xs text-emerald-800 font-semibold bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Evidencia fotográfica / captura adjunta correctamente</span>
          </div>
        )}
      </div>

      {/* Garantía de anonimato */}
      <div className="flex items-center justify-center gap-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
        <EyeOff className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>Garantía de Anonimato Total: Ningún dato personal o de conexión ha sido registrado.</span>
      </div>

      {/* Botón para realizar otra acción */}
      <div className="flex justify-center pt-2">
        <button
          type="button"
          onClick={onRealizarOtra}
          className="px-6 py-3 bg-blue-900 hover:bg-blue-800 text-white text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Realizar otro reporte virtual</span>
        </button>
      </div>
    </div>
  );
};
