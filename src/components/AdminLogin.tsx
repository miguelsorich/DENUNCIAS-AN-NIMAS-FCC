import React, { useState } from 'react';
import { Shield, Lock, ArrowLeft, KeyRound, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { LogoFacultad } from './LogoFacultad';

interface AdminLoginProps {
  onLoginExitoso: () => void;
  onVolverEstudiante: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginExitoso,
  onVolverEstudiante,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  // Clave oficial de administración (estricta)
  const CLAVE_ADMIN = 'scz3927534';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setCargando(true);

    setTimeout(() => {
      if (password.trim() === CLAVE_ADMIN) {
        onLoginExitoso();
      } else {
        setError('Contraseña incorrecta. Verifica tus credenciales de acceso institucional.');
        setCargando(false);
      }
    }, 300);
  };

  return (
    <div className="max-w-md mx-auto py-6 sm:py-10">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-lg shadow-slate-200/50 overflow-hidden">
        {/* Banner Superior Institucional */}
        <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 p-6 sm:p-8 text-center text-white relative">
          <button
            type="button"
            onClick={onVolverEstudiante}
            className="absolute top-4 left-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            title="Volver al Portal Estudiantes"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Estudiantes</span>
          </button>

          <div className="flex justify-center mb-3">
            <div className="p-2.5 bg-white rounded-2xl shadow-md">
              <LogoFacultad className="w-14 h-16" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-800/80 text-blue-200 text-xs font-bold uppercase tracking-wider mb-2 border border-blue-700/50">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>Portal de Autoridades</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Acceso Administrativo
          </h2>
          <p className="text-xs text-blue-200/90 mt-1 max-w-xs mx-auto">
            Facultad de Ciencias Contables, Auditoría, Sistemas de Control de Gestión y Finanzas
          </p>
        </div>

        {/* Formulario de Login */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-4 text-xs text-blue-900 flex items-start gap-3">
            <Lock className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-blue-950">Acceso restringido a personal facultativo</p>
              <p className="text-blue-800/90 leading-relaxed">
                Este módulo permite revisar denuncias, emitir reportes y cargar el Maestro de Oferta oficial.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="admin-password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Contraseña de Administrador
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Introduce la contraseña de acceso..."
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 focus:border-blue-900 focus:bg-white rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-900/20 transition-all"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={cargando || !password.trim()}
              className="w-full py-3 px-4 rounded-xl bg-blue-900 hover:bg-blue-950 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-sm shadow-md shadow-blue-900/20 hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {cargando ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verificando acceso...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Ingresar al Panel de Control</span>
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={onVolverEstudiante}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              ← Volver al Portal Estudiantil (Reportes y Denuncias)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
