import React, { useState, useMemo } from 'react';
import { OfertaClase, MaestroOfertaVigente, ReporteInasistencia } from '../types';
import { 
  Search, 
  BookOpen, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle, 
  AlertCircle, 
  GraduationCap,
  X
} from 'lucide-react';
import { ReporteInasistenciaForm } from './ReporteInasistenciaForm';
import { ReporteInasistenciaConfirmacion } from './ReporteInasistenciaConfirmacion';
import { buscarClasesEnMaestro } from '../utils/searchUtils';

interface BusquedaSeleccionClaseProps {
  maestroVigente: MaestroOfertaVigente | null;
  onRegistrarReporte?: (reporte: ReporteInasistencia) => void;
  onIrAAdmin?: () => void;
}

export const BusquedaSeleccionClase: React.FC<BusquedaSeleccionClaseProps> = ({
  maestroVigente,
  onRegistrarReporte,
  onIrAAdmin,
}) => {
  const [terminoBusqueda, setTerminoBusqueda] = useState<string>('');
  const [claseSeleccionada, setClaseSeleccionada] = useState<OfertaClase | null>(null);
  const [reporteEnviado, setReporteEnviado] = useState<ReporteInasistencia | null>(null);

  const registrosMaestro = maestroVigente?.registros || [];

  // Filtrado reactivo en tiempo real sobre el Maestro de Oferta vigente
  const resultadosFiltrados = useMemo(() => {
    return buscarClasesEnMaestro(registrosMaestro, terminoBusqueda);
  }, [registrosMaestro, terminoBusqueda]);

  const handleSeleccionarClase = (clase: OfertaClase) => {
    setClaseSeleccionada(clase);
    setReporteEnviado(null);
  };

  const handleCambiarSeleccion = () => {
    setClaseSeleccionada(null);
    setReporteEnviado(null);
  };

  const handleLimpiarBusqueda = () => {
    setTerminoBusqueda('');
  };

  const handleReporteCompletado = (nuevoReporte: ReporteInasistencia) => {
    setReporteEnviado(nuevoReporte);
    if (onRegistrarReporte) {
      onRegistrarReporte(nuevoReporte);
    }
  };

  const handleRealizarOtroReporte = () => {
    setReporteEnviado(null);
    setClaseSeleccionada(null);
    setTerminoBusqueda('');
  };

  // CASO: No existe un Maestro de Oferta vigente importado
  if (!maestroVigente || registrosMaestro.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center space-y-5 shadow-xs max-w-2xl mx-auto">
        <div className="w-16 h-16 bg-blue-50 text-blue-900 rounded-2xl flex items-center justify-center mx-auto border border-blue-200">
          <BookOpen className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Listo para Cargar el Maestro de Oferta Oficial
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed max-w-lg mx-auto">
            La plataforma se encuentra limpia y lista. Para habilitar la búsqueda de materias, docentes y aulas para los estudiantes, el Administrador debe importar el archivo Excel oficial de la facultad.
          </p>
        </div>

        {onIrAAdmin && (
          <div className="pt-2">
            <button
              type="button"
              onClick={onIrAAdmin}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-sm shadow-xs transition-all cursor-pointer"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Ir al Panel de Administración a Subir Excel</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // PASO 3 DEL FLUJO: Confirmación tras el envío exitoso
  if (reporteEnviado) {
    return (
      <ReporteInasistenciaConfirmacion
        reporte={reporteEnviado}
        onRealizarOtroReporte={handleRealizarOtroReporte}
      />
    );
  }

  // PASO 2 DEL FLUJO: Clase seleccionada + Marcar inasistencia + Comentario opcional + Revisión + Envío
  if (claseSeleccionada) {
    return (
      <ReporteInasistenciaForm
        clase={claseSeleccionada}
        onCambiarClase={handleCambiarSeleccion}
        onEnviarReporte={handleReporteCompletado}
      />
    );
  }

  // PASO 1 DEL FLUJO: Búsqueda y listado de clases disponibles
  return (
    <div className="space-y-6">
      {/* Encabezado de la pantalla del Estudiante */}
      <section className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-blue-900 bg-blue-100 px-2.5 py-0.5 rounded-md">
                <GraduationCap className="w-3.5 h-3.5" />
                Módulo 1 • Estudiantes
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Reporte de Inasistencia Docente
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Busca y selecciona la clase correspondiente.
            </p>
          </div>

          <div className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 shrink-0">
            <span className="font-semibold text-slate-700 block">Maestro de Oferta Activo</span>
            <span>{maestroVigente.semestre} ({registrosMaestro.length} clases)</span>
          </div>
        </div>

        {/* Barra de Búsqueda multi-criterio */}
        <div className="space-y-2">
          <label 
            htmlFor="input-busqueda-clase" 
            className="text-xs font-semibold uppercase tracking-wider text-slate-600 block"
          >
            Buscar por docente, sigla, grupo o nombre de materia
          </label>
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              id="input-busqueda-clase"
              type="text"
              value={terminoBusqueda}
              onChange={(e) => setTerminoBusqueda(e.target.value)}
              placeholder="Ej. Oscar Azogue, ADM100, Grupo A, Cálculo I..."
              className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-800 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
            {terminoBusqueda && (
              <button
                type="button"
                onClick={handleLimpiarBusqueda}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                title="Limpiar búsqueda"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Atajos de búsqueda rápida para pruebas */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs text-slate-500">
            <span className="font-medium">Filtros rápidos de ejemplo:</span>
            <button
              type="button"
              onClick={() => setTerminoBusqueda('AZOGUE')}
              className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono transition-colors cursor-pointer"
            >
              Docente: AZOGUE
            </button>
            <button
              type="button"
              onClick={() => setTerminoBusqueda('ADM100')}
              className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono transition-colors cursor-pointer"
            >
              Sigla: ADM100
            </button>
            <button
              type="button"
              onClick={() => setTerminoBusqueda('PROGRAMACION')}
              className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              Materia: Programación
            </button>
          </div>
        </div>
      </section>

      {/* SECCIÓN DE RESULTADOS DE BÚSQUEDA */}
      <section className="space-y-4" aria-label="Resultados de búsqueda de clases">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-800" />
            <span>Clases encontradas ({resultadosFiltrados.length})</span>
          </h2>
          {terminoBusqueda && (
            <span className="text-xs text-slate-500">
              Coincidencias con: <strong className="text-slate-800">&quot;{terminoBusqueda}&quot;</strong>
            </span>
          )}
        </div>

        {/* CASO: No se encontraron coincidencias */}
        {resultadosFiltrados.length === 0 ? (
          <div 
            id="mensaje-sin-resultados"
            className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3 shadow-xs"
          >
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="text-base font-bold text-slate-800">
                No se encontraron clases con ese criterio de búsqueda.
              </p>
              <p className="text-xs sm:text-sm text-slate-500">
                Prueba buscando con otra sigla, grupo, materia o parte del apellido del docente.
              </p>
            </div>
            <button
              type="button"
              onClick={handleLimpiarBusqueda}
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-800 hover:text-blue-950 pt-1 cursor-pointer"
            >
              Mostrar todas las clases disponibles
            </button>
          </div>
        ) : (
          /* Listado de resultados: cada clase como opción independiente */
          <div className="grid grid-cols-1 gap-3.5">
            {resultadosFiltrados.map((clase) => {
              return (
                <div
                  key={clase.id}
                  id={`tarjeta-clase-${clase.id}`}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-blue-300 p-4 sm:p-5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs hover:shadow-sm"
                >
                  {/* Información detallada de la clase */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-950 font-mono font-bold text-xs">
                        {clase.sigla}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-semibold text-xs">
                        Grupo: {clase.grupo}
                      </span>
                      {clase.carreras && (
                        <span className="text-[11px] text-slate-500">
                          Carreras: {clase.carreras}
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900">
                        {clase.nombreMateria}
                      </h3>
                      <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-0.5">
                        <span className="text-slate-500 font-normal">Docente:</span> {clase.docente}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-blue-700" />
                        <span>{clase.dia}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono">
                        <Clock className="w-3.5 h-3.5 text-blue-700" />
                        <span>{clase.horario}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-blue-700" />
                        <span>Aula: <strong>{clase.aula}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Botón para seleccionar la clase */}
                  <div className="shrink-0 flex items-center">
                    <button
                      type="button"
                      id={`btn-seleccionar-${clase.id}`}
                      onClick={() => handleSeleccionarClase(clase)}
                      className="w-full md:w-auto px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs bg-blue-900 hover:bg-blue-800 active:bg-blue-950 text-white"
                    >
                      <span>Seleccionar clase</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
