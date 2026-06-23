# AGENTS.md — Cruceros y Tours

## Descripción del proyecto

Agencia de viajes SPA para reservar cruceros, tours, vuelos y servicios especiales. Construida con React + Vite, Supabase como backend (PostgreSQL + Auth + Storage). Desplegada en Vercel.

**URL:** https://cruceros-y-tours.vercel.app (con guiones)
**URL alternativa (legacy):** https://crucerosytours.vercel.app (sin guiones, actualmente 404)

---

## Comandos

Ejecutar desde `agencia/`:

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor dev con HMR |
| `npm run build` | Build producción (output a dist/) |
| `npm run lint` | ESLint check |
| `npm run preview` | Preview del build local |

No hay framework de tests configurado.

---

## Stack tecnológico

- **Frontend:** React 19, React Router DOM v7 (BrowserRouter, v6-compatible API), Bootstrap 5, react-bootstrap
- **Animaciones:** GSAP 3.14, animate.css
- **SEO:** react-helmet-async, JSON-LD structured data
- **Backend:** Supabase (PostgreSQL + Auth + Storage + RLS)
- **Build:** Vite 7 + SWC
- **Despliegue:** Vercel (con SPA fallback, security headers, rate limiting)
- **Linting:** ESLint 9 con React Hooks plugin
- **Iconos:** FontAwesome 6, Bootstrap Icons, react-icons

---

## Estructura del proyecto

```
Cruceros_y_tours-./
├── AGENTS.md                    # ← Este archivo
├── CLAUDE.md                    # Redirige a AGENTS.md
└── agencia/                     # ★ Aplicación principal
    ├── vercel.json              # Config Vercel (IMPORTANTE: dentro de agencia/, no raíz del repo)
    ├── .env                     # VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY
    ├── package.json
    ├── vite.config.js           # SWC + code-splitting chunks
    ├── eslint.config.js
    ├── index.html
    ├── rls_supabase.sql         # Políticas RLS para Supabase
    ├── public/
    │   ├── assets/              # Logos de navieras
    │   ├── imagenes/            # Fotos de destinos
    │   ├── robots.txt
    │   ├── sitemap.xml
    │   └── llms.txt
    └── src/
        ├── main.jsx             # Punto de entrada React
        ├── App.jsx              # Componente raíz (rutas + providers)
        ├── backend/
        │   ├── supabase_client.js   # TODAS las consultas Supabase
        │   └── productService.js    # Legacy fetch service
        ├── contexts/
        │   └── AuthContext.jsx      # Context de autenticación
        ├── utils/
        │   └── imageHelper.js       # Resolución de URLs de imágenes
        ├── components/              # 37 componentes React
        ├── styles/                  # CSS por componente + globales
        └── imagenes/                # Assets locales
```

---

## Arquitectura

### Entry Points
- `agencia/src/main.jsx` — Monta `<App />` en `#root`, importa Bootstrap JS
- `agencia/src/App.jsx` — Root: `HelmetProvider > AuthProvider > Router`. Define TODAS las rutas

### Estado global
- `src/contexts/AuthContext.jsx` — Auth state de Supabase. Expone: `user`, `session`, `signIn`, `signUp`, `signInWithOAuth`, `signOut`, `getUserProfile`, `resetPasswordForEmail`, `updatePassword`

### Backend (Supabase)
- **Todas** las consultas van en `src/backend/supabase_client.js` (único archivo monolítico ~768 líneas)
- Credenciales en `agencia/.env`: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- Proyecto Supabase ID: `krpdacuthwpoyuccbihf`
- Tablas principales: `categorias`, `productos`, `detalles_cruceros`, `galleries`, `rooms`, `amenities`, `highlights`, `profiles`, `reservas`, `contactos`, `suscripciones`, `newsletter`

### Routing (App.jsx)
| Ruta | Componente |
|---|---|
| `/` | `landingPage` |
| `/destinos` | `destinos` |
| `/cruceros` | `Cruceros` |
| `/vuelos` | `vuelos` |
| `/servicios_especiales` | `servicios_especiales` |
| `/servicios_especiales/:categoria` | `ServicioCategoria` (dinámico) |
| `/detalles` | `detalles` (embebe `rooms.jsx`) |
| `/contacto` | `contacto` |
| `/login`, `/registro`, `/reset-password` | Auth pages |
| `/perfil` | `Perfil` |
| `/faq` | `FAQ` |
| `/guia-de-uso` | `GuiaDeUso` |
| `/politicas-privacidad` | `PoliticasPrivacidad` |
| `/suscripciones` | `Suscripciones` |
| `/nosotros` | `SobreNosotros` |
| `/admin` | `AdminPanel` (protegido por `AdminRoute`) |
| `*` | `NotFound` (página 404 personalizada con SEO noindex) |

---

## Diseño y estilos

## UI / Estilo base
- Tipografia global: 'Chicago Police', sans-serif (definida en src/styles/base.css).
- Fondo base: #ffffff.
- Usar variables CSS de src/styles/variables.css para colores, sombras y bordes.
  - Primario: var(--color-primary)
  - Primario oscuro: var(--color-primary-dark)
  - Texto principal: var(--color-text-primary)
  - Texto secundario: var(--color-text-secondary)
  - Fondo claro: var(--color-background-light)
  - Bordes: var(--border-radius)
  - Sombras: var(--shadow-sm), var(--shadow-md), var(--shadow-lg)

## Reglas de trabajo
- PROHIBIDO tocar otros archivos de codigo que no sean de la seccion en la que estamos trabajando.
- Si estamos trabajando en un componente, NO debes tocar otros componentes que no se relacionen.
- Debes escribir codigo limpio y con buenas practicas.
- Evitar codigo basura.
- Estamos trabajando con React: cada componente debe tener toda su logica dentro del mismo.
- No debe haber codigo hardcodeado.
- TODO CODIGO DEBE ESTAR OPTIMIZADO PARA RENDIMIENTO Y SEO.
- Usar siempre hooks y componentes funcionales.
- Seguir la arquitectura y convenciones del proyecto.
- Todo componente debe tener su archivo CSS propio si es necesario.

## Convenciones de estilos
- Centralizar colores/estilos en src/styles/variables.css.
- Estilos globales y utilidades en src/styles/base.css.
- Mantener consistencia con clases utilitarias existentes (ml-2, re, logo-container, logo-container_header).

## Arquitectura basica
- El layout principal vive en src/App.jsx con Header y Footer globales.
- Rutas definidas en src/App.jsx con React Router.

### Sistema de estilos
- `src/styles/variables.css` — Variables CSS (usar SIEMPRE, NO valores hardcodeados)
- `src/styles/base.css` — Estilos globales y utilidades
- Cada componente tiene su propio CSS en `src/styles/`

### Paleta de colores
- Primario: `#0FD3D3` (turquesa) → `var(--color-primary)`
- Primario oscuro: `var(--color-primary-dark)`
- Texto principal/Secundario: `#003366` (azul oscuro) → `var(--color-text-primary)`
- Texto secundario: `var(--color-text-secondary)`
- Fondo: `#FFFFFF`
- Fondo claro: `var(--color-background-light)`
- Bordes: `var(--border-radius)`
- Sombras: `var(--shadow-sm)`, `var(--shadow-md)`, `var(--shadow-lg)`

### Tipografía
- Font global: `'Chicago Police', sans-serif` (definida en `base.css`)
- Usar `clamp()` para `font-size`

### Cards — Tamaño uniforme OBLIGATORIO
**Todas las cards del proyecto deben usar las variables CSS del sistema de diseño definido en `variables.css`** para mantener un tamaño uniforme. NO se aceptan valores hardcodeados de `min-height`, `border-radius`, `box-shadow`, ni `padding` en las cards.

| Variable | Desktop | 768px | 600px | 480px |
|---|---|---|---|---|
| `--card-hero-min-height` | 400px | 300px | 280px | 260px |
| `--card-hero-radius` | 16px | — | — | — |
| `--card-servicio-min-height` | 320px | 300px | — | 260px |

Reglas:
- Hero cards (`.card--hero`, `.card--destino`, `.destination-card`, `.card_cruceros`, `.tour-card`, `.grid-experiencia__card`): usar `var(--card-hero-min-height)` y sus variantes responsive `*‑md`, `*‑sm`, `*‑xs`
- Service cards (`.card_servicio`): usar `var(--card-servicio-min-height)`
- `border-radius` siempre con `var(--card-hero-radius)` en hero cards
- `box-shadow` siempre con `var(--card-shadow)` / `var(--card-shadow-hover)`
- Cualquier card nueva debe usar estas variables desde su creación

---

## Responsividad — Regla OBLIGATORIA

**Todo componente nuevo o modificado debe ser responsive desde su creación.** No se acepta código solo para desktop.

### Breakpoints (orden de aplicación)
| Breakpoint | Uso |
|---|---|
| `max-width: 480px` | Móvil pequeño |
| `max-width: 600px` | Móvil medio |
| `max-width: 768px` | Tablet / móvil grande |
| `max-width: 900px` | Tablet landscape |
| `max-width: 1100px` | Pantallas medianas |
| `max-width: 1200px` | Desktop estándar |

### Reglas concretas
- `clamp()` para `font-size` en lugar de valores fijos
- `flex-wrap: wrap` y `grid` con `auto-fit / minmax` para layouts
- Imágenes: `width: 100%; object-fit: cover/contain`
- No usar `padding`/`margin` fijos grandes sin breakpoint que los reduzca en móvil
- Menú hamburguesa en `<768px` (ya implementado en `header.jsx`)
- Componentes con posicionamiento absoluto o GSAP: calcular offsets dinámicamente según `window.innerWidth`
- Probar siempre en al menos 375px, 768px y 1280px

---

## Convenciones de código

- **Componentes:** funcionales con hooks, lógica dentro del mismo componente
- **CSS:** archivo propio por componente si necesita estilos, usando variables de `variables.css`
- **No modificar** SUMAMENTE IMPORTANTE componentes no relacionados a la tarea actual
- **Consultas Supabase:** todas en `src/backend/supabase_client.js`
- **NO hardcodear** colores, spacings ni valores de estilo — usar variables CSS
- **Código optimizado** para rendimiento y SEO
- **Prohibido** tocar archivos fuera del alcance de la tarea actual SUMAMENTE IMPORTANTE

---

## Tablas de la DB (Supabase PostgreSQL)

- `categorias` — Categorías de productos/servicios
- `productos` — Paquetes de viaje
- `detalles_cruceros` — Detalles específicos de cruceros
- `galleries` — Galerías de imágenes por producto
- `rooms` — Tipos de habitaciones/cabinas con precios
- `amenities` — Amenidades con iconos emoji
- `highlights` — Descripciones destacadas
- `profiles` — Perfiles de usuario (con campo `rol` varchar para privilegio admin)
- `reservas` — Reservas con workflow de estados
- `contactos` — Envíos del formulario de contacto
- `suscripciones` — Planes de suscripción
- `newsletter` — Suscripciones a newsletter

### Campo de privilegio admin
- Tabla: `profiles`
- Campo: `rol` (VARCHAR, nullable)
- Valor admin: cadena `'admin'`
- La función `is_admin()` en Supabase encapsula la verificación.
- Para asignar admin: `UPDATE profiles SET rol = 'admin' WHERE id = '<UUID>';`
- **IMPORTANTE:** No existe campo `is_admin` boolean. El ejemplo comentado en `rls_supabase.sql` estaba equivocado.

---

## Modelo local (Ollama + Vulkan)

El proyecto tiene configurado un modelo local para evitar límites de API:

- **Modelo:** `qwen2.5-coder:7b` corriendo en Ollama con aceleración Vulkan
- **GPU:** AMD Radeon RX 570 (8GB VRAM) — ~55-62 tok/s
- **Servicio:** `ollama-vulkan.service` (user-level systemd) en `http://localhost:11434`
- **Config opencode:** `opencode.json` en la raíz del proyecto
- **Comandos útiles:**
  - `systemctl --user status ollama-vulkan.service` — Ver estado
  - `systemctl --user start/stop ollama-vulkan.service` — Iniciar/detener
  - `ollama run qwen2.5-coder:7b` — Probar el modelo directamente

Para cambiar de modelo local a uno en la nube, usar `/models` en opencode.

---

## Notas adicionales

- El layout principal vive en `App.jsx` con Header y Footer globales
- `rooms.jsx` se renderiza embebido dentro de `detalles.jsx` (no es ruta propia)
- Admin route protegida por `AdminRoute.jsx`
- `robots.txt` permite crawlers de IA (GPTBot, ClaudeBot, PerplexityBot)
- Code-splitting configurado en `vite.config.js`: vendor, supabase, ui, animation chunks
- Las imágenes se sirven desde `public/` (rutas locales), NO desde Supabase Storage

---

## Vercel — Configuración crítica

El Dashboard de Vercel tiene **`Root Directory: agencia`**. Esto implica:

1. **`vercel.json` debe estar en `agencia/vercel.json`**, no en la raíz del repo. El de la raíz es ignorado.
2. **`buildCommand`** se ejecuta desde `agencia/`, por lo tanto es solo `npm install && npm run build` (sin `cd agencia`).
3. **`outputDirectory`** es `dist` (relativo a `agencia/`).

### Variables de entorno requeridas en Vercel Dashboard

| Variable | Valor |
|---|---|
| `VITE_SUPABASE_URL` | URL del proyecto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Anon key pública de Supabase |
| `VITE_TURNSTILE_SITE_KEY` | `0x4AAAAAADd6blXfpD5j1zCO` (clave pública Cloudflare Turnstile) |

### SPA fallback

Usar **`rewrites`** (NO `routes`). Los `rewrites` tienen máxima prioridad y sobreescriben el framework detection de Vite.

```json
"rewrites": [
  { "source": "/(.*)", "destination": "/index.html" }
]
```

### Errores conocidos / evitados

| Error | Causa | Solución |
|---|---|---|
| `Build Failed: should NOT have additional property rootDirectory` | `rootDirectory` no es válido en `vercel.json` | Configurarlo solo en Dashboard |
| `sh: line 1: cd: agencia: No such file or directory` | `cd agencia` en buildCommand + Dashboard Root Directory = doble path | BuildCommand debe ser solo `npm install && npm run build` |
| Subpáginas 404 (x-vercel-error: NOT_FOUND) | Vite framework detection ignora `routes` de vercel.json | Usar `rewrites` (mayor prioridad) y poner vercel.json dentro de `agencia/` |
| Security headers ausentes | vercel.json no se leía por estar fuera del project root | Mover vercel.json a `agencia/` |

---

## CSS — Fixes documentados

### Aerolíneas overlapping

La tarjeta `.airline-card` con `position: sticky` se solapaba con el header sticky.

- **Fix:** `top: 30px` → `top: 100px` (clear header height)
- **Fix:** agregar `align-self: flex-start`
- **Font-family:** evitar doble quoting: `'Lora', serif` no `"'Lora', serif"`

### MCP tools
cuando necesites buscar documentacion, usa 'context7' tools.

---

## Ponytail — control de over-engineering

El proyecto tiene configurado el plugin **Ponytail** para OpenCode. Su objetivo es evitar over-engineering forzando al agente a:

1. Preguntarse si algo necesita existir (YAGNI)
2. Reutilizar código existente en el proyecto
3. Preferir stdlib, plataforma nativa y dependencias ya instaladas
4. Escribir el mínimo código necesario

**Por defecto está APAGADO (`off`)** para que tú tengas el control total.

### Activar / desactivar durante una sesión

Usa el comando `/ponytail` seguido del nivel:

| Comando | Efectivo |
|---|---|
| `/ponytail off` | Desactivado (por defecto) |
| `/ponytail lite` | Activo, solo sugerencias suaves |
| `/ponytail full` | Activo, reglas normales |
| `/ponytail ultra` | Muy agresivo recortando complejidad |

El cambio se aplica desde el siguiente mensaje.

### Cambiar el modo por defecto

Opción A — variable de entorno (prioridad alta):

```bash
export PONYTAIL_DEFAULT_MODE=full
```

Opción B — archivo de configuración global:

Edita `~/.config/ponytail/config.json`:

```json
{
  "defaultMode": "full"
}
```

Valores válidos: `off`, `lite`, `full`, `ultra`.

### Otros comandos útiles

- `/ponytail` — muestra el modo activo
- `/ponytail-review` — revisa el diff actual buscando over-engineering
- `/ponytail-audit` — audita todo el repo buscando over-engineering

### Instalación técnica

El plugin se carga desde `opencode.json` apuntando a la ruta absoluta del checkout:

```json
"plugin": ["/home/khalom/.opencode/ponytail/.opencode/plugins/ponytail.mjs"]
```

El checkout vive en `/home/khalom/.opencode/ponytail` (clonado del repo oficial). Para actualizarlo:

```bash
cd /home/khalom/.opencode/ponytail && git pull
```