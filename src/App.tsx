/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MaestroOfertaVigente, ReporteInasistencia, DenunciaVarias } from './types';
import { Header, ModuloActivo } from './components/Header';
import { BusquedaSeleccionClase } from './components/BusquedaSeleccionClase';
import { DenunciasVarias } from './components/DenunciasVarias';
import { AdminPanel } from './components/AdminPanel';
import { MAESTRO_DE_OFERTA } from './data/maestroOferta';
import { 
  REPORTES_INASISTENCIA_INICIALES, 
  DENUNCIAS_VARIAS_INICIALES 
} from './data/denunciasSeed';
import { Shield, GraduationCap, Layers } from 'lucide-react';

const STORAGE_KEY_MAESTRO = 'maestro_oferta_vigente_admin';
const STORAGE_KEY_INASISTENCIAS = 'reportes_inasistencia_docente';
const STORAGE_KEY_DENUNCIAS_VARIAS = 'denuncias_varias_registradas';

export default function App() {
  const [moduloActivo, setModuloActivo] = useState<ModuloActivo>('inasistencia');

  // 1. Maestro de Oferta Vigente
  const [maestroVigente, setMaestroVigente] = useState<MaestroOfertaVigente | null>(() => {
    try {
      const guardado = localStorage.getItem(STORAGE_KEY_MAESTRO);
      if (guardado) {
        return JSON.parse(guardado);
      }
    } catch {
      // Ignorar errores de localStorage
    }

    return {
      semestre: 'Semestre II / 2026',
      fechaImportacion: 'Inicio de Semestre',
      nombreArchivo: 'maestro_oferta_semestre_vigente.xlsx',
      totalRegistros: MAESTRO_DE_OFERTA.length,
      registros: MAESTRO_DE_OFERTA,
    };
  });

  // 2. Reportes de Inasistencia Docente (Módulo 1)
  const [reportesInasistencia, setReportesInasistencia] = useState<ReporteInasistencia[]>(() => {
    try {
      const guardado = localStorage.getItem(STORAGE_KEY_INASISTENCIAS);
      if (guardado) {
        const parsed = JSON.parse(guardado);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignorar errores
    }
    return REPORTES_INASISTENCIA_INICIALES;
  });

  // 3. Denuncias Varias (Módulo 2)
  const [denunciasVarias, setDenunciasVarias] = useState<DenunciaVarias[]>(() => {
    try {
      const guardado = localStorage.getItem(STORAGE_KEY_DENUNCIAS_VARIAS);
      if (guardado) {
        const parsed = JSON.parse(guardado);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignorar errores
    }
    return DENUNCIAS_VARIAS_INICIALES;
  });

  const handleGuardarMaestro = (nuevoMaestro: MaestroOfertaVigente) => {
    setMaestroVigente(nuevoMaestro);
    try {
      localStorage.setItem(STORAGE_KEY_MAESTRO, JSON.stringify(nuevoMaestro));
    } catch {
      // Ignorar errores
    }
  };

  const handleRegistrarReporteInasistencia = (nuevoReporte: ReporteInasistencia) => {
    setReportesInasistencia((prev) => {
      const actualizados = [nuevoReporte, ...prev];
      try {
        localStorage.setItem(STORAGE_KEY_INASISTENCIAS, JSON.stringify(actualizados));
      } catch {
        // Ignorar errores
      }
      return actualizados;
    });
  };

  const handleRegistrarDenunciaVarias = (nuevaDenuncia: DenunciaVarias) => {
    setDenunciasVarias((prev) => {
      const actualizados = [nuevaDenuncia, ...prev];
      try {
        localStorage.setItem(STORAGE_KEY_DENUNCIAS_VARIAS, JSON.stringify(actualizados));
      } catch {
        // Ignorar errores
      }
      return actualizados;
    });
  };

  const totalDenunciasTotales = reportesInasistencia.length + denunciasVarias.length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 antialiased">
      <Header 
        moduloActivo={moduloActivo} 
        onCambiarModulo={setModuloActivo}
        totalDenuncias={totalDenunciasTotales}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {moduloActivo === 'inasistencia' && (
          <BusquedaSeleccionClase 
            maestroVigente={maestroVigente} 
            onRegistrarReporte={handleRegistrarReporteInasistencia}
          />
        )}

        {moduloActivo === 'denuncias-varias' && (
          <DenunciasVarias 
            maestroVigente={maestroVigente}
            onRegistrarDenuncia={handleRegistrarDenunciaVarias}
          />
        )}

        {moduloActivo === 'admin' && (
          <AdminPanel
            maestroVigente={maestroVigente}
            onGuardarMaestro={handleGuardarMaestro}
            reportesInasistencia={reportesInasistencia}
            denunciasVarias={denunciasVarias}
          />
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 text-center sm:text-left">
          <div className="flex items-center gap-2">
            {moduloActivo === 'inasistencia' && (
              <>
                <GraduationCap className="w-4 h-4 text-blue-700 shrink-0" />
                <span>Módulo 1: Reporte de Inasistencia Docente</span>
              </>
            )}
            {moduloActivo === 'denuncias-varias' && (
              <>
                <Layers className="w-4 h-4 text-blue-700 shrink-0" />
                <span>Módulo 2: Denuncias Varias (Anónimas)</span>
              </>
            )}
            {moduloActivo === 'admin' && (
              <>
                <Shield className="w-4 h-4 text-blue-700 shrink-0" />
                <span>Panel del Administrador: Revisión de Denuncias y Reportes</span>
              </>
            )}
          </div>
          <div>
            <span>Sistema Institucional de Gestión y Denuncias de la Facultad</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
