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
- `agencia/src/App.jsx` — Root component: defines all routes, wraps app in `AuthProvider` → `CartProvider` → `Router`

### State Management
Two React Context providers:
- `src/contexts/AuthContext.jsx` — Supabase auth state; exposes `signIn`, `signUp`, `signInWithOAuth`, `signOut`, `getUserProfile`
- `src/components/cartContext/cartContext.jsx` — Shopping cart state; exposes `agregarAlCarrito`, `actualizarCantidad`

### Backend
- `src/backend/supabase_client.js` — Single file for all Supabase queries (`fetchCategories`, `fetchProductsByCategory`, etc.)
- Credentials in `agencia/.env` as `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

### Routing
All routes defined in `App.jsx`:
- `/` landing, `/destinos` destinations, `/cruceros` cruises, `/vuelos` flights, `/servicios_especiales` special services
- `/detalles` trip detail, `/rooms` room selection
- `/carrito` cart, `/pagos` payment, `/contacto` contact
- `/login`, `/registro` auth pages
- `/admin` admin panel (protected via `AdminRoute` component)

### Styling System
- `src/styles/variables.css` — CSS custom properties (must use these, no hardcoded values)
- `src/styles/base.css` — Global styles and utility classes
- Each component has its own CSS file in `src/styles/`

**Color palette:**
- Primary: `#0FD3D3` (turquoise)
- Secondary / text: `#003366` (dark blue)
- Background: `#FFFFFF`

**Typography:** `'Chicago Police', sans-serif` — global font for all text

## Coding Conventions

- Functional components with hooks only
- Each new component gets its own CSS file if it needs styling
- Do not modify components unrelated to the current task
- All Supabase queries go in `src/backend/supabase_client.js`
- Use CSS variables from `variables.css`; never hardcode color/spacing values
