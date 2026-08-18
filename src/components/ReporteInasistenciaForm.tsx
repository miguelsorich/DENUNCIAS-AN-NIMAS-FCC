import React, { useState, useEffect, useMemo } from 'react';
import { OfertaClase, ReporteInasistencia } from '../types';
import { 
  CheckCircle2, 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Send, 
  AlertTriangle, 
  FileText, 
  UserX, 
  MessageSquare,
  Lock,
  Camera,
  Image as ImageIcon
} from 'lucide-react';
import { validarHorarioClase } from '../utils/scheduleValidator';
import { CargadorImagenPrueba } from './CargadorImagenPrueba';

interface ReporteInasistenciaFormProps {
  clase: OfertaClase;
  onCambiarClase: () => void;
  onEnviarReporte: (reporte: ReporteInasistencia) => void;
}

export const ReporteInasistenciaForm: React.FC<ReporteInasistenciaFormProps> = ({
  clase,
  onCambiarClase,
  onEnviarReporte,
}) => {
  const [inasistenciaMarcada, setInasistenciaMarcada] = useState<boolean>(false);
  const [comentario, setComentario] = useState<string>('');
  const [imagenDataUrl, setImagenDataUrl] = useState<string | undefined>(undefined);
  const [imagenNombre, setImagenNombre] = useState<string | undefined>(undefined);
  const [fechaActualTexto, setFechaActualTexto] = useState<string>('');
  const [horaActualRef, setHoraActualRef] = useState<Date>(new Date());

  // Fecha generada automáticamente en el momento actual
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

  // Validación estricta del horario de la clase seleccionada
  const validacionHorario = useMemo(() => {
    return validarHorarioClase(clase.dia, clase.horario, horaActualRef);
  }, [clase.dia, clase.horario, horaActualRef]);

  const horarioPermitido = validacionHorario.estaEnHorario;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inasistenciaMarcada || !horarioPermitido) return;

    const reporteFinal: ReporteInasistencia = {
      id: `rep-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      claseId: clase.id,
      sigla: clase.sigla,
      grupo: clase.grupo,
      nombreMateria: clase.nombreMateria,
      docente: clase.docente,
      dia: clase.dia,
      horario: clase.horario,
      aula: clase.aula,
      inasistenciaMarcada: true,
      comentario: comentario.trim() ? comentario.trim() : undefined,
      imagenAdjunta: imagenDataUrl,
      imagenNombre: imagenNombre,
      fechaReporte: fechaActualTexto,
      esAnonimo: true,
    };

    onEnviarReporte(reporteFinal);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. SECCIÓN: CLASE SELECCIONADA (Datos protegidos, sin modificación manual) */}
      <section 
        id="seccion-clase-seleccionada-reporte"
        aria-labelledby="titulo-clase-seleccionada"
        className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center shrink-0 shadow-xs">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                Paso 1 • Clase confirmada
              </span>
              <h2 id="titulo-clase-seleccionada" className="text-xl font-bold text-slate-900 mt-0.5">
                Clase seleccionada
              </h2>
            </div>
          </div>

          <button
            type="button"
            id="btn-cambiar-seleccion-clase"
            onClick={onCambiarClase}
            className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold text-xs sm:text-sm shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0 self-start sm:self-auto"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600" />
            <span>Cambiar selección</span>
          </button>
        </div>

        {/* Información fidedigna de la clase (Solo lectura) */}
        <div className="bg-slate-50/80 rounded-xl p-5 border border-slate-200 text-sm grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Docente:
              </span>
              <p className="text-base font-bold text-slate-900">
                {clase.docente}
              </p>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Materia:
              </span>
              <p className="text-base font-semibold text-slate-900">
                {clase.nombreMateria}
              </p>
            </div>

            <div className="flex items-center gap-6">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Sigla:
                </span>
                <p className="font-mono font-bold text-blue-900 text-base">
                  {clase.sigla}
                </p>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Grupo:
                </span>
                <p className="font-bold text-slate-900 text-base">
                  {clase.grupo}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3 md:border-l md:border-slate-200 md:pl-5">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Día programado:
              </span>
              <div className="flex items-center gap-1.5 mt-0.5 text-slate-800 font-semibold">
                <Calendar className="w-4 h-4 text-blue-800" />
                <span>{clase.dia}</span>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Horario programado:
              </span>
              <div className="flex items-center gap-1.5 mt-0.5 text-slate-800 font-mono font-semibold">
                <Clock className="w-4 h-4 text-blue-800" />
                <span>{clase.horario}</span>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Aula:
              </span>
              <div className="flex items-center gap-1.5 mt-0.5 text-slate-800 font-semibold">
                <MapPin className="w-4 h-4 text-blue-800" />
                <span>{clase.aula}</span>
              </div>
            </div>
          </div>
        </div>

        {/* VALIDACIÓN EN TIEMPO REAL DEL HORARIO DE CLASE */}
        <div className={`p-4 rounded-xl border transition-all ${
          validacionHorario.estaEnHorario
            ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
            : 'bg-red-50 border-red-300 text-red-950'
        }`}>
          <div className="flex items-start sm:items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
              validacionHorario.estaEnHorario 
                ? 'bg-emerald-200 text-emerald-900' 
                : 'bg-red-200 text-red-900'
            }`}>
              {validacionHorario.estaEnHorario ? (
                <Clock className="w-5 h-5" />
              ) : (
                <Lock className="w-5 h-5" />
              )}
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <strong className="text-sm sm:text-base font-bold">
                  {validacionHorario.estaEnHorario 
                    ? '✓ Clase en horario activo' 
                    : '⛔ Fuera de horario programado'}
                </strong>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  validacionHorario.estaEnHorario
                    ? 'bg-emerald-200 text-emerald-900'
                    : 'bg-red-200 text-red-900'
                }`}>
                  {validacionHorario.estaEnHorario ? 'Permitido' : 'Bloqueado'}
                </span>
              </div>
              <p className="text-xs leading-relaxed opacity-90">
                {validacionHorario.mensaje}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECCIÓN: MARCAR LA INASISTENCIA */}
      <section 
        id="seccion-marcar-inasistencia"
        className={`bg-white rounded-2xl p-6 sm:p-7 border-2 transition-all shadow-xs space-y-4 ${
          !horarioPermitido 
            ? 'opacity-60 border-slate-200' 
            : inasistenciaMarcada 
              ? 'border-red-300 bg-red-50/20' 
              : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center gap-2">
          <UserX className="w-5 h-5 text-red-600" />
          <h3 className="text-lg font-bold text-slate-900">
            Registro de Inasistencia
          </h3>
        </div>

        <label 
          htmlFor="check-inasistencia-docente"
          className={`flex items-start gap-4 p-4 sm:p-5 rounded-xl border-2 transition-all ${
            !horarioPermitido
              ? 'cursor-not-allowed bg-slate-100 border-slate-300 text-slate-500'
              : inasistenciaMarcada
                ? 'bg-red-50 border-red-500 text-red-950 shadow-xs cursor-pointer'
                : 'bg-slate-50 border-slate-300 hover:bg-slate-100 text-slate-800 cursor-pointer'
          }`}
        >
          <input
            id="check-inasistencia-docente"
            type="checkbox"
            disabled={!horarioPermitido}
            checked={inasistenciaMarcada}
            onChange={(e) => setInasistenciaMarcada(e.target.checked)}
            className="w-6 h-6 mt-0.5 text-red-600 rounded border-slate-300 focus:ring-red-500 cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <div className="space-y-1">
            <span className="text-base sm:text-lg font-bold block">
              El docente no asistió a esta clase
            </span>
            <p className="text-xs sm:text-sm text-slate-600">
              Marca esta casilla para certificar que el docente {clase.docente} no se presentó a impartir la clase de {clase.nombreMateria} ({clase.sigla} - Gr. {clase.grupo}).
            </p>
          </div>
        </label>

        {!horarioPermitido && (
          <p className="text-xs text-red-700 font-bold flex items-center gap-1.5 bg-red-50 p-3 rounded-lg border border-red-200">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            No puedes reportar la inasistencia fuera del horario de clases ({clase.dia} {clase.horario}).
          </p>
        )}

        {horarioPermitido && !inasistenciaMarcada && (
          <p className="text-xs text-amber-700 font-medium flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            Debes marcar esta opción para habilitar el envío del reporte.
          </p>
        )}
      </section>

      {/* 3. SECCIÓN: CARGAR FOTO / IMAGEN COMO PRUEBA (OPCIONAL) */}
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
        titulo="Fotografía o imagen como prueba de inasistencia (Opcional)"
        descripcion="Si tienes una foto del aula vacía, captura de mensaje o aviso de suspensión, puedes adjuntarla aquí. Si no tienes foto, puedes enviar el reporte igualmente."
      />

      {/* 4. SECCIÓN: COMENTARIO OPCIONAL */}
      <section 
        id="seccion-comentario-opcional"
        className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-3"
      >
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-slate-600" />
          <label 
            htmlFor="textarea-comentario" 
            className="text-base font-bold text-slate-900 block"
          >
            Comentario (opcional)
          </label>
        </div>

        <p className="text-xs text-slate-500">
          Puedes agregar cualquier detalle adicional sobre lo ocurrido (por ejemplo: tiempo de espera, aviso de suspensión o circunstancias del aula). No es obligatorio.
        </p>

        <textarea
          id="textarea-comentario"
          rows={3}
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Escribe aquí algún detalle adicional si lo deseas (opcional)..."
          className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-800 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-y"
        />
      </section>

      {/* 5. SECCIÓN: FECHA AUTOMÁTICA Y 6. ANONIMATO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fecha automática (Solo lectura, generada por el sistema) */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-1.5">
          <div className="flex items-center gap-2 text-slate-700 font-bold text-xs uppercase tracking-wider">
            <Clock className="w-4 h-4 text-blue-800" />
            <span>Fecha y hora automática del reporte</span>
          </div>
          <p className="text-base font-bold text-slate-900 capitalize">
            {fechaActualTexto || 'Cargando fecha actual...'}
          </p>
          <p className="text-[11px] text-slate-500">
            Registrada de manera automática por el sistema en el instante del reporte.
          </p>
        </div>

        {/* Aviso explícito de Anonimato */}
        <div className="bg-blue-50/80 rounded-2xl p-5 border border-blue-200 space-y-1.5">
          <div className="flex items-center gap-2 text-blue-950 font-bold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-blue-800" />
            <span>Garantía de privacidad</span>
          </div>
          <p className="text-base font-bold text-blue-950">
            Tu reporte es anónimo.
          </p>
          <p className="text-[11px] text-blue-800 leading-relaxed">
            No se solicita ni se registra tu nombre, código, correo electrónico, teléfono ni ningún dato personal.
          </p>
        </div>
      </div>

      {/* 7. SECCIÓN: REVISIÓN ANTES DEL ENVÍO */}
      <section 
        id="seccion-resumen-revision"
        className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-5"
      >
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <FileText className="w-5 h-5 text-blue-900" />
          <h3 className="text-lg font-bold text-slate-900">
            Revisión del reporte antes del envío
          </h3>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-200 space-y-3 text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <strong className="text-slate-500 block text-xs uppercase">Docente:</strong>
              <span className="font-bold text-slate-900">{clase.docente}</span>
            </div>
            <div>
              <strong className="text-slate-500 block text-xs uppercase">Materia:</strong>
              <span className="font-semibold text-slate-900">{clase.nombreMateria}</span>
            </div>
            <div>
              <strong className="text-slate-500 block text-xs uppercase">Sigla y Grupo:</strong>
              <span className="font-bold text-slate-900">{clase.sigla} — Grupo {clase.grupo}</span>
            </div>
            <div>
              <strong className="text-slate-500 block text-xs uppercase">Día, Horario y Aula:</strong>
              <span className="text-slate-900">{clase.dia} | {clase.horario} | Aula {clase.aula}</span>
            </div>
            <div>
              <strong className="text-slate-500 block text-xs uppercase">Fecha automática:</strong>
              <span className="font-semibold text-slate-900 capitalize">{fechaActualTexto}</span>
            </div>
            <div>
              <strong className="text-slate-500 block text-xs uppercase">Inasistencia marcada:</strong>
              <span className={`font-bold ${inasistenciaMarcada ? 'text-red-700' : 'text-slate-400'}`}>
                {inasistenciaMarcada ? '✓ El docente no asistió a esta clase' : '✕ No marcada'}
              </span>
            </div>
            <div>
              <strong className="text-slate-500 block text-xs uppercase">Horario de clase:</strong>
              <span className={`font-bold ${validacionHorario.estaEnHorario ? 'text-emerald-700' : 'text-red-700'}`}>
                {validacionHorario.estaEnHorario ? '✓ En horario de clase' : '⛔ Fuera de horario programado'}
              </span>
            </div>
            <div>
              <strong className="text-slate-500 block text-xs uppercase">Prueba fotográfica:</strong>
              <span className={`font-semibold ${imagenDataUrl ? 'text-emerald-700' : 'text-slate-500'}`}>
                {imagenDataUrl ? '✓ Foto adjunta' : 'Sin foto adjunta (Opcional)'}
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

          {comentario.trim() && (
            <div className="pt-2 border-t border-slate-200">
              <strong className="text-slate-500 block text-xs uppercase mb-0.5">Comentario:</strong>
              <p className="text-slate-800 italic bg-white p-2.5 rounded-lg border border-slate-200">
                &quot;{comentario.trim()}&quot;
              </p>
            </div>
          )}
        </div>

        {/* Botón principal de Envío */}
        <div className="pt-2">
          <button
            type="submit"
            id="btn-enviar-reporte"
            disabled={!inasistenciaMarcada || !horarioPermitido}
            className={`w-full py-4 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 shadow-xs ${
              inasistenciaMarcada && horarioPermitido
                ? 'bg-blue-900 hover:bg-blue-800 active:bg-blue-950 text-white hover:shadow-md cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
            }`}
          >
            <Send className="w-5 h-5" />
            <span>Enviar reporte</span>
          </button>

          {!horarioPermitido ? (
            <p className="text-center text-xs text-red-600 font-bold mt-2">
              ⛔ No se puede enviar el reporte porque la clase está fuera del horario programado ({clase.dia} {clase.horario}).
            </p>
          ) : !inasistenciaMarcada ? (
            <p className="text-center text-xs text-slate-500 mt-2">
              Para habilitar el botón de envío, marca la casilla &quot;El docente no asistió a esta clase&quot;.
            </p>
          ) : null}
        </div>
      </section>
    </form>
  );
};
