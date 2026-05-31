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
| `/admin` | `AdminPanel` (protegido por `AdminRoute`) |
| `*` | Redirige a `/` |

---

## Diseño y estilos

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
- **No modificar** componentes no relacionados a la tarea actual
- **Consultas Supabase:** todas en `src/backend/supabase_client.js`
- **NO hardcodear** colores, spacings ni valores de estilo — usar variables CSS
- **Código optimizado** para rendimiento y SEO
- **Prohibido** tocar archivos fuera del alcance de la tarea actual

---

## Tablas de la DB (Supabase PostgreSQL)

- `categorias` — Categorías de productos/servicios
- `productos` — Paquetes de viaje
- `detalles_cruceros` — Detalles específicos de cruceros
- `galleries` — Galerías de imágenes por producto
- `rooms` — Tipos de habitaciones/cabinas con precios
- `amenities` — Amenidades con iconos emoji
- `highlights` — Descripciones destacadas
- `profiles` — Perfiles de usuario (con campo `role`)
- `reservas` — Reservas con workflow de estados
- `contactos` — Envíos del formulario de contacto
- `suscripciones` — Planes de suscripción
- `newsletter` — Suscripciones a newsletter

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
