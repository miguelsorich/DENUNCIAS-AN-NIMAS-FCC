import React, { useState, useMemo } from 'react';
import { 
  OfertaClase, 
  MaestroOfertaVigente, 
  DenunciaVarias, 
  RespuestaOportuna, 
  SubeMateriales, 
  TipoDenunciaVirtual 
} from '../types';
import { 
  Laptop, 
  Search, 
  BookOpen, 
  GraduationCap, 
  Clock, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  ShieldCheck, 
  Send, 
  UploadCloud, 
  FileSpreadsheet, 
  MessageSquare, 
  AlertCircle, 
  HelpCircle, 
  Layers, 
  RotateCcw,
  Check,
  X,
  FileCheck2,
  AlertTriangle
} from 'lucide-react';
import { CargadorImagenPrueba } from './CargadorImagenPrueba';
import { CargadorMaestroVirtualRapido } from './CargadorMaestroVirtualRapido';
import { DenunciaVirtualConfirmacion } from './DenunciaVirtualConfirmacion';
import { buscarClasesEnMaestro } from '../utils/searchUtils';

interface DenunciaVirtualFormProps {
  maestroVirtual: MaestroOfertaVigente | null;
  onGuardarMaestroVirtual: (nuevoMaestro: MaestroOfertaVigente) => void;
  onRegistrarDenuncia: (denuncia: DenunciaVarias) => void;
}

const CATEGORIAS_DENUNCIA_VIRTUAL: { id: TipoDenunciaVirtual; titulo: string; descripcion: string }[] = [
  {
    id: 'No responde a consultas o dudas en plataforma',
    titulo: 'Falta de atención y respuesta a consultas',
    descripcion: 'El docente no atiende foros de dudas, mensajes en plataforma virtual ni correos de los estudiantes.',
  },
  {
    id: 'No sube materiales ni recursos a tiempo',
    titulo: 'Retraso o falta de materiales didácticos',
    descripcion: 'No se publican diapositivas, textos, grabaciones de clases sincrónicas ni guías para el avance de la materia.',
  },
  {
    id: 'Inasistencia / No se conecta a sesiones sincrónicas',
    titulo: 'Inasistencia a clases sincrónicas programadas',
    descripcion: 'El docente no inicia la videollamada (Teams, Zoom, Meet, etc.) a la hora establecida ni avisa con anticipación.',
  },
  {
    id: 'Obligar a comprar libros o cobros indebidos en plataforma',
    titulo: 'Cobros forzosos de libros o licencias',
    descripcion: 'Condicionamiento de notas o derechos de examen por compra de libros o pago de accesos digitales.',
  },
  {
    id: 'Obligar a asistir a seminarios o cursos externos',
    titulo: 'Obligar a asistir a seminarios virtuales pagados',
    descripcion: 'Exigencia de participar en congresos o seminarios externos como requisito para aprobar la materia.',
  },
  {
    id: 'Evaluaciones o exámenes irregulares / sin previo aviso',
    titulo: 'Evaluaciones irregulares o sin previo aviso',
    descripcion: 'Habilitación de exámenes fuera de cronograma, falta de tiempo suficiente en plataforma o problemas de calificación.',
  },
  {
    id: 'Otros motivos (Modalidad Virtual)',
    titulo: 'Otros motivos de modalidad virtual',
    descripcion: 'Cualquier otra irregularidad académica o administrativa ocurrida en el entorno virtual.',
  },
];

export const DenunciaVirtualForm: React.FC<DenunciaVirtualFormProps> = ({
  maestroVirtual,
  onGuardarMaestroVirtual,
  onRegistrarDenuncia,
}) => {
  const [terminoBusqueda, setTerminoBusqueda] = useState<string>('');
  const [claseSeleccionada, setClaseSeleccionada] = useState<OfertaClase | null>(null);
  const [mostrarSubirMaestro, setMostrarSubirMaestro] = useState<boolean>(false);

  // Preguntas clave de evaluación virtual
  const [respondeConsultas, setRespondeConsultas] = useState<RespuestaOportuna | null>(null);
  const [subeMateriales, setSubeMateriales] = useState<SubeMateriales | null>(null);

  // Categoría de denuncia
  const [tipoDenuncia, setTipoDenuncia] = useState<TipoDenunciaVirtual | null>(null);
  const [comentario, setComentario] = useState<string>('');
  const [imagenDataUrl, setImagenDataUrl] = useState<string | undefined>(undefined);
  const [imagenNombre, setImagenNombre] = useState<string | undefined>(undefined);

  // Estado de confirmación
  const [denunciaExitosa, setDenunciaExitosa] = useState<DenunciaVarias | null>(null);

  const registrosMaestro = maestroVirtual?.registros || [];

  // Filtrado de materias virtuales
  const resultadosFiltrados = useMemo(() => {
    return buscarClasesEnMaestro(registrosMaestro, terminoBusqueda);
  }, [registrosMaestro, terminoBusqueda]);

  const handleSeleccionarClase = (clase: OfertaClase) => {
    setClaseSeleccionada(clase);
  };

  const handleCambiarClase = () => {
    setClaseSeleccionada(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claseSeleccionada || !respondeConsultas || !subeMateriales || !tipoDenuncia) {
      return;
    }

    const nuevaDenuncia: DenunciaVarias = {
      id: `virt-den-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      modalidad: 'virtual',
      claseId: claseSeleccionada.id,
      docente: claseSeleccionada.docente,
      docenteDenunciado: claseSeleccionada.docente,
      nombreMateria: claseSeleccionada.nombreMateria,
      sigla: claseSeleccionada.sigla,
      grupo: claseSeleccionada.grupo,
      dia: claseSeleccionada.dia,
      horario: claseSeleccionada.horario,
      aula: claseSeleccionada.aula,
      tipoDenuncia: tipoDenuncia,
      respondeConsultasOportunamente: respondeConsultas,
      subeMaterialesATiempo: subeMateriales,
      comentario: comentario.trim(),
      imagenAdjunta: imagenDataUrl,
      imagenNombre: imagenNombre,
      fechaRegistro: new Date().toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      esAnonimo: true,
    };

    setDenunciaExitosa(nuevaDenuncia);
    onRegistrarDenuncia(nuevaDenuncia);
  };

  const handleRealizarOtra = () => {
    setDenunciaExitosa(null);
    setClaseSeleccionada(null);
    setRespondeConsultas(null);
    setSubeMateriales(null);
    setTipoDenuncia(null);
    setComentario('');
    setImagenDataUrl(undefined);
    setImagenNombre(undefined);
    setTerminoBusqueda('');
  };

  if (denunciaExitosa) {
    return (
      <DenunciaVirtualConfirmacion
        denuncia={denunciaExitosa}
        onRealizarOtra={handleRealizarOtra}
      />
    );
  }

  const formularioListo =
    claseSeleccionada !== null &&
    respondeConsultas !== null &&
    subeMateriales !== null &&
    tipoDenuncia !== null;

  return (
    <div className="space-y-6">
      {/* Banner Informativo de Modalidad Virtual */}
      <section className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-7 text-white shadow-md border border-blue-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 text-xs font-bold uppercase tracking-wider">
                <Laptop className="w-3.5 h-3.5 text-amber-400" />
                Modalidad Virtual — Campus Online
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                100% Anónimo
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Supervisión de Docencia y Aulas Virtuales
            </h2>
            <p className="text-xs sm:text-sm text-blue-100/90 max-w-2xl leading-relaxed">
              Evalúa el cumplimiento de la docencia en plataforma virtual: respuesta a consultas, publicación oportuna de materiales didácticos y reportes de irregularidades.
            </p>
          </div>

          {/* Botón para cargar Maestro de Oferta Virtual */}
          <button
            type="button"
            id="btn-subir-maestro-virtual"
            onClick={() => setMostrarSubirMaestro(!mostrarSubirMaestro)}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition-all text-xs font-bold flex items-center gap-2 shrink-0 self-start md:self-auto cursor-pointer"
          >
            <UploadCloud className="w-4 h-4 text-amber-400" />
            <span>{mostrarSubirMaestro ? 'Ocultar Carga de Oferta' : 'Subir Oferta Virtual'}</span>
          </button>
        </div>
      </section>

      {/* Modal/Cargador de Maestro Virtual si está abierto */}
      {mostrarSubirMaestro && (
        <CargadorMaestroVirtualRapido
          maestroVirtualVigente={maestroVirtual}
          onGuardarMaestroVirtual={(nuevo) => {
            onGuardarMaestroVirtual(nuevo);
            setMostrarSubirMaestro(false);
          }}
          onCerrar={() => setMostrarSubirMaestro(false)}
        />
      )}

      {/* PASO 1: Búsqueda y Selección de Materia Virtual */}
      <section 
        id="seccion-buscar-clase-virtual"
        className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-950 flex items-center justify-center font-black text-xs">
              1
            </span>
            <h3 className="text-base font-bold text-slate-900">
              Seleccionar Materia y Docente Virtual
            </h3>
          </div>

          {claseSeleccionada ? (
            <button
              type="button"
              onClick={handleCambiarClase}
              className="text-xs font-bold text-blue-900 hover:text-blue-950 flex items-center gap-1 hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Cambiar materia seleccionada</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold">{registrosMaestro.length}</span> materias virtuales en catálogo
            </div>
          )}
        </div>

        {!claseSeleccionada ? (
          <div className="space-y-4">
            {/* Buscador de materias virtuales */}
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="input-buscar-clase-virtual"
                type="text"
                value={terminoBusqueda}
                onChange={(e) => setTerminoBusqueda(e.target.value)}
                placeholder="Escribe la materia, sigla (ej: CPA-100), grupo (ej: V1) o nombre del docente..."
                className="w-full pl-11 pr-10 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 focus:outline-hidden transition-all placeholder:text-slate-400"
              />
              {terminoBusqueda && (
                <button
                  type="button"
                  onClick={() => setTerminoBusqueda('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200/50 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Listado de resultados */}
            <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 rounded-xl border border-slate-200">
              {resultadosFiltrados.length === 0 ? (
                <div className="p-8 text-center text-slate-500 space-y-2">
                  <BookOpen className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-xs sm:text-sm font-semibold">
                    No se encontraron materias virtuales con "{terminoBusqueda}"
                  </p>
                  <p className="text-xs text-slate-400">
                    Puedes subir la lista de materias de tu carrera usando el botón "Subir Oferta Virtual".
                  </p>
                </div>
              ) : (
                resultadosFiltrados.map((clase) => (
                  <div
                    key={clase.id}
                    onClick={() => handleSeleccionarClase(clase)}
                    className="p-3.5 sm:p-4 hover:bg-blue-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 bg-blue-100 text-blue-950 rounded-md">
                          {clase.sigla} - Gr. {clase.grupo}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-950">
                          {clase.nombreMateria}
                        </h4>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                        <GraduationCap className="w-3.5 h-3.5 text-blue-900" />
                        <span>Docente: <strong>{clase.docente}</strong></span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <Laptop className="w-3 h-3 text-slate-400" />
                          {clase.aula}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {clase.dia}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {clase.horario}
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
          /* Materia Virtual Seleccionada */
          <div className="p-4 sm:p-5 rounded-xl border-2 border-blue-900 bg-blue-50/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Materia Virtual Seleccionada
              </div>
              <span className="text-[11px] font-mono text-slate-500">ID: {claseSeleccionada.id}</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-blue-200 space-y-3">
              <div>
                <span className="text-slate-400 text-xs uppercase block font-semibold">Docente Titular:</span>
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
                  <span className="text-slate-400 block text-[11px] uppercase font-semibold">Plataforma / Aula:</span>
                  <span className="text-slate-800 font-medium block">{claseSeleccionada.aula}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* FORMULARIO DE EVALUACIÓN Y REPORTE VIRTUAL */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* PREGUNTA 1: ¿El docente responde de manera oportuna las consultas? */}
        <section 
          id="seccion-pregunta-consultas-oportunas"
          className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-3"
        >
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-950 flex items-center justify-center font-black text-xs">
              2
            </span>
            <h3 className="text-base font-bold text-slate-900">
              ¿El docente responde de manera oportuna a las consultas y dudas de los estudiantes?
            </h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Evalúa la atención del docente en los foros de la plataforma virtual, grupos oficiales o correos institucionales.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {/* Opción SI */}
            <button
              type="button"
              id="opt-consultas-si"
              onClick={() => setRespondeConsultas('SI')}
              className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                respondeConsultas === 'SI'
                  ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm">✓ Sí, oportunamente</span>
                {respondeConsultas === 'SI' && <Check className="w-4 h-4 text-emerald-600" />}
              </div>
              <p className="text-xs opacity-80 leading-tight">
                Responde dudas y consultas dentro de plazos razonables.
              </p>
            </button>

            {/* Opción REGULAR */}
            <button
              type="button"
              id="opt-consultas-regular"
              onClick={() => setRespondeConsultas('REGULAR')}
              className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                respondeConsultas === 'REGULAR'
                  ? 'border-amber-500 bg-amber-50/70 text-amber-950 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm">⚠️ Con mucho retraso</span>
                {respondeConsultas === 'REGULAR' && <Check className="w-4 h-4 text-amber-600" />}
              </div>
              <p className="text-xs opacity-80 leading-tight">
                Tarda semanas o responde tarde antes de las evaluaciones.
              </p>
            </button>

            {/* Opción NO */}
            <button
              type="button"
              id="opt-consultas-no"
              onClick={() => setRespondeConsultas('NO')}
              className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                respondeConsultas === 'NO'
                  ? 'border-red-500 bg-red-50/70 text-red-950 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm">⛔ No responde</span>
                {respondeConsultas === 'NO' && <Check className="w-4 h-4 text-red-600" />}
              </div>
              <p className="text-xs opacity-80 leading-tight">
                Ignora mensajes, foros de consultas y dudas académicas.
              </p>
            </button>
          </div>
        </section>

        {/* PREGUNTA 2: ¿El docente sube sus materiales didácticos a tiempo? */}
        <section 
          id="seccion-pregunta-materiales-tiempo"
          className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-3"
        >
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-950 flex items-center justify-center font-black text-xs">
              3
            </span>
            <h3 className="text-base font-bold text-slate-900">
              ¿El docente sube sus materiales didácticos, grabaciones y guías a tiempo?
            </h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Indica si el docente mantiene actualizada la plataforma virtual con los temas, ejercicios, lecturas y recursos correspondientes al avance.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {/* Opción SI */}
            <button
              type="button"
              id="opt-materiales-si"
              onClick={() => setSubeMateriales('SI')}
              className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                subeMateriales === 'SI'
                  ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm">✓ Sí, a tiempo</span>
                {subeMateriales === 'SI' && <Check className="w-4 h-4 text-emerald-600" />}
              </div>
              <p className="text-xs opacity-80 leading-tight">
                Sube guías, diapositivas y lecturas puntualmente según el avance.
              </p>
            </button>

            {/* Opción RETRASO */}
            <button
              type="button"
              id="opt-materiales-retraso"
              onClick={() => setSubeMateriales('RETRASO')}
              className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                subeMateriales === 'RETRASO'
                  ? 'border-amber-500 bg-amber-50/70 text-amber-950 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm">⚠️ Sube con retraso</span>
                {subeMateriales === 'RETRASO' && <Check className="w-4 h-4 text-amber-600" />}
              </div>
              <p className="text-xs opacity-80 leading-tight">
                Publica los materiales fuera de fecha o pocos días antes del examen.
              </p>
            </button>

            {/* Opción NO */}
            <button
              type="button"
              id="opt-materiales-no"
              onClick={() => setSubeMateriales('NO')}
              className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                subeMateriales === 'NO'
                  ? 'border-red-500 bg-red-50/70 text-red-950 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm">⛔ No sube materiales</span>
                {subeMateriales === 'NO' && <Check className="w-4 h-4 text-red-600" />}
              </div>
              <p className="text-xs opacity-80 leading-tight">
                El aula virtual está desactualizada, vacía o sin recursos didácticos.
              </p>
            </button>
          </div>
        </section>

        {/* PASO 4: Tipo de Denuncia / Irregularidad Virtual */}
        <section 
          id="seccion-tipo-denuncia-virtual"
          className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4"
        >
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-950 flex items-center justify-center font-black text-xs">
              4
            </span>
            <h3 className="text-base font-bold text-slate-900">
              Motivo Principal de la Denuncia Virtual
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {CATEGORIAS_DENUNCIA_VIRTUAL.map((cat) => {
              const seleccionado = tipoDenuncia === cat.id;
              return (
                <div
                  key={cat.id}
                  onClick={() => setTipoDenuncia(cat.id)}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer space-y-1.5 flex flex-col justify-between ${
                    seleccionado
                      ? 'bg-blue-50/70 border-blue-900 ring-1 ring-blue-900/30 shadow-xs'
                      : 'bg-slate-50/60 hover:bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className={`font-bold text-xs sm:text-sm ${seleccionado ? 'text-blue-950' : 'text-slate-900'}`}>
                      {cat.titulo}
                    </span>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                      seleccionado ? 'bg-blue-900 border-blue-900 text-white' : 'border-slate-300 bg-white'
                    }`}>
                      {seleccionado && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {cat.descripcion}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* PASO 5: Detalle / Comentario de la situación */}
        <section 
          id="seccion-comentario-denuncia-virtual"
          className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-950 flex items-center justify-center font-black text-xs">
                5
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Detalle y Comentario de la Situación
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 font-semibold">
              {comentario.length} / 1000 caracteres
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Explica con claridad los hechos, fechas o detalles específicos sobre la falta cometida por el docente en la modalidad virtual.
          </p>

          <textarea
            id="textarea-comentario-virtual"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            rows={4}
            maxLength={1000}
            placeholder="Ejemplo: El docente no sube las diapositivas desde hace 3 semanas y en los foros de consulta de Moodle no responde a las dudas sobre el proyecto final..."
            className="w-full p-4 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 focus:outline-hidden transition-all resize-y placeholder:text-slate-400"
          />
        </section>

        {/* PASO 6: Cargador de Captura de Pantalla o Evidencia Fotográfica Opcional */}
        <CargadorImagenPrueba
          imagenDataUrl={imagenDataUrl}
          imagenNombre={imagenNombre}
          onImagenSeleccionada={(url, nom) => {
            setImagenDataUrl(url);
            setImagenNombre(nom);
          }}
          onQuitarImagen={() => {
            setImagenDataUrl(undefined);
            setImagenNombre(undefined);
          }}
          titulo="Captura de pantalla o comprobante digital (Opcional)"
          descripcion="Si tienes una captura de pantalla del aula virtual vacía, chat de Teams, WhatsApp o foros sin respuesta, puedes adjuntarla aquí. Si no tienes captura, puedes enviar la denuncia de todos modos."
        />

        {/* GARANTÍA DE ANONIMATO Y BOTÓN DE ENVÍO */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
          <div className="flex items-center gap-3 text-xs text-slate-600">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-slate-900 block font-bold">
                Garantía de Confidencialidad y Anonimato Total
              </strong>
              <span>
                Esta denuncia se envía directamente a la supervisión académica facultativa. No se almacena tu nombre, correo ni datos de dispositivo.
              </span>
            </div>
          </div>

          <button
            type="submit"
            id="btn-enviar-denuncia-virtual"
            disabled={!formularioListo}
            className={`w-full py-4 px-6 rounded-xl font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 shadow-md ${
              formularioListo
                ? 'bg-blue-900 hover:bg-blue-800 text-white cursor-pointer hover:shadow-lg'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            <Send className="w-5 h-5" />
            <span>Enviar Denuncia Modalidad Virtual</span>
          </button>
        </div>
      </form>
    </div>
  );
};
