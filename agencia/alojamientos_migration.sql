-- =====================================================
-- MIGRATION: Crear tabla alojamientos
-- =====================================================
-- Uso: Ejecutar en SQL Editor de Supabase Dashboard
-- Describe: Almacena opciones de alojamiento para cada
-- destino (nacional/internacional). Cada destino producto
-- puede tener N opciones con precio, categoría, tipo
-- habitación, rating, distancia, etc.
-- =====================================================

CREATE TABLE alojamientos (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  producto_id INTEGER REFERENCES productos(id) ON DELETE CASCADE NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  precio DECIMAL(10, 2),
  imagen_url TEXT,
  estrellas INTEGER DEFAULT 3 CHECK (estrellas >= 1 AND estrellas <= 5),
  distancia_centro VARCHAR(100),
  categoria VARCHAR(50) CHECK (categoria IN ('todo incluido', 'solo alojamiento', 'desayunos', 'media pension')),
  tipo_habitacion VARCHAR(50) CHECK (tipo_habitacion IN ('superior', 'primera calidad', 'doble superior', 'doble premium')),
  enlace_externo TEXT,
  posicion_orden INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índice para búsquedas por producto ordenadas
CREATE INDEX idx_alojamientos_producto ON alojamientos(producto_id, posicion_orden);

-- RLS
ALTER TABLE alojamientos ENABLE ROW LEVEL SECURITY;

-- Política: lectura pública
CREATE POLICY "Permitir lectura pública de alojamientos"
  ON alojamientos FOR SELECT
  USING (true);

-- Política: solo admin puede insertar
CREATE POLICY "Admin puede insertar alojamientos"
  ON alojamientos FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.rol = 'admin'
    )
  );

-- Política: solo admin puede actualizar
CREATE POLICY "Admin puede actualizar alojamientos"
  ON alojamientos FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.rol = 'admin'
    )
  );

-- Política: solo admin puede eliminar
CREATE POLICY "Admin puede eliminar alojamientos"
  ON alojamientos FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.rol = 'admin'
    )
  );
