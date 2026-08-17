import { createClient } from '@supabase/supabase-js';

// Supabase configuration provided by the user
export const SUPABASE_URL = 
  import.meta.env.VITE_SUPABASE_URL || 
  'https://endakhgwmfpwvrkhgrgp.supabase.co';

export const SUPABASE_ANON_KEY = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuZGFraGd3bWZwd3Zya2hncmdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwMDI2ODEsImV4cCI6MjEwMjU3ODY4MX0.gDtBLYLH_y7wyNHbGswrecXpSMcwAUTx9uzPiHm2ZdQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const SQL_SCHEMA_SUPABASE = `-- ========================================================
-- TABLAS PARA VOZ ANÓNIMA - CONTROL DE ASISTENCIA Y DENUNCIAS
-- ========================================================

-- 1. Tabla: reportes_inasistencia
CREATE TABLE IF NOT EXISTS public.reportes_inasistencia (
  id TEXT PRIMARY KEY,
  clase_id TEXT,
  sigla TEXT,
  grupo TEXT,
  nombre_materia TEXT,
  docente TEXT,
  dia TEXT,
  horario TEXT,
  aula TEXT,
  inasistencia_marcada BOOLEAN DEFAULT true,
  comentario TEXT,
  fecha_reporte TEXT,
  es_anonimo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabla: denuncias_varias
CREATE TABLE IF NOT EXISTS public.denuncias_varias (
  id TEXT PRIMARY KEY,
  clase_id TEXT,
  docente TEXT,
  nombre_materia TEXT,
  sigla TEXT,
  grupo TEXT,
  dia TEXT,
  horario TEXT,
  aula TEXT,
  docente_denunciado TEXT,
  tipo_denuncia TEXT NOT NULL,
  comentario TEXT,
  fecha_registro TEXT,
  es_anonimo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabla: maestro_oferta (Maestro Vigente activo)
CREATE TABLE IF NOT EXISTS public.maestro_oferta (
  id TEXT PRIMARY KEY DEFAULT 'vigente',
  semestre TEXT NOT NULL,
  fecha_importacion TEXT,
  nombre_archivo TEXT,
  total_registros INTEGER DEFAULT 0,
  registros JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ========================================================
-- POLÍTICAS DE SEGURIDAD (RLS) - LECTURA Y ESCRITURA PÚBLICA / ANÓNIMA
-- ========================================================
ALTER TABLE public.reportes_inasistencia ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.denuncias_varias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maestro_oferta ENABLE ROW LEVEL SECURITY;

-- Políticas para reportes_inasistencia
CREATE POLICY "Permitir lectura publica reportes_inasistencia" 
  ON public.reportes_inasistencia FOR SELECT USING (true);
CREATE POLICY "Permitir insercion publica reportes_inasistencia" 
  ON public.reportes_inasistencia FOR INSERT WITH CHECK (true);

-- Políticas para denuncias_varias
CREATE POLICY "Permitir lectura publica denuncias_varias" 
  ON public.denuncias_varias FOR SELECT USING (true);
CREATE POLICY "Permitir insercion publica denuncias_varias" 
  ON public.denuncias_varias FOR INSERT WITH CHECK (true);

-- Políticas para maestro_oferta
CREATE POLICY "Permitir lectura publica maestro_oferta" 
  ON public.maestro_oferta FOR SELECT USING (true);
CREATE POLICY "Permitir insercion y actualizacion maestro_oferta" 
  ON public.maestro_oferta FOR ALL USING (true) WITH CHECK (true);
`;
