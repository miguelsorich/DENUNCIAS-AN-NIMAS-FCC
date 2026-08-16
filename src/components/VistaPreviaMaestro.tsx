import React from 'react';
import { OfertaClase } from '../types';
import { Eye, FileCheck2, ArrowRight } from 'lucide-react';

interface VistaPreviaMaestroProps {
  nombreArchivo: string;
  semestre: string;
  registros: OfertaClase[];
  onProcederImportacion: () => void;
  onCancelarSeleccion: () => void;
}

export const VistaPreviaMaestro: React.FC<VistaPreviaMaestroProps> = ({
  nombreArchivo,
  semestre,
  registros,
  onProcederImportacion,
  onCancelarSeleccion,
}) => {
  return (
    <div
      id="seccion-vista-previa-maestro"
      className="bg-white rounded-2xl border-2 border-blue-200 p-5 sm:p-6 shadow-sm space-y-4 animate-in fade-in"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-100 text-blue-900">
              <Eye className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              Vista previa del archivo seleccionado
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Comprueba visualmente que los datos corresponden al archivo y semestre correctos antes de importar.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold">
            <FileCheck2 className="w-4 h-4 text-blue-700" />
            {registros.length} registros listos para importar
          </span>
        </div>
      </div>

      <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-xs flex flex-wrap items-center justify-between gap-2 text-slate-700">
        <div>
          <span className="text-slate-500">Archivo:</span>{' '}
          <strong className="font-mono text-slate-900">{nombreArchivo}</strong>
        </div>
        <div>
          <span className="text-slate-500">Semestre asignado:</span>{' '}
          <strong className="text-blue-900">{semestre}</strong>
        </div>
      </div>

      {/* Tabla de Vista Previa con las 8 columnas requeridas:
          SIGLA, GR, NOMBRE DE LA MATERIA, CARRERAS, DOCENTE, DÍA, HORARIO, AULA */}
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto max-h-80">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead className="sticky top-0 z-10 bg-slate-100 text-slate-800 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px] shadow-2xs">
              <tr>
                <th scope="col" className="py-2.5 px-3 whitespace-nowrap">SIGLA</th>
                <th scope="col" className="py-2.5 px-2 text-center whitespace-nowrap">GR</th>
                <th scope="col" className="py-2.5 px-3 min-w-[180px]">NOMBRE DE LA MATERIA</th>
                <th scope="col" className="py-2.5 px-3 min-w-[200px]">CARRERAS</th>
                <th scope="col" className="py-2.5 px-3 min-w-[190px]">DOCENTE</th>
                <th scope="col" className="py-2.5 px-2 whitespace-nowrap">DÍA</th>
                <th scope="col" className="py-2.5 px-3 min-w-[120px] whitespace-nowrap">HORARIO</th>
                <th scope="col" className="py-2.5 px-3 min-w-[130px]">AULA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {registros.map((item, idx) => (
                <tr key={item.id || idx} className="hover:bg-blue-50/30 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-blue-900 whitespace-nowrap">
                    {item.sigla}
                  </td>
                  <td className="py-2.5 px-2 font-semibold text-slate-900 text-center">
                    {item.grupo}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-900">
                    {item.nombreMateria}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 text-[11px]">
                    {item.carreras}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-800">
                    {item.docente}
                  </td>
                  <td className="py-2.5 px-2 text-slate-700 whitespace-nowrap">
                    {item.dia}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px] whitespace-nowrap">
                    {item.horario}
                  </td>
                  <td className="py-2.5 px-3 text-slate-700">
                    {item.aula}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Botones de confirmación de vista previa y ejecución de importación */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          type="button"
          id="btn-cancelar-vista-previa"
          onClick={onCancelarSeleccion}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
        >
          Seleccionar otro archivo
        </button>

        <button
          type="button"
          id="btn-ejecutar-importar-maestro"
          onClick={onProcederImportacion}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 active:bg-blue-950 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Importar Maestro de Oferta</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
