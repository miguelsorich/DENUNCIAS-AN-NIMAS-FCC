/**
 * Utilidad para validación de horarios de clase en tiempo real.
 * Compara el día de la semana y el rango horario de la clase con la fecha/hora actual del sistema.
 */

export interface ScheduleValidationResult {
  estaEnHorario: boolean;
  diaCoincide: boolean;
  horaCoincide: boolean;
  diaActualNombre: string;
  horaActualTexto: string;
  diaClase: string;
  horarioClase: string;
  horaInicioTexto?: string;
  horaFinTexto?: string;
  minutosRestantes?: number;
  mensaje: string;
}

const NOMBRES_DIAS: Record<number, string> = {
  0: 'Domingo',
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado',
};

/**
 * Normaliza un texto removiendo acentos y convirtiendo a mayúsculas
 */
function normalizarTexto(txt: string): string {
  return (txt || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .trim();
}

/**
 * Determina el conjunto de días (0=Dom, 1=Lun, ..., 6=Sab) a los que corresponde un texto de horario.
 * Soporta todas las convenciones universitarias (UAGRM / Bolivia / Latam):
 * - "M-J", "M - J", "MA-JU", "MAR-JUE", "MARTES Y JUEVES", "MJ" -> [2, 4]
 * - "L-M-V", "LU-MI-VI", "LUN-MIE-VIE", "LMV" -> [1, 3, 5]
 * - "L-V", "LU-VI", "LUNES A VIERNES", "LUNES AL VIERNES" -> [1, 2, 3, 4, 5]
 * - "L-S", "LUNES A SABADO" -> [1, 2, 3, 4, 5, 6]
 * - "SABADO", "SAB", "SA", "S" -> [6]
 * - "LUNES", "LUN", "LU", "L" -> [1]
 * - "MARTES", "MAR", "MA" -> [2]
 * - "MIERCOLES", "MIER", "MIE", "MI", "X" -> [3]
 * - "JUEVES", "JUE", "JU", "J" -> [4]
 * - "VIERNES", "VIE", "VI", "V" -> [5]
 */
export function extraerDiasClase(diaClaseRaw: string): Set<number> {
  const dias = new Set<number>();
  if (!diaClaseRaw || !diaClaseRaw.trim()) {
    // Si no está especificado, asumimos todos los días hábiles
    return new Set([0, 1, 2, 3, 4, 5, 6]);
  }

  const raw = normalizarTexto(diaClaseRaw);

  // 1. Patrones compuestos exactos y rangos
  // Lunes a Viernes
  if (
    raw.includes('LUNES A VIERNES') || 
    raw.includes('LUNES AL VIERNES') || 
    raw.includes('LU A VI') || 
    raw === 'L-V' || 
    raw === 'LV' || 
    raw === 'LU-VI' || 
    raw === 'LUN-VIE'
  ) {
    return new Set([1, 2, 3, 4, 5]);
  }

  // Lunes a Sábado
  if (
    raw.includes('LUNES A SABADO') || 
    raw.includes('LUNES AL SABADO') || 
    raw === 'L-S' || 
    raw === 'LU-SA' || 
    raw === 'LUN-SAB'
  ) {
    return new Set([1, 2, 3, 4, 5, 6]);
  }

  // Lunes, Miércoles y Viernes (L-M-V / LU-MI-VI / LMV)
  if (
    raw.includes('L-M-V') || 
    raw.includes('L M V') || 
    raw.includes('LMV') || 
    raw.includes('LU-MI-VI') || 
    raw.includes('LU MI VI') || 
    raw.includes('LUN-MIE-VIE') ||
    raw.includes('LUNES, MIERCOLES Y VIERNES') ||
    raw.includes('LUNES MIERCOLES VIERNES')
  ) {
    dias.add(1); // Lunes
    dias.add(3); // Miércoles
    dias.add(5); // Viernes
    if (raw.includes('S') && (raw.includes('SAB') || raw.endsWith('S') || raw.includes('-S'))) {
      dias.add(6);
    }
    return dias;
  }

  // Martes y Jueves (M-J / MA-JU / MAR-JUE / MJ)
  if (
    raw.includes('M-J') || 
    raw.includes('M - J') || 
    raw.includes('M/J') || 
    raw.includes('M J') || 
    raw.includes('MJ') || 
    raw.includes('MA-JU') || 
    raw.includes('MAR-JUE') || 
    raw.includes('MARTES Y JUEVES') ||
    raw.includes('MARTES JUEVES')
  ) {
    dias.add(2); // Martes
    dias.add(4); // Jueves
    if (raw.includes('S') && (raw.includes('SAB') || raw.endsWith('S') || raw.includes('-S') || raw.includes('SABADO'))) {
      dias.add(6); // Sábado (M-J-S)
    }
    return dias;
  }

  // 2. Descomposición por tokens (palabras o letras separadas por guión, espacio, coma, barra)
  const tokens = raw.split(/[\s,\-\/]+/).filter(Boolean);

  // Si tiene tokens explícitos
  for (const token of tokens) {
    // LUNES
    if (token === 'L' || token === 'LU' || token === 'LUN' || token === 'LUNES') {
      dias.add(1);
    }
    // MARTES
    else if (token === 'MA' || token === 'MAR' || token === 'MARTES') {
      dias.add(2);
    }
    // MIÉRCOLES
    else if (token === 'MI' || token === 'MIE' || token === 'MIER' || token === 'MIERCOLES' || token === 'X') {
      dias.add(3);
    }
    // JUEVES
    else if (token === 'J' || token === 'JU' || token === 'JUE' || token === 'JUEV' || token === 'JUEVES') {
      dias.add(4);
    }
    // VIERNES
    else if (token === 'V' || token === 'VI' || token === 'VIE' || token === 'VIER' || token === 'VIERNES') {
      dias.add(5);
    }
    // SÁBADO
    else if (token === 'S' || token === 'SA' || token === 'SAB' || token === 'SABADO') {
      dias.add(6);
    }
    // DOMINGO
    else if (token === 'D' || token === 'DO' || token === 'DOM' || token === 'DOMINGO') {
      dias.add(0);
    }
    // Token 'M' aislado
    else if (token === 'M') {
      // Si el texto completo contiene J (como M-J), M es Martes
      if (raw.includes('J')) {
        dias.add(2);
      }
      // Si el texto contiene L o V (como L-M-V), M es Miércoles
      else if (raw.includes('L') || raw.includes('V')) {
        dias.add(3);
      }
      // Si no es determinable, incluir Martes y Miércoles
      else {
        dias.add(2);
        dias.add(3);
      }
    }
  }

  // Si no se identificó ningún día de manera estricta, pero contiene palabras completas
  if (dias.size === 0) {
    if (raw.includes('LUNES')) dias.add(1);
    if (raw.includes('MARTES')) dias.add(2);
    if (raw.includes('MIERCOLES')) dias.add(3);
    if (raw.includes('JUEVES')) dias.add(4);
    if (raw.includes('VIERNES')) dias.add(5);
    if (raw.includes('SABADO')) dias.add(6);
    if (raw.includes('DOMINGO')) dias.add(0);
  }

  // Si aun así está vacío, permitir para evitar bloquear falsamente al estudiante
  if (dias.size === 0) {
    return new Set([0, 1, 2, 3, 4, 5, 6]);
  }

  return dias;
}

/**
 * Verifica si el día actual coincide con los días de la clase.
 */
export function verificarCoincidenciaDia(diaClaseRaw: string, fechaReferencia: Date = new Date()): boolean {
  if (!diaClaseRaw || !diaClaseRaw.trim()) {
    return true;
  }

  const diaActualIndex = fechaReferencia.getDay();
  const diasClase = extraerDiasClase(diaClaseRaw);

  return diasClase.has(diaActualIndex);
}

/**
 * Parsea un string de horario y extrae minutos de inicio y fin desde medianoche.
 * Ejemplos soportados:
 * "07:00 - 09:15"
 * "07:00-09:15"
 * "18:15 - 20:30"
 * "18:15-20:30"
 * "7:00 a 9:15"
 * "0700 - 0915"
 */
export function parsearRangoHorario(horarioRaw: string): {
  inicioMinutos: number | null;
  finMinutos: number | null;
  horaInicioTexto: string;
  horaFinTexto: string;
} {
  const limpio = (horarioRaw || '').trim();
  
  if (!limpio) {
    return {
      inicioMinutos: null,
      finMinutos: null,
      horaInicioTexto: '',
      horaFinTexto: '',
    };
  }

  // Buscar dos grupos de hora:minuto (ej. 18:15 - 20:30)
  const matchEstandar = limpio.match(/(\d{1,2}):(\d{2})\s*(?:-|a|al|hasta|\/|–|—)\s*(\d{1,2}):(\d{2})/i);
  if (matchEstandar) {
    const h1 = parseInt(matchEstandar[1], 10);
    const m1 = parseInt(matchEstandar[2], 10);
    const h2 = parseInt(matchEstandar[3], 10);
    const m2 = parseInt(matchEstandar[4], 10);

    const inicioMin = h1 * 60 + m1;
    const finMin = h2 * 60 + m2;

    const pad = (n: number) => n.toString().padStart(2, '0');
    return {
      inicioMinutos: inicioMin,
      finMinutos: finMin,
      horaInicioTexto: `${pad(h1)}:${pad(m1)}`,
      horaFinTexto: `${pad(h2)}:${pad(m2)}`,
    };
  }

  // Formato compacto 0700 - 0915
  const matchCompacto = limpio.match(/(\d{2})(\d{2})\s*(?:-|a|–|—)\s*(\d{2})(\d{2})/i);
  if (matchCompacto) {
    const h1 = parseInt(matchCompacto[1], 10);
    const m1 = parseInt(matchCompacto[2], 10);
    const h2 = parseInt(matchCompacto[3], 10);
    const m2 = parseInt(matchCompacto[4], 10);

    const inicioMin = h1 * 60 + m1;
    const finMin = h2 * 60 + m2;

    const pad = (n: number) => n.toString().padStart(2, '0');
    return {
      inicioMinutos: inicioMin,
      finMinutos: finMin,
      horaInicioTexto: `${pad(h1)}:${pad(m1)}`,
      horaFinTexto: `${pad(h2)}:${pad(m2)}`,
    };
  }

  return {
    inicioMinutos: null,
    finMinutos: null,
    horaInicioTexto: '',
    horaFinTexto: '',
  };
}

/**
 * Valida si en el momento actual (o fecha dada) la clase se encuentra en curso.
 * Incluye un margen de tolerancia prudencial (por ejemplo 10 min antes y 15 min después)
 * para que los estudiantes que ingresan unos minutos antes al aula o reportan al terminar
 * puedan enviar su reporte sin bloqueos técnicos imprevistos.
 */
export function validarHorarioClase(
  diaClase: string,
  horarioClase: string,
  fechaReferencia: Date = new Date(),
  margenToleranciaMinutos: number = 10
): ScheduleValidationResult {
  const diaActualIndex = fechaReferencia.getDay();
  const diaActualNombre = NOMBRES_DIAS[diaActualIndex] || 'Desconocido';
  
  const pad = (n: number) => n.toString().padStart(2, '0');
  const horaActualTexto = `${pad(fechaReferencia.getHours())}:${pad(fechaReferencia.getMinutes())}`;
  const minutosActuales = fechaReferencia.getHours() * 60 + fechaReferencia.getMinutes();

  const diaCoincide = verificarCoincidenciaDia(diaClase, fechaReferencia);
  const { inicioMinutos, finMinutos, horaInicioTexto, horaFinTexto } = parsearRangoHorario(horarioClase);

  // Si no se pudo parsear el horario, permitimos para no bloquear
  if (inicioMinutos === null || finMinutos === null) {
    return {
      estaEnHorario: true,
      diaCoincide: true,
      horaCoincide: true,
      diaActualNombre,
      horaActualTexto,
      diaClase: diaClase || 'No especificado',
      horarioClase: horarioClase || 'No especificado',
      mensaje: 'Horario flexible / disponible.',
    };
  }

  // Tolerancia: 10 minutos antes del inicio hasta 15 minutos después de la finalización
  const horaCoincide = 
    minutosActuales >= (inicioMinutos - margenToleranciaMinutos) && 
    minutosActuales <= (finMinutos + 15);

  const estaEnHorario = diaCoincide && horaCoincide;

  let mensaje = '';
  let minutosRestantes: number | undefined;

  if (estaEnHorario) {
    minutosRestantes = finMinutos - minutosActuales;
    mensaje = `Clase en horario activo (${horaInicioTexto} a ${horaFinTexto}).`;
  } else if (!diaCoincide && !horaCoincide) {
    mensaje = `Fuera de día y horario programado. La clase corresponde a los días ${diaClase} de ${horaInicioTexto} a ${horaFinTexto} (Hoy es ${diaActualNombre}, ${horaActualTexto}).`;
  } else if (!diaCoincide) {
    mensaje = `Fuera de día programado. Esta clase corresponde a los días ${diaClase} (Hoy es ${diaActualNombre}).`;
  } else if (minutosActuales < inicioMinutos) {
    mensaje = `La clase aún no ha iniciado. Comienza hoy a las ${horaInicioTexto} (Hora actual: ${horaActualTexto}).`;
  } else {
    mensaje = `El horario de la clase ya finalizó. Concluyó hoy a las ${horaFinTexto} (Hora actual: ${horaActualTexto}).`;
  }

  return {
    estaEnHorario,
    diaCoincide,
    horaCoincide,
    diaActualNombre,
    horaActualTexto,
    diaClase,
    horarioClase,
    horaInicioTexto,
    horaFinTexto,
    minutosRestantes,
    mensaje,
  };
}
