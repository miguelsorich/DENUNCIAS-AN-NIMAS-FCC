import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileSpreadsheet, 
  AlertCircle, 
  CheckCircle2, 
  Download, 
  X, 
  FileCheck2,
  Layers,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { MaestroOfertaVigente, ValidacionImportacion } from '../types';
import { 
  procesarArchivoMaestro, 
  descargarPlantillaExcel, 
  descargarPlantillaCSV,
  COLUMNAS_REQUERIDAS 
} from '../utils/fileParser';

interface CargadorMaestroVirtualRapidoProps {
  maestroVirtualVigente: MaestroOfertaVigente | null;
  onGuardarMaestroVirtual: (nuevoMaestro: MaestroOfertaVigente) => void;
  onCerrar?: () => void;
}

export const CargadorMaestroVirtualRapido: React.FC<CargadorMaestroVirtualRapidoProps> = ({
  maestroVirtualVigente,
  onGuardarMaestroVirtual,
  onCerrar,
}) => {
  const [estaArrastrando, setEstaArrastrando] = useState<boolean>(false);
  const [estaProcesando, setEstaProcesando] = useState<boolean>(false);
  const [errorValidacion, setErrorValidacion] = useState<ValidacionImportacion | null>(null);
  const [validacionExitosa, setValidacionExitosa] = useState<ValidacionImportacion | null>(null);
  const [nombreArchivo, setNombreArchivo] = useState<string>('');
  const [semestre, setSemestre] = useState<string>('Modalidad Virtual II / 2026');
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const procesarArchivo = async (file: File) => {
    setErrorValidacion(null);
    setValidacionExitosa(null);
    setMensajeExito(null);
    setNombreArchivo(file.name);
    setEstaProcesando(true);

    try {
      const validacion = await procesarArchivoMaestro(file);
      if (!validacion.esValido || !validacion.registros || validacion.registros.length === 0) {
        setErrorValidacion(validacion);
      } else {
        setValidacionExitosa(validacion);
      }
    } catch (err: any) {
      setErrorValidacion({
        esValido: false,
        columnasFaltantes: [...COLUMNAS_REQUERIDAS],
        columnasEncontradas: [],
        totalFilas: 0,
        errores: [err.message || 'Error al procesar archivo de oferta virtual.'],
      });
    } finally {
      setEstaProcesando(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      procesarArchivo(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setEstaArrastrando(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      procesarArchivo(file);
    }
  };

  const handleConfirmarCarga = () => {
    if (!validacionExitosa || !validacionExitosa.registros) return;

    const nuevoMaestro: MaestroOfertaVigente = {
      semestre: semestre.trim() || 'Modalidad Virtual II / 2026',
      fechaImportacion: new Date().toLocaleString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      nombreArchivo: nombreArchivo || 'oferta_virtual.xlsx',
      totalRegistros: validacionExitosa.registros.length,
      registros: validacionExitosa.registros,
    };

    onGuardarMaestroVirtual(nuevoMaestro);
    setMensajeExito(`¡Se importaron ${nuevoMaestro.totalRegistros} clases virtuales exitosamente!`);
    setTimeout(() => {
      if (onCerrar) onCerrar();
    }, 1200);
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-blue-200 shadow-md space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center">
            <Upload className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Subir Maestro de Oferta — Modalidad Virtual
            </h3>
            <p className="text-xs text-slate-500">
              Carga tu archivo Excel (.xlsx, .xls) o CSV con las materias virtuales habilitadas.
            </p>
          </div>
        </div>

        {onCerrar && (
          <button
            type="button"
            onClick={onCerrar}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Selector de periodo/semestre y plantilla */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
        <div className="flex items-center gap-2">
          <label htmlFor="semestre-virtual" className="font-bold text-slate-700">Período:</label>
          <input
            id="semestre-virtual"
            type="text"
            value={semestre}
            onChange={(e) => setSemestre(e.target.value)}
            className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg font-medium text-slate-800 focus:ring-1 focus:ring-blue-900 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">Plantillas de ejemplo:</span>
          <button
            type="button"
            onClick={() => descargarPlantillaExcel()}
            className="text-blue-900 hover:text-blue-950 font-bold flex items-center gap-1 hover:underline cursor-pointer"
          >
            <Download className="w-3 h-3" /> Excel (.xlsx)
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => descargarPlantillaCSV()}
            className="text-blue-900 hover:text-blue-950 font-bold flex items-center gap-1 hover:underline cursor-pointer"
          >
            <Download className="w-3 h-3" /> CSV
          </button>
        </div>
      </div>

      {/* Input oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Zona Drag and drop */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setEstaArrastrando(true); }}
        onDragLeave={() => setEstaArrastrando(false)}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          estaArrastrando
            ? 'border-blue-900 bg-blue-50/60 scale-[1.01]'
            : 'border-slate-300 hover:border-blue-900/70 bg-slate-50/50 hover:bg-slate-50'
        }`}
      >
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center mx-auto mb-2">
          {estaProcesando ? (
            <div className="w-5 h-5 border-2 border-blue-900 border-t-transparent rounded-full animate-spin" />
          ) : (
            <FileSpreadsheet className="w-5 h-5" />
          )}
        </div>

        <p className="text-xs sm:text-sm font-bold text-slate-800">
          {estaProcesando ? 'Analizando archivo...' : 'Haz clic para seleccionar o arrastra tu archivo aquí'}
        </p>
        <p className="text-[11px] text-slate-500 mt-1">
          Archivos compatibles: Excel (.xlsx, .xls) y CSV estructurado
        </p>
      </div>

      {/* Errores de validación */}
      {errorValidacion && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 space-y-2 text-xs text-red-900">
          <div className="flex items-center gap-1.5 font-bold text-red-800">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>El archivo no cumple con el formato requerido</span>
          </div>
          {errorValidacion.columnasFaltantes.length > 0 && (
            <p>
              Columnas requeridas ausentes: <strong>{errorValidacion.columnasFaltantes.join(', ')}</strong>
            </p>
          )}
          {errorValidacion.errores.map((err, idx) => (
            <p key={idx} className="opacity-90">{err}</p>
          ))}
        </div>
      )}

      {/* Validación Exitosa / Vista Previa */}
      {validacionExitosa && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <div>
                <span className="font-bold text-emerald-950 text-xs sm:text-sm block">
                  Archivo validado correctamente
                </span>
                <span className="text-[11px] text-emerald-800">
                  {nombreArchivo} — {validacionExitosa.totalFilas} materias virtuales detectadas
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleConfirmarCarga}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Confirmar y Guardar Oferta Virtual</span>
            </button>
          </div>

          {/* Muestra rápida de 3 registros */}
          <div className="bg-white/80 rounded-lg p-2.5 border border-emerald-200 text-[11px] space-y-1">
            <span className="font-bold text-slate-700 block">Vista previa de clases detectadas:</span>
            <div className="divide-y divide-slate-100">
              {validacionExitosa.registros?.slice(0, 3).map((clase, i) => (
                <div key={i} className="py-1 flex items-center justify-between text-slate-700">
                  <span><strong>{clase.sigla} - Gr. {clase.grupo}</strong>: {clase.nombreMateria}</span>
                  <span className="text-slate-500 font-mono text-[10px]">{clase.docente}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {mensajeExito && (
        <div className="bg-emerald-100 border border-emerald-400 text-emerald-950 p-3 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>{mensajeExito}</span>
        </div>
      )}
    </div>
  );
};
