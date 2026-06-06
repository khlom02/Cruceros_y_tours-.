-- =====================================================
-- RLS INSERT POLICIES — Cruceros y Tours
-- =====================================================
-- Ejecutar en Supabase SQL Editor
-- =====================================================

-- =====================================================
-- 1. HABILITAR RLS EN TABLAS FALTANTES
-- =====================================================

ALTER TABLE contactos ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservas ENABLE ROW LEVEL SECURITY;
ALTER TABLE suscripciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 2. CONTACTOS — Permitir INSERT público (con rate limit)
-- =====================================================

CREATE POLICY "Permitir INSERT público en contactos"
ON contactos FOR INSERT
WITH CHECK (true);

-- Solo admin puede ver/actualizar contactos
CREATE POLICY "Solo admin puede leer contactos"
ON contactos FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

CREATE POLICY "Solo admin puede actualizar contactos"
ON contactos FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- =====================================================
-- 3. NEWSLETTER — Permitir INSERT público
-- =====================================================

CREATE POLICY "Permitir INSERT público en newsletter"
ON newsletter FOR INSERT
WITH CHECK (true);

-- =====================================================
-- 4. RESERVAS — Solo usuarios autenticados pueden INSERT
-- =====================================================

CREATE POLICY "Usuarios autenticados pueden crear reservas"
ON reservas FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Usuarios pueden ver sus propias reservas"
ON reservas FOR SELECT
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Solo admin puede actualizar reservas"
ON reservas FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- =====================================================
-- 5. SUSCRIPCIONES — Solo usuarios autenticados
-- =====================================================

CREATE POLICY "Usuarios autenticados pueden crear suscripciones"
ON suscripciones FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Usuarios pueden ver sus propias suscripciones"
ON suscripciones FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Solo admin puede actualizar suscripciones"
ON suscripciones FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- =====================================================
-- 6. NOTA: Agregar campo is_admin a profiles si no existe
-- =====================================================
-- Si la tabla profiles no tiene el campo is_admin, ejecutar:
-- ALTER TABLE profiles ADD COLUMN is_admin BOOLEAN DEFAULT false;
-- Luego asignar admin manualmente:
-- UPDATE profiles SET is_admin = true WHERE email = 'admin@tudominio.com';
