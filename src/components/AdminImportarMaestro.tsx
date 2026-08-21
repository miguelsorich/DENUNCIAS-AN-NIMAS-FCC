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
  Building2,
  Laptop,
  Sparkles,
  RefreshCw,
  Edit3
} from 'lucide-react';
import { MaestroOfertaVigente, ValidacionImportacion, ModalidadEstudio, OfertaClase } from '../types';
import { 
  procesarArchivoMaestro,
  validarYParsearMatrizFilas,
  COLUMNAS_REQUERIDAS,
  descargarPlantillaExcel,
  descargarPlantillaCSV,
  descargarPlantillaVirtualExcel,
  descargarPlantillaVirtualCSV,
} from '../utils/fileParser';
import { ModalReemplazarMaestro } from './ModalReemplazarMaestro';
import { VistaPreviaMaestro } from './VistaPreviaMaestro';
import { TablaMaestroOferta } from './TablaMaestroOferta';

interface AdminImportarMaestroProps {
  maestroPresencial?: MaestroOfertaVigente | null;
  onGuardarMaestroPresencial?: (nuevoMaestro: MaestroOfertaVigente) => void;
  maestroVirtual?: MaestroOfertaVigente | null;
  onGuardarMaestroVirtual?: (nuevoMaestro: MaestroOfertaVigente) => void;
  // Aliases for compatibility
  maestroVigente?: MaestroOfertaVigente | null;
  onGuardarMaestro?: (nuevoMaestro: MaestroOfertaVigente) => void;
}

export const AdminImportarMaestro: React.FC<AdminImportarMaestroProps> = ({
  maestroPresencial,
  onGuardarMaestroPresencial,
  maestroVirtual,
  onGuardarMaestroVirtual,
  maestroVigente,
  onGuardarMaestro,
}) => {
  // Resolver referencias compatibles
  const maestroP = maestroPresencial || maestroVigente || null;
  const guardarP = onGuardarMaestroPresencial || onGuardarMaestro || (() => {});
  const maestroV = maestroVirtual || null;
  const guardarV = onGuardarMaestroVirtual || (() => {});

  // Modalidad seleccionada para importar o gestionar: 'presencial' o 'virtual'
  const [modalidadActiva, setModalidadActiva] = useState<ModalidadEstudio>('presencial');

  const [semestreSeleccionado, setSemestreSeleccionado] = useState<string>('Semestre II / 2026');
  const [nombreArchivo, setNombreArchivo] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [estaProcesando, setEstaProcesando] = useState<boolean>(false);
  const [errorValidacion, setErrorValidacion] = useState<ValidacionImportacion | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [mostrarModalReemplazo, setMostrarModalReemplazo] = useState<boolean>(false);
  const [vistaPreviaDatos, setVistaPreviaDatos] = useState<ValidacionImportacion | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const maestroActual = modalidadActiva === 'presencial' ? maestroP : maestroV;
  const guardarActual = modalidadActiva === 'presencial' ? guardarP : guardarV;

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

    // Si ya existe un Maestro de Oferta cargado para esta modalidad, solicitar confirmación
    if (maestroActual && maestroActual.registros.length > 0) {
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

    const prefijo = modalidadActiva === 'virtual' ? 'Maestro Virtual' : 'Maestro Presencial';
    const nuevoMaestro: MaestroOfertaVigente = {
      semestre: `${semestreSeleccionado} (${modalidadActiva === 'virtual' ? 'Virtual' : 'Presencial'})`,
      fechaImportacion: `${fechaFormateada} (${prefijo})`,
      nombreArchivo: fileName || `maestro_oferta_${modalidadActiva}.xlsx`,
      totalRegistros: validacion.registros?.length || 0,
      registros: validacion.registros || [],
    };

    guardarActual(nuevoMaestro);
    setMensajeExito(
      `Maestro de Oferta (${modalidadActiva === 'virtual' ? 'Modalidad Virtual' : 'Modalidad Presencial'}) importado correctamente con ${nuevoMaestro.totalRegistros} registros.`
    );
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

  // Cargar datos de prueba según modalidad
  const handleCargarPruebaValida = () => {
    setErrorValidacion(null);
    setMensajeExito(null);

    if (modalidadActiva === 'presencial') {
      setNombreArchivo('Maestro_Oferta_Presencial_2026.xlsx');
      const matrizValidaPresencial = [
        ['SIGLA', 'GR', 'NOMBRE DE LA MATERIA', 'CARRERAS', 'DOCENTE', 'DÍA', 'HORARIO', 'AULA'],
        ['ADM100', 'A', 'ADMINISTRACION GENERAL', '105-5-109-1', 'AZOGUE ROMERO OSCAR', 'L-M-V', '19:45-21:15', '21318'],
        ['INF110', 'B', 'INTRODUCCION A LA INFORMATICA', '187-3-187-4', 'ZUNA VELASCO HERNAN', 'M-J', '07:00-09:15', '236-4'],
        ['MAT101', '1', 'CALCULO I', '105-5-187-3-187-4', 'GUTIERREZ ROJAS JUAN CARLOS', 'L-M-V', '07:00-08:30', '21312'],
        ['FIS100', 'A', 'FISICA I', '187-3-187-4', 'CALDERON MAMANI RENE', 'M-J', '09:15-11:30', 'LAB-FIS'],
        ['LIN100', 'C', 'INGLES TECNICO I', '105-5-109-1', 'SUAREZ MONTERO ELIZABETH', 'L-M-V', '11:30-13:00', '21314'],
        ['INF210', 'A', 'PROGRAMACION I', '187-3-187-4', 'FLORES FLORES WALTER', 'M-J', '14:00-16:15', 'LAB-201'],
        ['EST101', '2', 'ESTADISTICA I', '105-5-109-1', 'RODRIGUEZ PAREDES MARCO', 'L-M-V', '16:00-17:30', '21316'],
      ];
      const validacion = validarYParsearMatrizFilas(matrizValidaPresencial);
      setVistaPreviaDatos(validacion);
    } else {
      setNombreArchivo('Maestro_Oferta_Virtual_2026.xlsx');
      const matrizValidaVirtual = [
        ['SIGLA', 'GR', 'NOMBRE DE LA MATERIA', 'CARRERAS', 'DOCENTE', 'DÍA', 'HORARIO', 'AULA'],
        ['CPA-100', 'V1', 'CONTABILIDAD BASICA I (VIRTUAL)', 'CONTADURIA PUBLICA', 'LIC. JUSTINIANO PINTO CARLOS', 'LUNES Y MIERCOLES', '18:15 - 20:30', 'AULA VIRTUAL 1 (TEAMS)'],
        ['CPA-200', 'V1', 'CONTABILIDAD DE COSTOS I (VIRTUAL)', 'CONTADURIA PUBLICA', 'LIC. ROJAS BANEGAS MARIO', 'MARTES Y JUEVES', '19:00 - 21:15', 'AULA VIRTUAL 2 (MOODLE)'],
        ['AUD-300', 'V2', 'AUDITORIA FINANCIERA I (VIRTUAL)', 'AUDITORIA FINANCIERA', 'LIC. AGUILERA SUAREZ JAVIER', 'LUNES Y VIERNES', '07:00 - 09:15', 'CAMPUS VIRTUAL FCCA'],
        ['FIN-400', 'V1', 'ADMINISTRACION FINANCIERA (VIRTUAL)', 'INGENIERIA FINANCIERA', 'LIC. MENDOZA CALDERON ELENA', 'MIERCOLES Y VIERNES', '20:30 - 22:45', 'PLATAFORMA VIRTUAL (TEAMS)'],
        ['SCG-250', 'V1', 'SISTEMAS DE INFORMACION Y CONTROL (VIRTUAL)', 'SISTEMAS DE CONTROL', 'LIC. GUTIERREZ TERRAZAS ROBERTO', 'SABADO', '08:00 - 12:30', 'AULA VIRTUAL (MEET)'],
        ['MAT-101', 'V3', 'MATEMATICA FINANCIERA (VIRTUAL)', 'TODAS LAS CARRERAS', 'LIC. SUAREZ VARGAS PATRICIA', 'MARTES Y JUEVES', '16:00 - 18:15', 'AULA VIRTUAL 3 (CLASSROOM)'],
      ];
      const validacion = validarYParsearMatrizFilas(matrizValidaVirtual);
      setVistaPreviaDatos(validacion);
    }
  };

  const handleCargarPruebaInvalida = () => {
    setErrorValidacion(null);
    setMensajeExito(null);
    setVistaPreviaDatos(null);
    setNombreArchivo('Archivo_Incompleto_Sin_Docente.xlsx');

    const matrizIncompleta = [
      ['SIGLA', 'GR', 'NOMBRE DE LA MATERIA', 'CARRERAS', 'HORARIO'],
      ['ADM100', 'A', 'ADMINISTRACION GENERAL', '105-5-109-1', '19:45-21:15'],
      ['INF110', 'B', 'INTRODUCCION A LA INFORMATICA', '187-3-187-4', '07:00-09:15'],
    ];

    const validacion = validarYParsearMatrizFilas(matrizIncompleta);
    setErrorValidacion(validacion);
  };

  // Manejo de actualización manual de docente en los registros del maestro activo
  const handleActualizarRegistrosDocentes = (nuevosRegistros: OfertaClase[]) => {
    if (!maestroActual) return;
    const nuevoMaestro: MaestroOfertaVigente = {
      ...maestroActual,
      totalRegistros: nuevosRegistros.length,
      registros: nuevosRegistros,
    };
    guardarActual(nuevoMaestro);
  };

  const handleActualizarDocenteIndividual = (claseId: string, nuevoDocente: string, aplicarATodas: boolean = false) => {
    if (!maestroActual) return;
    const claseModificada = maestroActual.registros.find(r => r.id === claseId);
    const docenteAnterior = claseModificada?.docente?.trim().toUpperCase() || '';

    const actualizados = maestroActual.registros.map(item => {
      if (aplicarATodas && docenteAnterior && item.docente.trim().toUpperCase() === docenteAnterior) {
        return { ...item, docente: nuevoDocente };
      }
      if (item.id === claseId) {
        return { ...item, docente: nuevoDocente };
      }
      return item;
    });

    handleActualizarRegistrosDocentes(actualizados);
  };

  return (
    <div className="space-y-8">
      {/* Selector Principal de Modalidad para el Maestro */}
      <section className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-blue-900 bg-blue-100 px-2.5 py-0.5 rounded-md">
                <Shield className="w-3.5 h-3.5" />
                Gestión Oficial de Maestros de Oferta
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Importar y Gestionar Maestro de Oferta
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Administra de manera independiente el Maestro de Oferta para <strong>Modalidad Presencial</strong> y <strong>Modalidad Virtual</strong>, con soporte para <strong>edición manual de docentes</strong>.
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
            <label htmlFor="select-semestre-admin" className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Semestre académico
            </label>
            <select
              id="select-semestre-admin"
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

        {/* Pestañas de Selección de Modalidad (Presencial vs Virtual) */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
            Selecciona la modalidad a importar o gestionar:
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Tarjeta Modalidad Presencial */}
            <button
              type="button"
              onClick={() => {
                setModalidadActiva('presencial');
                setErrorValidacion(null);
                setVistaPreviaDatos(null);
                setMensajeExito(null);
              }}
              className={`p-4 rounded-2xl text-left border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                modalidadActiva === 'presencial'
                  ? 'border-blue-800 bg-blue-50/50 shadow-sm'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100/80 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    modalidadActiva === 'presencial' ? 'bg-blue-900 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                      Maestro Modalidad Presencial
                    </h3>
                    <span className="text-xs text-slate-500">
                      Clases en aula física • Inasistencias presenciales
                    </span>
                  </div>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  modalidadActiva === 'presencial'
                    ? 'bg-blue-900 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}>
                  {maestroP?.totalRegistros || 0} clases
                </span>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
                <span className="text-slate-600">
                  Archivo activo: <strong>{maestroP?.nombreArchivo || 'No cargado'}</strong>
                </span>
                <span className="text-blue-900 font-bold">
                  {modalidadActiva === 'presencial' ? '● Seleccionado' : 'Hacer clic para gestionar'}
                </span>
              </div>
            </button>

            {/* Tarjeta Modalidad Virtual */}
            <button
              type="button"
              onClick={() => {
                setModalidadActiva('virtual');
                setErrorValidacion(null);
                setVistaPreviaDatos(null);
                setMensajeExito(null);
              }}
              className={`p-4 rounded-2xl text-left border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                modalidadActiva === 'virtual'
                  ? 'border-indigo-700 bg-indigo-50/50 shadow-sm'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100/80 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    modalidadActiva === 'virtual' ? 'bg-indigo-800 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    <Laptop className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                      Maestro Modalidad Virtual
                    </h3>
                    <span className="text-xs text-slate-500">
                      Materias virtuales • Plataformas • Consultas y Materiales
                    </span>
                  </div>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  modalidadActiva === 'virtual'
                    ? 'bg-indigo-800 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}>
                  {maestroV?.totalRegistros || 0} clases
                </span>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
                <span className="text-slate-600">
                  Archivo activo: <strong>{maestroV?.nombreArchivo || 'No cargado'}</strong>
                </span>
                <span className="text-indigo-800 font-bold">
                  {modalidadActiva === 'virtual' ? '● Seleccionado' : 'Hacer clic para gestionar'}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Estructura oficial requerida y formatos admitidos */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Info className="w-4 h-4 text-blue-700 shrink-0" />
              <span>Plantilla oficial requerida ({modalidadActiva === 'virtual' ? 'Modalidad Virtual' : 'Modalidad Presencial'}):</span>
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
            Cada modalidad cuenta con su propio Maestro de Oferta independiente. Al importar un archivo, se actualizará exclusivamente la oferta académica de <strong>{modalidadActiva === 'virtual' ? 'Modalidad Virtual' : 'Modalidad Presencial'}</strong>.
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
              : modalidadActiva === 'virtual'
              ? 'border-indigo-300 bg-indigo-50/30 hover:bg-indigo-50/70 hover:border-indigo-400'
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
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto shadow-inner ${
              modalidadActiva === 'virtual' ? 'bg-indigo-100 text-indigo-900' : 'bg-blue-100 text-blue-900'
            }`}>
              <Upload className="w-7 h-7" />
            </div>

            <div>
              <p className="text-base font-bold text-slate-900">
                {estaProcesando
                  ? `Leyendo y validando Maestro (${modalidadActiva === 'virtual' ? 'Virtual' : 'Presencial'})...`
                  : `Selecciona o arrastra el archivo para Maestro ${modalidadActiva === 'virtual' ? 'Virtual' : 'Presencial'}`}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Formatos admitidos: Excel (<strong>.xlsx</strong>) o CSV (<strong>.csv</strong>) con las 8 columnas obligatorias
              </p>
            </div>

            <div className="pt-1 flex flex-wrap justify-center gap-2">
              <span className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-xs transition-colors ${
                modalidadActiva === 'virtual' ? 'bg-indigo-800 hover:bg-indigo-700' : 'bg-blue-900 hover:bg-blue-800'
              }`}>
                <FileSpreadsheet className="w-4 h-4" />
                <span>Importar archivo para {modalidadActiva === 'virtual' ? 'Modalidad Virtual' : 'Modalidad Presencial'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Acciones auxiliares de prueba y descarga de plantillas oficiales */}
        <div className="pt-2 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-500">Pruebas rápidas ({modalidadActiva}):</span>
            <button
              type="button"
              id="btn-cargar-muestra-valida"
              onClick={handleCargarPruebaValida}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold border border-slate-200 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-700" />
              <span>Cargar datos válidos de prueba ({modalidadActiva})</span>
            </button>
            <button
              type="button"
              id="btn-cargar-muestra-invalida"
              onClick={handleCargarPruebaInvalida}
              className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 font-semibold border border-amber-200 transition-colors cursor-pointer"
            >
              Probar archivo con errores
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              id="btn-descargar-plantilla-xlsx"
              onClick={() => {
                if (modalidadActiva === 'virtual') {
                  descargarPlantillaVirtualExcel(semestreSeleccionado);
                } else {
                  descargarPlantillaExcel(semestreSeleccionado);
                }
              }}
              className="inline-flex items-center gap-1 text-emerald-800 hover:text-emerald-950 font-bold cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Plantilla {modalidadActiva === 'virtual' ? 'Virtual' : 'Presencial'} (.xlsx)</span>
            </button>
            <span className="text-slate-300">|</span>
            <button
              type="button"
              id="btn-descargar-plantilla-csv"
              onClick={() => {
                if (modalidadActiva === 'virtual') {
                  descargarPlantillaVirtualCSV(semestreSeleccionado);
                } else {
                  descargarPlantillaCSV(semestreSeleccionado);
                }
              }}
              className="inline-flex items-center gap-1 text-blue-800 hover:text-blue-950 font-bold cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Plantilla (.csv)</span>
            </button>
          </div>
        </div>
      </section>

      {/* Alerta de Error de Validación */}
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
                    El archivo no corresponde a la plantilla del Maestro de Oferta ({modalidadActiva}). Faltan las siguientes columnas: {errorValidacion.columnasFaltantes.join(', ')}.
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
          semestre={`${semestreSeleccionado} (${modalidadActiva === 'virtual' ? 'Virtual' : 'Presencial'})`}
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
              {mensajeExito}
            </h3>
            <p className="text-xs sm:text-sm text-emerald-800">
              Los registros han sido cargados para la <strong>{modalidadActiva === 'virtual' ? 'Modalidad Virtual' : 'Modalidad Presencial'}</strong> y ya están disponibles para los estudiantes.
            </p>
          </div>
        </div>
      )}

      {/* Vista y Edición Manual de Docentes del Maestro Activo */}
      {maestroActual && maestroActual.registros.length > 0 ? (
        <section className="space-y-3" aria-labelledby="seccion-registros-vigentes">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-blue-900" />
              <span className="font-bold text-sm text-slate-800">
                Edición Manual y Verificación de Registros ({modalidadActiva === 'virtual' ? 'Modalidad Virtual' : 'Modalidad Presencial'})
              </span>
            </div>
          </div>

          <TablaMaestroOferta
            registros={maestroActual.registros}
            semestreVigente={maestroActual.semestre}
            fechaActualizacion={maestroActual.fechaImportacion}
            modalidad={modalidadActiva}
            onActualizarRegistros={handleActualizarRegistrosDocentes}
            onActualizarDocente={handleActualizarDocenteIndividual}
          />
        </section>
      ) : (
        <div className="p-8 bg-white border border-slate-200 rounded-2xl text-center space-y-2">
          <p className="text-sm font-bold text-slate-700">
            No hay registros cargados aún para el Maestro de {modalidadActiva === 'virtual' ? 'Modalidad Virtual' : 'Modalidad Presencial'}.
          </p>
          <p className="text-xs text-slate-500">
            Selecciona un archivo Excel (.xlsx) o CSV (.csv) arriba o utiliza el botón de datos de prueba para inicializarlo.
          </p>
        </div>
      )}

      {/* Diálogo de Confirmación antes de Reemplazar */}
      {mostrarModalReemplazo && maestroActual && vistaPreviaDatos && (
        <ModalReemplazarMaestro
          maestroExistente={maestroActual}
          nuevoResultado={vistaPreviaDatos}
          nuevoNombreArchivo={nombreArchivo}
          nuevoSemestre={semestreSeleccionado}
          modalidad={modalidadActiva}
          onConfirmarReemplazo={handleConfirmarReemplazo}
          onCancelar={handleCancelarReemplazo}
        />
      )}
    </div>
  );
};
