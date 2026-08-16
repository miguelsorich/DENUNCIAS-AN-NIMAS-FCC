import React, { useState } from 'react';
import { MaestroOfertaVigente, ReporteInasistencia, DenunciaVarias } from '../types';
import { Shield, FileSpreadsheet, ShieldCheck, UploadCloud } from 'lucide-react';
import { AdminRevisionDenuncias } from './AdminRevisionDenuncias';
import { AdminReportesExportacion } from './AdminReportesExportacion';
import { AdminImportarMaestro } from './AdminImportarMaestro';

interface AdminPanelProps {
  maestroVigente: MaestroOfertaVigente | null;
  onGuardarMaestro: (nuevoMaestro: MaestroOfertaVigente) => void;
  reportesInasistencia: ReporteInasistencia[];
  denunciasVarias: DenunciaVarias[];
}

export type SeccionAdmin = 'revision-denuncias' | 'reportes-exportacion' | 'importar-maestro';

export const AdminPanel: React.FC<AdminPanelProps> = ({
  maestroVigente,
  onGuardarMaestro,
  reportesInasistencia,
  denunciasVarias,
}) => {
  const [seccionAdmin, setSeccionAdmin] = useState<SeccionAdmin>('revision-denuncias');

  return (
    <div className="space-y-6">
      {/* Barra de navegación interna del Administrador */}
      <div className="bg-white rounded-2xl p-2 sm:p-2.5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 px-3 py-1">
          <Shield className="w-5 h-5 text-blue-900" />
          <span className="font-bold text-slate-900 text-sm sm:text-base">
            Panel de Control del Administrador
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            id="tab-admin-revision-denuncias"
            onClick={() => setSeccionAdmin('revision-denuncias')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              seccionAdmin === 'revision-denuncias'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Revisión de denuncias</span>
            <span className="ml-1 text-[11px] px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-950 font-bold">
              {reportesInasistencia.length + denunciasVarias.length}
            </span>
          </button>

          <button
            type="button"
            id="tab-admin-reportes-exportacion"
            onClick={() => setSeccionAdmin('reportes-exportacion')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              seccionAdmin === 'reportes-exportacion'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Reportes y exportación</span>
          </button>

          <button
            type="button"
            id="tab-admin-importar-maestro"
            onClick={() => setSeccionAdmin('importar-maestro')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              seccionAdmin === 'importar-maestro'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Importar Maestro de Oferta</span>
          </button>
        </div>
      </div>

      {/* Contenido de la sección seleccionada */}
      {seccionAdmin === 'revision-denuncias' && (
        <AdminRevisionDenuncias
          reportesInasistencia={reportesInasistencia}
          denunciasVarias={denunciasVarias}
        />
      )}

      {seccionAdmin === 'reportes-exportacion' && (
        <AdminReportesExportacion
          reportesInasistencia={reportesInasistencia}
          denunciasVarias={denunciasVarias}
        />
      )}

      {seccionAdmin === 'importar-maestro' && (
        <AdminImportarMaestro
          maestroVigente={maestroVigente}
          onGuardarMaestro={onGuardarMaestro}
        />
      )}
    </div>
  );
};
