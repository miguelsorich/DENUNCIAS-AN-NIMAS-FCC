/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
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
import { supabase } from './lib/supabase';
import {
  checkSupabaseConnection,
  fetchMaestroOfertaSupabase,
  saveMaestroOfertaSupabase,
  fetchReportesInasistenciaSupabase,
  insertReporteInasistenciaSupabase,
  fetchDenunciasVariasSupabase,
  insertDenunciaVariasSupabase,
  SupabaseStatus,
} from './services/supabaseService';

const STORAGE_KEY_MAESTRO = 'maestro_oferta_vigente_admin';
const STORAGE_KEY_INASISTENCIAS = 'reportes_inasistencia_docente';
const STORAGE_KEY_DENUNCIAS_VARIAS = 'denuncias_varias_registradas';

export default function App() {
  const [moduloActivo, setModuloActivo] = useState<ModuloActivo>('inasistencia');
  const [supabaseStatus, setSupabaseStatus] = useState<SupabaseStatus | null>(null);

  // 1. Maestro de Oferta Vigente (Limpio para que el administrador suba el archivo real)
  const [maestroVigente, setMaestroVigente] = useState<MaestroOfertaVigente | null>(() => {
    try {
      const guardado = localStorage.getItem(STORAGE_KEY_MAESTRO);
      if (guardado) {
        const parsed = JSON.parse(guardado);
        if (parsed && Array.isArray(parsed.registros) && parsed.registros.length > 0) {
          return {
            semestre: parsed.semestre || 'Semestre II / 2026',
            fechaImportacion: parsed.fechaImportacion || 'Importado por Administrador',
            nombreArchivo: parsed.nombreArchivo || 'maestro_oferta.xlsx',
            totalRegistros: parsed.registros.length,
            registros: parsed.registros,
          };
        }
      }
    } catch (e) {
      console.warn('Error al leer maestro de localStorage:', e);
    }
    return null;
  });

  // 2. Reportes de Inasistencia Docente (Módulo 1) - Limpio sin denuncias de práctica
  const [reportesInasistencia, setReportesInasistencia] = useState<ReporteInasistencia[]>(() => {
    try {
      const guardado = localStorage.getItem(STORAGE_KEY_INASISTENCIAS);
      if (guardado) {
        const parsed = JSON.parse(guardado);
        if (Array.isArray(parsed)) {
          // Filtrar cualquier dato de prueba anterior
          const limpios = parsed.filter(item => !item.id.startsWith('rep-seed-'));
          return limpios;
        }
      }
    } catch {
      // Ignorar errores
    }
    return [];
  });

  // 3. Denuncias Varias (Módulo 2) - Limpio sin denuncias de práctica
  const [denunciasVarias, setDenunciasVarias] = useState<DenunciaVarias[]>(() => {
    try {
      const guardado = localStorage.getItem(STORAGE_KEY_DENUNCIAS_VARIAS);
      if (guardado) {
        const parsed = JSON.parse(guardado);
        if (Array.isArray(parsed)) {
          // Filtrar cualquier dato de prueba anterior
          const limpios = parsed.filter(item => !item.id.startsWith('den-seed-'));
          return limpios;
        }
      }
    } catch {
      // Ignorar errores
    }
    return [];
  });

  // Sincronización Inicial con Supabase
  const sincronizarConSupabase = useCallback(async () => {
    const status = await checkSupabaseConnection();
    setSupabaseStatus(status);

    // 1. Sincronizar Maestro de Oferta
    const maestroSupa = await fetchMaestroOfertaSupabase();
    if (maestroSupa && maestroSupa.registros.length > 0) {
      setMaestroVigente(maestroSupa);
      try {
        localStorage.setItem(STORAGE_KEY_MAESTRO, JSON.stringify(maestroSupa));
      } catch {
        // Ignorar
      }
    }

    // 2. Sincronizar Inasistencias
    const inasistenciasSupa = await fetchReportesInasistenciaSupabase();
    if (inasistenciasSupa && inasistenciasSupa.length > 0) {
      const filtradas = inasistenciasSupa.filter(item => !item.id.startsWith('rep-seed-'));
      setReportesInasistencia(filtradas);
      try {
        localStorage.setItem(STORAGE_KEY_INASISTENCIAS, JSON.stringify(filtradas));
      } catch {
        // Ignorar
      }
    }

    // 3. Sincronizar Denuncias Varias
    const denunciasSupa = await fetchDenunciasVariasSupabase();
    if (denunciasSupa && denunciasSupa.length > 0) {
      const filtradas = denunciasSupa.filter(item => !item.id.startsWith('den-seed-'));
      setDenunciasVarias(filtradas);
      try {
        localStorage.setItem(STORAGE_KEY_DENUNCIAS_VARIAS, JSON.stringify(filtradas));
      } catch {
        // Ignorar
      }
    }
  }, []);

  useEffect(() => {
    sincronizarConSupabase();

    // Suscripción Realtime a cambios en Supabase
    const channelInasistencias = supabase
      .channel('realtime_inasistencias')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'reportes_inasistencia' },
        (payload) => {
          const nuevo: ReporteInasistencia = {
            id: payload.new.id,
            claseId: payload.new.clase_id || payload.new.id,
            sigla: payload.new.sigla || '',
            grupo: payload.new.grupo || '',
            nombreMateria: payload.new.nombre_materia || '',
            docente: payload.new.docente || '',
            dia: payload.new.dia || '',
            horario: payload.new.horario || '',
            aula: payload.new.aula || '',
            inasistenciaMarcada: payload.new.inasistencia_marcada ?? true,
            comentario: payload.new.comentario || '',
            fechaReporte: payload.new.fecha_reporte || new Date().toLocaleDateString(),
            esAnonimo: payload.new.es_anonimo ?? true,
          };

          setReportesInasistencia((prev) => {
            if (prev.some((item) => item.id === nuevo.id)) return prev;
            const updated = [nuevo, ...prev];
            try {
              localStorage.setItem(STORAGE_KEY_INASISTENCIAS, JSON.stringify(updated));
            } catch {}
            return updated;
          });
        }
      )
      .subscribe();

    const channelDenuncias = supabase
      .channel('realtime_denuncias')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'denuncias_varias' },
        (payload) => {
          const nueva: DenunciaVarias = {
            id: payload.new.id,
            claseId: payload.new.clase_id,
            docente: payload.new.docente,
            nombreMateria: payload.new.nombre_materia,
            sigla: payload.new.sigla,
            grupo: payload.new.grupo,
            dia: payload.new.dia,
            horario: payload.new.horario,
            aula: payload.new.aula,
            docenteDenunciado: payload.new.docente_denunciado || payload.new.docente,
            tipoDenuncia: payload.new.tipo_denuncia || 'Otros',
            comentario: payload.new.comentario || '',
            fechaRegistro: payload.new.fecha_registro || new Date().toLocaleDateString(),
            esAnonimo: payload.new.es_anonimo ?? true,
          };

          setDenunciasVarias((prev) => {
            if (prev.some((item) => item.id === nueva.id)) return prev;
            const updated = [nueva, ...prev];
            try {
              localStorage.setItem(STORAGE_KEY_DENUNCIAS_VARIAS, JSON.stringify(updated));
            } catch {}
            return updated;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channelInasistencias);
      supabase.removeChannel(channelDenuncias);
    };
  }, [sincronizarConSupabase]);

  const handleGuardarMaestro = (nuevoMaestro: MaestroOfertaVigente) => {
    setMaestroVigente(nuevoMaestro);
    try {
      localStorage.setItem(STORAGE_KEY_MAESTRO, JSON.stringify(nuevoMaestro));
    } catch {
      // Ignorar errores
    }
    // Guardar en Supabase
    saveMaestroOfertaSupabase(nuevoMaestro);
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
    // Guardar en Supabase
    insertReporteInasistenciaSupabase(nuevoReporte);
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
    // Guardar en Supabase
    insertDenunciaVariasSupabase(nuevaDenuncia);
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
            onIrAAdmin={() => setModuloActivo('admin')}
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
            <span>Voz Anónima — Habla con confianza</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

