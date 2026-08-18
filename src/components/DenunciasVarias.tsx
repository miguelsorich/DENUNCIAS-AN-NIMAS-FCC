import React, { useState, useEffect, useMemo } from 'react';
import { TipoDenunciaVarias, DenunciaVarias, MaestroOfertaVigente, OfertaClase } from '../types';
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
  RotateCcw,
  BookOpen,
  Calendar,
  MapPin,
  Tag,
  Check,
  Lock,
  Unlock,
  AlertTriangle,
  Camera,
  Image as ImageIcon
} from 'lucide-react';
import { DenunciasVariasConfirmacion } from './DenunciasVariasConfirmacion';
import { buscarClasesEnMaestro } from '../utils/searchUtils';
import { validarHorarioClase } from '../utils/scheduleValidator';
import { CargadorImagenPrueba } from './CargadorImagenPrueba';

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
  const [terminoBusqueda, setTerminoBusqueda] = useState<string>('');
  const [claseSeleccionada, setClaseSeleccionada] = useState<OfertaClase | null>(null);
  const [tipoSeleccionado, setTipoSeleccionado] = useState<TipoDenunciaVarias | null>(null);
  const [comentario, setComentario] = useState<string>('');
  const [imagenDataUrl, setImagenDataUrl] = useState<string | undefined>(undefined);
  const [imagenNombre, setImagenNombre] = useState<string | undefined>(undefined);
  const [fechaActualTexto, setFechaActualTexto] = useState<string>('');
  const [horaActualRef, setHoraActualRef] = useState<Date>(new Date());
  const [denunciaEnviada, setDenunciaEnviada] = useState<DenunciaVarias | null>(null);
  
  // Modo de prueba para omitir restricción de horario si se requiere
  const [modoPruebaOmitirHorario, setModoPruebaOmitirHorario] = useState<boolean>(false);

  const registrosMaestro = maestroVigente?.registros || [];

  // Filtrado de clases utilizando la fuente única del Maestro de Oferta vigente
  const resultadosFiltrados = useMemo(() => {
    return buscarClasesEnMaestro(registrosMaestro, terminoBusqueda);
  }, [registrosMaestro, terminoBusqueda]);

  // Registro de fecha y hora automática del sistema
  useEffect(() => {
    const actualizarFecha = () => {
      const now = new Date();
      setHoraActualRef(now);
      setFechaActualTexto(
        now.toLocaleDateString('es-ES', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    };

    actualizarFecha();
    const intervalo = setInterval(actualizarFecha, 10000);
    return () => clearInterval(intervalo);
  }, []);

  // Validación de horario si hay clase seleccionada
  const validacionHorario = useMemo(() => {
    if (!claseSeleccionada) {
      return { estaEnHorario: true, mensaje: 'Seleccione una clase.' };
    }
    return validarHorarioClase(claseSeleccionada.dia, claseSeleccionada.horario, horaActualRef);
  }, [claseSeleccionada, horaActualRef]);

  const horarioPermitido = validacionHorario.estaEnHorario || modoPruebaOmitirHorario;

  const handleSeleccionarClase = (clase: OfertaClase) => {
    setClaseSeleccionada(clase);
  };

  const handleCambiarClase = () => {
    setClaseSeleccionada(null);
  };

  const handleLimpiarBusqueda = () => {
    setTerminoBusqueda('');
  };

  const handleSeleccionarCategoria = (categoria: TipoDenunciaVarias) => {
    setTipoSeleccionado(categoria);
  };

  const handleEnviarDenuncia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claseSeleccionada || !tipoSeleccionado || !horarioPermitido) return;
    if (tipoSeleccionado === 'Otros' && !comentario.trim()) return;

    const nuevaDenuncia: DenunciaVarias = {
      id: `den-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      claseId: claseSeleccionada.id,
      docente: claseSeleccionada.docente,
      docenteDenunciado: claseSeleccionada.docente,
      nombreMateria: claseSeleccionada.nombreMateria,
      sigla: claseSeleccionada.sigla,
      grupo: claseSeleccionada.grupo,
      dia: claseSeleccionada.dia,
      horario: claseSeleccionada.horario,
      aula: claseSeleccionada.aula,
      tipoDenuncia: tipoSeleccionado,
      comentario: comentario.trim(),
      imagenAdjunta: imagenDataUrl,
      imagenNombre: imagenNombre,
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
    setClaseSeleccionada(null);
    setTerminoBusqueda('');
    setTipoSeleccionado(null);
    setComentario('');
    setImagenDataUrl(undefined);
    setImagenNombre(undefined);
  };

  if (denunciaEnviada) {
    return (
      <DenunciasVariasConfirmacion
        denuncia={denunciaEnviada}
        onRealizarOtraDenuncia={handleRealizarOtraDenuncia}
      />
    );
  }

  // Validación: Se requiere Clase + Horario permitido + Tipo de Denuncia + (si es "Otros", descripción obligatoria)
  const puedeEnviar = Boolean(
    claseSeleccionada &&
    horarioPermitido &&
    tipoSeleccionado &&
    (tipoSeleccionado !== 'Otros' || comentario.trim().length > 0)
  );

  if (!maestroVigente || registrosMaestro.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4 shadow-xs">
        <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-1 max-w-md mx-auto">
          <h2 className="text-xl font-bold text-slate-900">
            No hay Maestro de Oferta vigente cargado
          </h2>
          <p className="text-sm text-slate-600">
            Para realizar una denuncia varia asociada a una clase o docente, el administrador debe importar primero el archivo oficial del Maestro de Oferta académica.
          </p>
        </div>
      </div>
    );
  }

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
          Siga los pasos: busque y seleccione la clase o docente del Maestro de Oferta vigente, clasifique la irregularidad, describa lo sucedido, adjunte una fotografía opcional y envíe su reporte confidencial.
        </p>
      </section>

      {/* PASO 1: Búsqueda y Selección de la Clase o Docente */}
      <section 
        id="seccion-buscar-clase-denuncia"
        className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-900 text-white font-bold text-xs flex items-center justify-center">
              1
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              Buscar clase o docente
            </h2>
          </div>
          {claseSeleccionada && (
            <button
              type="button"
              id="btn-cambiar-clase-denuncia"
              onClick={handleCambiarClase}
              className="text-xs font-semibold text-blue-900 hover:text-blue-700 hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Cambiar clase
            </button>
          )}
        </div>

        {!claseSeleccionada ? (
          <div className="space-y-4">
            <p className="text-xs text-slate-600">
              Busque la materia, sigla, grupo o nombre del docente en el Maestro de Oferta vigente:
            </p>

            {/* Input de Búsqueda */}
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                id="input-busqueda-clase-denuncia"
                value={terminoBusqueda}
                onChange={(e) => setTerminoBusqueda(e.target.value)}
                placeholder="Buscar por docente, sigla, grupo o materia..."
                className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-300 focus:border-blue-900 focus:bg-white rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900/20 transition-all"
              />
              {terminoBusqueda && (
                <button
                  type="button"
                  id="btn-limpiar-busqueda-denuncia"
                  onClick={handleLimpiarBusqueda}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Contador de resultados */}
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>
                Mostrando <strong>{resultadosFiltrados.length}</strong> de {registrosMaestro.length} clases disponibles
              </span>
              {terminoBusqueda && (
                <span>Filtrado por: &quot;{terminoBusqueda}&quot;</span>
              )}
            </div>

            {/* Listado de Resultados de Clases */}
            <div className="max-h-80 overflow-y-auto space-y-2.5 pr-1 divide-y divide-slate-100">
              {resultadosFiltrados.length === 0 ? (
                <div className="py-8 text-center bg-slate-50 rounded-xl border border-slate-200">
                  <GraduationCap className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs sm:text-sm font-bold text-slate-700">
                    No se encontraron clases o docentes que coincidan con &quot;{terminoBusqueda}&quot;.
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Verifique el nombre del docente, la sigla o el nombre de la materia en el Maestro vigente.
                  </p>
                </div>
              ) : (
                resultadosFiltrados.map((clase) => (
                  <div
                    key={clase.id}
                    id={`opcion-clase-${clase.id}`}
                    onClick={() => handleSeleccionarClase(clase)}
                    className="p-3.5 sm:p-4 rounded-xl border border-slate-200 hover:border-blue-900 bg-white hover:bg-blue-50/40 cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 bg-blue-100 text-blue-950 rounded-md">
                          {clase.sigla} - Gr. {clase.grupo}
                        </span>
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-950">
                          {clase.nombreMateria}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                        <GraduationCap className="w-3.5 h-3.5 text-blue-900" />
                        <span>Docente: <strong>{clase.docente}</strong></span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {clase.dia}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {clase.horario}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          Aula: {clase.aula}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="px-3.5 py-1.5 bg-slate-100 group-hover:bg-blue-900 group-hover:text-white text-slate-700 text-xs font-bold rounded-lg transition-colors shrink-0 self-start sm:self-center cursor-pointer"
                    >
                      Seleccionar
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          /* Clase Seleccionada */
          <div 
            id="tarjeta-clase-seleccionada-denuncia"
            className="p-5 rounded-xl border-2 border-blue-900 bg-blue-50/30 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Clase seleccionada
              </div>
              <span className="text-[11px] font-mono text-slate-500">ID: {claseSeleccionada.id}</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-blue-200 space-y-3">
              <div>
                <span className="text-slate-400 text-xs uppercase block font-semibold">
                  Docente:
                </span>
                <strong className="text-slate-900 text-base sm:text-lg block">
                  {claseSeleccionada.docente}
                </strong>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px] uppercase font-semibold">Materia:</span>
                  <span className="font-bold text-slate-900 block">{claseSeleccionada.nombreMateria}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] uppercase font-semibold">Sigla / Grupo:</span>
                  <span className="font-bold text-blue-900 block font-mono">
                    {claseSeleccionada.sigla} - Gr. {claseSeleccionada.grupo}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] uppercase font-semibold">Día / Horario:</span>
                  <span className="text-slate-800 font-medium block">
                    {claseSeleccionada.dia} ({claseSeleccionada.horario})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] uppercase font-semibold">Aula:</span>
                  <span className="text-slate-800 font-medium block">{claseSeleccionada.aula}</span>
                </div>
              </div>
            </div>

            {/* VALIDACIÓN DEL HORARIO DE CLASE */}
            <div className={`p-3.5 rounded-xl border transition-all ${
              validacionHorario.estaEnHorario
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-red-50 border-red-300 text-red-950'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start sm:items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    validacionHorario.estaEnHorario ? 'bg-emerald-200 text-emerald-900' : 'bg-red-200 text-red-900'
                  }`}>
                    {validacionHorario.estaEnHorario ? <Clock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <strong className="text-xs sm:text-sm font-bold">
                        {validacionHorario.estaEnHorario ? '✓ Clase en horario programado' : '⛔ Fuera de horario de clases'}
                      </strong>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                        validacionHorario.estaEnHorario ? 'bg-emerald-200 text-emerald-900' : 'bg-red-200 text-red-900'
                      }`}>
                        {validacionHorario.estaEnHorario ? 'Habilitado' : 'Restringido'}
                      </span>
                    </div>
                    <p className="text-xs opacity-90 leading-tight">
                      {validacionHorario.mensaje}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setModoPruebaOmitirHorario(!modoPruebaOmitirHorario)}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 self-end sm:self-auto cursor-pointer ${
                    modoPruebaOmitirHorario
                      ? 'bg-amber-100 border-amber-400 text-amber-900 shadow-2xs'
                      : 'bg-white/80 hover:bg-white border-slate-300 text-slate-700'
                  }`}
                  title="Permite simular y probar el envío en cualquier momento"
                >
                  {modoPruebaOmitirHorario ? (
                    <>
                      <Unlock className="w-3 h-3 text-amber-700" />
                      <span>Modo pruebas: Activo</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3 h-3 text-slate-500" />
                      <span>Modo pruebas</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* PASO 2: Selección de la Categoría de Denuncia */}
      <section 
        id="seccion-categorias-denuncia"
        className={`bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5 transition-opacity ${
          !claseSeleccionada ? 'opacity-50 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <span className="w-6 h-6 rounded-full bg-blue-900 text-white font-bold text-xs flex items-center justify-center">
            2
          </span>
          <h2 className="text-lg font-bold text-slate-900">
            Tipo de denuncia
          </h2>
        </div>

        <p className="text-xs text-slate-600">
          Seleccione la categoría que describe la situación irregular ocurrida:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {CATEGORIAS_DENUNCIA.map((cat) => {
            const isSelected = tipoSeleccionado === cat.id;
            return (
              <div
                key={cat.id}
                id={`card-categoria-${cat.id.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => handleSeleccionarCategoria(cat.id)}
                className={`p-4 rounded-xl border-2 text-left cursor-pointer transition-all space-y-2 flex flex-col justify-between ${
                  isSelected
                    ? 'border-blue-900 bg-blue-50/60 shadow-xs ring-2 ring-blue-900/15'
                    : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5" />
                      {cat.id === 'Otros' ? 'General' : 'Específica'}
                    </span>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-blue-900 text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm leading-snug">
                    {cat.titulo}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {cat.descripcion}
                  </p>
                </div>

                <div className="pt-2 text-[11px] font-semibold text-blue-900">
                  {isSelected ? '✓ Seleccionado' : 'Haga clic para seleccionar'}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* PASO 3: Fotografía o Imagen de Prueba (Opcional) */}
      <div className={`transition-opacity ${!claseSeleccionada ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
        <CargadorImagenPrueba
          imagenDataUrl={imagenDataUrl}
          imagenNombre={imagenNombre}
          onImagenSeleccionada={(dataUrl, nombre) => {
            setImagenDataUrl(dataUrl);
            setImagenNombre(nombre);
          }}
          onQuitarImagen={() => {
            setImagenDataUrl(undefined);
            setImagenNombre(undefined);
          }}
          titulo="Fotografía o imagen como prueba (Opcional)"
          descripcion="Si tienes una foto del recibo/boleto del seminario, foto del libro obligatorio, captura de mensaje u otra prueba, puedes adjuntarla aquí. Si no tienes foto, puedes enviar la denuncia sin problema."
        />
      </div>

      {/* PASO 4: Comentario o Descripción */}
      <section 
        id="seccion-comentario-denuncia"
        className={`bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 transition-opacity ${
          !tipoSeleccionado ? 'opacity-50 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-900 text-white font-bold text-xs flex items-center justify-center">
              4
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              Comentario o descripción de la denuncia
            </h2>
          </div>
          {tipoSeleccionado === 'Otros' ? (
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
              Obligatorio para &quot;Otros&quot;
            </span>
          ) : (
            <span className="text-xs text-slate-500 font-medium">Opcional</span>
          )}
        </div>

        <div className="space-y-2">
          <label 
            htmlFor="textarea-comentario-denuncia" 
            className="block text-xs font-semibold text-slate-700"
          >
            {tipoSeleccionado === 'Otros'
              ? 'Describa detalladamente la situación irregular ocurrida (requerido):'
              : 'Detalles adicionales, contexto o comentarios sobre la denuncia (opcional):'}
          </label>
          <div className="relative">
            <textarea
              id="textarea-comentario-denuncia"
              rows={4}
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder={
                tipoSeleccionado === 'Otros'
                  ? 'Escriba aquí los hechos ocurridos de manera clara...'
                  : 'Si desea, agregue aclaraciones o detalles de lo sucedido...'
              }
              className="w-full p-4 bg-slate-50 border border-slate-300 focus:border-blue-900 focus:bg-white rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900/20 transition-all resize-y"
            />
          </div>
        </div>
      </section>

      {/* PASO 5: Fecha Automática del Sistema */}
      <section 
        id="seccion-fecha-automatica-denuncia"
        className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase font-semibold block">
              Fecha automática del sistema
            </span>
            <span className="text-sm font-bold text-slate-900 capitalize">
              {fechaActualTexto || 'Cargando fecha...'}
            </span>
          </div>
        </div>

        <div className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 self-start sm:self-auto">
          Generada automáticamente (no editable)
        </div>
      </section>

      {/* PASO 6: Revisión antes de enviar */}
      {claseSeleccionada && tipoSeleccionado && (
        <section 
          id="seccion-revision-previa-denuncia"
          className="bg-slate-50 rounded-2xl p-6 border-2 border-slate-200 space-y-4"
        >
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <FileText className="w-5 h-5 text-blue-900" />
            <h2 className="text-base font-bold text-slate-900">
              Revisión antes de enviar
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-slate-400 uppercase font-semibold block text-[10px]">Docente:</span>
              <strong className="text-slate-900 text-sm block mt-0.5">{claseSeleccionada.docente}</strong>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-slate-400 uppercase font-semibold block text-[10px]">Materia / Sigla / Grupo:</span>
              <span className="font-bold text-slate-900 block mt-0.5">
                {claseSeleccionada.nombreMateria} ({claseSeleccionada.sigla} - Gr. {claseSeleccionada.grupo})
              </span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-slate-400 uppercase font-semibold block text-[10px]">Día / Horario / Aula:</span>
              <span className="font-medium text-slate-800 block mt-0.5">
                {claseSeleccionada.dia} ({claseSeleccionada.horario}) • Aula: {claseSeleccionada.aula}
              </span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-slate-400 uppercase font-semibold block text-[10px]">Tipo de denuncia:</span>
              <strong className="text-blue-900 text-sm block mt-0.5">{tipoSeleccionado}</strong>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-slate-400 uppercase font-semibold block text-[10px]">Horario de clase:</span>
              <span className={`font-bold block mt-0.5 ${validacionHorario.estaEnHorario ? 'text-emerald-700' : 'text-red-700'}`}>
                {validacionHorario.estaEnHorario ? '✓ En horario de clase' : '⛔ Fuera de horario programado'}
              </span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-slate-400 uppercase font-semibold block text-[10px]">Prueba fotográfica:</span>
              <span className={`font-semibold block mt-0.5 ${imagenDataUrl ? 'text-emerald-700' : 'text-slate-500'}`}>
                {imagenDataUrl ? '✓ Foto adjunta' : 'Sin foto adjunta (Opcional)'}
              </span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 sm:col-span-2 md:col-span-3">
              <span className="text-slate-400 uppercase font-semibold block text-[10px]">Comentario / Descripción:</span>
              <span className="text-slate-800 italic block mt-0.5">
                {comentario.trim() || '(Sin descripción adicional)'}
              </span>
            </div>
          </div>

          {imagenDataUrl && (
            <div className="pt-2 border-t border-slate-200 flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-300 shrink-0 bg-slate-200">
                <img
                  src={imagenDataUrl}
                  alt="Miniatura de prueba"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-800 block">Fotografía de prueba adjunta</span>
                <span className="text-slate-500">{imagenNombre}</span>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Botón de Envío y Aviso de Anonimato */}
      <form onSubmit={handleEnviarDenuncia} className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              Su identidad permanece 100% protegida y anónima en todo momento.
            </span>
          </div>

          <button
            type="submit"
            id="btn-enviar-denuncia-varias"
            disabled={!puedeEnviar}
            className={`px-8 py-3.5 rounded-xl font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 ${
              puedeEnviar
                ? 'bg-blue-900 hover:bg-blue-800 active:bg-blue-950 text-white cursor-pointer hover:shadow-md'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Enviar denuncia anónima</span>
          </button>
        </div>

        {!puedeEnviar && (
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-center">
            {!claseSeleccionada 
              ? 'Por favor busque y seleccione una clase antes de enviar.'
              : !horarioPermitido
                ? `⛔ No se puede denunciar fuera del horario de clases (${claseSeleccionada.dia} ${claseSeleccionada.horario}).`
                : !tipoSeleccionado 
                  ? 'Por favor seleccione una categoría de denuncia.' 
                  : 'Debe escribir una descripción para la categoría "Otros".'}
          </p>
        )}
      </form>
    </div>
  );
};
