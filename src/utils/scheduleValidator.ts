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

const DIAS_MAP: Record<number, string[]> = {
  0: ['DOMINGO', 'DOM', 'DO'],
  1: ['LUNES', 'LUN', 'LU'],
  2: ['MARTES', 'MAR', 'MA'],
  3: ['MIERCOLES', 'MIÉRCOLES', 'MIER', 'MIE', 'MI'],
  4: ['JUEVES', 'JUEV', 'JUE', 'JU'],
  5: ['VIERNES', 'VIER', 'VIE', 'VI'],
  6: ['SABADO', 'SÁBADO', 'SAB', 'SA'],
};

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
 * Verifica si el día actual coincide con los días indicados en el campo 'dia' de la clase.
 * Ejemplo de formatos soportados: "LUNES", "LUNES - MIERCOLES - VIERNES", "LU-MI-VI", "MA-JU", "LUNES A VIERNES", "SABADO".
 */
export function verificarCoincidenciaDia(diaClaseRaw: string, fechaReferencia: Date = new Date()): boolean {
  if (!diaClaseRaw || !diaClaseRaw.trim()) {
    // Si no hay día especificado, permitimos por defecto
    return true;
  }

  const diaActualIndex = fechaReferencia.getDay();
  const diaNormalizado = normalizarTexto(diaClaseRaw);

  // Tokens para el día actual
  const tokensDiaActual = DIAS_MAP[diaActualIndex] || [];

  // 1. Caso directo: si el texto contiene el nombre del día actual (ej: "LUNES", "MARTES")
  for (const token of tokensDiaActual) {
    // Expresión regular para palabra completa o delimitada por guión/espacio/coma
    const regex = new RegExp(`(^|[\\s,\\-/])${token}([\\s,\\-/]|$)`, 'i');
    if (regex.test(diaNormalizado)) {
      return true;
    }
  }

  // 2. Caso de rango "LUNES A VIERNES" o "LU A VI"
  if (diaNormalizado.includes(' A ') || diaNormalizado.includes(' AL ')) {
    if (diaActualIndex >= 1 && diaActualIndex <= 5) {
      return true;
    }
  }

  // 3. Formato compacto de letras: ej "L-M-V" o "LU MI VI"
  const tokensComunes = diaNormalizado.split(/[\s,\-/]+/);
  for (const t of tokensComunes) {
    if (tokensDiaActual.includes(t)) {
      return true;
    }
  }

  return false;
}

/**
 * Parsea un string de horario y extrae minutos de inicio y fin desde medianoche.
 * Ejemplos soportados:
 * "07:00 - 09:15"
 * "07:00-09:15"
 * "07:00 a 09:15"
 * "7:00 - 9:15"
 * "18:15 - 20:30"
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

  // Buscar dos grupos de hora:minuto
  // Formato standard HH:MM o H:MM
  const matchEstandar = limpio.match(/(\d{1,2}):(\d{2})\s*(?:-|a|al|hasta|\/)\s*(\d{1,2}):(\d{2})/i);
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
  const matchCompacto = limpio.match(/(\d{2})(\d{2})\s*(?:-|a)\s*(\d{2})(\d{2})/i);
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
 * Incluye un margen de tolerancia opcional (por defecto 0 minutos, o 5 minutos).
 */
export function validarHorarioClase(
  diaClase: string,
  horarioClase: string,
  fechaReferencia: Date = new Date(),
  margenToleranciaMinutos: number = 0
): ScheduleValidationResult {
  const diaActualIndex = fechaReferencia.getDay();
  const diaActualNombre = NOMBRES_DIAS[diaActualIndex] || 'Desconocido';
  
  const pad = (n: number) => n.toString().padStart(2, '0');
  const horaActualTexto = `${pad(fechaReferencia.getHours())}:${pad(fechaReferencia.getMinutes())}`;
  const minutosActuales = fechaReferencia.getHours() * 60 + fechaReferencia.getMinutes();

  const diaCoincide = verificarCoincidenciaDia(diaClase, fechaReferencia);
  const { inicioMinutos, finMinutos, horaInicioTexto, horaFinTexto } = parsearRangoHorario(horarioClase);

  // Si no se pudo parsear el horario, permitimos por flexibilidad
  if (inicioMinutos === null || finMinutos === null) {
    return {
      estaEnHorario: true,
      diaCoincide: true,
      horaCoincide: true,
      diaActualNombre,
      horaActualTexto,
      diaClase: diaClase || 'No especificado',
      horarioClase: horarioClase || 'No especificado',
      mensaje: 'Horario flexible / no estructurado.',
    };
  }

  const horaCoincide = 
    minutosActuales >= (inicioMinutos - margenToleranciaMinutos) && 
    minutosActuales <= (finMinutos + margenToleranciaMinutos);

  const estaEnHorario = diaCoincide && horaCoincide;

  let mensaje = '';
  let minutosRestantes: number | undefined;

  if (estaEnHorario) {
    minutosRestantes = finMinutos - minutosActuales;
    mensaje = `Clase en curso actualmente (${horaInicioTexto} a ${horaFinTexto}).`;
  } else if (!diaCoincide && !horaCoincide) {
    mensaje = `Fuera de día y horario programado. La clase se imparte los ${diaClase} de ${horaInicioTexto} a ${horaFinTexto} (Hoy es ${diaActualNombre}, ${horaActualTexto}).`;
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
