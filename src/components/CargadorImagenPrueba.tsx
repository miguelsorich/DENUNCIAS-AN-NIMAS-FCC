import React, { useRef, useState } from 'react';
import { Camera, Image as ImageIcon, Trash2, UploadCloud, Eye, X, AlertCircle } from 'lucide-react';

interface CargadorImagenPruebaProps {
  imagenDataUrl?: string;
  imagenNombre?: string;
  onImagenSeleccionada: (dataUrl: string, nombre: string) => void;
  onQuitarImagen: () => void;
  titulo?: string;
  descripcion?: string;
}

export const CargadorImagenPrueba: React.FC<CargadorImagenPruebaProps> = ({
  imagenDataUrl,
  imagenNombre,
  onImagenSeleccionada,
  onQuitarImagen,
  titulo = 'Fotografía o imagen como prueba (Opcional)',
  descripcion = 'Si tienes una foto del aula vacía, captura de pantalla, foto de un texto u otra evidencia, puedes adjuntarla aquí. Si no tienes foto, puedes enviar la denuncia sin problema.',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [estaArrastrando, setEstaArrastrando] = useState<boolean>(false);
  const [procesando, setProcesando] = useState<boolean>(false);
  const [errorCarga, setErrorCarga] = useState<string | null>(null);
  const [verModalFoto, setVerModalFoto] = useState<boolean>(false);

  // Comprimir imagen usando Canvas para evitar desbordar memoria o almacenamiento
  const comprimirImagen = (file: File): Promise<{ dataUrl: string; nombre: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Error al leer el archivo.'));
      reader.onload = (e) => {
        const img = new Image();
        img.onerror = () => reject(new Error('El archivo no es una imagen válida.'));
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Redimensionar si excede 1280px para optimizar tamaño
          const MAX_DIM = 1280;
          if (width > MAX_DIM || height > MAX_DIM) {
            if (width > height) {
              height = Math.round((height * MAX_DIM) / width);
              width = MAX_DIM;
            } else {
              width = Math.round((width * MAX_DIM) / height);
              height = MAX_DIM;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            return reject(new Error('No se pudo procesar la imagen.'));
          }

          ctx.drawImage(img, 0, 0, width, height);
          // Calidad 0.75 JPEG
          const dataUrl = canvas.toDataURL('image/jpeg', 0.75);
          resolve({ dataUrl, nombre: file.name });
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const procesarArchivo = async (file: File) => {
    setErrorCarga(null);
    if (!file.type.startsWith('image/')) {
      setErrorCarga('Por favor selecciona un archivo de imagen válido (JPG, PNG, WEBP).');
      return;
    }

    // Límite de 15MB inicial
    if (file.size > 15 * 1024 * 1024) {
      setErrorCarga('La imagen original es demasiado pesada (máximo 15MB).');
      return;
    }

    try {
      setProcesando(true);
      const { dataUrl, nombre } = await comprimirImagen(file);
      onImagenSeleccionada(dataUrl, nombre);
    } catch (err: any) {
      setErrorCarga(err.message || 'No se pudo procesar la imagen.');
    } finally {
      setProcesando(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setEstaArrastrando(true);
  };

  const handleDragLeave = () => {
    setEstaArrastrando(false);
  };

  return (
    <section 
      id="seccion-adjuntar-imagen-prueba"
      className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-3"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-slate-700" />
          <h3 className="text-base font-bold text-slate-900">
            {titulo}
          </h3>
        </div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
          Opcional
        </span>
      </div>

      <p className="text-xs text-slate-500 leading-relaxed">
        {descripcion}
      </p>

      {/* Input oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="input-foto-prueba"
      />

      {/* Si ya hay imagen adjunta */}
      {imagenDataUrl ? (
        <div className="bg-slate-50 border border-emerald-300 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 w-full sm:w-auto">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-300 shrink-0 bg-slate-200">
              <img
                src={imagenDataUrl}
                alt="Prueba adjunta"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <button
                type="button"
                onClick={() => setVerModalFoto(true)}
                className="absolute inset-0 bg-slate-900/40 hover:bg-slate-900/60 transition-colors flex items-center justify-center text-white cursor-pointer"
                title="Ver imagen completa"
              >
                <Eye className="w-5 h-5" />
              </button>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  ✓ Foto adjunta como prueba
                </span>
              </div>
              <p className="text-xs text-slate-700 font-medium truncate mt-1">
                {imagenNombre || 'evidencia_adjunta.jpg'}
              </p>
              <button
                type="button"
                onClick={() => setVerModalFoto(true)}
                className="text-[11px] font-bold text-blue-900 hover:underline cursor-pointer flex items-center gap-1 mt-0.5"
              >
                <Eye className="w-3 h-3" />
                <span>Ver imagen en tamaño completo</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cambiar foto
            </button>

            <button
              type="button"
              onClick={onQuitarImagen}
              className="text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              title="Quitar foto adjunta"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Quitar</span>
            </button>
          </div>
        </div>
      ) : (
        /* Zona para seleccionar o arrastrar imagen */
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-5 sm:p-6 text-center cursor-pointer transition-all ${
            estaArrastrando
              ? 'border-blue-900 bg-blue-50/50'
              : 'border-slate-300 hover:border-blue-900/60 bg-slate-50/60 hover:bg-slate-50'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center mx-auto mb-2.5">
            {procesando ? (
              <div className="w-5 h-5 border-2 border-blue-900 border-t-transparent rounded-full animate-spin" />
            ) : (
              <UploadCloud className="w-6 h-6" />
            )}
          </div>

          <p className="text-xs sm:text-sm font-bold text-slate-800">
            {procesando ? 'Procesando imagen...' : 'Haz clic para seleccionar o arrastra una foto aquí'}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Formatos admitidos: JPG, PNG, WEBP (Se optimiza automáticamente)
          </p>
        </div>
      )}

      {errorCarga && (
        <div className="flex items-center gap-2 text-xs text-red-700 bg-red-50 p-2.5 rounded-lg border border-red-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorCarga}</span>
        </div>
      )}

      {/* Modal visor de la fotografía en pantalla completa */}
      {verModalFoto && imagenDataUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-5 shadow-2xl border border-slate-200 space-y-3 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-blue-900" />
                Vista previa de la prueba fotográfica
              </span>
              <button
                type="button"
                onClick={() => setVerModalFoto(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[65vh] overflow-auto flex items-center justify-center bg-slate-900 rounded-xl p-2">
              <img
                src={imagenDataUrl}
                alt="Prueba adjunta ampliada"
                className="max-h-[60vh] max-w-full object-contain rounded"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-500 font-medium truncate max-w-xs">
                {imagenNombre}
              </span>
              <button
                type="button"
                onClick={() => setVerModalFoto(false)}
                className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl cursor-pointer"
              >
                Cerrar vista previa
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
