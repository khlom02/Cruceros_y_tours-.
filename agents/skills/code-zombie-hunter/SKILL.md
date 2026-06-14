---
name: code-zombie-hunter
description: "CAZADOR DE CÓDIGO ZOMBIE — protector del proyecto que busca, identifica y elimina código muerto, obsoleto y sin funcionalidad. Actívate SIEMPRE que el usuario mencione: 'codigo zombie', 'zombie code', 'dead code', 'codigo muerto', 'codigo obsoleto', 'limpiar codigo', 'remove dead code', 'unused code', 'codigo sin usar', 'codigo viejo', 'legacy code', 'refactorizar codigo muerto', 'cleanup', 'limpieza de codigo', 'borrar codigo inutil', 'recursos desperdiciados', 'código fantasma', 'ghost code', 'codigo heredado', 'deprecated code', 'codigo deprecado', 'codigo sin funcionalidad', 'sobrante', 'codigo residual', o cuando el proyecto lleve mucho tiempo sin mantenimiento. También actívate automáticamente después de un QA Integrity check o Security Audit, para limpiar lo que esos audits detecten como inservible. Este skill es un PROTECTOR: elimina código zombie pero NUNCA pone en peligro código vital del proyecto."
---

# CODE ZOMBIE HUNTER 🧟‍♂️🔫

Protector del proyecto Cruceros y Tours (React 19 + Vite + Supabase + Vercel).
Cazador sistemático de código zombie — código muerto, obsoleto, sin funcionalidad que consume recursos, confunde desarrolladores y ensucia el codebase.

## Filosofía

El código zombie es todo aquel que:
- **No se ejecuta nunca**: funciones, componentes, variables que nadie llama
- **No se importa nunca**: exports que ningún otro archivo consume
- **No se necesita nunca**: dependencias instaladas pero jamás importadas
- **No se alcanza nunca**: código después de `return`, dentro de `if (false)`, ramas muertas
- **No sirve para nada**: archivos enteros que ya no forman parte del flujo de la app
- **No debió estar nunca**: `console.log()`, `debugger;`, commented-out blocks enormes

Cazar zombie code NO es refactorizar — es **eliminar sin piedad** lo que no aporta valor. Pero con método, clasificación y verificación.

---

## Workflow General

```
FASE 1: RASTREO  → Escaneo estático (Knip, ESLint, grep)
FASE 2: CLASIFICACIÓN → Separar MUERTOS CONFIRMADOS de SOSPECHOSOS
FASE 3: ELIMINACIÓN SEGURA → Remover confirmados, reportar sospechosos
FASE 4: VERIFICACIÓN → Build + QA Integrity para asegurar que nada se rompió
FASE 5: REPORTE → Entregar un parte de cacería
```

**REGLAS DE ORO:**

1. **DETECTAR ≠ ELIMINAR** — primero siempre clasificar. No todo lo que parece zombie lo es.
2. **NUNCA tocar** entry points del proyecto: `main.jsx`, `App.jsx` (estructura de rutas), `vite.config.js`, `vercel.json`, `supabase_client.js` (lógica de backend)
3. **NUNCA eliminar** archivos de configuración activos: `package.json`, `eslint.config.js`, `.env`, `index.html`
4. **NUNCA modificar** el contexto `AuthContext.jsx` — es crítico para autenticación
5. **VERIFICAR SIEMPRE** con `npm run build` después de cada tanda de eliminaciones
6. **Si el build falla**, restaurar inmediatamente con `git checkout -- <file>` y reportar
7. **Máximo 3 tandas** por sesión; si hay más, reportar como deuda técnica pendiente

---

## FASE 1: RASTREO (Scanning)

Ejecutar SIEMPRE en orden. NO saltarse pasos.

### 1.1 — Knip (detección multi-nivel)

Ejecutar Knip desde la raíz del proyecto (`agencia/`). Si no está instalado, instalarlo temporalmente:

```bash
cd agencia && npx knip@5 --no-gitignore --include-libs 2>&1
```

Knip detecta automáticamente:
- **Unused files** — Archivos nunca importados
- **Unused dependencies** — Paquetes en `package.json` nunca usados
- **Unused devDependencies** — DevDeps nunca usadas
- **Unused exports** — Exports nunca importados por ningún otro archivo
- **Unlisted dependencies** — Paquetes usados pero no declarados en `package.json`
- **Unresolved imports** — Imports que apuntan a módulos que no existen

Interpretar el output de Knip así:
```
Unused files (N)               → POSIBLE ZOMBIE (alta confianza)
Unused dependencies (N)        → ZOMBIE CONFIRMADO (eliminar sin miedo)
Unused devDependencies (N)     → ZOMBIE CONFIRMADO
Unused exports (N)             → SOSPECHOSO (revisar si es API pública)
Unlisted dependencies (N)      → REVISAR (puede ser dependencia implícita)
Unresolved imports (N)         → ERROR (esto rompe el build, arreglarlo)
```

### 1.2 — ESLint (unused variables)

```bash
cd agencia && npx eslint . --rule 'no-unused-vars: error' --no-eslintrc --config eslint.config.js 2>&1
```

Detecta:
- Variables importadas pero no usadas
- Variables declaradas pero no usadas dentro del mismo archivo
- Parámetros de función no usados

### 1.3 — Grep sistemático (patrones zombie)

Buscar estos patrones en TODO el código fuente (excluyendo `node_modules/` y `dist/`):

```bash
cd agencia/src

# Debug artifacts
rg -n "console\.log\(" --include='*.jsx' --include='*.js' 2>/dev/null
rg -n "debugger;" --include='*.jsx' --include='*.js' 2>/dev/null

# Commented-out JSX blocks (3+ consecutive commented lines with JSX)
rg -n "^\s*//\s*<[A-Z]" --include='*.jsx' 2>/dev/null
rg -n "^\s*//\s*<[a-z]" --include='*.jsx' 2>/dev/null

# Large commented-out code blocks (10+ consecutive comment lines)
rg -n "^(\s*//.*\n){10,}" --include='*.jsx' --include='*.js' --multiline 2>/dev/null || true

# Empty functional components
rg -n "const \w+ = \([^)]*\)\s*=>\s*\{\s*\};" --include='*.jsx' 2>/dev/null
rg -n "function \w+\([^)]*\)\s*\{\s*\}" --include='*.jsx' --include='*.js' 2>/dev/null

# TODO/FIXME markers (for forensic analysis, not auto-delete)
rg -n "TODO|FIXME|HACK|XXX" --include='*.jsx' --include='*.js' 2>/dev/null

# Unreachable code after return
rg -n "^\s+return\s+" --include='*.jsx' --include='*.js' -A 5 2>/dev/null
```

### 1.4 — Huérfanos de assets

```bash
cd agencia/public

# List all images in public/
find . -type f \( -iname '*.png' -o -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.svg' -o -iname '*.webp' -o -iname '*.gif' -o -iname '*.ico' \) | sed 's|^\./||' > /tmp/public_assets.txt

# Check which are referenced in source code
while IFS= read -r asset; do
  basename=$(basename "$asset")
  if ! rg -q "$basename" ../src/ 2>/dev/null; then
    echo "ORPHAN: $asset"
  fi
done < /tmp/public_assets.txt
```

### 1.5 — Archivos CSS huérfanos

```bash
cd agencia/src

# List all CSS files
find . -name '*.css' -not -path './node_modules/*' | sed 's|^\./||' > /tmp/all_css.txt

# Check which are imported in JSX/JS
while IFS= read -r css_file; do
  basename=$(basename "$css_file")
  if ! rg -q "import.*['\"].*$basename" --include='*.jsx' --include='*.js' 2>/dev/null; then
    echo "ORPHAN CSS: $css_file"
  fi
done < /tmp/all_css.txt
```

---

## FASE 2: CLASIFICACIÓN

Una vez obtenidos todos los resultados, clasificar CADA hallazgo en una categoría:

### 🟢 CLASE A — ZOMBIE CONFIRMADO (eliminación automática segura)

| Tipo | Ejemplos |
|------|----------|
| `console.log()` sin propósito | Logs de depuración evidentes (`console.log("hola")`, `console.log(data)`) |
| Variables no usadas | `let x = 5;` sin que `x` se use después |
| Comentarios de una línea con código | `// <SomeComponent />` sin contexto útil |
| Dependencias no usadas | `bootstrapp`, paquetes en `package.json` sin imports |
| `debugger;` | Cualquier instancia de `debugger;` |
| Archivos CSS no importados | CSS files en `src/styles/` que ningún componente importa |

### 🟡 CLASE B — SOSPECHOSO (requiere revisión humana)

| Tipo | Razón |
|------|-------|
| Unused exports | Podría ser API pública deliberada o futura |
| Unused files | Podría planearse usar después |
| Bloques comentados grandes | Podría contener lógica valiosa comentada por una razón |
| Empty components | Podría ser placeholder intencional |
| Orphan assets | Podría usarse dinámicamente (carga por nombre desde DB) |

### 🟠 CLASE C — REQUIERE INVESTIGACIÓN

| Tipo | Razón |
|------|-------|
| Unresolved imports | Son errores que rompen el build — hay que arreglarlos, no solo eliminarlos |
| TODO/FIXME/HACK | Indican deuda técnica — reportar pero no borrar |
| Unlisted dependencies | El código las usa pero no están en `package.json` — agregarlas, no quitarlas |
| Código no alcanzable | A veces hay early returns deliberados con cleanup debajo |

---

## FASE 3: ELIMINACIÓN SEGURA

### Para CLASE A (Zombies Confirmados)

Eliminar UN ARCHIVO A LA VEZ y verificar después de CADA uno:

```bash
# 1. Eliminar el archivo o la línea
rm src/components/SomeOldComponent.jsx

# 2. Verificar que el build sigue funcionando
cd agencia && npm run build 2>&1

# 3. Si falla, restaurar inmediatamente
git checkout -- src/components/SomeOldComponent.jsx
```

**Para eliminar código dentro de un archivo** (ej: `console.log`, variable no usada):
- Usar `edit` para remover la línea exacta
- No eliminar imports enteros si el módulo se usa para otra cosa
- Si es un import completo no usado, eliminar toda la línea del import

**Para eliminar dependencias no usadas:**
```bash
npm uninstall <package-name>
```

### Para CLASE B (Sospechosos)

NO eliminar. En su lugar, compilar en el reporte como "investigar".

Excepción: si el usuario dice explícitamente "elimina todo lo que encuentres", entonces marcar Clase B como "pendiente de confirmación" y preguntar UNO POR UNO:

> "Encontré `src/components/OldThing.jsx` que no se importa en ningún lado. ¿La elimino?"

### Para CLASE C

Solo reportar. No tocar.

---

## FASE 4: VERIFICACIÓN

Después de CADA tanda de eliminaciones:

```bash
cd agencia && npm run build 2>&1
```

Si el build falla:
1. Identificar qué eliminación causó el fallo
2. Restaurar con `git checkout -- <archivo>`
3. Re-clasificar ese elemento como CLASE C (no era zombie)
4. Continuar con los siguientes

Al final de todas las tandas, ejecutar verificación completa:

```bash
cd agencia && npm run lint 2>&1
cd agencia && npm run build 2>&1
```

---

## FASE 5: REPORTE DE CACERÍA

Entregar siempre este reporte estructurado al final:

```
╔══════════════════════════════════════════════════════════╗
║        CODE ZOMBIE HUNTER — PARTE DE CACERÍA            ║
╚══════════════════════════════════════════════════════════╝

📊 RESUMEN
═══════════════════════════════════════════════════════════
🟢 Eliminados (Clase A):    N zombies abatidos
🟡 Sospechosos (Clase B):   N en cuarentena (requieren revisión)
🟠 Por investigar (Clase C): N marcados para forense
📦 Líneas eliminadas:       ~XXX líneas de código muerto
💾 KB ahorrados:            ~XXX KB en el build final

═══════════════════════════════════════════════════════════
🟢 ZOMBIES ELIMINADOS
═══════════════════════════════════════════════════════════
[N] [archivo:línea] [tipo] [qué se hizo]
Ejemplo:
[1] src/components/old-banner.jsx (archivo completo) → eliminado
[2] src/pages/home.jsx:45 (console.log) → removido
[3] package.json (bootstrapp) → npm uninstall

═══════════════════════════════════════════════════════════
🟡 SOSPECHOSOS EN CUARENTENA
═══════════════════════════════════════════════════════════
[N] [archivo:línea] [tipo] [por qué se sospecha]
Ejemplo:
[1] src/utils/oldHelper.js (unused export) → podría ser API legacy
[2] public/assets/old-logo.svg (orphan) → no referenciado en código

═══════════════════════════════════════════════════════════
🟠 PENDIENTE DE INVESTIGACIÓN
═══════════════════════════════════════════════════════════
[N] [archivo:línea] [tipo] [acción recomendada]
Ejemplo:
[1] src/backend/supabase_client.js:301 (TODO: migrate to new API) → planificar migración
[2] src/utils/imageHelper.js:15 (FIXME: broken for webp) → corregir bug

═══════════════════════════════════════════════════════════
✅ VERIFICACIÓN
═══════════════════════════════════════════════════════════
Build: PASA ✅ | Lint: PASA ✅
Tiempo de build: X.XXs (antes era X.XXs)
Sin regresiones introducidas.

═══════════════════════════════════════════════════════════
💡 RECOMENDACIONES
═══════════════════════════════════════════════════════════
- Revisar los N sospechosos en cuarentena manualmente
- Los TODO/FIXME podrían planificarse en el backlog
- Considerar integrar Knip en CI para prevenir nuevo código zombie
- Ejecutar esta cacería periódicamente (recomendado: cada mes)
```

---

## Tabla de tipos de zombie con prioridad y acción

| Tipo | Prioridad | Clase | Herramienta | Acción |
|------|-----------|-------|-------------|--------|
| `console.log()` en producción | 🔴 Alta | A | grep | Eliminar línea |
| `debugger;` | 🔴 Alta | A | grep | Eliminar línea |
| Dependencia no usada | 🔴 Alta | A | Knip | `npm uninstall` |
| DevDependency no usada | 🟡 Media | A | Knip | `npm uninstall -D` |
| Archivo CSS huérfano | 🟡 Media | A | bash | Eliminar archivo |
| Variable no usada | 🟡 Media | A | ESLint | Eliminar declaración |
| Import no usado (exclusivo) | 🟡 Media | A | ESLint | Eliminar línea import |
| Unused file (no entry) | 🟡 Media | B | Knip | Preguntar antes de eliminar |
| Unused export | 🟡 Media | B | Knip | Reportar, no eliminar |
| Comentario de código | 🟢 Baja | A/B | grep | Si es obvio, limpiar |
| Bloque comentado grande | 🟢 Baja | B | grep | Reportar |
| Empty component | 🟢 Baja | B | grep | Preguntar |
| Orphan asset | 🟢 Baja | B | bash | Preguntar |
| Unresolved import | 🔴 Alta | C | Knip | NO ELIMINAR — arreglar |
| Unlisted dependency | 🟡 Media | C | Knip | Agregar a `package.json` |
| TODO/FIXME/HACK | 🟢 Baja | C | grep | Reportar al equipo |

---

## Tips tácticos para el cazador

1. **Cazar un tipo a la vez**: primero `console.log`s, luego variables, luego archivos. No mezclar.
2. **Confiar en Knip para dependencias**: Knip tiene alta precisión para unused deps. Es seguro eliminar lo que marca como no usado.
3. **Desconfiar de unused exports**: React components exportados podrían usarse dinámicamente (lazy loading, map de rutas). Verificar con `rg "import.*OldComponent"` antes de eliminar.
4. **Los CSS huérfanos suelen ser zombies seguros**: Si un CSS no se importa en ningún JSX/JS, es zombie.
5. **Los assets huérfanos pueden ser falsos positivos**: Podrían cargarse por URL dinámica. Verificar si hay alguna lógica en el código que construya rutas dinámicamente.
6. **`console.log` con contenido sensible**: Además de zombie, es riesgo de seguridad si logea emails, tokens o datos personales — prioridad máxima.
7. **Si el proyecto tiene TypeScript**: Knip tiene mejor precisión con TS. Este proyecto es JavaScript, así que Knip puede tener algunos falsos positivos con exports — siempre verificar.

---

## Integración con otros skills

- **Después de `qa-integrity`**: QA puede detectar imports rotos o CSS no encontrados. Este skill los limpia.
- **Después de `security-auditor`**: Security puede encontrar `console.log` con datos sensibles. Este skill los elimina.
- **Antes de `qa-debugger`**: Primero limpiar zombie code, luego aplicar fixes — evita gastar tiempo arreglando código que debería eliminarse.

---

## Prohibiciones absolutas (NO HACER NUNCA)

1. NO tocar `main.jsx` — entry point del bundle
2. NO tocar `App.jsx` — define TODAS las rutas del proyecto
3. NO tocar `AuthContext.jsx` — lógica crítica de autenticación
4. NO tocar `supabase_client.js` — todas las queries a la DB
5. NO tocar `vite.config.js` — configuración del build
6. NO tocar `vercel.json` — configuración del deploy
7. NO tocar `index.html` — HTML root
8. NO tocar `variables.css` — sistema de diseño global
9. NO tocar `base.css` — estilos reset/globales
10. NO eliminar un archivo si hay duda razonable de que pueda usarse en tiempo de ejecución aunque no se importe estáticamente
11. NO modificar JSX que renderiza rutas dinámicas o lazy-loaded components
12. NO hacer `rm -rf` de directorios enteros sin verificar archivo por archivo
