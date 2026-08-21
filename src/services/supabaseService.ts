import { supabase } from '../lib/supabase';
import { MaestroOfertaVigente, ReporteInasistencia, DenunciaVarias, OfertaClase } from '../types';

export interface SupabaseStatus {
  isConnected: boolean;
  isChecking: boolean;
  lastChecked: string | null;
  error: string | null;
  tablesFound: {
    reportes_inasistencia: boolean;
    denuncias_varias: boolean;
    maestro_oferta: boolean;
  };
}

// ----------------------------------------------------
// 1. Probar Conexión con Supabase
// ----------------------------------------------------
export async function checkSupabaseConnection(): Promise<SupabaseStatus> {
  const result: SupabaseStatus = {
    isConnected: false,
    isChecking: false,
    lastChecked: new Date().toLocaleTimeString(),
    error: null,
    tablesFound: {
      reportes_inasistencia: false,
      denuncias_varias: false,
      maestro_oferta: false,
    },
  };

  try {
    // 1. Probar tabla reportes_inasistencia
    const { error: errInasistencias } = await supabase
      .from('reportes_inasistencia')
      .select('id')
      .limit(1);

    if (!errInasistencias) {
      result.tablesFound.reportes_inasistencia = true;
    } else if (errInasistencias.code === '42P01') {
      // Table does not exist in postgres
      result.tablesFound.reportes_inasistencia = false;
    }

    // 2. Probar tabla denuncias_varias
    const { error: errDenuncias } = await supabase
      .from('denuncias_varias')
      .select('id')
      .limit(1);

    if (!errDenuncias) {
      result.tablesFound.denuncias_varias = true;
    } else if (errDenuncias.code === '42P01') {
      result.tablesFound.denuncias_varias = false;
    }

    // 3. Probar tabla maestro_oferta
    const { error: errMaestro } = await supabase
      .from('maestro_oferta')
      .select('id')
      .limit(1);

    if (!errMaestro) {
      result.tablesFound.maestro_oferta = true;
    } else if (errMaestro.code === '42P01') {
      result.tablesFound.maestro_oferta = false;
    }

    // Si al menos una tabla responde o no hay error de red/credenciales
    if (
      result.tablesFound.reportes_inasistencia ||
      result.tablesFound.denuncias_varias ||
      result.tablesFound.maestro_oferta
    ) {
      result.isConnected = true;
    } else if (!errInasistencias || !errDenuncias || !errMaestro) {
      result.isConnected = true;
    } else {
      result.isConnected = false;
      result.error = errInasistencias?.message || errDenuncias?.message || 'Tablas no encontradas o sin permisos';
    }
  } catch (err: any) {
    result.isConnected = false;
    result.error = err?.message || 'Error de conexión de red con Supabase';
  }

  return result;
}

// ----------------------------------------------------
// 2. Maestro de Oferta (Sync con Supabase)
// ----------------------------------------------------
export async function fetchMaestroOfertaSupabase(): Promise<MaestroOfertaVigente | null> {
  try {
    const { data, error } = await supabase
      .from('maestro_oferta')
      .select('*')
      .eq('id', 'vigente')
      .single();

    if (error || !data) {
      return null;
    }

    let registros: OfertaClase[] = [];
    if (Array.isArray(data.registros)) {
      registros = data.registros;
    } else if (typeof data.registros === 'string') {
      try {
        registros = JSON.parse(data.registros);
      } catch {
        registros = [];
      }
    }

    return {
      semestre: data.semestre || 'Semestre II / 2026',
      fechaImportacion: data.fecha_importacion || 'Importado desde Supabase',
      nombreArchivo: data.nombre_archivo || 'maestro_oferta_vigente.xlsx',
      totalRegistros: data.total_registros || registros.length,
      registros: registros,
    };
  } catch (e) {
    console.warn('Error al obtener maestro de oferta de Supabase:', e);
    return null;
  }
}

export async function saveMaestroOfertaSupabase(maestro: MaestroOfertaVigente): Promise<boolean> {
  try {
    const payload = {
      id: 'vigente',
      semestre: maestro.semestre,
      fecha_importacion: maestro.fechaImportacion,
      nombre_archivo: maestro.nombreArchivo,
      total_registros: maestro.totalRegistros,
      registros: maestro.registros,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('maestro_oferta')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.warn('Error al guardar maestro en Supabase:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('Excepción al guardar maestro en Supabase:', e);
    return false;
  }
}

// ----------------------------------------------------
// 3. Reportes de Inasistencia Docente (Sync con Supabase)
// ----------------------------------------------------
export async function fetchReportesInasistenciaSupabase(): Promise<ReporteInasistencia[] | null> {
  try {
    const { data, error } = await supabase
      .from('reportes_inasistencia')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      return null;
    }

    return data.map((item: any) => ({
      id: item.id,
      claseId: item.clase_id || item.claseId || item.id,
      sigla: item.sigla || '',
      grupo: item.grupo || '',
      nombreMateria: item.nombre_materia || item.nombreMateria || '',
      docente: item.docente || '',
      dia: item.dia || '',
      horario: item.horario || '',
      aula: item.aula || '',
      inasistenciaMarcada: item.inasistencia_marcada ?? item.inasistenciaMarcada ?? true,
      comentario: item.comentario || '',
      imagenAdjunta: item.imagen_adjunta || item.imagenAdjunta || undefined,
      imagenNombre: item.imagen_nombre || item.imagenNombre || undefined,
      fechaReporte: item.fecha_reporte || item.fechaReporte || new Date(item.created_at).toLocaleDateString(),
      esAnonimo: item.es_anonimo ?? item.esAnonimo ?? true,
    }));
  } catch (e) {
    console.warn('Error al cargar reportes de inasistencia de Supabase:', e);
    return null;
  }
}

export async function insertReporteInasistenciaSupabase(reporte: ReporteInasistencia): Promise<boolean> {
  try {
    const payload: any = {
      id: reporte.id,
      clase_id: reporte.claseId,
      sigla: reporte.sigla,
      grupo: reporte.grupo,
      nombre_materia: reporte.nombreMateria,
      docente: reporte.docente,
      dia: reporte.dia,
      horario: reporte.horario,
      aula: reporte.aula,
      inasistencia_marcada: reporte.inasistenciaMarcada,
      comentario: reporte.comentario || '',
      fecha_reporte: reporte.fechaReporte,
      es_anonimo: reporte.esAnonimo,
    };

    if (reporte.imagenAdjunta) {
      payload.imagen_adjunta = reporte.imagenAdjunta;
      payload.imagen_nombre = reporte.imagenNombre || 'evidencia.jpg';
    }

    const { error } = await supabase
      .from('reportes_inasistencia')
      .insert([payload]);

    if (error) {
      console.warn('Error al insertar reporte de inasistencia en Supabase:', error.message);
      // Si falla por columnas adicionales no existentes en supabase, intentar sin campos opcionales
      if (error.message?.includes('column') || error.code === '42703') {
        const { imagen_adjunta, imagen_nombre, ...safePayload } = payload;
        const { error: fallbackError } = await supabase
          .from('reportes_inasistencia')
          .insert([safePayload]);
        return !fallbackError;
      }
      return false;
    }
    return true;
  } catch (e) {
    console.warn('Excepción al insertar reporte de inasistencia en Supabase:', e);
    return false;
  }
}

// ----------------------------------------------------
// 4. Denuncias Varias (Sync con Supabase)
// ----------------------------------------------------
export async function fetchDenunciasVariasSupabase(): Promise<DenunciaVarias[] | null> {
  try {
    const { data, error } = await supabase
      .from('denuncias_varias')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      return null;
    }

    return data.map((item: any) => ({
      id: item.id,
      modalidad: item.modalidad || (item.tipo_denuncia?.includes('Virtual') || item.tipo_denuncia?.includes('plataforma') ? 'virtual' : 'presencial'),
      claseId: item.clase_id || item.claseId,
      docente: item.docente || '',
      nombreMateria: item.nombre_materia || item.nombreMateria || '',
      sigla: item.sigla || '',
      grupo: item.grupo || '',
      dia: item.dia || '',
      horario: item.horario || '',
      aula: item.aula || '',
      docenteDenunciado: item.docente_denunciado || item.docenteDenunciado || item.docente,
      tipoDenuncia: item.tipo_denuncia || item.tipoDenuncia || 'Otros',
      respondeConsultasOportunamente: item.responde_consultas || item.respondeConsultasOportunamente || undefined,
      subeMaterialesATiempo: item.sube_materiales || item.subeMaterialesATiempo || undefined,
      comentario: item.comentario || '',
      imagenAdjunta: item.imagen_adjunta || item.imagenAdjunta || undefined,
      imagenNombre: item.imagen_nombre || item.imagenNombre || undefined,
      fechaRegistro: item.fecha_registro || item.fechaRegistro || new Date(item.created_at).toLocaleDateString(),
      esAnonimo: item.es_anonimo ?? item.esAnonimo ?? true,
    }));
  } catch (e) {
    console.warn('Error al cargar denuncias varias de Supabase:', e);
    return null;
  }
}

export async function insertDenunciaVariasSupabase(denuncia: DenunciaVarias): Promise<boolean> {
  try {
    const payload: any = {
      id: denuncia.id,
      modalidad: denuncia.modalidad || 'presencial',
      clase_id: denuncia.claseId || null,
      docente: denuncia.docente || '',
      nombre_materia: denuncia.nombreMateria || '',
      sigla: denuncia.sigla || '',
      grupo: denuncia.grupo || '',
      dia: denuncia.dia || '',
      horario: denuncia.horario || '',
      aula: denuncia.aula || '',
      docente_denunciado: denuncia.docenteDenunciado || denuncia.docente || '',
      tipo_denuncia: denuncia.tipoDenuncia,
      responde_consultas: denuncia.respondeConsultasOportunamente || null,
      sube_materiales: denuncia.subeMaterialesATiempo || null,
      comentario: denuncia.comentario || '',
      fecha_registro: denuncia.fechaRegistro,
      es_anonimo: denuncia.esAnonimo,
    };

    if (denuncia.imagenAdjunta) {
      payload.imagen_adjunta = denuncia.imagenAdjunta;
      payload.imagen_nombre = denuncia.imagenNombre || 'evidencia.jpg';
    }

    const { error } = await supabase
      .from('denuncias_varias')
      .insert([payload]);

    if (error) {
      console.warn('Error al insertar denuncia varias en Supabase:', error.message);
      // Si falla por columnas adicionales no existentes en supabase, reintentar con payload base
      if (error.message?.includes('column') || error.code === '42703') {
        const safePayload = {
          id: payload.id,
          clase_id: payload.clase_id,
          docente: payload.docente,
          nombre_materia: payload.nombre_materia,
          sigla: payload.sigla,
          grupo: payload.grupo,
          dia: payload.dia,
          horario: payload.horario,
          aula: payload.aula,
          docente_denunciado: payload.docente_denunciado,
          tipo_denuncia: payload.tipo_denuncia,
          comentario: payload.comentario,
          fecha_registro: payload.fecha_registro,
          es_anonimo: payload.es_anonimo,
        };
        const { error: fallbackError } = await supabase
          .from('denuncias_varias')
          .insert([safePayload]);
        return !fallbackError;
      }
      return false;
    }
    return true;
  } catch (e) {
    console.warn('Excepción al insertar denuncia varias en Supabase:', e);
    return false;
  }
}

export async function deleteReporteInasistenciaSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('reportes_inasistencia')
      .delete()
      .eq('id', id);

    if (error) {
      console.warn('Error al eliminar reporte de inasistencia en Supabase:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('Excepción al eliminar reporte de inasistencia en Supabase:', e);
    return false;
  }
}

export async function deleteDenunciaVariasSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('denuncias_varias')
      .delete()
      .eq('id', id);

    if (error) {
      console.warn('Error al eliminar denuncia varias en Supabase:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('Excepción al eliminar denuncia varias en Supabase:', e);
    return false;
  }
}

