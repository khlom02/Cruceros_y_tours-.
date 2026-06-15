-- =====================================================
-- MIGRATION: Extender alojamientos para detalle completo
-- =====================================================
-- Uso: Ejecutar en SQL Editor de Supabase Dashboard
-- Describe: Agrega campos descriptivos, ubicación, servicios,
-- tarifa e imágenes de hotel/habitación/comida/servicios.
-- =====================================================

-- ── 1. Extender tabla alojamientos ───────────────────
ALTER TABLE alojamientos
  ADD COLUMN IF NOT EXISTS descripcion TEXT,
  ADD COLUMN IF NOT EXISTS direccion TEXT,
  ADD COLUMN IF NOT EXISTS latitud DECIMAL(10, 8),
  ADD COLUMN IF NOT EXISTS longitud DECIMAL(11, 8),
  ADD COLUMN IF NOT EXISTS texto_venta TEXT,
  ADD COLUMN IF NOT EXISTS servicios_incluidos JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS tarifa_incluye JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS tipos_habitacion JSONB DEFAULT '[]'::jsonb;

-- Validaciones simples de coordenadas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_alojamientos_latitud'
  ) THEN
    ALTER TABLE alojamientos ADD CONSTRAINT chk_alojamientos_latitud
      CHECK (latitud IS NULL OR (latitud >= -90 AND latitud <= 90));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_alojamientos_longitud'
  ) THEN
    ALTER TABLE alojamientos ADD CONSTRAINT chk_alojamientos_longitud
      CHECK (longitud IS NULL OR (longitud >= -180 AND longitud <= 180));
  END IF;
END$$;

-- ── 2. Tabla de imágenes del alojamiento ──────────────
CREATE TABLE IF NOT EXISTS alojamiento_imagenes (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  alojamiento_id BIGINT NOT NULL REFERENCES alojamientos(id) ON DELETE CASCADE,
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('hotel', 'habitacion', 'comida', 'servicio')),
  imagen_url TEXT NOT NULL,
  titulo VARCHAR(255),
  posicion_orden INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_alojamiento_imagenes_alojamiento
  ON alojamiento_imagenes(alojamiento_id, tipo, posicion_orden);

-- ── 3. RLS para alojamiento_imagenes ──────────────────
ALTER TABLE alojamiento_imagenes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir lectura pública de alojamiento_imagenes"
  ON alojamiento_imagenes;
CREATE POLICY "Permitir lectura pública de alojamiento_imagenes"
  ON alojamiento_imagenes FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admin puede insertar alojamiento_imagenes"
  ON alojamiento_imagenes;
CREATE POLICY "Admin puede insertar alojamiento_imagenes"
  ON alojamiento_imagenes FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.rol = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admin puede actualizar alojamiento_imagenes"
  ON alojamiento_imagenes;
CREATE POLICY "Admin puede actualizar alojamiento_imagenes"
  ON alojamiento_imagenes FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.rol = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admin puede eliminar alojamiento_imagenes"
  ON alojamiento_imagenes;
CREATE POLICY "Admin puede eliminar alojamiento_imagenes"
  ON alojamiento_imagenes FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.rol = 'admin'
    )
  );
