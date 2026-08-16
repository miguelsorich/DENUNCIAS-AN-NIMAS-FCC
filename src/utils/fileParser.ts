import * as XLSX from 'xlsx';
import { OfertaClase, ValidacionImportacion } from '../types';

export const COLUMNAS_REQUERIDAS = [
  'SIGLA',
  'GR',
  'NOMBRE DE LA MATERIA',
  'CARRERAS',
  'DOCENTE',
  'DÍA',
  'HORARIO',
  'AULA',
] as const;

// Normalizer to compare headers safely (uppercase, strip accents, collapse spaces)
export const normalizarHeader = (header: string): string => {
  if (!header) return '';
  return header
    .toString()
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents (DÍA -> DIA)
    .replace(/[\t_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

export const mapCanonicalHeader = (headerNormalized: string): string | null => {
  if (headerNormalized === 'SIGLA') return 'SIGLA';
  if (headerNormalized === 'GR' || headerNormalized === 'GRUPO') return 'GR';
  if (
    headerNormalized === 'NOMBRE DE LA MATERIA' ||
    headerNormalized === 'NOMBRE MATERIA' ||
    headerNormalized === 'MATERIA'
  )
    return 'NOMBRE DE LA MATERIA';
  if (headerNormalized === 'CARRERAS' || headerNormalized === 'CARRERA') return 'CARRERAS';
  if (headerNormalized === 'DOCENTE' || headerNormalized === 'PROFESOR') return 'DOCENTE';
  if (headerNormalized === 'DIA' || headerNormalized === 'DÍA') return 'DÍA';
  if (headerNormalized === 'HORARIO' || headerNormalized === 'HORA') return 'HORARIO';
  if (headerNormalized === 'AULA' || headerNormalized === 'AMBIENTE') return 'AULA';

  return null;
};

export const validarExtensionArchivo = (fileName: string): boolean => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  return extension === 'xlsx' || extension === 'csv';
};

/**
 * Parses and validates tabular rows (from either .xlsx or .csv)
 */
export const validarYParsearMatrizFilas = (
  filasMatriz: (string | number | boolean | null | undefined)[][]
): ValidacionImportacion => {
  if (!filasMatriz || filasMatriz.length === 0) {
    return {
      esValido: false,
      columnasFaltantes: [...COLUMNAS_REQUERIDAS],
      columnasEncontradas: [],
      totalFilas: 0,
      errores: ['El archivo no contiene registros ni encabezados válidos.'],
    };
  }

  // Find the header row (usually row 0, but check first 5 rows in case of blank top rows)
  let headerRowIndex = -1;
  let headerIndexMap = new Map<string, number>();
  let columnasEncontradas: string[] = [];

  for (let r = 0; r < Math.min(5, filasMatriz.length); r++) {
    const row = filasMatriz[r];
    if (!row || row.length === 0) continue;

    const tempMap = new Map<string, number>();
    const tempEncontradas: string[] = [];

    row.forEach((cell, colIdx) => {
      if (cell !== undefined && cell !== null) {
        const norm = normalizarHeader(String(cell));
        const canonical = mapCanonicalHeader(norm);
        if (canonical) {
          tempMap.set(canonical, colIdx);
          if (!tempEncontradas.includes(canonical)) {
            tempEncontradas.push(canonical);
          }
        }
      }
    });

    // If we found at least 2 canonical headers in this row, treat it as the header row
    if (tempEncontradas.length >= 2) {
      headerRowIndex = r;
      headerIndexMap = tempMap;
      columnasEncontradas = tempEncontradas;
      break;
    }
  }

  if (headerRowIndex === -1) {
    // If not found in first rows, try with first non-empty row
    headerRowIndex = 0;
    const row = filasMatriz[0] || [];
    row.forEach((cell, colIdx) => {
      if (cell !== undefined && cell !== null) {
        const norm = normalizarHeader(String(cell));
        const canonical = mapCanonicalHeader(norm);
        if (canonical) {
          headerIndexMap.set(canonical, colIdx);
          if (!columnasEncontradas.includes(canonical)) {
            columnasEncontradas.push(canonical);
          }
        }
      }
    });
  }

  const columnasFaltantes = COLUMNAS_REQUERIDAS.filter((col) => !headerIndexMap.has(col));

  if (columnasFaltantes.length > 0) {
    const mensajeFaltantes = `El archivo no corresponde a la plantilla del Maestro de Oferta. Faltan las siguientes columnas: ${columnasFaltantes.join(', ')}.`;
    return {
      esValido: false,
      columnasFaltantes,
      columnasEncontradas,
      totalFilas: 0,
      errores: [mensajeFaltantes],
    };
  }

  // Extract data rows
  const registros: OfertaClase[] = [];

  for (let r = headerRowIndex + 1; r < filasMatriz.length; r++) {
    const row = filasMatriz[r];
    if (!row || row.length === 0) continue;

    // Check if entire row is empty
    const allEmpty = row.every((c) => c === undefined || c === null || String(c).trim() === '');
    if (allEmpty) continue;

    const getVal = (colKey: string): string => {
      const idx = headerIndexMap.get(colKey);
      if (idx === undefined || idx < 0 || idx >= row.length) return '';
      const cellVal = row[idx];
      if (cellVal === undefined || cellVal === null) return '';
      // Preserve exact values as string (trim whitespace around edges)
      return String(cellVal).trim();
    };

    const sigla = getVal('SIGLA');
    const grupo = getVal('GR');
    const nombreMateria = getVal('NOMBRE DE LA MATERIA');
    const carreras = getVal('CARRERAS');
    const docente = getVal('DOCENTE');
    const dia = getVal('DÍA');
    const horario = getVal('HORARIO');
    const aula = getVal('AULA');

    // Skip blank or invalid rows
    if (!sigla && !nombreMateria && !docente) {
      continue;
    }

    registros.push({
      id: `reg-${r}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
      sigla,
      grupo,
      nombreMateria,
      carreras,
      docente,
      dia,
      horario,
      aula,
    });
  }

  if (registros.length === 0) {
    return {
      esValido: false,
      columnasFaltantes: [],
      columnasEncontradas,
      totalFilas: 0,
      errores: ['El archivo contiene los encabezados pero no tiene filas de datos (registros de oferta).'],
    };
  }

  return {
    esValido: true,
    columnasFaltantes: [],
    columnasEncontradas,
    totalFilas: registros.length,
    errores: [],
    registros,
  };
};

/**
 * Validates and parses an ArrayBuffer or binary string from an Excel (.xlsx) file
 */
export const validarYParsearExcel = (data: ArrayBuffer | Uint8Array): ValidacionImportacion => {
  try {
    const workbook = XLSX.read(data, {
      type: 'array',
      cellDates: false,
      cellText: true,
    });

    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      return {
        esValido: false,
        columnasFaltantes: [...COLUMNAS_REQUERIDAS],
        columnasEncontradas: [],
        totalFilas: 0,
        errores: ['El archivo Excel no contiene hojas de cálculo.'],
      };
    }

    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    // Convert sheet to 2D array of strings/values preserving raw strings
    const rowsMatrix: (string | number | undefined)[][] = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: '',
      raw: false,
    });

    return validarYParsearMatrizFilas(rowsMatrix);
  } catch (error) {
    return {
      esValido: false,
      columnasFaltantes: [...COLUMNAS_REQUERIDAS],
      columnasEncontradas: [],
      totalFilas: 0,
      errores: [`Error al procesar el archivo Excel: ${error instanceof Error ? error.message : 'Formato no legible'}`],
    };
  }
};

/**
 * Validates and parses a CSV text file
 */
export const validarYParsearCSV = (csvContent: string): ValidacionImportacion => {
  try {
    const cleanContent = csvContent.replace(/^\uFEFF/, '').trim();
    if (!cleanContent) {
      return {
        esValido: false,
        columnasFaltantes: [...COLUMNAS_REQUERIDAS],
        columnasEncontradas: [],
        totalFilas: 0,
        errores: ['El archivo CSV seleccionado está vacío.'],
      };
    }

    // Read CSV via XLSX library for robust delimiter and quoting handling
    const workbook = XLSX.read(cleanContent, {
      type: 'string',
      raw: false,
    });

    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const rowsMatrix: (string | number | undefined)[][] = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: '',
      raw: false,
    });

    return validarYParsearMatrizFilas(rowsMatrix);
  } catch {
    // Fallback standard parsing
    const lines = csvContent.replace(/^\uFEFF/, '').trim().split(/\r?\n/);
    const rows = lines.map((l) => l.split(/[,;\t]/).map((c) => c.replace(/^"|"$/g, '').trim()));
    return validarYParsearMatrizFilas(rows);
  }
};

/**
 * Master parser for File object (.xlsx or .csv)
 */
export const procesarArchivoMaestro = async (
  file: File
): Promise<ValidacionImportacion> => {
  const fileName = file.name;
  const extension = fileName.split('.').pop()?.toLowerCase();

  if (extension !== 'xlsx' && extension !== 'csv') {
    return {
      esValido: false,
      columnasFaltantes: [...COLUMNAS_REQUERIDAS],
      columnasEncontradas: [],
      totalFilas: 0,
      errores: [
        'Formato no permitido. La aplicación solo acepta archivos Excel (.xlsx) o archivos CSV (.csv).',
      ],
    };
  }

  if (extension === 'xlsx') {
    const arrayBuffer = await file.arrayBuffer();
    return validarYParsearExcel(arrayBuffer);
  } else {
    const text = await file.text();
    return validarYParsearCSV(text);
  }
};

/**
 * Creates and downloads an official sample Excel (.xlsx) file
 */
export const descargarPlantillaExcel = (semestre: string = 'II-2026') => {
  const data = [
    [
      'SIGLA',
      'GR',
      'NOMBRE DE LA MATERIA',
      'CARRERAS',
      'DOCENTE',
      'DÍA',
      'HORARIO',
      'AULA',
    ],
    [
      'ADM100',
      'A',
      'ADMINISTRACION GENERAL',
      '105-5-109-1',
      'AZOGUE ROMERO OSCAR',
      'L-M-V',
      '19:45-21:15',
      '21318',
    ],
    [
      'INF110',
      'B',
      'INTRODUCCION A LA INFORMATICA',
      '187-3-187-4',
      'ZUNA VELASCO HERNAN',
      'M-J',
      '07:00-09:15',
      '236-4',
    ],
    [
      'MAT101',
      '1',
      'CALCULO I',
      '105-5-187-3-187-4',
      'GUTIERREZ ROJAS JUAN CARLOS',
      'L-M-V',
      '07:00-08:30',
      '21312',
    ],
    [
      'FIS100',
      'A',
      'FISICA I',
      '187-3-187-4',
      'CALDERON MAMANI RENE',
      'M-J',
      '09:15-11:30',
      'LAB-FIS',
    ],
    [
      'LIN100',
      'C',
      'INGLES TECNICO I',
      '105-5-109-1',
      'SUAREZ MONTERO ELIZABETH',
      'L-M-V',
      '11:30-13:00',
      '21314',
    ],
    [
      'INF210',
      'A',
      'PROGRAMACION I',
      '187-3-187-4',
      'FLORES FLORES WALTER',
      'M-J',
      '14:00-16:15',
      'LAB-201',
    ],
    [
      'EST101',
      '2',
      'ESTADISTICA I',
      '105-5-109-1',
      'RODRIGUEZ PAREDES MARCO',
      'L-M-V',
      '16:00-17:30',
      '21316',
    ],
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Maestro_Oferta');

  XLSX.writeFile(workbook, `plantilla_maestro_oferta_${semestre.replace(/[^a-zA-Z0-9]/g, '_')}.xlsx`);
};

/**
 * Creates and downloads an official sample CSV (.csv) file
 */
export const descargarPlantillaCSV = (semestre: string = 'II-2026') => {
  const csvContent =
    'SIGLA,GR,NOMBRE DE LA MATERIA,CARRERAS,DOCENTE,DÍA,HORARIO,AULA\n' +
    'ADM100,A,ADMINISTRACION GENERAL,105-5-109-1,AZOGUE ROMERO OSCAR,L-M-V,19:45-21:15,21318\n' +
    'INF110,B,INTRODUCCION A LA INFORMATICA,187-3-187-4,ZUNA VELASCO HERNAN,M-J,07:00-09:15,236-4\n' +
    'MAT101,1,CALCULO I,105-5-187-3-187-4,GUTIERREZ ROJAS JUAN CARLOS,L-M-V,07:00-08:30,21312\n' +
    'FIS100,A,FISICA I,187-3-187-4,CALDERON MAMANI RENE,M-J,09:15-11:30,LAB-FIS\n' +
    'LIN100,C,INGLES TECNICO I,105-5-109-1,SUAREZ MONTERO ELIZABETH,L-M-V,11:30-13:00,21314\n' +
    'INF210,A,PROGRAMACION I,187-3-187-4,FLORES FLORES WALTER,M-J,14:00-16:15,LAB-201\n' +
    'EST101,2,ESTADISTICA I,105-5-109-1,RODRIGUEZ PAREDES MARCO,L-M-V,16:00-17:30,21316';

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `plantilla_maestro_oferta_${semestre.replace(/[^a-zA-Z0-9]/g, '_')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const MUESTRA_REGISTROS_REALES: OfertaClase[] = [
  {
    id: 'mue-1',
    sigla: 'ADM100',
    grupo: 'A',
    nombreMateria: 'ADMINISTRACION GENERAL',
    carreras: '105-5-109-1',
    docente: 'AZOGUE ROMERO OSCAR',
    dia: 'L-M-V',
    horario: '19:45-21:15',
    aula: '21318',
  },
  {
    id: 'mue-2',
    sigla: 'INF110',
    grupo: 'B',
    nombreMateria: 'INTRODUCCION A LA INFORMATICA',
    carreras: '187-3-187-4',
    docente: 'ZUNA VELASCO HERNAN',
    dia: 'M-J',
    horario: '07:00-09:15',
    aula: '236-4',
  },
  {
    id: 'mue-3',
    sigla: 'MAT101',
    grupo: '1',
    nombreMateria: 'CALCULO I',
    carreras: '105-5-187-3-187-4',
    docente: 'GUTIERREZ ROJAS JUAN CARLOS',
    dia: 'L-M-V',
    horario: '07:00-08:30',
    aula: '21312',
  },
  {
    id: 'mue-4',
    sigla: 'FIS100',
    grupo: 'A',
    nombreMateria: 'FISICA I',
    carreras: '187-3-187-4',
    docente: 'CALDERON MAMANI RENE',
    dia: 'M-J',
    horario: '09:15-11:30',
    aula: 'LAB-FIS',
  },
  {
    id: 'mue-5',
    sigla: 'LIN100',
    grupo: 'C',
    nombreMateria: 'INGLES TECNICO I',
    carreras: '105-5-109-1',
    docente: 'SUAREZ MONTERO ELIZABETH',
    dia: 'L-M-V',
    horario: '11:30-13:00',
    aula: '21314',
  },
  {
    id: 'mue-6',
    sigla: 'INF210',
    grupo: 'A',
    nombreMateria: 'PROGRAMACION I',
    carreras: '187-3-187-4',
    docente: 'FLORES FLORES WALTER',
    dia: 'M-J',
    horario: '14:00-16:15',
    aula: 'LAB-201',
  },
  {
    id: 'mue-7',
    sigla: 'EST101',
    grupo: '2',
    nombreMateria: 'ESTADISTICA I',
    carreras: '105-5-109-1',
    docente: 'RODRIGUEZ PAREDES MARCO',
    dia: 'L-M-V',
    horario: '16:00-17:30',
    aula: '21316',
  },
];
