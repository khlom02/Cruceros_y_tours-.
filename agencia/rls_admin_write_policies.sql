-- =====================================================
-- RLS POLÍTICAS DE ESCRITURA — ADMIN
-- Cruceros y Tours
-- =====================================================
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- =====================================================
-- NOTA: El campo de privilegio en 'profiles' es 'rol' (VARCHAR).
-- El valor para admin es la cadena 'admin'.
-- No existe un campo 'is_admin' boolean — ese ejemplo en
-- rls_supabase.sql estaba incorrecto y nunca se ejecutó.
-- =====================================================

-- ─── Función auxiliar is_admin() ───────────────────
-- Evita repetir la subquery en cada política.
-- Usa SECURITY DEFINER para acceder a profiles sin exponer datos.

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.rol = 'admin'
  );
$$;

-- ─── Tabla: productos ──────────────────────────────

CREATE POLICY "Admin puede insertar productos"
ON productos FOR INSERT
WITH CHECK (is_admin());

CREATE POLICY "Admin puede actualizar productos"
ON productos FOR UPDATE
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Admin puede eliminar productos"
ON productos FOR DELETE
USING (is_admin());

-- ─── Tabla: categorias ─────────────────────────────

CREATE POLICY "Admin puede insertar categorias"
ON categorias FOR INSERT
WITH CHECK (is_admin());

CREATE POLICY "Admin puede actualizar categorias"
ON categorias FOR UPDATE
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Admin puede eliminar categorias"
ON categorias FOR DELETE
USING (is_admin());

-- ─── Tabla: detalles_cruceros ──────────────────────

CREATE POLICY "Admin puede insertar detalles_cruceros"
ON detalles_cruceros FOR INSERT
WITH CHECK (is_admin());

CREATE POLICY "Admin puede actualizar detalles_cruceros"
ON detalles_cruceros FOR UPDATE
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Admin puede eliminar detalles_cruceros"
ON detalles_cruceros FOR DELETE
USING (is_admin());

-- ─── Tabla: galleries ──────────────────────────────

CREATE POLICY "Admin puede insertar galleries"
ON galleries FOR INSERT
WITH CHECK (is_admin());

CREATE POLICY "Admin puede actualizar galleries"
ON galleries FOR UPDATE
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Admin puede eliminar galleries"
ON galleries FOR DELETE
USING (is_admin());

-- ─── Tabla: rooms ──────────────────────────────────

CREATE POLICY "Admin puede insertar rooms"
ON rooms FOR INSERT
WITH CHECK (is_admin());

CREATE POLICY "Admin puede actualizar rooms"
ON rooms FOR UPDATE
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Admin puede eliminar rooms"
ON rooms FOR DELETE
USING (is_admin());

-- ─── Tabla: amenities ──────────────────────────────

CREATE POLICY "Admin puede insertar amenities"
ON amenities FOR INSERT
WITH CHECK (is_admin());

CREATE POLICY "Admin puede actualizar amenities"
ON amenities FOR UPDATE
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Admin puede eliminar amenities"
ON amenities FOR DELETE
USING (is_admin());

-- ─── Tabla: highlights ─────────────────────────────

CREATE POLICY "Admin puede insertar highlights"
ON highlights FOR INSERT
WITH CHECK (is_admin());

CREATE POLICY "Admin puede actualizar highlights"
ON highlights FOR UPDATE
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Admin puede eliminar highlights"
ON highlights FOR DELETE
USING (is_admin());

-- ─── Tabla: profiles — admin puede leer todos ──────
-- (por defecto solo puede leer el propio perfil)

CREATE POLICY "Admin puede leer todos los perfiles"
ON profiles FOR SELECT
USING (is_admin() OR auth.uid() = id);

-- ─── Asignar rol admin (ejecutar UNA sola vez) ─────
-- Reemplazar con el UUID real del usuario admin:
-- UPDATE profiles SET rol = 'admin' WHERE id = '<UUID-del-admin>';

-- ─── Verificar políticas aplicadas ─────────────────
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, cmd;
