import * as XLSX from 'xlsx';
import { ReporteInasistencia, DenunciaVarias } from '../types';

/**
 * Exporta el reporte de inasistencias docentes en formato Excel (.xlsx) o CSV (.csv)
 * Encabezados exactos:
 * FECHA | DOCENTE | MATERIA | SIGLA | GRUPO | DÍA | HORARIO | AULA | COMENTARIO
 */
export const exportarReporteInasistencias = (
  reportes: ReporteInasistencia[],
  formato: 'xlsx' | 'csv'
) => {
  if (!reportes || reportes.length === 0) return;

  const filas = reportes.map((rep) => ({
    FECHA: rep.fechaReporte || '',
    DOCENTE: rep.docente || '',
    MATERIA: rep.nombreMateria || '',
    SIGLA: rep.sigla || '',
    GRUPO: rep.grupo || '',
    'DÍA': rep.dia || '',
    HORARIO: rep.horario || '',
    AULA: rep.aula || '',
    COMENTARIO: rep.comentario ? rep.comentario.trim() : 'Sin comentario',
  }));

  const worksheet = XLSX.utils.json_to_sheet(filas);

  // Ajustar anchos de columna automáticos para mejor legibilidad
  worksheet['!cols'] = [
    { wch: 32 }, // FECHA
    { wch: 35 }, // DOCENTE
    { wch: 30 }, // MATERIA
    { wch: 10 }, // SIGLA
    { wch: 8 },  // GRUPO
    { wch: 12 }, // DÍA
    { wch: 16 }, // HORARIO
    { wch: 12 }, // AULA
    { wch: 50 }, // COMENTARIO
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Inasistencias_Docentes');

  const fechaIso = new Date().toISOString().slice(0, 10);
  const nombreArchivo = `reporte_inasistencias_docentes_${fechaIso}.${formato}`;

  if (formato === 'xlsx') {
    XLSX.writeFile(workbook, nombreArchivo, { bookType: 'xlsx' });
  } else {
    // Para CSV agregamos BOM UTF-8 para garantizar compatibilidad con tildes y caracteres especiales
    const csvContent = XLSX.utils.sheet_to_csv(worksheet, { FS: ';' });
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', nombreArchivo);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

/**
 * Exporta el reporte de denuncias varias en formato Excel (.xlsx) o CSV (.csv)
 * Encabezados exactos:
 * FECHA | DOCENTE | MATERIA | SIGLA | GRUPO | DÍA | HORARIO | AULA | TIPO DE DENUNCIA | COMENTARIO O DESCRIPCIÓN
 */
export const exportarReporteDenunciasVarias = (
  denuncias: DenunciaVarias[],
  formato: 'xlsx' | 'csv'
) => {
  if (!denuncias || denuncias.length === 0) return;

  const filas = denuncias.map((den) => {
    const docenteVal = den.docente || den.docenteDenunciado;
    
    let respuestaConsultas = 'N/A';
    if (den.respondeConsultasOportunamente === 'SI') respuestaConsultas = 'Sí, oportunamente';
    else if (den.respondeConsultasOportunamente === 'REGULAR') respuestaConsultas = 'Con retraso / Regular';
    else if (den.respondeConsultasOportunamente === 'NO') respuestaConsultas = 'No responde';

    let subeMateriales = 'N/A';
    if (den.subeMaterialesATiempo === 'SI') subeMateriales = 'Sí, a tiempo';
    else if (den.subeMaterialesATiempo === 'RETRASO') subeMateriales = 'Con retraso';
    else if (den.subeMaterialesATiempo === 'NO') subeMateriales = 'No sube';

    return {
      FECHA: den.fechaRegistro || '',
      MODALIDAD: den.modalidad === 'virtual' ? 'VIRTUAL' : 'PRESENCIAL',
      DOCENTE: docenteVal ? docenteVal.trim() : 'No especificado',
      MATERIA: den.nombreMateria ? den.nombreMateria.trim() : 'No especificado',
      SIGLA: den.sigla ? den.sigla.trim() : 'No especificado',
      GRUPO: den.grupo ? den.grupo.trim() : 'No especificado',
      'DÍA': den.dia ? den.dia.trim() : 'No especificado',
      HORARIO: den.horario ? den.horario.trim() : 'No especificado',
      AULA: den.aula ? den.aula.trim() : 'No especificado',
      'TIPO DE DENUNCIA': den.tipoDenuncia || '',
      'RESPONDE CONSULTAS': respuestaConsultas,
      'SUBE MATERIALES A TIEMPO': subeMateriales,
      'TIENE FOTO PRUEBA': den.imagenAdjunta ? 'SÍ' : 'NO',
      'COMENTARIO O DESCRIPCIÓN': den.comentario ? den.comentario.trim() : 'Sin descripción adicional',
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(filas);

  // Ajustar anchos de columna automáticos
  worksheet['!cols'] = [
    { wch: 30 }, // FECHA
    { wch: 14 }, // MODALIDAD
    { wch: 35 }, // DOCENTE
    { wch: 35 }, // MATERIA
    { wch: 12 }, // SIGLA
    { wch: 10 }, // GRUPO
    { wch: 15 }, // DÍA
    { wch: 18 }, // HORARIO
    { wch: 14 }, // AULA
    { wch: 35 }, // TIPO DE DENUNCIA
    { wch: 24 }, // RESPONDE CONSULTAS
    { wch: 24 }, // SUBE MATERIALES A TIEMPO
    { wch: 16 }, // TIENE FOTO PRUEBA
    { wch: 60 }, // COMENTARIO O DESCRIPCIÓN
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Denuncias_Varias');

  const fechaIso = new Date().toISOString().slice(0, 10);
  const nombreArchivo = `reporte_denuncias_varias_${fechaIso}.${formato}`;

  if (formato === 'xlsx') {
    XLSX.writeFile(workbook, nombreArchivo, { bookType: 'xlsx' });
  } else {
    const csvContent = XLSX.utils.sheet_to_csv(worksheet, { FS: ';' });
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', nombreArchivo);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
