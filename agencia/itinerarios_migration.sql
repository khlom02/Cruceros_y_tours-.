-- =====================================================
-- MIGRATION: Crear tabla itinerarios
-- =====================================================
-- Uso: Ejecutar en SQL Editor de Supabase Dashboard
-- Describe: Almacena itinerarios de productos (cruceros, tours, etc.)
-- por día, con título, descripción y categoría.
-- =====================================================

CREATE TABLE itinerarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  producto_id INTEGER REFERENCES productos(id) ON DELETE CASCADE NOT NULL,
  dia INTEGER NOT NULL,
  titulo VARCHAR(200) NOT NULL,
  descripcion TEXT,
  categoria VARCHAR(100),
  posicion_orden INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índice para búsquedas por producto ordenadas
CREATE INDEX idx_itinerarios_producto_dia ON itinerarios(producto_id, dia, posicion_orden);

-- RLS
ALTER TABLE itinerarios ENABLE ROW LEVEL SECURITY;

-- Política: lectura pública (igual que las demás tablas de contenido)
CREATE POLICY "Permitir lectura pública de itinerarios"
  ON itinerarios FOR SELECT
  USING (true);

-- Política: solo admin puede insertar/actualizar/eliminar
CREATE POLICY "Admin puede insertar itinerarios"
  ON itinerarios FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.rol = 'admin'
    )
  );

CREATE POLICY "Admin puede actualizar itinerarios"
  ON itinerarios FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.rol = 'admin'
    )
  );

CREATE POLICY "Admin puede eliminar itinerarios"
  ON itinerarios FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.rol = 'admin'
    )
  );
