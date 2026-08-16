import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileSpreadsheet, 
  AlertCircle, 
  CheckCircle2, 
  Shield, 
  Download,
  Info,
  Calendar,
  Layers,
  FileCheck2,
  FileCode,
  Sparkles
} from 'lucide-react';
import { MaestroOfertaVigente, ValidacionImportacion } from '../types';
import { 
  procesarArchivoMaestro,
  validarYParsearCSV,
  validarYParsearMatrizFilas,
  COLUMNAS_REQUERIDAS,
  descargarPlantillaExcel,
  descargarPlantillaCSV,
  MUESTRA_REGISTROS_REALES
} from '../utils/fileParser';
import { ModalReemplazarMaestro } from './ModalReemplazarMaestro';
import { VistaPreviaMaestro } from './VistaPreviaMaestro';
import { TablaMaestroOferta } from './TablaMaestroOferta';

interface AdminImportarMaestroProps {
  maestroVigente: MaestroOfertaVigente | null;
  onGuardarMaestro: (nuevoMaestro: MaestroOfertaVigente) => void;
}

export const AdminImportarMaestro: React.FC<AdminImportarMaestroProps> = ({
  maestroVigente,
  onGuardarMaestro,
}) => {
  const [semestreSeleccionado, setSemestreSeleccionado] = useState<string>('Semestre II / 2026');
  const [nombreArchivo, setNombreArchivo] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [estaProcesando, setEstaProcesando] = useState<boolean>(false);
  const [errorValidacion, setErrorValidacion] = useState<ValidacionImportacion | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [mostrarModalReemplazo, setMostrarModalReemplazo] = useState<boolean>(false);
  const [vistaPreviaDatos, setVistaPreviaDatos] = useState<ValidacionImportacion | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const procesarArchivoSeleccionado = async (file: File) => {
    setErrorValidacion(null);
    setMensajeExito(null);
    setVistaPreviaDatos(null);
    setNombreArchivo(file.name);
    setEstaProcesando(true);

    try {
      const validacion = await procesarArchivoMaestro(file);

      if (!validacion.esValido || !validacion.registros) {
        setErrorValidacion(validacion);
        setVistaPreviaDatos(null);
      } else {
        setErrorValidacion(null);
        setVistaPreviaDatos(validacion);
      }
    } catch (err) {
      setErrorValidacion({
        esValido: false,
        columnasFaltantes: [...COLUMNAS_REQUERIDAS],
        columnasEncontradas: [],
        totalFilas: 0,
        errores: [
          `Error al leer el archivo: ${err instanceof Error ? err.message : 'Formato no legible'}`,
        ],
      });
    } finally {
      setEstaProcesando(false);
    }
  };

  const handleIniciarImportacionDesdeVistaPrevia = () => {
    if (!vistaPreviaDatos || !vistaPreviaDatos.registros) return;

    // Si ya existe un Maestro de Oferta cargado, solicitar confirmación de reemplazo
    if (maestroVigente && maestroVigente.registros.length > 0) {
      setMostrarModalReemplazo(true);
    } else {
      ejecutarImportacionFinal(vistaPreviaDatos, nombreArchivo);
    }
  };

  const ejecutarImportacionFinal = (validacion: ValidacionImportacion, fileName: string) => {
    const now = new Date();
    const fechaFormateada = now.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const nuevoMaestro: MaestroOfertaVigente = {
      semestre: semestreSeleccionado,
      fechaImportacion: fechaFormateada,
      nombreArchivo: fileName || 'maestro_oferta_semestre.xlsx',
      totalRegistros: validacion.registros?.length || 0,
      registros: validacion.registros || [],
    };

    onGuardarMaestro(nuevoMaestro);
    setMensajeExito('Maestro de Oferta importado correctamente.');
    setMostrarModalReemplazo(false);
    setVistaPreviaDatos(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleConfirmarReemplazo = () => {
    if (vistaPreviaDatos && vistaPreviaDatos.registros) {
      ejecutarImportacionFinal(vistaPreviaDatos, nombreArchivo);
    }
  };

  const handleCancelarReemplazo = () => {
    setMostrarModalReemplazo(false);
  };

  const handleCancelarVistaPrevia = () => {
    setVistaPreviaDatos(null);
    setNombreArchivo('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      procesarArchivoSeleccionado(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      procesarArchivoSeleccionado(e.dataTransfer.files[0]);
    }
  };

  // Pruebas directas con datos exactos del usuario (ADM100, etc.)
  const handleCargarPruebaValidaExcel = () => {
    setErrorValidacion(null);
    setMensajeExito(null);
    setNombreArchivo('Maestro_Oferta_Facultad_2026.xlsx');
    
    // Matriz completa con las 8 columnas requeridas y registros de ejemplo real
    const matrizValida = [
      ['SIGLA', 'GR', 'NOMBRE DE LA MATERIA', 'CARRERAS', 'DOCENTE', 'DÍA', 'HORARIO', 'AULA'],
      ['ADM100', 'A', 'ADMINISTRACION GENERAL', '105-5-109-1', 'AZOGUE ROMERO OSCAR', 'L-M-V', '19:45-21:15', '21318'],
      ['INF110', 'B', 'INTRODUCCION A LA INFORMATICA', '187-3-187-4', 'ZUNA VELASCO HERNAN', 'M-J', '07:00-09:15', '236-4'],
      ['MAT101', '1', 'CALCULO I', '105-5-187-3-187-4', 'GUTIERREZ ROJAS JUAN CARLOS', 'L-M-V', '07:00-08:30', '21312'],
      ['FIS100', 'A', 'FISICA I', '187-3-187-4', 'CALDERON MAMANI RENE', 'M-J', '09:15-11:30', 'LAB-FIS'],
      ['LIN100', 'C', 'INGLES TECNICO I', '105-5-109-1', 'SUAREZ MONTERO ELIZABETH', 'L-M-V', '11:30-13:00', '21314'],
      ['INF210', 'A', 'PROGRAMACION I', '187-3-187-4', 'FLORES FLORES WALTER', 'M-J', '14:00-16:15', 'LAB-201'],
      ['EST101', '2', 'ESTADISTICA I', '105-5-109-1', 'RODRIGUEZ PAREDES MARCO', 'L-M-V', '16:00-17:30', '21316'],
      ['SIS322', 'A', 'SISTEMAS OPERATIVOS I', '187-3-187-4', 'TORRICO JORGE ALBERTO', 'L-M-V', '18:15-19:45', '236-2'],
      ['INF312', '1', 'BASE DE DATOS I', '187-3-187-4', 'VARGAS BLANCO PATRICIA', 'M-J', '16:15-18:30', 'LAB-BD'],
    ];

    const validacion = validarYParsearMatrizFilas(matrizValida);
    setVistaPreviaDatos(validacion);
  };

  const handleCargarPruebaInvalida = () => {
    setErrorValidacion(null);
    setMensajeExito(null);
    setVistaPreviaDatos(null);
    setNombreArchivo('Archivo_Incompleto_Sin_Aulas_Ni_Docente.xlsx');

    // Matriz con columnas faltantes: falta DOCENTE, DÍA, AULA
    const matrizIncompleta = [
      ['SIGLA', 'GR', 'NOMBRE DE LA MATERIA', 'CARRERAS', 'HORARIO'],
      ['ADM100', 'A', 'ADMINISTRACION GENERAL', '105-5-109-1', '19:45-21:15'],
      ['INF110', 'B', 'INTRODUCCION A LA INFORMATICA', '187-3-187-4', '07:00-09:15'],
    ];

    const validacion = validarYParsearMatrizFilas(matrizIncompleta);
    setErrorValidacion(validacion);
  };

  return (
    <div className="space-y-8">
      {/* Sección principal requerida: Importar Maestro de Oferta */}
      <section className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-blue-900 bg-blue-100 px-2.5 py-0.5 rounded-md">
                <Shield className="w-3.5 h-3.5" />
                Módulo 1 — Parte 1 • Exclusivo Administrador
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Importar Maestro de Oferta
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Importa al inicio de cada semestre el archivo oficial del Maestro de Oferta vigente en formato <strong>.xlsx</strong> o <strong>.csv</strong>.
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
            <label htmlFor="select-semestre" className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Semestre a importar
            </label>
            <select
              id="select-semestre"
              value={semestreSeleccionado}
              onChange={(e) => setSemestreSeleccionado(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-900 text-sm font-semibold rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-100 focus:border-blue-700 outline-none cursor-pointer"
            >
              <option value="Semestre II / 2026">Semestre II / 2026 (Nuevo)</option>
              <option value="Semestre I / 2026">Semestre I / 2026</option>
              <option value="Semestre II / 2025">Semestre II / 2025</option>
              <option value="Semestre I / 2025">Semestre I / 2025</option>
            </select>
          </div>
        </div>

        {/* Estructura oficial requerida y formatos admitidos */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Info className="w-4 h-4 text-blue-700 shrink-0" />
              <span>Plantilla oficial obligatoria (8 columnas):</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                Excel (.xlsx)
              </span>
              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-[11px]">
                CSV (.csv)
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {COLUMNAS_REQUERIDAS.map((col) => (
              <span
                key={col}
                className="px-2.5 py-1 bg-white border border-slate-300 rounded-md font-mono text-[11px] font-bold text-slate-800 shadow-2xs"
              >
                {col}
              </span>
            ))}
          </div>

          <p className="text-slate-500 text-[11px] leading-relaxed">
            Existe un único Maestro de Oferta para toda la facultad. Los datos (como siglas, códigos de carrera, nombres y aulas) se conservan exactamente como aparecen en el archivo.
          </p>
        </div>

        {/* Selector de Archivo del nuevo semestre (.xlsx o .csv) */}
        <div
          id="zona-seleccion-archivo"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all cursor-pointer ${
            isDragging
              ? 'border-blue-600 bg-blue-50/70 scale-[1.01]'
              : 'border-slate-300 bg-slate-50/50 hover:bg-slate-100/70 hover:border-slate-400'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.csv"
            onChange={handleFileChange}
            className="hidden"
            id="input-archivo-maestro"
          />

          <div className="max-w-md mx-auto space-y-3">
            <div className="w-14 h-14 bg-blue-100 text-blue-900 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Upload className="w-7 h-7" />
            </div>

            <div>
              <p className="text-base font-bold text-slate-900">
                {estaProcesando
                  ? 'Leyendo y validando estructura del archivo...'
                  : 'Selecciona o arrastra el archivo del Maestro de Oferta'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Formatos admitidos: Excel (<strong>.xlsx</strong>) o CSV (<strong>.csv</strong>) con las 8 columnas obligatorias
              </p>
            </div>

            <div className="pt-1 flex flex-wrap justify-center gap-2">
              <span className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors">
                <FileSpreadsheet className="w-4 h-4" />
                <span>Seleccionar archivo Excel (.xlsx) o CSV (.csv)</span>
              </span>
            </div>
          </div>
        </div>

        {/* Acciones auxiliares de prueba y descarga de plantillas oficiales */}
        <div className="pt-2 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-500">Pruebas rápidas de archivo:</span>
            <button
              type="button"
              id="btn-cargar-muestra-valida-excel"
              onClick={handleCargarPruebaValidaExcel}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold border border-slate-200 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-700" />
              <span>Cargar datos válidos de prueba (.xlsx / .csv)</span>
            </button>
            <button
              type="button"
              id="btn-cargar-muestra-invalida"
              onClick={handleCargarPruebaInvalida}
              className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 font-semibold border border-amber-200 transition-colors cursor-pointer"
            >
              Probar archivo incompleto (Faltan columnas)
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              id="btn-descargar-plantilla-xlsx"
              onClick={() => descargarPlantillaExcel(semestreSeleccionado)}
              className="inline-flex items-center gap-1 text-emerald-800 hover:text-emerald-950 font-bold cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Plantilla .xlsx</span>
            </button>
            <span className="text-slate-300">|</span>
            <button
              type="button"
              id="btn-descargar-plantilla-csv"
              onClick={() => descargarPlantillaCSV(semestreSeleccionado)}
              className="inline-flex items-center gap-1 text-blue-800 hover:text-blue-950 font-bold cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Plantilla .csv</span>
            </button>
          </div>
        </div>
      </section>

      {/* Alerta de Error de Validación con el mensaje solicitado */}
      {errorValidacion && !errorValidacion.esValido && (
        <div
          id="alerta-error-validacion"
          className="bg-red-50 border-2 border-red-200 rounded-2xl p-5 sm:p-6 space-y-3 animate-in fade-in"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-red-950">
                {errorValidacion.columnasFaltantes.length > 0 ? (
                  <span>
                    El archivo no corresponde a la plantilla del Maestro de Oferta. Faltan las siguientes columnas: {errorValidacion.columnasFaltantes.join(', ')}.
                  </span>
                ) : (
                  <span>
                    {errorValidacion.errores[0] || 'El archivo seleccionado no corresponde al formato esperado.'}
                  </span>
                )}
              </h3>
              <p className="text-xs sm:text-sm text-red-800">
                No se completó la importación. Para continuar, asegúrate de que el archivo Excel (.xlsx) o CSV (.csv) contenga exactamente las 8 columnas requeridas.
              </p>
            </div>
          </div>

          {errorValidacion.columnasFaltantes.length > 0 && (
            <div className="mt-2 p-3.5 bg-white/90 rounded-xl border border-red-200 text-xs">
              <p className="font-bold text-red-900 mb-1.5">
                Detalle de columnas ausentes en el encabezado:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {errorValidacion.columnasFaltantes.map((col) => (
                  <span
                    key={col}
                    className="px-2.5 py-1 bg-red-100 text-red-900 border border-red-300 rounded font-mono font-bold text-[11px]"
                  >
                    ✕ {col}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Vista Previa de Registros Encontrados (Antes de confirmar importación o reemplazo) */}
      {vistaPreviaDatos && vistaPreviaDatos.registros && (
        <VistaPreviaMaestro
          nombreArchivo={nombreArchivo}
          semestre={semestreSeleccionado}
          registros={vistaPreviaDatos.registros}
          onProcederImportacion={handleIniciarImportacionDesdeVistaPrevia}
          onCancelarSeleccion={handleCancelarVistaPrevia}
        />
      )}

      {/* Mensaje de Confirmación tras Importación Exitosa */}
      {mensajeExito && (
        <div
          id="mensaje-confirmacion-importacion"
          className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-5 sm:p-6 flex items-start gap-3.5 animate-in fade-in"
        >
          <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-emerald-950">
              Maestro de Oferta importado correctamente.
            </h3>
            <p className="text-xs sm:text-sm text-emerald-800">
              El maestro de oferta para el <strong>{maestroVigente?.semestre}</strong> ha sido cargado con un total de <strong>{maestroVigente?.totalRegistros} registros</strong>.
            </p>
          </div>
        </div>
      )}

      {/* Vista sencilla de los registros importados para que el administrador compruebe la información */}
      {maestroVigente && maestroVigente.registros.length > 0 && (
        <section className="space-y-3" aria-labelledby="seccion-registros-vigentes">
          <TablaMaestroOferta
            registros={maestroVigente.registros}
            semestreVigente={maestroVigente.semestre}
            fechaActualizacion={maestroVigente.fechaImportacion}
          />
        </section>
      )}

      {/* Diálogo de Confirmación antes de Reemplazar */}
      {mostrarModalReemplazo && maestroVigente && vistaPreviaDatos && (
        <ModalReemplazarMaestro
          maestroExistente={maestroVigente}
          nuevoResultado={vistaPreviaDatos}
          nuevoNombreArchivo={nombreArchivo}
          nuevoSemestre={semestreSeleccionado}
          onConfirmarReemplazo={handleConfirmarReemplazo}
          onCancelar={handleCancelarReemplazo}
        />
      )}
    </div>
  );
};
