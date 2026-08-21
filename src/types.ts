export interface OfertaClase {
  id: string;
  sigla: string;
  grupo: string;
  nombreMateria: string;
  carreras: string;
  docente: string;
  dia: string;
  horario: string;
  aula: string;
}

export interface MaestroOfertaVigente {
  semestre: string;
  fechaImportacion: string;
  nombreArchivo: string;
  totalRegistros: number;
  registros: OfertaClase[];
}

export interface ValidacionImportacion {
  esValido: boolean;
  columnasFaltantes: string[];
  columnasEncontradas: string[];
  totalFilas: number;
  errores: string[];
  registros?: OfertaClase[];
}

export interface ReporteInasistencia {
  id: string;
  claseId: string;
  sigla: string;
  grupo: string;
  nombreMateria: string;
  docente: string;
  dia: string;
  horario: string;
  aula: string;
  inasistenciaMarcada: boolean;
  comentario?: string;
  imagenAdjunta?: string; // Data URL de la fotografía o comprobante opcional
  imagenNombre?: string;
  fechaReporte: string;
  esAnonimo: boolean;
}

export type ModalidadEstudio = 'presencial' | 'virtual';

export type RespuestaOportuna = 'SI' | 'NO' | 'REGULAR';
export type SubeMateriales = 'SI' | 'NO' | 'RETRASO';

export type TipoDenunciaVirtual = 
  | 'No responde a consultas o dudas en plataforma'
  | 'No sube materiales ni recursos a tiempo'
  | 'Inasistencia / No se conecta a sesiones sincrónicas'
  | 'Obligar a comprar libros o cobros indebidos en plataforma'
  | 'Obligar a asistir a seminarios o cursos externos'
  | 'Evaluaciones o exámenes irregulares / sin previo aviso'
  | 'Otros motivos (Modalidad Virtual)';

export type TipoDenunciaVarias = 
  | 'Obligar a asistir a seminarios'
  | 'Obligar a comprar libros'
  | 'Otros'
  | TipoDenunciaVirtual;

export interface DenunciaVarias {
  id: string;
  modalidad?: ModalidadEstudio;
  claseId?: string;
  docente?: string;
  nombreMateria?: string;
  sigla?: string;
  grupo?: string;
  dia?: string;
  horario?: string;
  aula?: string;
  docenteDenunciado?: string; // fallback if only docente was set
  tipoDenuncia: TipoDenunciaVarias;
  // Campos específicos de modalidad virtual solicitados
  respondeConsultasOportunamente?: RespuestaOportuna | string;
  subeMaterialesATiempo?: SubeMateriales | string;
  comentario: string;
  imagenAdjunta?: string; // Data URL de la fotografía o comprobante opcional
  imagenNombre?: string;
  fechaRegistro: string;
  esAnonimo: boolean;
}
