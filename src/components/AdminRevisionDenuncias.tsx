import React, { useState, useMemo } from 'react';
import { ReporteInasistencia, DenunciaVarias, TipoDenunciaVarias } from '../types';
import { 
  ShieldCheck, 
  Calendar, 
  Clock, 
  MapPin, 
  UserX, 
  MessageSquare, 
  Search, 
  Tag, 
  Layers, 
  BookOpen, 
  AlertCircle,
  FileCheck2,
  Filter,
  X,
  GraduationCap,
  Trash2,
  AlertTriangle,
  Camera,
  Eye,
  Image as ImageIcon
} from 'lucide-react';

interface AdminRevisionDenunciasProps {
  reportesInasistencia: ReporteInasistencia[];
  denunciasVarias: DenunciaVarias[];
  onEliminarInasistencia?: (id: string) => void;
  onEliminarDenunciaVarias?: (id: string) => void;
  onLimpiarTodasInasistencias?: () => void;
  onLimpiarTodasDenunciasVarias?: () => void;
}

export type SubpestanaRevision = 'inasistencias' | 'denuncias-varias';

interface ElementoAEliminar {
  tipo: 'inasistencia' | 'denuncia-varias' | 'todas-inasistencias' | 'todas-denuncias';
  id?: string;
  descripcion: string;
}

interface FotoParaVer {
  url: string;
  titulo: string;
  nombre?: string;
}

export const AdminRevisionDenuncias: React.FC<AdminRevisionDenunciasProps> = ({
  reportesInasistencia,
  denunciasVarias,
  onEliminarInasistencia,
  onEliminarDenunciaVarias,
  onLimpiarTodasInasistencias,
  onLimpiarTodasDenunciasVarias,
}) => {
  const [subpestana, setSubpestana] = useState<SubpestanaRevision>('inasistencias');
  
  // Filtros de búsqueda para Inasistencias
  const [busquedaInasistencia, setBusquedaInasistencia] = useState<string>('');
  
  // Filtros para Denuncias Varias
  const [filtroTipoDenuncia, setFiltroTipoDenuncia] = useState<string>('TODOS');
  const [busquedaDenunciasVarias, setBusquedaDenunciasVarias] = useState<string>('');

  // Estado para el modal de confirmación de eliminación
  const [elementoAEliminar, setElementoAEliminar] = useState<ElementoAEliminar | null>(null);
  
  // Estado para ver fotografía de prueba adjunta en pantalla completa
  const [fotoParaVer, setFotoParaVer] = useState<FotoParaVer | null>(null);

  // Filtrado de inasistencias
  const inasistenciasFiltradas = useMemo(() => {
    const query = busquedaInasistencia.toLowerCase().trim();
    if (!query) return reportesInasistencia;

    return reportesInasistencia.filter((rep) => {
      const docente = rep.docente?.toLowerCase() || '';
      const sigla = rep.sigla?.toLowerCase() || '';
      const materia = rep.nombreMateria?.toLowerCase() || '';
      const grupo = rep.grupo?.toLowerCase() || '';
      const aula = rep.aula?.toLowerCase() || '';
      const comentario = rep.comentario?.toLowerCase() || '';

      return (
        docente.includes(query) ||
        sigla.includes(query) ||
        materia.includes(query) ||
        grupo.includes(query) ||
        aula.includes(query) ||
        comentario.includes(query)
      );
    });
  }, [reportesInasistencia, busquedaInasistencia]);

  // Filtrado de denuncias varias
  const denunciasVariasFiltradas = useMemo(() => {
    return denunciasVarias.filter((den) => {
      const coincideTipo =
        filtroTipoDenuncia === 'TODOS' || den.tipoDenuncia === filtroTipoDenuncia;

      const query = busquedaDenunciasVarias.toLowerCase().trim();
      const docenteVal = (den.docente || den.docenteDenunciado || '').toLowerCase();
      const materiaVal = (den.nombreMateria || '').toLowerCase();
      const siglaVal = (den.sigla || '').toLowerCase();
      const grupoVal = (den.grupo || '').toLowerCase();
      const aulaVal = (den.aula || '').toLowerCase();
      const diaVal = (den.dia || '').toLowerCase();
      const horarioVal = (den.horario || '').toLowerCase();
      const tipoVal = den.tipoDenuncia.toLowerCase();
      const comentarioVal = (den.comentario || '').toLowerCase();
      const fechaVal = den.fechaRegistro.toLowerCase();

      const coincideBusqueda =
        !query ||
        docenteVal.includes(query) ||
        materiaVal.includes(query) ||
        siglaVal.includes(query) ||
        grupoVal.includes(query) ||
        aulaVal.includes(query) ||
        diaVal.includes(query) ||
        horarioVal.includes(query) ||
        tipoVal.includes(query) ||
        comentarioVal.includes(query) ||
        fechaVal.includes(query);

      return coincideTipo && coincideBusqueda;
    });
  }, [denunciasVarias, filtroTipoDenuncia, busquedaDenunciasVarias]);

  const handleEjecutarEliminacion = () => {
    if (!elementoAEliminar) return;

    if (elementoAEliminar.tipo === 'inasistencia' && elementoAEliminar.id && onEliminarInasistencia) {
      onEliminarInasistencia(elementoAEliminar.id);
    } else if (elementoAEliminar.tipo === 'denuncia-varias' && elementoAEliminar.id && onEliminarDenunciaVarias) {
      onEliminarDenunciaVarias(elementoAEliminar.id);
    } else if (elementoAEliminar.tipo === 'todas-inasistencias' && onLimpiarTodasInasistencias) {
      onLimpiarTodasInasistencias();
    } else if (elementoAEliminar.tipo === 'todas-denuncias' && onLimpiarTodasDenunciasVarias) {
      onLimpiarTodasDenunciasVarias();
    }

    setElementoAEliminar(null);
  };

  return (
    <div className="space-y-6">
      {/* Encabezado Principal del Módulo de Revisión */}
      <section className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-blue-900 bg-blue-100 px-2.5 py-0.5 rounded-md">
                <ShieldCheck className="w-3.5 h-3.5" />
                Módulo 3 • Panel de Administración
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Revisión de denuncias
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Consulta y revisión institucional de reportes anónimos recibidos de los estudiantes.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5 text-xs text-blue-900 shrink-0 space-y-0.5">
            <span className="font-bold flex items-center gap-1.5 text-blue-950">
              <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
              Garantía de Anonimato
            </span>
            <p className="text-[11px] text-blue-800">
              No se almacena ni se expone ningún dato de identidad de los estudiantes.
            </p>
          </div>
        </div>

        {/* Selector de subpestañas: 1. Inasistencias docentes | 2. Denuncias varias */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="subtab-inasistencias-docentes"
              onClick={() => setSubpestana('inasistencias')}
              className={`pb-3 px-4 text-sm sm:text-base font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                subpestana === 'inasistencias'
                  ? 'border-blue-900 text-blue-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <UserX className="w-4 h-4" />
              <span>Inasistencias docentes</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                subpestana === 'inasistencias' 
                  ? 'bg-blue-100 text-blue-900' 
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {reportesInasistencia.length}
              </span>
            </button>

            <button
              type="button"
              id="subtab-denuncias-varias"
              onClick={() => setSubpestana('denuncias-varias')}
              className={`pb-3 px-4 text-sm sm:text-base font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                subpestana === 'denuncias-varias'
                  ? 'border-blue-900 text-blue-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Denuncias varias</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                subpestana === 'denuncias-varias' 
                  ? 'bg-blue-100 text-blue-900' 
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {denunciasVarias.length}
              </span>
            </button>
          </div>

          {/* Botón de limpieza masiva para pruebas si hay elementos */}
          {subpestana === 'inasistencias' && reportesInasistencia.length > 0 && onLimpiarTodasInasistencias && (
            <button
              type="button"
              onClick={() => setElementoAEliminar({
                tipo: 'todas-inasistencias',
                descripcion: `Todos los ${reportesInasistencia.length} reportes de inasistencia docente actualmente registrados.`
              })}
              className="mb-2 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 hover:text-red-800 border border-red-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpiar todas las inasistencias</span>
            </button>
          )}

          {subpestana === 'denuncias-varias' && denunciasVarias.length > 0 && onLimpiarTodasDenunciasVarias && (
            <button
              type="button"
              onClick={() => setElementoAEliminar({
                tipo: 'todas-denuncias',
                descripcion: `Todas las ${denunciasVarias.length} denuncias varias actualmente registradas.`
              })}
              className="mb-2 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 hover:text-red-800 border border-red-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpiar todas las denuncias</span>
            </button>
          )}
        </div>
      </section>

      {/* VISTA 1: INASISTENCIAS DOCENTES */}
      {subpestana === 'inasistencias' && (
        <section className="space-y-4" aria-label="Sección de Inasistencias Docentes">
          {/* Barra de filtrado para inasistencias */}
          {reportesInasistencia.length > 0 && (
            <div className="bg-white rounded-xl p-4 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={busquedaInasistencia}
                  onChange={(e) => setBusquedaInasistencia(e.target.value)}
                  placeholder="Buscar reporte por docente, sigla, materia, aula o comentario..."
                  className="w-full pl-10 pr-9 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-900 focus:ring-1 focus:ring-blue-900 outline-none"
                />
                {busquedaInasistencia && (
                  <button
                    type="button"
                    onClick={() => setBusquedaInasistencia('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <span className="text-xs text-slate-500 font-medium self-end sm:self-auto shrink-0">
                Mostrando {inasistenciasFiltradas.length} de {reportesInasistencia.length} reportes
              </span>
            </div>
          )}

          {/* CASO: No existen reportes de inasistencia docente */}
          {reportesInasistencia.length === 0 ? (
            <div 
              id="mensaje-sin-reportes-inasistencia"
              className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-3 shadow-xs"
            >
              <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                <UserX className="w-7 h-7" />
              </div>
              <p className="text-lg font-bold text-slate-800">
                No existen reportes de inasistencia docente.
              </p>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                Cuando los estudiantes registren inasistencias desde el Módulo 1, aparecerán listadas en esta sección para su revisión.
              </p>
            </div>
          ) : inasistenciasFiltradas.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-2 shadow-xs">
              <p className="text-sm font-bold text-slate-700">
                No se encontraron reportes con el criterio de búsqueda especificado.
              </p>
              <button
                type="button"
                onClick={() => setBusquedaInasistencia('')}
                className="text-xs font-bold text-blue-900 hover:underline cursor-pointer"
              >
                Limpiar filtro de búsqueda
              </button>
            </div>
          ) : (
            /* LISTADO DE REPORTES DE INASISTENCIA */
            <div className="grid grid-cols-1 gap-4">
              {inasistenciasFiltradas.map((reporte) => (
                <div
                  key={reporte.id}
                  id={`tarjeta-reporte-${reporte.id}`}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 p-5 sm:p-6 transition-all shadow-2xs space-y-4"
                >
                  {/* Encabezado de la tarjeta: Estado, Materia y Fecha */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-red-100 text-red-900 font-bold text-xs flex items-center gap-1">
                        <UserX className="w-3.5 h-3.5 text-red-700" />
                        Inasistencia confirmada
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-950 font-mono font-bold text-xs">
                        {reporte.sigla} — Gr. {reporte.grupo}
                      </span>
                      <span className="text-xs font-bold text-slate-800">
                        {reporte.nombreMateria}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-semibold text-slate-700 capitalize">
                          {reporte.fechaReporte}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Datos detallados fidedignos de la clase del Maestro de Oferta */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 text-xs bg-slate-50/80 p-4 rounded-xl border border-slate-200 items-center">
                    <div>
                      <span className="text-slate-400 uppercase font-semibold block text-[11px]">
                        DOCENTE:
                      </span>
                      <strong className="text-slate-900 text-sm block mt-0.5">
                        {reporte.docente}
                      </strong>
                    </div>

                    <div>
                      <span className="text-slate-400 uppercase font-semibold block text-[11px]">
                        DÍA:
                      </span>
                      <div className="flex items-center gap-1 text-slate-800 font-medium mt-0.5 text-xs sm:text-sm">
                        <Calendar className="w-3.5 h-3.5 text-blue-800" />
                        <span>{reporte.dia}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-400 uppercase font-semibold block text-[11px]">
                        HORARIO:
                      </span>
                      <div className="flex items-center gap-1 text-slate-800 font-mono font-medium mt-0.5 text-xs sm:text-sm">
                        <Clock className="w-3.5 h-3.5 text-blue-800" />
                        <span>{reporte.horario}</span>
                      </div>
                    </div>

                    {/* Aula y Botón de Limpiar / Borrar */}
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <span className="text-slate-400 uppercase font-semibold block text-[11px]">
                          AULA:
                        </span>
                        <div className="flex items-center gap-1 text-slate-800 font-medium mt-0.5 text-xs sm:text-sm">
                          <MapPin className="w-3.5 h-3.5 text-blue-800" />
                          <span className="font-bold">{reporte.aula}</span>
                        </div>
                      </div>

                      {/* Icono / Botón para borrar o limpiar reporte de prueba */}
                      {onEliminarInasistencia && (
                        <button
                          type="button"
                          onClick={() => setElementoAEliminar({
                            tipo: 'inasistencia',
                            id: reporte.id,
                            descripcion: `Inasistencia de ${reporte.docente} (${reporte.sigla} Gr. ${reporte.grupo} - Aula ${reporte.aula})`
                          })}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 hover:border-red-300 font-bold text-xs transition-all cursor-pointer shadow-2xs shrink-0"
                          title="Borrar o limpiar este reporte de prueba"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-600" />
                          <span>limpiar</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Fotografía de prueba si fue adjuntada */}
                  {reporte.imagenAdjunta && (
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-300 shrink-0 bg-slate-200">
                          <img
                            src={reporte.imagenAdjunta}
                            alt="Prueba adjunta"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="text-xs">
                          <span className="font-bold text-slate-800 flex items-center gap-1">
                            <Camera className="w-3.5 h-3.5 text-blue-900" />
                            Foto de prueba adjunta
                          </span>
                          <span className="text-slate-500 truncate block max-w-xs">
                            {reporte.imagenNombre || 'evidencia.jpg'}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setFotoParaVer({
                          url: reporte.imagenAdjunta!,
                          titulo: `Prueba de inasistencia: ${reporte.docente} (${reporte.sigla})`,
                          nombre: reporte.imagenNombre
                        })}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Ver foto completa</span>
                      </button>
                    </div>
                  )}

                  {/* Comentario cuando exista */}
                  {reporte.comentario ? (
                    <div className="space-y-1 pt-1">
                      <span className="text-slate-500 font-semibold text-xs flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5 text-blue-800" />
                        Comentario del estudiante (Anónimo):
                      </span>
                      <p className="text-xs sm:text-sm text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-200 italic leading-relaxed">
                        &quot;{reporte.comentario}&quot;
                      </p>
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-400 italic">
                      Sin comentario adicional.
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* VISTA 2: DENUNCIAS VARIAS */}
      {subpestana === 'denuncias-varias' && (
        <section className="space-y-4" aria-label="Sección de Denuncias Varias">
          {/* Barra de filtros para denuncias varias */}
          {denunciasVarias.length > 0 && (
            <div className="bg-white rounded-xl p-4 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" />
                  Tipo:
                </span>
                <button
                  type="button"
                  onClick={() => setFiltroTipoDenuncia('TODOS')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    filtroTipoDenuncia === 'TODOS'
                      ? 'bg-blue-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Todos ({denunciasVarias.length})
                </button>

                <button
                  type="button"
                  onClick={() => setFiltroTipoDenuncia('Obligar a asistir a seminarios')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    filtroTipoDenuncia === 'Obligar a asistir a seminarios'
                      ? 'bg-blue-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Seminarios
                </button>

                <button
                  type="button"
                  onClick={() => setFiltroTipoDenuncia('Obligar a comprar libros')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    filtroTipoDenuncia === 'Obligar a comprar libros'
                      ? 'bg-blue-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Libros
                </button>

                <button
                  type="button"
                  onClick={() => setFiltroTipoDenuncia('Otros')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    filtroTipoDenuncia === 'Otros'
                      ? 'bg-blue-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Otros
                </button>
              </div>

              <div className="relative w-full md:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={busquedaDenunciasVarias}
                  onChange={(e) => setBusquedaDenunciasVarias(e.target.value)}
                  placeholder="Buscar en descripción..."
                  className="w-full pl-9 pr-7 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-900 outline-none"
                />
                {busquedaDenunciasVarias && (
                  <button
                    type="button"
                    onClick={() => setBusquedaDenunciasVarias('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* CASO: No existen denuncias registradas */}
          {denunciasVarias.length === 0 ? (
            <div 
              id="mensaje-sin-denuncias-varias"
              className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-3 shadow-xs"
            >
              <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                <Layers className="w-7 h-7" />
              </div>
              <p className="text-lg font-bold text-slate-800">
                No existen denuncias registradas.
              </p>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                Cuando los estudiantes registren denuncias varias desde el Módulo 2, se mostrarán en esta sección para su revisión.
              </p>
            </div>
          ) : denunciasVariasFiltradas.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-2 shadow-xs">
              <p className="text-sm font-bold text-slate-700">
                No se encontraron denuncias con los filtros seleccionados.
              </p>
              <button
                type="button"
                onClick={() => {
                  setFiltroTipoDenuncia('TODOS');
                  setBusquedaDenunciasVarias('');
                }}
                className="text-xs font-bold text-blue-900 hover:underline cursor-pointer"
              >
                Restablecer filtros
              </button>
            </div>
          ) : (
            /* LISTADO DE DENUNCIAS VARIAS */
            <div className="grid grid-cols-1 gap-4">
              {denunciasVariasFiltradas.map((denuncia) => {
                const docenteVal = denuncia.docente || denuncia.docenteDenunciado;
                return (
                  <div
                    key={denuncia.id}
                    id={`tarjeta-denuncia-varias-${denuncia.id}`}
                    className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 p-5 sm:p-6 transition-all shadow-2xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3 py-1 rounded-lg bg-blue-100 text-blue-950 font-bold text-xs sm:text-sm flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5 text-blue-800" />
                          {denuncia.tipoDenuncia}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-semibold text-slate-700 capitalize">
                            {denuncia.fechaRegistro}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Información de la Clase / Docente denunciado */}
                    <div className="bg-slate-50/90 p-4 rounded-xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center shrink-0 mt-0.5">
                            <GraduationCap className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <span className="text-slate-400 uppercase font-semibold block text-[11px]">
                              DOCENTE:
                            </span>
                            <strong className="text-slate-900 text-sm sm:text-base block">
                              {docenteVal ? (
                                docenteVal
                              ) : (
                                <span className="text-slate-500 font-normal italic">No especificado</span>
                              )}
                            </strong>
                          </div>
                        </div>

                        {/* Icono / Botón para borrar o limpiar denuncia de prueba */}
                        {onEliminarDenunciaVarias && (
                          <button
                            type="button"
                            onClick={() => setElementoAEliminar({
                              tipo: 'denuncia-varias',
                              id: denuncia.id,
                              descripcion: `Denuncia por "${denuncia.tipoDenuncia}" contra ${docenteVal || 'Docente no especificado'}`
                            })}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 hover:border-red-300 font-bold text-xs transition-all cursor-pointer shadow-2xs shrink-0"
                            title="Borrar o limpiar este reporte de prueba"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-600" />
                            <span>borrar o limpiar</span>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 pt-2 border-t border-slate-200/80 text-xs">
                        <div className="col-span-2 sm:col-span-3 md:col-span-2">
                          <span className="text-slate-400 block text-[11px] uppercase font-semibold">MATERIA:</span>
                          <span className="font-bold text-slate-900">
                            {denuncia.nombreMateria || <span className="text-slate-400 font-normal italic">No especificado</span>}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px] uppercase font-semibold">SIGLA:</span>
                          <span className="font-mono font-bold text-blue-900">
                            {denuncia.sigla || <span className="text-slate-400 font-normal italic">No especificado</span>}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px] uppercase font-semibold">GRUPO:</span>
                          <span className="font-bold text-slate-900">
                            {denuncia.grupo || <span className="text-slate-400 font-normal italic">No especificado</span>}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px] uppercase font-semibold">DÍA / HORARIO:</span>
                          <span className="text-slate-800 font-medium block">
                            {denuncia.dia ? `${denuncia.dia} ${denuncia.horario ? `(${denuncia.horario})` : ''}` : (
                              <span className="text-slate-400 font-normal italic">No especificado</span>
                            )}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px] uppercase font-semibold">AULA:</span>
                          <span className="text-slate-800 font-medium">
                            {denuncia.aula || <span className="text-slate-400 font-normal italic">No especificado</span>}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Fotografía de prueba si fue adjuntada */}
                    {denuncia.imagenAdjunta && (
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-300 shrink-0 bg-slate-200">
                            <img
                              src={denuncia.imagenAdjunta}
                              alt="Prueba adjunta"
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="text-xs">
                            <span className="font-bold text-slate-800 flex items-center gap-1">
                              <Camera className="w-3.5 h-3.5 text-blue-900" />
                              Foto de prueba adjunta
                            </span>
                            <span className="text-slate-500 truncate block max-w-xs">
                              {denuncia.imagenNombre || 'evidencia.jpg'}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setFotoParaVer({
                            url: denuncia.imagenAdjunta!,
                            titulo: `Prueba de denuncia: ${denuncia.tipoDenuncia} - ${docenteVal || 'Docente'}`,
                            nombre: denuncia.imagenNombre
                          })}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Ver foto completa</span>
                        </button>
                      </div>
                    )}

                    {/* Comentario o descripción */}
                    <div className="space-y-1">
                      <span className="text-slate-400 uppercase font-semibold block text-[11px]">
                        COMENTARIO O DESCRIPCIÓN:
                      </span>
                      {denuncia.comentario ? (
                        <p className="text-xs sm:text-sm text-slate-800 bg-slate-50 p-4 rounded-xl border border-slate-200 whitespace-pre-wrap leading-relaxed">
                          {denuncia.comentario}
                        </p>
                      ) : (
                        <p className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-lg border border-slate-200">
                          (Sin descripción adicional registrada)
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* Modal visor de fotografía en pantalla completa */}
      {fotoParaVer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-5 shadow-2xl border border-slate-200 space-y-3 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5 truncate pr-2">
                <Camera className="w-4 h-4 text-blue-900 shrink-0" />
                {fotoParaVer.titulo}
              </span>
              <button
                type="button"
                onClick={() => setFotoParaVer(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-auto flex items-center justify-center bg-slate-900 rounded-xl p-2">
              <img
                src={fotoParaVer.url}
                alt="Prueba completa"
                className="max-h-[65vh] max-w-full object-contain rounded"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-500 font-medium truncate max-w-xs">
                {fotoParaVer.nombre || 'evidencia.jpg'}
              </span>
              <button
                type="button"
                onClick={() => setFotoParaVer(null)}
                className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl cursor-pointer"
              >
                Cerrar vista
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar o limpiar reportes */}
      {elementoAEliminar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">
                  ¿Borrar o limpiar este reporte?
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {elementoAEliminar.descripcion}
                </p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900">
              <p className="font-medium">
                Esta acción eliminará el registro de forma permanente de la base de datos y del panel administrativo.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setElementoAEliminar(null)}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleEjecutarEliminacion}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-red-600 hover:bg-red-700 text-white shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Sí, borrar registro</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
