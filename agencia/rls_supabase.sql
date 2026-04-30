-- =====================================================
-- ROW LEVEL SECURITY (RLS) - Cruceros y Tours Web
-- =====================================================

-- =====================================================
-- 1. HABILITAR RLS EN TODAS LAS TABLAS
-- =====================================================

ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE detalles_cruceros ENABLE ROW LEVEL SECURITY;
ALTER TABLE galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 2. POLÍTICAS PARA TABLAS PÚBLICAS (SÓLO LECTURA)
-- =====================================================

-- Tabla: categorias - Cualquier usuario puede leer
CREATE POLICY "Permitir lectura pública de categorias"
ON categorias FOR SELECT
USING (true);

-- Tabla: productos - Cualquier usuario puede leer
CREATE POLICY "Permitir lectura pública de productos"
ON productos FOR SELECT
USING (true);

-- Tabla: detalles_cruceros - Cualquier usuario puede leer
CREATE POLICY "Permitir lectura pública de detalles_cruceros"
ON detalles_cruceros FOR SELECT
USING (true);

-- Tabla: galleries - Cualquier usuario puede leer
CREATE POLICY "Permitir lectura pública de galleries"
ON galleries FOR SELECT
USING (true);

-- Tabla: rooms - Cualquier usuario puede leer
CREATE POLICY "Permitir lectura pública de rooms"
ON rooms FOR SELECT
USING (true);

-- Tabla: amenities - Cualquier usuario puede leer
CREATE POLICY "Permitir lectura pública de amenities"
ON amenities FOR SELECT
USING (true);

-- Tabla: highlights - Cualquier usuario puede leer
CREATE POLICY "Permitir lectura pública de highlights"
ON highlights FOR SELECT
USING (true);

-- =====================================================
-- 3. POLÍTICAS PARA PERFILES DE USUARIOS
-- =====================================================

-- Los usuarios pueden leer su propio perfil
CREATE POLICY "Usuarios pueden leer su propio perfil"
ON profiles FOR SELECT
USING (auth.uid() = user_id);

-- Los usuarios pueden actualizar su propio perfil
CREATE POLICY "Usuarios pueden actualizar su propio perfil"
ON profiles FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- 4. POLÍTICAS DE ESCRITURA (SÓLO ADMIN)
-- =====================================================

-- Para tablas de contenido: INSERT, UPDATE, DELETE solo para admin
-- Nota: Crea una función is_admin() si tienes un campo admin en profiles

-- Ejemplo de política de solo lectura para usuarios no autenticados
-- (ya configurado arriba con USING (true))

-- =====================================================
-- 5. NOTAS IMPORTANTES
-- =====================================================

/*
NOTAS PARA EL ADMIN:

1. Las políticas acima permiten LECTURA PÚBLICA a todas las tablas de contenido.
   Esto es necesario porque tu aplicación es pública y cualquiera puede ver
   los productos, categorías, cruceros, etc.

2. Para políticas de ESCRITURA (INSERT/UPDATE/DELETE), necesitas:
   - Agregar un campo 'is_admin' boolean a la tabla 'profiles'
   - Crear una función que verifique si el usuario es admin
   
   Ejemplo de política de escritura para admin:
   
   CREATE POLICY "Admin puede insertar productos"
   ON productos FOR INSERT
   WITH CHECK (
     EXISTS (
       SELECT 1 FROM profiles
       WHERE profiles.user_id = auth.uid()
       AND profiles.is_admin = true
     )
   );

3. Las credenciales VITE_SUPABASE_ANON_KEY son seguras porque:
   - RLS protege la base de datos
   - Los usuarios solo pueden acceder a lo que las políticas permiten
   - Nunca expones claves de servicio o API keys privadas

4. Para proteger contra rate limiting, considera:
   - Usar Vercel Edge Functions con rate limiting
   - Configurar límites en el panel de Supabase (Settings → API)
*/

-- =====================================================
-- 6. VERIFICAR POLÍTICAS CREADAS
-- =====================================================

-- Ver todas las políticas creadas
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;