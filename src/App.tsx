/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { MaestroOfertaVigente, ReporteInasistencia, DenunciaVarias } from './types';
import { Header, PortalActivo } from './components/Header';
import { PortalEstudiante, SubmoduloEstudiante } from './components/PortalEstudiante';
import { AdminPanel } from './components/AdminPanel';
import { AdminLogin } from './components/AdminLogin';
import { 
  REPORTES_INASISTENCIA_INICIALES, 
  DENUNCIAS_VARIAS_INICIALES 
} from './data/denunciasSeed';
import { Shield, GraduationCap, Layers, Lock, ShieldAlert } from 'lucide-react';
import { supabase } from './lib/supabase';
import {
  checkSupabaseConnection,
  fetchMaestroOfertaSupabase,
  saveMaestroOfertaSupabase,
  fetchReportesInasistenciaSupabase,
  insertReporteInasistenciaSupabase,
  deleteReporteInasistenciaSupabase,
  fetchDenunciasVariasSupabase,
  insertDenunciaVariasSupabase,
  deleteDenunciaVariasSupabase,
  SupabaseStatus,
} from './services/supabaseService';

const STORAGE_KEY_MAESTRO = 'maestro_oferta_vigente_admin';
const STORAGE_KEY_INASISTENCIAS = 'reportes_inasistencia_docente';
const STORAGE_KEY_DENUNCIAS_VARIAS = 'denuncias_varias_registradas';
const STORAGE_KEY_ADMIN_AUTH = 'voz_anonima_admin_autenticado';

export default function App() {
  // Estado de navegación entre Portales: 'estudiante' o 'admin'
  const [portalActivo, setPortalActivo] = useState<PortalActivo>('estudiante');
  const [submoduloEstudiante, setSubmoduloEstudiante] = useState<SubmoduloEstudiante>('inasistencia');
  
  // Estado de autenticación del administrador
  const [isAdminAutenticado, setIsAdminAutenticado] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY_ADMIN_AUTH) === 'true';
    } catch {
      return false;
    }
  });

  const [supabaseStatus, setSupabaseStatus] = useState<SupabaseStatus | null>(null);

  // Atajos de teclado y detección de URL hash (#admin) para acceso administrativo discreto
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Atajo seguro: Ctrl + Shift + A o Alt + A abre/conmuta el panel administrativo
      if ((e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') || (e.altKey && e.key.toLowerCase() === 'a')) {
        e.preventDefault();
        setPortalActivo((prev) => (prev === 'admin' ? 'estudiante' : 'admin'));
      }
    };

    const handleHashCheck = () => {
      if (window.location.hash === '#admin' || window.location.hash === '#administrador' || window.location.hash === '#gestion') {
        setPortalActivo('admin');
      }
    };

    handleHashCheck();
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('hashchange', handleHashCheck);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('hashchange', handleHashCheck);
    };
  }, []);

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
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'reportes_inasistencia' },
        (payload) => {
          setReportesInasistencia((prev) => {
            const updated = prev.filter((item) => item.id !== payload.old.id);
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
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'denuncias_varias' },
        (payload) => {
          setDenunciasVarias((prev) => {
            const updated = prev.filter((item) => item.id !== payload.old.id);
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

  // Manejadores de Autenticación de Administrador
  const handleLoginAdminExitoso = () => {
    setIsAdminAutenticado(true);
    try {
      sessionStorage.setItem(STORAGE_KEY_ADMIN_AUTH, 'true');
    } catch {}
  };

  const handleCerrarSesionAdmin = () => {
    setIsAdminAutenticado(false);
    try {
      sessionStorage.removeItem(STORAGE_KEY_ADMIN_AUTH);
    } catch {}
    setPortalActivo('estudiante');
  };

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

  const handleEliminarInasistencia = async (id: string) => {
    setReportesInasistencia((prev) => {
      const actualizados = prev.filter((r) => r.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY_INASISTENCIAS, JSON.stringify(actualizados));
      } catch {}
      return actualizados;
    });
    await deleteReporteInasistenciaSupabase(id);
  };

  const handleEliminarDenunciaVarias = async (id: string) => {
    setDenunciasVarias((prev) => {
      const actualizados = prev.filter((d) => d.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY_DENUNCIAS_VARIAS, JSON.stringify(actualizados));
      } catch {}
      return actualizados;
    });
    await deleteDenunciaVariasSupabase(id);
  };

  const handleLimpiarTodasInasistencias = async () => {
    const ids = reportesInasistencia.map(r => r.id);
    setReportesInasistencia([]);
    try {
      localStorage.removeItem(STORAGE_KEY_INASISTENCIAS);
    } catch {}
    for (const id of ids) {
      await deleteReporteInasistenciaSupabase(id);
    }
  };

  const handleLimpiarTodasDenunciasVarias = async () => {
    const ids = denunciasVarias.map(d => d.id);
    setDenunciasVarias([]);
    try {
      localStorage.removeItem(STORAGE_KEY_DENUNCIAS_VARIAS);
    } catch {}
    for (const id of ids) {
      await deleteDenunciaVariasSupabase(id);
    }
  };

  const totalDenunciasTotales = reportesInasistencia.length + denunciasVarias.length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 antialiased selection:bg-blue-900 selection:text-white">
      {/* Encabezado Principal Limpio enfocado a Estudiantes (con acceso discreto para autoridades) */}
      <Header 
        portalActivo={portalActivo} 
        onCambiarPortal={setPortalActivo}
        isAdminAutenticado={isAdminAutenticado}
        onCerrarSesionAdmin={handleCerrarSesionAdmin}
        totalDenuncias={totalDenunciasTotales}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        
        {/* PORTAL DE ESTUDIANTES (Vista pública por defecto para realizar denuncias) */}
        {portalActivo === 'estudiante' && (
          <PortalEstudiante
            submoduloActivo={submoduloEstudiante}
            onCambiarSubmodulo={setSubmoduloEstudiante}
            maestroVigente={maestroVigente}
            onRegistrarReporteInasistencia={handleRegistrarReporteInasistencia}
            onRegistrarDenunciaVarias={handleRegistrarDenunciaVarias}
          />
        )}

        {/* PORTAL DE ADMINISTRADOR (Acceso protegido por contraseña o sesión) */}
        {portalActivo === 'admin' && (
          isAdminAutenticado ? (
            <AdminPanel
              maestroVigente={maestroVigente}
              onGuardarMaestro={handleGuardarMaestro}
              reportesInasistencia={reportesInasistencia}
              denunciasVarias={denunciasVarias}
              onEliminarInasistencia={handleEliminarInasistencia}
              onEliminarDenunciaVarias={handleEliminarDenunciaVarias}
              onLimpiarTodasInasistencias={handleLimpiarTodasInasistencias}
              onLimpiarTodasDenunciasVarias={handleLimpiarTodasDenunciasVarias}
              onVolverEstudiante={() => setPortalActivo('estudiante')}
            />
          ) : (
            <AdminLogin
              onLoginExitoso={handleLoginAdminExitoso}
              onVolverEstudiante={() => setPortalActivo('estudiante')}
            />
          )
        )}
      </main>

      {/* Pie de Página Institucional con Acceso Administrativo Discreto */}
      <footer className="bg-white border-t border-slate-200/90 py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-blue-900 shrink-0" />
            <span>Facultad de Ciencias Contables, Auditoría, Sistemas de Control y Finanzas — UAGRM</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Voz Anónima</span>
              <span>•</span>
              <span>Garantía de Confidencialidad</span>
            </div>

            {/* Acceso discreto para autoridades facultativas */}
            <button
              type="button"
              onClick={() => setPortalActivo(portalActivo === 'admin' ? 'estudiante' : 'admin')}
              className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer flex items-center gap-1 opacity-70 hover:opacity-100"
              title="Acceso Facultativo"
            >
              <Lock className="w-3 h-3" />
              <span className="text-[11px]">Acceso Facultativo</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
