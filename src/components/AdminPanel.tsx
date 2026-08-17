import React, { useState } from 'react';
import { MaestroOfertaVigente, ReporteInasistencia, DenunciaVarias } from '../types';
import { 
  Shield, 
  FileSpreadsheet, 
  ShieldCheck, 
  UploadCloud, 
  Layers, 
  BookOpen, 
  GraduationCap, 
  Database,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { AdminRevisionDenuncias } from './AdminRevisionDenuncias';
import { AdminReportesExportacion } from './AdminReportesExportacion';
import { AdminImportarMaestro } from './AdminImportarMaestro';

interface AdminPanelProps {
  maestroVigente: MaestroOfertaVigente | null;
  onGuardarMaestro: (nuevoMaestro: MaestroOfertaVigente) => void;
  reportesInasistencia: ReporteInasistencia[];
  denunciasVarias: DenunciaVarias[];
  onVolverEstudiante?: () => void;
}

export type SeccionAdmin = 'revision-denuncias' | 'reportes-exportacion' | 'importar-maestro';

export const AdminPanel: React.FC<AdminPanelProps> = ({
  maestroVigente,
  onGuardarMaestro,
  reportesInasistencia,
  denunciasVarias,
  onVolverEstudiante,
}) => {
  const [seccionAdmin, setSeccionAdmin] = useState<SeccionAdmin>('revision-denuncias');

  const totalInasistencias = reportesInasistencia.length;
  const totalDenunciasVarias = denunciasVarias.length;
  const totalClasesMaestro = maestroVigente?.registros?.length || 0;

  return (
    <div className="space-y-6">
      {/* Banner Superior del Portal de Administración */}
      <section className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-7 text-white shadow-md border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold uppercase tracking-wider">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                Portal de Administración Facultativa
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold">
                <UserCheck className="w-3 h-3 text-emerald-400" />
                Sesión Autorizada
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Control Académico y Seguimiento Docente
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Supervisión de reportes estudiantiles en tiempo real, emisión de informes oficiales y gestión del Maestro de Oferta.
            </p>
          </div>

          {/* Métricas rápidas */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="bg-white/10 backdrop-blur-xs px-3.5 py-2 rounded-2xl border border-white/10 text-center">
              <span className="block text-lg font-black text-white">{totalInasistencias}</span>
              <span className="text-[11px] font-bold text-slate-300">Inasistencias</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs px-3.5 py-2 rounded-2xl border border-white/10 text-center">
              <span className="block text-lg font-black text-white">{totalDenunciasVarias}</span>
              <span className="text-[11px] font-bold text-slate-300">Denuncias Varias</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs px-3.5 py-2 rounded-2xl border border-white/10 text-center">
              <span className="block text-lg font-black text-amber-400">{totalClasesMaestro}</span>
              <span className="text-[11px] font-bold text-slate-300">Clases Maestro</span>
            </div>
          </div>
        </div>
      </section>

      {/* Barra de pestañas internas del Administrador */}
      <div className="bg-white rounded-2xl p-2 sm:p-2.5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 w-full md:w-auto">
          {/* Pestaña 1: Revisión de Denuncias */}
          <button
            type="button"
            id="tab-admin-revision-denuncias"
            onClick={() => setSeccionAdmin('revision-denuncias')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              seccionAdmin === 'revision-denuncias'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Revisión de Denuncias</span>
            <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
              seccionAdmin === 'revision-denuncias' ? 'bg-blue-800 text-white' : 'bg-blue-100 text-blue-950'
            }`}>
              {totalInasistencias + totalDenunciasVarias}
            </span>
          </button>

          {/* Pestaña 2: Reportes y Exportación */}
          <button
            type="button"
            id="tab-admin-reportes-exportacion"
            onClick={() => setSeccionAdmin('reportes-exportacion')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              seccionAdmin === 'reportes-exportacion'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Reportes y Exportación</span>
          </button>

          {/* Pestaña 3: Importar Maestro de Oferta */}
          <button
            type="button"
            id="tab-admin-importar-maestro"
            onClick={() => setSeccionAdmin('importar-maestro')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              seccionAdmin === 'importar-maestro'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Importar Maestro de Oferta</span>
            {totalClasesMaestro === 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500" title="Pendiente de carga" />
            )}
          </button>
        </div>

        {onVolverEstudiante && (
          <button
            type="button"
            onClick={onVolverEstudiante}
            className="text-xs font-bold text-slate-600 hover:text-blue-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-1.5 self-end md:self-auto"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Ver Portal Estudiantes</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
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
