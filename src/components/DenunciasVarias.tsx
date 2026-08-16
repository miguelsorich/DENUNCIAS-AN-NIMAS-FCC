import React, { useState, useEffect, useMemo } from 'react';
import { TipoDenunciaVarias, DenunciaVarias, MaestroOfertaVigente } from '../types';
import { 
  ShieldCheck, 
  Send, 
  FileText, 
  Clock, 
  AlertCircle, 
  MessageSquare, 
  Layers,
  Search,
  GraduationCap,
  CheckCircle2,
  X,
  UserCheck,
  RotateCcw
} from 'lucide-react';
import { DenunciasVariasConfirmacion } from './DenunciasVariasConfirmacion';

const CATEGORIAS_DENUNCIA: { id: TipoDenunciaVarias; titulo: string; descripcion: string }[] = [
  {
    id: 'Obligar a asistir a seminarios',
    titulo: 'Obligar a asistir a seminarios',
    descripcion: 'Cobro o condicionamiento de notas/asistencia por participar en cursos, congresos o seminarios.',
  },
  {
    id: 'Obligar a comprar libros',
    titulo: 'Obligar a comprar libros',
    descripcion: 'Exigencia obligatoria de compra de libros, folletos o textos como requisito para aprobar o tener derecho a examen.',
  },
  {
    id: 'Otros',
    titulo: 'Otros',
    descripcion: 'Cualquier otra irregularidad o situación no contemplada en las categorías anteriores.',
  },
];

interface DenunciasVariasProps {
  maestroVigente: MaestroOfertaVigente | null;
  onRegistrarDenuncia?: (denuncia: DenunciaVarias) => void;
}

export const DenunciasVarias: React.FC<DenunciasVariasProps> = ({ 
  maestroVigente,
  onRegistrarDenuncia 
}) => {
  const [docenteSeleccionado, setDocenteSeleccionado] = useState<string | null>(null);
  const [busquedaDocente, setBusquedaDocente] = useState<string>('');
  const [tipoSeleccionado, setTipoSeleccionado] = useState<TipoDenunciaVarias | null>(null);
  const [comentario, setComentario] = useState<string>('');
  const [fechaActualTexto, setFechaActualTexto] = useState<string>('');
  const [denunciaEnviada, setDenunciaEnviada] = useState<DenunciaVarias | null>(null);

  // Extraer la lista única de docentes disponibles en el Maestro de Oferta vigente
  const listaDocentes = useMemo(() => {
    if (!maestroVigente || !maestroVigente.registros) return [];
    const docentesSet = new Set<string>();
    for (const reg of maestroVigente.registros) {
      if (reg.docente && reg.docente.trim()) {
        docentesSet.add(reg.docente.trim());
      }
    }
    return Array.from(docentesSet).sort((a, b) => a.localeCompare(b, 'es'));
  }, [maestroVigente]);

  // Filtrado de docentes por búsqueda parcial de nombre o apellido
  const docentesFiltrados = useMemo(() => {
    const query = busquedaDocente.toLowerCase().trim();
    if (!query) return listaDocentes;
    return listaDocentes.filter((doc) => doc.toLowerCase().includes(query));
  }, [listaDocentes, busquedaDocente]);

  // Registro de fecha y hora automática del sistema
  useEffect(() => {
    const obtenerFechaLegible = () => {
      const now = new Date();
      return now.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    };

    setFechaActualTexto(obtenerFechaLegible());
    const intervalo = setInterval(() => {
      setFechaActualTexto(obtenerFechaLegible());
    }, 30000);

    return () => clearInterval(intervalo);
  }, []);

  const handleSeleccionarDocente = (docente: string) => {
    setDocenteSeleccionado(docente);
    setBusquedaDocente('');
  };

  const handleCambiarDocente = () => {
    setDocenteSeleccionado(null);
    setBusquedaDocente('');
  };

  const handleSeleccionarCategoria = (categoria: TipoDenunciaVarias) => {
    setTipoSeleccionado(categoria);
  };

  const handleEnviarDenuncia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docenteSeleccionado || !tipoSeleccionado) return;

    const nuevaDenuncia: DenunciaVarias = {
      id: `den-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      docenteDenunciado: docenteSeleccionado,
      tipoDenuncia: tipoSeleccionado,
      comentario: comentario.trim(),
      fechaRegistro: fechaActualTexto,
      esAnonimo: true,
    };

    setDenunciaEnviada(nuevaDenuncia);
    if (onRegistrarDenuncia) {
      onRegistrarDenuncia(nuevaDenuncia);
    }
  };

  const handleRealizarOtraDenuncia = () => {
    setDenunciaEnviada(null);
    setDocenteSeleccionado(null);
    setBusquedaDocente('');
    setTipoSeleccionado(null);
    setComentario('');
  };

  if (denunciaEnviada) {
    return (
      <DenunciasVariasConfirmacion
        denuncia={denunciaEnviada}
        onRealizarOtraDenuncia={handleRealizarOtraDenuncia}
      />
    );
  }

  // Validación: Se requiere Docente + Tipo de Denuncia + (si es "Otros", descripción obligatoria)
  const puedeEnviar = Boolean(
    docenteSeleccionado &&
    tipoSeleccionado &&
    (tipoSeleccionado !== 'Otros' || comentario.trim().length > 0)
  );

  return (
    <div className="space-y-6">
      {/* Encabezado principal del Módulo 2 */}
      <section className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-blue-900 bg-blue-100 px-2.5 py-0.5 rounded-md">
                <Layers className="w-3.5 h-3.5" />
                Módulo 2 • Denuncias Varias
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Realizar otra denuncia
            </h1>
            <p className="text-sm font-semibold text-blue-900 mt-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-700" />
              Tu denuncia es anónima.
            </p>
          </div>

          <div className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 shrink-0">
            <span className="font-semibold text-slate-700 block">Privacidad Garantizada</span>
            <span>Sin registro de datos personales</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600">
          Siga los pasos para seleccionar al docente denunciado del Maestro de Oferta vigente, clasificar la irregularidad y describir lo ocurrido.
        </p>
      </section>

      {/* Formulario de registro de denuncia */}
      <form onSubmit={handleEnviarDenuncia} className="space-y-6">
        
        {/* PASO 1. BUSCAR Y SELECCIONAR DOCENTE DENUNCIADO */}
        <section 
          id="seccion-docente-denunciado"
          className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-blue-900" />
              <label 
                htmlFor="input-buscar-docente" 
                className="text-base font-bold text-slate-900 block"
              >
                1. Docente denunciado (Obligatorio)
              </label>
            </div>
            <span className="text-xs font-semibold text-blue-900 bg-blue-50 px-2.5 py-1 rounded-full">
              Maestro de Oferta vigente
            </span>
          </div>

          {/* Docente ya seleccionado */}
          {docenteSeleccionado ? (
            <div className="bg-blue-50/70 border-2 border-blue-900 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-900 block">
                    Docente denunciado seleccionado:
                  </span>
                  <p className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                    {docenteSeleccionado}
                  </p>
                </div>
              </div>

              <button
                type="button"
                id="btn-cambiar-docente"
                onClick={handleCambiarDocente}
                className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-bold border border-slate-300 rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-center cursor-pointer shadow-2xs"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
                <span>Cambiar docente</span>
              </button>
            </div>
          ) : (
            /* Buscador de docentes */
            <div className="space-y-3">
              <p className="text-xs text-slate-600">
                Busca y selecciona al docente escribiendo parcialmente su nombre o apellido. Solo se permite seleccionar docentes registrados en el Maestro de Oferta vigente.
              </p>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  id="input-buscar-docente"
                  value={busquedaDocente}
                  onChange={(e) => setBusquedaDocente(e.target.value)}
                  placeholder="Escribe el nombre o apellido del docente..."
                  className="w-full pl-10 pr-9 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-900 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  autoComplete="off"
                />
                {busquedaDocente && (
                  <button
                    type="button"
                    onClick={() => setBusquedaDocente('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Lista de docentes filtrados */}
              <div className="border border-slate-200 rounded-xl max-h-56 overflow-y-auto divide-y divide-slate-100 bg-white shadow-inner">
                {docentesFiltrados.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500 space-y-1">
                    <p className="font-semibold text-slate-700">
                      No se encontró ningún docente con &quot;{busquedaDocente}&quot;
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Verifique la ortografía o intente con otro apellido/nombre.
                    </p>
                  </div>
                ) : (
                  docentesFiltrados.map((docente, idx) => (
                    <button
                      key={docente || idx}
                      type="button"
                      id={`btn-docente-${idx}`}
                      onClick={() => handleSeleccionarDocente(docente)}
                      className="w-full text-left px-4 py-2.5 hover:bg-blue-50 transition-colors flex items-center justify-between gap-3 text-xs sm:text-sm text-slate-800 cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <GraduationCap className="w-4 h-4 text-slate-400 group-hover:text-blue-900 shrink-0" />
                        <span className="font-semibold group-hover:text-blue-950">
                          {docente}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-blue-800 bg-blue-50 group-hover:bg-blue-100 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        Seleccionar
                      </span>
                    </button>
                  ))
                )}
              </div>

              <p className="text-[11px] text-slate-400">
                {docentesFiltrados.length} docente(s) disponible(s) en el Maestro de Oferta vigente.
              </p>
            </div>
          )}
        </section>

        {/* PASO 2. SELECCIÓN DE TIPO DE DENUNCIA */}
        <section 
          id="seccion-tipo-denuncia"
          className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <label className="text-base font-bold text-slate-900 block">
              2. Tipo de denuncia
            </label>
            <span className="text-xs text-slate-500 font-medium">
              Selecciona una opción
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {CATEGORIAS_DENUNCIA.map((cat) => {
              const estaSeleccionada = tipoSeleccionado === cat.id;

              return (
                <div
                  key={cat.id}
                  id={`opcion-tipo-${cat.id.replace(/\s+/g, '-').toLowerCase()}`}
                  onClick={() => handleSeleccionarCategoria(cat.id)}
                  className={`p-4 sm:p-5 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                    estaSeleccionada
                      ? 'border-blue-900 bg-blue-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/70 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    id={`radio-${cat.id}`}
                    name="tipoDenuncia"
                    checked={estaSeleccionada}
                    onChange={() => handleSeleccionarCategoria(cat.id)}
                    className="w-5 h-5 mt-0.5 text-blue-900 border-slate-300 focus:ring-blue-800 cursor-pointer shrink-0"
                  />
                  <div className="space-y-0.5">
                    <span className="text-base font-bold text-slate-900 block">
                      {cat.titulo}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-600">
                      {cat.descripcion}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {!tipoSeleccionado && (
            <p className="text-xs text-amber-700 font-medium flex items-center gap-1.5 pt-1">
              <AlertCircle className="w-4 h-4 shrink-0" />
              Por favor selecciona una categoría de denuncia para continuar.
            </p>
          )}
        </section>

        {/* PASO 3. COMENTARIO O DESCRIPCIÓN */}
        {tipoSeleccionado && (
          <section 
            id="seccion-comentario-descripcion"
            className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-3 animate-in fade-in duration-200"
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-900" />
              <label 
                htmlFor="textarea-comentario-descripcion" 
                className="text-base font-bold text-slate-900 block"
              >
                3. Comentario o descripción de la denuncia
              </label>
            </div>

            <p className="text-xs text-slate-600">
              {tipoSeleccionado === 'Otros' ? (
                <strong className="text-blue-950">
                  Describe detalladamente el motivo y las circunstancias de la denuncia.
                </strong>
              ) : (
                'Explica brevemente lo ocurrido, materia o circunstancias relacionadas.'
              )}
            </p>

            <textarea
              id="textarea-comentario-descripcion"
              rows={4}
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder={
                tipoSeleccionado === 'Otros'
                  ? 'Escribe detalladamente el motivo de la denuncia...'
                  : 'Escribe aquí los detalles de la situación (materia, grupo o circunstancias)...'
              }
              className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-900 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-y"
            />
          </section>
        )}

        {/* 4. FECHA AUTOMÁTICA Y AVISO DE ANONIMATO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Fecha automática */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-1.5">
            <div className="flex items-center gap-2 text-slate-700 font-bold text-xs uppercase tracking-wider">
              <Clock className="w-4 h-4 text-blue-800" />
              <span>Fecha y hora automática</span>
            </div>
            <p className="text-base font-bold text-slate-900 capitalize">
              {fechaActualTexto || 'Cargando fecha actual...'}
            </p>
            <p className="text-[11px] text-slate-500">
              Registrada de forma automática por el sistema en el momento de la denuncia.
            </p>
          </div>

          {/* Aviso de Anonimato */}
          <div className="bg-blue-50/80 rounded-2xl p-5 border border-blue-200 space-y-1.5">
            <div className="flex items-center gap-2 text-blue-950 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-blue-800" />
              <span>Garantía de confidencialidad</span>
            </div>
            <p className="text-base font-bold text-blue-950">
              Tu denuncia es anónima.
            </p>
            <p className="text-[11px] text-blue-800 leading-relaxed">
              No se solicita ni se registra nombre, código, correo electrónico ni teléfono del estudiante.
            </p>
          </div>
        </div>

        {/* 5. REVISIÓN ANTES DE ENVIAR */}
        {docenteSeleccionado && tipoSeleccionado && (
          <section 
            id="seccion-revision-denuncia-varias"
            className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-5 animate-in fade-in duration-200"
          >
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <FileText className="w-5 h-5 text-blue-900" />
              <h3 className="text-lg font-bold text-slate-900">
                Revisión antes de enviar
              </h3>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-200 space-y-3 text-xs sm:text-sm">
              <div>
                <strong className="text-slate-500 block text-xs uppercase">Docente denunciado:</strong>
                <span className="font-bold text-slate-900 text-base">{docenteSeleccionado}</span>
              </div>

              <div>
                <strong className="text-slate-500 block text-xs uppercase">Tipo de denuncia:</strong>
                <span className="font-bold text-slate-900 text-base">{tipoSeleccionado}</span>
              </div>

              <div>
                <strong className="text-slate-500 block text-xs uppercase">Fecha automática:</strong>
                <span className="font-semibold text-slate-900 capitalize">{fechaActualTexto}</span>
              </div>

              <div>
                <strong className="text-slate-500 block text-xs uppercase">Comentario o descripción:</strong>
                {comentario.trim() ? (
                  <p className="text-slate-800 bg-white p-3 rounded-lg border border-slate-200 mt-1 whitespace-pre-wrap leading-relaxed">
                    {comentario.trim()}
                  </p>
                ) : (
                  <span className="text-slate-400 italic">
                    (Sin descripción adicional registrada)
                  </span>
                )}
              </div>
            </div>

            {/* Botón principal: Enviar denuncia */}
            <div className="pt-2">
              <button
                type="submit"
                id="btn-enviar-denuncia"
                disabled={!puedeEnviar}
                className={`w-full py-4 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer ${
                  puedeEnviar
                    ? 'bg-blue-900 hover:bg-blue-800 active:bg-blue-950 text-white hover:shadow-md'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                }`}
              >
                <Send className="w-5 h-5" />
                <span>Enviar denuncia</span>
              </button>

              {!puedeEnviar && tipoSeleccionado === 'Otros' && (
                <p className="text-center text-xs text-amber-700 mt-2 font-medium">
                  Para la opción &quot;Otros&quot;, por favor escribe una descripción del motivo de la denuncia.
                </p>
              )}
            </div>
          </section>
        )}
      </form>
    </div>
  );
};
