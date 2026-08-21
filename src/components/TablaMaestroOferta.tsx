import React, { useState, useMemo } from 'react';
import { OfertaClase, ModalidadEstudio } from '../types';
import { 
  FileSpreadsheet, 
  Layers, 
  Search, 
  UserCheck, 
  Edit3, 
  Check, 
  X, 
  Building2, 
  Laptop, 
  Users, 
  AlertCircle,
  Sparkles
} from 'lucide-react';

interface TablaMaestroOfertaProps {
  registros: OfertaClase[];
  semestreVigente?: string;
  fechaActualizacion?: string;
  modalidad?: ModalidadEstudio;
  onActualizarRegistros?: (nuevosRegistros: OfertaClase[]) => void;
  onActualizarDocente?: (claseId: string, nuevoDocente: string, aplicarATodas?: boolean) => void;
}

export const TablaMaestroOferta: React.FC<TablaMaestroOfertaProps> = ({
  registros,
  semestreVigente,
  fechaActualizacion,
  modalidad = 'presencial',
  onActualizarRegistros,
  onActualizarDocente,
}) => {
  const [filtroTexto, setFiltroTexto] = useState('');
  
  // Estado para edición individual de docente
  const [editandoClaseId, setEditandoClaseId] = useState<string | null>(null);
  const [nombreDocenteEditando, setNombreDocenteEditando] = useState<string>('');
  const [docenteOriginal, setDocenteOriginal] = useState<string>('');
  const [aplicarATodasLasMaterias, setAplicarATodasLasMaterias] = useState<boolean>(false);
  
  // Mensaje de retroalimentación tras editar
  const [mensajeExitoEdicion, setMensajeExitoEdicion] = useState<string | null>(null);

  // Modal para búsqueda y reemplazo masivo de un docente
  const [mostrarModalReemplazoMasivo, setMostrarModalReemplazoMasivo] = useState(false);
  const [docenteBuscarMasivo, setDocenteBuscarMasivo] = useState('');
  const [docenteReemplazarMasivo, setDocenteReemplazarMasivo] = useState('');

  const registrosFiltrados = useMemo(() => {
    if (!filtroTexto.trim()) return registros;
    const term = filtroTexto.toLowerCase().trim();
    return registros.filter(
      (r) =>
        r.sigla.toLowerCase().includes(term) ||
        r.nombreMateria.toLowerCase().includes(term) ||
        r.docente.toLowerCase().includes(term) ||
        r.grupo.toLowerCase().includes(term) ||
        r.aula.toLowerCase().includes(term) ||
        r.carreras.toLowerCase().includes(term)
    );
  }, [registros, filtroTexto]);

  // Contar cuántas materias dicta el docente original si se está editando
  const coincidenciasDocenteOriginal = useMemo(() => {
    if (!docenteOriginal.trim()) return 0;
    const originalUpper = docenteOriginal.trim().toUpperCase();
    return registros.filter(r => r.docente.trim().toUpperCase() === originalUpper).length;
  }, [registros, docenteOriginal]);

  const handleIniciarEdicion = (clase: OfertaClase) => {
    setEditandoClaseId(clase.id);
    setNombreDocenteEditando(clase.docente);
    setDocenteOriginal(clase.docente);
    setAplicarATodasLasMaterias(false);
    setMensajeExitoEdicion(null);
  };

  const handleCancelarEdicion = () => {
    setEditandoClaseId(null);
    setNombreDocenteEditando('');
    setDocenteOriginal('');
    setAplicarATodasLasMaterias(false);
  };

  const handleGuardarEdicion = (claseId: string) => {
    const nuevoNombreLimpio = nombreDocenteEditando.trim().toUpperCase();
    if (!nuevoNombreLimpio) return;

    if (onActualizarDocente) {
      onActualizarDocente(claseId, nuevoNombreLimpio, aplicarATodasLasMaterias);
    } else if (onActualizarRegistros) {
      const originalUpper = docenteOriginal.trim().toUpperCase();
      const actualizados = registros.map(item => {
        if (aplicarATodasLasMaterias && item.docente.trim().toUpperCase() === originalUpper) {
          return { ...item, docente: nuevoNombreLimpio };
        }
        if (item.id === claseId) {
          return { ...item, docente: nuevoNombreLimpio };
        }
        return item;
      });
      onActualizarRegistros(actualizados);
    }

    setMensajeExitoEdicion(
      aplicarATodasLasMaterias
        ? `Se actualizó el docente a "${nuevoNombreLimpio}" en ${coincidenciasDocenteOriginal} materia(s).`
        : `Docente modificado a "${nuevoNombreLimpio}" correctamente.`
    );
    setEditandoClaseId(null);

    // Ocultar mensaje tras 4 segundos
    setTimeout(() => {
      setMensajeExitoEdicion(null);
    }, 4000);
  };

  const handleEjecutarReemplazoMasivo = (e: React.FormEvent) => {
    e.preventDefault();
    const buscar = docenteBuscarMasivo.trim().toUpperCase();
    const reemplazo = docenteReemplazarMasivo.trim().toUpperCase();

    if (!buscar || !reemplazo) return;

    let modificados = 0;
    const actualizados = registros.map(item => {
      if (item.docente.trim().toUpperCase().includes(buscar)) {
        modificados++;
        return { ...item, docente: reemplazo };
      }
      return item;
    });

    if (onActualizarRegistros) {
      onActualizarRegistros(actualizados);
    }

    setMensajeExitoEdicion(`Se actualizó el nombre del docente en ${modificados} clase(s) de la modalidad ${modalidad}.`);
    setMostrarModalReemplazoMasivo(false);
    setDocenteBuscarMasivo('');
    setDocenteReemplazarMasivo('');

    setTimeout(() => {
      setMensajeExitoEdicion(null);
    }, 4000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-0">
      <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/70">
        <div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-blue-900" />
            <h3 className="text-base font-bold text-slate-900">
              Registros del Maestro de Oferta — {modalidad === 'virtual' ? 'Modalidad Virtual' : 'Modalidad Presencial'}
            </h3>
            {modalidad === 'virtual' ? (
              <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-900 border border-indigo-200 text-[11px] font-bold inline-flex items-center gap-1">
                <Laptop className="w-3 h-3 text-indigo-700" />
                Virtual
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-200 text-[11px] font-bold inline-flex items-center gap-1">
                <Building2 className="w-3 h-3 text-blue-700" />
                Presencial
              </span>
            )}
          </div>
          {semestreVigente && (
            <p className="text-xs text-slate-500 mt-0.5">
              Semestre: <strong className="text-slate-700">{semestreVigente}</strong>
              {fechaActualizacion && ` • Importado: ${fechaActualizacion}`}
              {' • '}
              <span className="text-emerald-700 font-semibold">Permite modificación manual de docentes</span>
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filtroTexto}
              onChange={(e) => setFiltroTexto(e.target.value)}
              placeholder="Buscar materia, sigla, docente o aula..."
              className="pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:border-blue-700 focus:ring-1 focus:ring-blue-100 outline-none text-slate-800 placeholder:text-slate-400 w-56 sm:w-64"
            />
          </div>

          <button
            type="button"
            onClick={() => setMostrarModalReemplazoMasivo(true)}
            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg border border-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Corregir o reemplazar nombre de un docente en varias clases"
          >
            <Users className="w-3.5 h-3.5 text-blue-800" />
            <span>Reemplazar docente masivo</span>
          </button>

          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-100/90 text-blue-900 text-xs font-bold font-mono shrink-0">
            <Layers className="w-3.5 h-3.5" />
            {registros.length} registros
          </span>
        </div>
      </div>

      {/* Banner de confirmación de edición de docente */}
      {mensajeExitoEdicion && (
        <div className="p-3 bg-emerald-50 border-b border-emerald-200 flex items-center justify-between text-xs text-emerald-900 font-semibold animate-in fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{mensajeExitoEdicion}</span>
          </div>
          <button 
            type="button" 
            onClick={() => setMensajeExitoEdicion(null)} 
            className="text-emerald-700 hover:text-emerald-950 p-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Tabla con todas las columnas del Maestro de Oferta */}
      <div className="overflow-x-auto max-h-[500px]">
        <table className="w-full text-left text-xs sm:text-sm text-slate-700 border-collapse">
          <thead className="sticky top-0 z-10 bg-slate-100 text-slate-800 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px] shadow-2xs">
            <tr>
              <th scope="col" className="py-3 px-3.5 whitespace-nowrap">SIGLA</th>
              <th scope="col" className="py-3 px-2.5 text-center whitespace-nowrap">GR</th>
              <th scope="col" className="py-3 px-3.5 min-w-[180px]">NOMBRE DE LA MATERIA</th>
              <th scope="col" className="py-3 px-3.5 min-w-[180px]">CARRERAS</th>
              <th scope="col" className="py-3 px-3.5 min-w-[260px]">
                <div className="flex items-center justify-between">
                  <span>DOCENTE</span>
                  <span className="text-[10px] text-blue-900 font-semibold normal-case bg-blue-100/70 px-2 py-0.5 rounded">
                    Clic para editar
                  </span>
                </div>
              </th>
              <th scope="col" className="py-3 px-2.5 whitespace-nowrap">DÍA</th>
              <th scope="col" className="py-3 px-3 min-w-[120px] whitespace-nowrap">HORARIO</th>
              <th scope="col" className="py-3 px-3.5 min-w-[140px]">
                {modalidad === 'virtual' ? 'AULA / PLATAFORMA' : 'AULA'}
              </th>
              <th scope="col" className="py-3 px-3 text-center whitespace-nowrap">ACCIONES</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {registrosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-8 text-slate-500 text-xs">
                  No se encontraron registros que coincidan con la búsqueda &quot;{filtroTexto}&quot;.
                </td>
              </tr>
            ) : (
              registrosFiltrados.map((item, index) => {
                const estaEditandoEste = editandoClaseId === item.id;

                return (
                  <tr 
                    key={item.id || `${item.sigla}-${item.grupo}-${index}`}
                    className={`transition-colors ${estaEditandoEste ? 'bg-amber-50/80' : 'hover:bg-blue-50/40'}`}
                  >
                    <td className="py-3 px-3.5 font-mono font-bold text-blue-900 whitespace-nowrap">
                      {item.sigla}
                    </td>
                    <td className="py-3 px-2.5 font-semibold text-slate-900 text-center">
                      {item.grupo}
                    </td>
                    <td className="py-3 px-3.5 font-medium text-slate-900">
                      {item.nombreMateria}
                    </td>
                    <td className="py-3 px-3.5 text-slate-600 text-xs">
                      {item.carreras || 'FCCA'}
                    </td>

                    {/* Columna DOCENTE con edición manual inline */}
                    <td className="py-2.5 px-3.5">
                      {estaEditandoEste ? (
                        <div className="space-y-2 bg-white p-2.5 rounded-xl border-2 border-amber-400 shadow-sm">
                          <label className="text-[10px] font-bold text-amber-900 uppercase block">
                            Modificar Nombre de Docente:
                          </label>
                          <input
                            type="text"
                            value={nombreDocenteEditando}
                            onChange={(e) => setNombreDocenteEditando(e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs font-bold border border-amber-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50/40 text-slate-900 uppercase"
                            placeholder="NOMBRE COMPLETO DEL DOCENTE"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleGuardarEdicion(item.id);
                              if (e.key === 'Escape') handleCancelarEdicion();
                            }}
                          />

                          {coincidenciasDocenteOriginal > 1 && (
                            <label className="flex items-center gap-2 text-[11px] text-slate-700 cursor-pointer pt-1 font-medium select-none">
                              <input
                                type="checkbox"
                                checked={aplicarATodasLasMaterias}
                                onChange={(e) => setAplicarATodasLasMaterias(e.target.checked)}
                                className="w-3.5 h-3.5 text-blue-900 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                              />
                              <span>
                                Aplicar cambio a las <strong>{coincidenciasDocenteOriginal} materias</strong> donde dicta este docente
                              </span>
                            </label>
                          )}

                          <div className="flex items-center gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => handleGuardarEdicion(item.id)}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer transition-colors"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Guardar</span>
                            </button>
                            <button
                              type="button"
                              onClick={handleCancelarEdicion}
                              className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Cancelar</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-2 group">
                          <span className="font-semibold text-slate-800">
                            {item.docente || <span className="text-slate-400 italic">No asignado</span>}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleIniciarEdicion(item)}
                            className="opacity-70 group-hover:opacity-100 hover:bg-blue-100 text-blue-900 p-1 rounded-md transition-all cursor-pointer"
                            title="Editar nombre del docente para este registro"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-2.5 text-slate-700 whitespace-nowrap">
                      {item.dia}
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-mono text-xs whitespace-nowrap">
                      {item.horario}
                    </td>
                    <td className="py-3 px-3.5 text-slate-700">
                      {item.aula}
                    </td>

                    {/* Acciones */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleIniciarEdicion(item)}
                        className="px-2 py-1 text-xs font-semibold text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-md border border-blue-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3 text-blue-800" />
                        <span>Editar Docente</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <span>
          Mostrando {registrosFiltrados.length} de {registros.length} registros del maestro de oferta ({modalidad === 'virtual' ? 'Modalidad Virtual' : 'Modalidad Presencial'}).
        </span>
        <span className="font-medium text-slate-600">
          Semestre activo: {semestreVigente || 'Vigente'}
        </span>
      </div>

      {/* Modal Reemplazo Masivo de Nombre de Docente */}
      {mostrarModalReemplazoMasivo && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-900 text-base">
                  Reemplazar Nombre de Docente
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setMostrarModalReemplazoMasivo(false)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Permite corregir o actualizar un nombre de docente en todas las clases de la <strong>modalidad {modalidad}</strong> que coincidan con la búsqueda.
            </p>

            <form onSubmit={handleEjecutarReemplazoMasivo} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nombre actual o texto a buscar:
                </label>
                <input
                  type="text"
                  required
                  value={docenteBuscarMasivo}
                  onChange={(e) => setDocenteBuscarMasivo(e.target.value)}
                  placeholder="Ej: ROJAS BANEGAS MARIO"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-blue-700 focus:ring-2 focus:ring-blue-100 outline-none uppercase font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nuevo nombre corregido del docente:
                </label>
                <input
                  type="text"
                  required
                  value={docenteReemplazarMasivo}
                  onChange={(e) => setDocenteReemplazarMasivo(e.target.value)}
                  placeholder="Ej: LIC. ROJAS BANEGAS MARIO ALBERTO"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-blue-700 focus:ring-2 focus:ring-blue-100 outline-none uppercase font-semibold text-slate-800"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setMostrarModalReemplazoMasivo(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-900 hover:bg-blue-800 text-white shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Aplicar reemplazo</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

