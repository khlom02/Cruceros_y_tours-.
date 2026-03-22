# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Travel agency single-page application for booking cruises, tours, flights, and special services. Built with React + Vite, using Supabase as the backend (PostgreSQL database + authentication).

The main application lives in the `agencia/` subdirectory.

## Commands

Run these from the `agencia/` directory:

```bash
npm run dev       # Start dev server with HMR
npm run build     # Production build (output to dist/)
npm run lint      # ESLint check
npm run preview   # Preview production build locally
```

No test framework is configured.

## Architecture

### Entry Points
- `agencia/src/main.jsx` — React app mount
- `agencia/src/App.jsx` — Root component: defines all routes, wraps app in `AuthProvider` → `Router`

### State Management
One React Context provider:
- `src/contexts/AuthContext.jsx` — Supabase auth state; exposes `signIn`, `signUp`, `signInWithOAuth`, `signOut`, `getUserProfile`

### Backend
- `src/backend/supabase_client.js` — Single file for all Supabase queries (`fetchCategories`, `fetchProductsByCategory`, etc.)
- Credentials in `agencia/.env` as `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

### Routing
All routes defined in `App.jsx`:
- `/` landing, `/destinos` destinations, `/cruceros` cruises, `/vuelos` flights, `/servicios_especiales` special services
- `/servicios_especiales/:categoria` — subrutas dinámicas (trenes, vehiculos, asistencia)
- `/detalles` trip detail (Rooms se renderiza embebido aquí, no es ruta propia)
- `/contacto` contact, `/login`, `/registro`, `/reset-password` auth pages
- `/admin` admin panel (protected via `AdminRoute` component)
- `*` catch-all redirige a `/`

### Styling System
- `src/styles/variables.css` — CSS custom properties (must use these, no hardcoded values)
- `src/styles/base.css` — Global styles and utility classes
- Each component has its own CSS file in `src/styles/`

**Color palette:**
- Primary: `#0FD3D3` (turquoise)
- Secondary / text: `#003366` (dark blue)
- Background: `#FFFFFF`

**Typography:** `'Chicago Police', sans-serif` — global font for all text

## Responsividad — Regla obligatoria

**Todo componente nuevo o modificado debe ser responsive desde el momento en que se crea.** No se acepta código que funcione solo en desktop.

Breakpoints estándar del proyecto (aplicar en este orden):

| Breakpoint | Uso |
|---|---|
| `max-width: 480px` | Móvil pequeño |
| `max-width: 600px` | Móvil medio |
| `max-width: 768px` | Tablet / móvil grande |
| `max-width: 900px` | Tablet landscape |
| `max-width: 1100px` | Pantallas medianas |
| `max-width: 1200px` | Desktop estándar |

Reglas concretas:
- Usar `clamp()` para `font-size` en lugar de valores fijos.
- Usar `flex-wrap: wrap` y `grid` con `auto-fit / minmax` para layouts.
- Imágenes siempre con `width: 100%; object-fit: cover/contain`.
- Nunca usar `padding` o `margin` con valores fijos grandes sin un breakpoint que los reduzca en móvil.
- El menú de navegación en `<768px` usa el menú hamburguesa (ya implementado en `header.jsx`).
- Para componentes con posicionamiento absoluto o GSAP, calcular offsets dinámicamente según `window.innerWidth`.
- Probar siempre la vista en al menos 375px, 768px y 1280px de ancho.

## Documentos de referencia obligatoria

Este archivo (`CLAUDE.md`) y `agencia/.github/copilot-instructions.md` deben consultarse **antes de escribir cualquier código** en este repositorio. Contienen las convenciones, restricciones y arquitectura del proyecto. Cualquier cambio que contradiga estas guías debe ser consultado primero con el usuario.

## Coding Conventions

- Functional components with hooks only
- Each new component gets its own CSS file if it needs styling
- Do not modify components unrelated to the current task
- All Supabase queries go in `src/backend/supabase_client.js`
- Use CSS variables from `variables.css`; never hardcode color/spacing values
