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
  fechaReporte: string;
  esAnonimo: boolean;
}

export type TipoDenunciaVarias = 
  | 'Obligar a asistir a seminarios'
  | 'Obligar a comprar libros'
  | 'Otros';

export interface DenunciaVarias {
  id: string;
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
  comentario: string;
  fechaRegistro: string;
  esAnonimo: boolean;
}
