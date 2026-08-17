import { OfertaClase } from '../types';

/**
 * Normaliza un texto para búsquedas insensibles a mayúsculas, tildes y caracteres especiales.
 */
export const normalizarParaBusqueda = (texto: string | null | undefined): string => {
  if (!texto) return '';
  return texto
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Quita tildes: á->a, é->e, í->i, ó->o, ú->u
    .replace(/[\t_\-\/\\:;.,]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Realiza una búsqueda parcial sobre el Maestro de Oferta vigente.
 * Coincide parcialmente con: DOCENTE, SIGLA, GR (Grupo), NOMBRE DE LA MATERIA, AULA, DÍA, HORARIO.
 * Soporta búsqueda de palabras múltiples en cualquier orden (ej: "SORICH CALCULO", "ADM100 AZOGUE", "MAT101").
 */
export const buscarClasesEnMaestro = (
  registros: OfertaClase[] | undefined | null,
  termino: string
): OfertaClase[] => {
  if (!registros || !Array.isArray(registros) || registros.length === 0) {
    return [];
  }

  const queryLimpia = normalizarParaBusqueda(termino);
  if (!queryLimpia) {
    return registros;
  }

  // Dividir el término en palabras para búsqueda flexible
  const palabras = queryLimpia.split(' ').filter(Boolean);

  return registros.filter((clase) => {
    const docente = normalizarParaBusqueda(clase.docente);
    const sigla = normalizarParaBusqueda(clase.sigla);
    const siglaSinEspacios = sigla.replace(/\s+/g, '');
    const grupo = normalizarParaBusqueda(clase.grupo);
    const materia = normalizarParaBusqueda(clase.nombreMateria);
    const aula = normalizarParaBusqueda(clase.aula);
    const dia = normalizarParaBusqueda(clase.dia);
    const horario = normalizarParaBusqueda(clase.horario);

    // Texto combinado de la clase para coincidencia global
    const textoCompletoClase = `${docente} ${sigla} ${siglaSinEspacios} ${grupo} ${materia} ${aula} ${dia} ${horario}`;

    // Cada palabra buscada debe coincidir con alguna parte de la clase
    return palabras.every((palabra) => {
      const palabraSinEspacios = palabra.replace(/\s+/g, '');
      return (
        textoCompletoClase.includes(palabra) ||
        siglaSinEspacios.includes(palabraSinEspacios) ||
        docente.includes(palabra) ||
        sigla.includes(palabra) ||
        grupo.includes(palabra) ||
        materia.includes(palabra)
      );
    });
  });
};
