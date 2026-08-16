import React, { useState } from 'react';
import { ReporteInasistencia, DenunciaVarias } from '../types';
import { 
  FileSpreadsheet, 
  Download, 
  UserX, 
  Layers, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  MapPin, 
  FileText, 
  Check, 
  AlertCircle,
  Table as TableIcon
} from 'lucide-react';
import { exportarReporteInasistencias, exportarReporteDenunciasVarias } from '../utils/exportUtils';

interface AdminReportesExportacionProps {
  reportesInasistencia: ReporteInasistencia[];
  denunciasVarias: DenunciaVarias[];
}

export type TipoReporteActivo = 'inasistencias' | 'denuncias-varias';

export const AdminReportesExportacion: React.FC<AdminReportesExportacionProps> = ({
  reportesInasistencia,
  denunciasVarias,
}) => {
  const [reporteActivo, setReporteActivo] = useState<TipoReporteActivo>('inasistencias');
  const [descargaExitosa, setDescargaExitosa] = useState<string | null>(null);

  const handleDescargarInasistencias = (formato: 'xlsx' | 'csv') => {
    if (reportesInasistencia.length === 0) return;
    exportarReporteInasistencias(reportesInasistencia, formato);
    setDescargaExitosa(`Reporte de inasistencias descargado en formato .${formato}`);
    setTimeout(() => setDescargaExitosa(null), 4000);
  };

  const handleDescargarDenunciasVarias = (formato: 'xlsx' | 'csv') => {
    if (denunciasVarias.length === 0) return;
    exportarReporteDenunciasVarias(denunciasVarias, formato);
    setDescargaExitosa(`Reporte de denuncias varias descargado en formato .${formato}`);
    setTimeout(() => setDescargaExitosa(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Encabezado Principal del Módulo 4 */}
      <section className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-blue-900 bg-blue-100 px-2.5 py-0.5 rounded-md">
                <FileSpreadsheet className="w-3.5 h-3.5" />
                Módulo 4 • Panel de Administración
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Reportes y exportación
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Consulta previa y descarga institucional de los reportes generados en formatos Excel (.xlsx) y CSV (.csv).
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5 text-xs text-blue-900 shrink-0 space-y-0.5">
            <span className="font-bold flex items-center gap-1.5 text-blue-950">
              <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
              Reportes 100% Anónimos
            </span>
            <p className="text-[11px] text-blue-800">
              Ningún reporte descargado incluye nombres, códigos o datos personales de estudiantes.
            </p>
          </div>
        </div>

        {/* Notificación de descarga */}
        {descargaExitosa && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{descargaExitosa}</span>
          </div>
        )}

        {/* Selector de tipo de reporte: 1. Reporte de inasistencias docentes | 2. Reporte de denuncias varias */}
        <div className="flex items-center gap-2 pt-1 border-b border-slate-200">
          <button
            type="button"
            id="tab-reporte-inasistencias"
            onClick={() => setReporteActivo('inasistencias')}
            className={`pb-3 px-4 text-sm sm:text-base font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              reporteActivo === 'inasistencias'
                ? 'border-blue-900 text-blue-900'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            <UserX className="w-4 h-4" />
            <span>Reporte de inasistencias docentes</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
              reporteActivo === 'inasistencias' 
                ? 'bg-blue-100 text-blue-900' 
                : 'bg-slate-100 text-slate-600'
            }`}>
              {reportesInasistencia.length}
            </span>
          </button>

          <button
            type="button"
            id="tab-reporte-denuncias-varias"
            onClick={() => setReporteActivo('denuncias-varias')}
            className={`pb-3 px-4 text-sm sm:text-base font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              reporteActivo === 'denuncias-varias'
                ? 'border-blue-900 text-blue-900'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Reporte de denuncias varias</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
              reporteActivo === 'denuncias-varias' 
                ? 'bg-blue-100 text-blue-900' 
                : 'bg-slate-100 text-slate-600'
            }`}>
              {denunciasVarias.length}
            </span>
          </button>
        </div>
      </section>

      {/* SECCIÓN 1: REPORTE DE INASISTENCIAS DOCENTES */}
      {reporteActivo === 'inasistencias' && (
        <section className="space-y-4" aria-label="Sección Reporte de inasistencias docentes">
          {/* Barra de opciones de descarga y resumen */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <TableIcon className="w-5 h-5 text-blue-900" />
                Visualización previa del reporte
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Revise la estructura de los datos antes de exportar. Total registros: {reportesInasistencia.length}
              </p>
            </div>

            {/* Opciones de descarga */}
            {reportesInasistencia.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  id="btn-descargar-inasistencias-excel"
                  onClick={() => handleDescargarInasistencias('xlsx')}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
                  title="Descargar reporte de inasistencias en formato Excel (.xlsx)"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Descargar reporte de inasistencias (Excel .xlsx)</span>
                </button>

                <button
                  type="button"
                  id="btn-descargar-inasistencias-csv"
                  onClick={() => handleDescargarInasistencias('csv')}
                  className="bg-slate-800 hover:bg-slate-900 text-white px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
                  title="Descargar reporte de inasistencias en formato CSV (.csv)"
                >
                  <Download className="w-4 h-4" />
                  <span>CSV (.csv)</span>
                </button>
              </div>
            ) : (
              <div className="text-xs text-slate-400 font-semibold italic">
                Descarga inhabilitada (sin datos)
              </div>
            )}
          </div>

          {/* CASO: No existen reportes de inasistencia para exportar */}
          {reportesInasistencia.length === 0 ? (
            <div 
              id="mensaje-sin-inasistencias-exportar"
              className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-3 shadow-xs"
            >
              <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-7 h-7" />
              </div>
              <p className="text-lg font-bold text-slate-800">
                No existen reportes de inasistencia para exportar.
              </p>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                Una vez que los estudiantes registren reportes en el Módulo 1, podrá visualizarlos y descargarlos aquí.
              </p>
            </div>
          ) : (
            /* TABLA DE VISUALIZACIÓN PREVIA DE INASISTENCIAS */
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm border-collapse" id="tabla-preview-inasistencias">
                  <thead>
                    <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-3.5 whitespace-nowrap">#</th>
                      <th className="py-3 px-3.5 whitespace-nowrap">FECHA</th>
                      <th className="py-3 px-3.5 whitespace-nowrap">DOCENTE</th>
                      <th className="py-3 px-3.5 whitespace-nowrap">MATERIA</th>
                      <th className="py-3 px-3.5 whitespace-nowrap">SIGLA</th>
                      <th className="py-3 px-3.5 whitespace-nowrap">GRUPO</th>
                      <th className="py-3 px-3.5 whitespace-nowrap">DÍA</th>
                      <th className="py-3 px-3.5 whitespace-nowrap">HORARIO</th>
                      <th className="py-3 px-3.5 whitespace-nowrap">AULA</th>
                      <th className="py-3 px-3.5 min-w-[200px]">COMENTARIO</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-800">
                    {reportesInasistencia.map((rep, idx) => (
                      <tr key={rep.id || idx} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-3.5 font-mono text-slate-400 font-bold">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-3.5 whitespace-nowrap text-slate-600 font-medium">
                          {rep.fechaReporte}
                        </td>
                        <td className="py-3 px-3.5 font-bold text-slate-900 whitespace-nowrap">
                          {rep.docente}
                        </td>
                        <td className="py-3 px-3.5 font-semibold text-slate-800 whitespace-nowrap">
                          {rep.nombreMateria}
                        </td>
                        <td className="py-3 px-3.5 font-mono font-bold text-blue-900 whitespace-nowrap">
                          {rep.sigla}
                        </td>
                        <td className="py-3 px-3.5 font-mono font-bold text-slate-700 whitespace-nowrap">
                          {rep.grupo}
                        </td>
                        <td className="py-3 px-3.5 whitespace-nowrap">
                          {rep.dia}
                        </td>
                        <td className="py-3 px-3.5 font-mono text-slate-600 whitespace-nowrap">
                          {rep.horario}
                        </td>
                        <td className="py-3 px-3.5 font-semibold text-slate-900 whitespace-nowrap">
                          {rep.aula}
                        </td>
                        <td className="py-3 px-3.5 text-xs text-slate-600 italic">
                          {rep.comentario ? rep.comentario : <span className="text-slate-400 font-normal">Sin comentario</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      )}

      {/* SECCIÓN 2: REPORTE DE DENUNCIAS VARIAS */}
      {reporteActivo === 'denuncias-varias' && (
        <section className="space-y-4" aria-label="Sección Reporte de denuncias varias">
          {/* Barra de opciones de descarga y resumen */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <TableIcon className="w-5 h-5 text-blue-900" />
                Visualización previa del reporte
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Revise la estructura de los datos antes de exportar. Total registros: {denunciasVarias.length}
              </p>
            </div>

            {/* Opciones de descarga */}
            {denunciasVarias.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  id="btn-descargar-denuncias-varias-excel"
                  onClick={() => handleDescargarDenunciasVarias('xlsx')}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
                  title="Descargar reporte de denuncias varias en formato Excel (.xlsx)"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Descargar reporte de denuncias varias (Excel .xlsx)</span>
                </button>

                <button
                  type="button"
                  id="btn-descargar-denuncias-varias-csv"
                  onClick={() => handleDescargarDenunciasVarias('csv')}
                  className="bg-slate-800 hover:bg-slate-900 text-white px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
                  title="Descargar reporte de denuncias varias en formato CSV (.csv)"
                >
                  <Download className="w-4 h-4" />
                  <span>CSV (.csv)</span>
                </button>
              </div>
            ) : (
              <div className="text-xs text-slate-400 font-semibold italic">
                Descarga inhabilitada (sin datos)
              </div>
            )}
          </div>

          {/* CASO: No existen denuncias varias para exportar */}
          {denunciasVarias.length === 0 ? (
            <div 
              id="mensaje-sin-denuncias-varias-exportar"
              className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-3 shadow-xs"
            >
              <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-7 h-7" />
              </div>
              <p className="text-lg font-bold text-slate-800">
                No existen denuncias varias para exportar.
              </p>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                Una vez que los estudiantes registren denuncias en el Módulo 2, podrá visualizarlas y descargarlas aquí.
              </p>
            </div>
          ) : (
            /* TABLA DE VISUALIZACIÓN PREVIA DE DENUNCIAS VARIAS */
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm border-collapse" id="tabla-preview-denuncias-varias">
                  <thead>
                    <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-3.5 whitespace-nowrap">#</th>
                      <th className="py-3 px-3.5 whitespace-nowrap">FECHA</th>
                      <th className="py-3 px-3.5 whitespace-nowrap">DOCENTE</th>
                      <th className="py-3 px-3.5 whitespace-nowrap">MATERIA</th>
                      <th className="py-3 px-3.5 whitespace-nowrap">SIGLA</th>
                      <th className="py-3 px-3.5 whitespace-nowrap">GRUPO</th>
                      <th className="py-3 px-3.5 whitespace-nowrap">DÍA</th>
                      <th className="py-3 px-3.5 whitespace-nowrap">HORARIO</th>
                      <th className="py-3 px-3.5 whitespace-nowrap">AULA</th>
                      <th className="py-3 px-3.5 whitespace-nowrap">TIPO DE DENUNCIA</th>
                      <th className="py-3 px-3.5 min-w-[280px]">COMENTARIO O DESCRIPCIÓN</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-800">
                    {denunciasVarias.map((den, idx) => {
                      const docenteVal = den.docente || den.docenteDenunciado;
                      return (
                        <tr key={den.id || idx} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-3.5 font-mono text-slate-400 font-bold">
                            {idx + 1}
                          </td>
                          <td className="py-3 px-3.5 whitespace-nowrap text-slate-600 font-medium">
                            {den.fechaRegistro}
                          </td>
                          <td className="py-3 px-3.5 font-bold text-slate-900 whitespace-nowrap">
                            {docenteVal ? (
                              docenteVal
                            ) : (
                              <span className="text-slate-400 font-medium italic">No especificado</span>
                            )}
                          </td>
                          <td className="py-3 px-3.5 font-semibold text-slate-800 whitespace-nowrap">
                            {den.nombreMateria || <span className="text-slate-400 font-medium italic">No especificado</span>}
                          </td>
                          <td className="py-3 px-3.5 font-mono font-bold text-blue-900 whitespace-nowrap">
                            {den.sigla || <span className="text-slate-400 font-normal italic">No especificado</span>}
                          </td>
                          <td className="py-3 px-3.5 font-bold text-slate-800 whitespace-nowrap">
                            {den.grupo || <span className="text-slate-400 font-normal italic">No especificado</span>}
                          </td>
                          <td className="py-3 px-3.5 text-slate-600 whitespace-nowrap">
                            {den.dia || <span className="text-slate-400 font-normal italic">No especificado</span>}
                          </td>
                          <td className="py-3 px-3.5 text-slate-600 whitespace-nowrap font-mono text-xs">
                            {den.horario || <span className="text-slate-400 font-normal italic">No especificado</span>}
                          </td>
                          <td className="py-3 px-3.5 text-slate-700 whitespace-nowrap">
                            {den.aula || <span className="text-slate-400 font-normal italic">No especificado</span>}
                          </td>
                          <td className="py-3 px-3.5 font-bold text-blue-950 whitespace-nowrap">
                            <span className="bg-blue-100 text-blue-950 px-2.5 py-1 rounded-md text-xs font-bold">
                              {den.tipoDenuncia}
                            </span>
                          </td>
                          <td className="py-3 px-3.5 text-xs text-slate-700 leading-relaxed">
                            {den.comentario ? den.comentario : <span className="text-slate-400 italic">Sin descripción adicional</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
};
