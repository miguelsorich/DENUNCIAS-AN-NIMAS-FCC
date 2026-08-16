import React, { useState, useMemo } from 'react';
import { OfertaClase } from '../types';
import { FileSpreadsheet, Layers, Search, Filter } from 'lucide-react';

interface TablaMaestroOfertaProps {
  registros: OfertaClase[];
  semestreVigente?: string;
  fechaActualizacion?: string;
}

export const TablaMaestroOferta: React.FC<TablaMaestroOfertaProps> = ({
  registros,
  semestreVigente,
  fechaActualizacion,
}) => {
  const [filtroTexto, setFiltroTexto] = useState('');

  const registrosFiltrados = useMemo(() => {
    if (!filtroTexto.trim()) return registros;
    const term = filtroTexto.toLowerCase().trim();
    return registros.filter(
      (r) =>
        r.sigla.toLowerCase().includes(term) ||
        r.nombreMateria.toLowerCase().includes(term) ||
        r.docente.toLowerCase().includes(term) ||
        r.grupo.toLowerCase().includes(term) ||
        r.aula.toLowerCase().includes(term) ||
        r.carreras.toLowerCase().includes(term)
    );
  }, [registros, filtroTexto]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-0">
      <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70">
        <div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-blue-900" />
            <h3 className="text-base font-bold text-slate-900">
              Registros del Maestro de Oferta Vigente
            </h3>
          </div>
          {semestreVigente && (
            <p className="text-xs text-slate-500 mt-0.5">
              Semestre: <strong className="text-slate-700">{semestreVigente}</strong>
              {fechaActualizacion && ` • Importado: ${fechaActualizacion}`}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filtroTexto}
              onChange={(e) => setFiltroTexto(e.target.value)}
              placeholder="Buscar en registros..."
              className="pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:border-blue-700 focus:ring-1 focus:ring-blue-100 outline-none text-slate-800 placeholder:text-slate-400"
            />
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-100/90 text-blue-900 text-xs font-bold font-mono shrink-0">
            <Layers className="w-3.5 h-3.5" />
            {registros.length} registros
          </span>
        </div>
      </div>

      {/* Tabla con todas las columnas del Maestro de Oferta */}
      <div className="overflow-x-auto max-h-[500px]">
        <table className="w-full text-left text-xs sm:text-sm text-slate-700 border-collapse">
          <thead className="sticky top-0 z-10 bg-slate-100 text-slate-800 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px] shadow-2xs">
            <tr>
              <th scope="col" className="py-3 px-3.5 whitespace-nowrap">SIGLA</th>
              <th scope="col" className="py-3 px-2.5 text-center whitespace-nowrap">GR</th>
              <th scope="col" className="py-3 px-3.5 min-w-[180px]">NOMBRE DE LA MATERIA</th>
              <th scope="col" className="py-3 px-3.5 min-w-[200px]">CARRERAS</th>
              <th scope="col" className="py-3 px-3.5 min-w-[200px]">DOCENTE</th>
              <th scope="col" className="py-3 px-2.5 whitespace-nowrap">DÍA</th>
              <th scope="col" className="py-3 px-3 min-w-[120px] whitespace-nowrap">HORARIO</th>
              <th scope="col" className="py-3 px-3.5 min-w-[140px]">AULA</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {registrosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-slate-500 text-xs">
                  No se encontraron registros que coincidan con la búsqueda &quot;{filtroTexto}&quot;.
                </td>
              </tr>
            ) : (
              registrosFiltrados.map((item, index) => (
                <tr 
                  key={item.id || index}
                  className="hover:bg-blue-50/40 transition-colors"
                >
                  <td className="py-3 px-3.5 font-mono font-bold text-blue-900 whitespace-nowrap">
                    {item.sigla}
                  </td>
                  <td className="py-3 px-2.5 font-semibold text-slate-900 text-center">
                    {item.grupo}
                  </td>
                  <td className="py-3 px-3.5 font-medium text-slate-900">
                    {item.nombreMateria}
                  </td>
                  <td className="py-3 px-3.5 text-slate-600 text-xs">
                    {item.carreras}
                  </td>
                  <td className="py-3 px-3.5 font-medium text-slate-800">
                    {item.docente}
                  </td>
                  <td className="py-3 px-2.5 text-slate-700 whitespace-nowrap">
                    {item.dia}
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-mono text-xs whitespace-nowrap">
                    {item.horario}
                  </td>
                  <td className="py-3 px-3.5 text-slate-700">
                    {item.aula}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
        <span>
          Mostrando {registrosFiltrados.length} de {registros.length} registros del maestro de oferta vigente.
        </span>
        <span className="font-medium text-slate-600">
          Semestre activo: {semestreVigente}
        </span>
      </div>
    </div>
  );
};
