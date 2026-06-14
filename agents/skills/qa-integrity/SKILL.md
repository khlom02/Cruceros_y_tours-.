---
name: qa-integrity
description: Run systematic quality assurance checks across the entire project. Use whenever the user asks to verify project integrity, run tests, check for broken imports, validate routes, audit CSS consistency, verify Supabase queries, check responsive layout, audit SEO, or confirm the build compiles. Trigger on keywords like "test", "qa", "integrity", "verify", "audit", "check", "validate", "lint", "build check", "broken", "health check", "smoke test", "regression".
---

# QA Integrity Checker

Systematic project-wide QA agent for Cruceros y Tours (React + Vite + Supabase + Vercel).

## Workflow

Run these checks **in order**. Stop and report errors at each step before proceeding.

---

### 1. BUILD & LINT CHECK

```bash
cd agencia && npm run lint 2>&1
cd agencia && npm run build 2>&1
```

- Report any lint errors (excluding pre-existing `scripts/uploadToSupabase.js` errors).
- Report any build failures. Build must complete with `✓ built in X.XXs`.
- Verify chunk output: must include `vendor`, `supabase`, `ui`, `animation`, and `index` chunks.

### 2. ROUTE INTEGRITY

Read `src/App.jsx` and `AGENTS.md`. Verify:

- Every `<Route path>` in App.jsx has a documented entry in AGENTS.md routing table.
- Every route in AGENTS.md exists in App.jsx.
- All route `element` imports exist as files in `src/components/`.
- The catch-all `*` route uses `<NotFound />` (not `<Navigate>`).
- `/admin` is wrapped in `<AdminRoute>`.
- `/detalles` embeds `rooms.jsx` (verify rooms.jsx is imported/used inside detalles.jsx).

### 3. IMPORT RESOLUTION

For every `.jsx` file in `src/components/`, `src/contexts/`, `src/backend/`:

- Check all relative imports resolve to existing files.
- Check all named imports match actual exports in target files.
- Flag any import of non-existent components, utils, or styles.

Focus on:
- `App.jsx` — all route component imports exist.
- `supabase_client.js` — all Supabase table names match actual tables.
- `AuthContext.jsx` — exports match what `AdminRoute.jsx` and `Perfil.jsx` consume.

### 4. CSS VARIABLES AUDIT

For every `.css` file in `src/styles/`:

- Flag any hardcoded color values (hex, rgb, hsl) that should use `var(--color-*)` from `variables.css`.
- Flag any hardcoded `font-size` without `clamp()`.
- Flag any hardcoded `padding`/`margin` > 20px without a responsive breakpoint.
- Flag any `box-shadow` that doesn't use `var(--shadow-*)`.
- Flag any `border-radius` that doesn't use `var(--border-radius)`.

Exceptions: `variables.css` itself, `base.css` (global reset), third-party overrides.

### 5. SUPABASE QUERY VALIDATION

Read `src/backend/supabase_client.js`:

- Every `.from('table_name')` must reference an existing table: `categorias`, `productos`, `detalles_cruceros`, `galleries`, `rooms`, `amenities`, `highlights`, `profiles`, `reservas`, `contactos`, `suscripciones`, `newsletter`.
- Every `.select()` field must be plausible for that table.
- Every `.insert()` and `.update()` must have matching RLS policies (see `rls_supabase.sql` and `rls_admin_write_policies.sql`).
- Verify `TURNSTILE_SITE_KEY` uses `import.meta.env.VITE_TURNSTILE_SITE_KEY ?? "fallback"` pattern.

### 6. RESPONSIVE LAYOUT CHECK

For every component in `src/components/`:

- Verify it has a corresponding CSS file in `src/styles/` (if it needs styles).
- Check CSS files for responsive breakpoints at: 480px, 600px, 768px, 900px, 1100px, 1200px.
- Flag any fixed-width values that should be `clamp()` or `%`.
- Verify images use `width: 100%; object-fit: cover/contain`.
- Flag any component without responsive consideration.

### 7. SEO AUDIT

For every page component (route target in App.jsx):

- Verify it uses `<SEO>` component with `title` and `description`.
- Check for `og:title`, `og:description`, `og:image` meta tags (via SEO.jsx).
- Verify canonical URL is set.
- Check for JSON-LD structured data on landing page, cruceros, vuelos, destinos.
- Verify `noindex` is set on non-public pages (admin, login, perfil, NotFound).

### 8. LINK INTEGRITY

Read `src/components/header.jsx` and `src/components/footer.jsx`:

- Every `<Link to="...">` must resolve to a defined route in App.jsx.
- Flag any broken or hardcoded paths.

### 9. AGENTS.md DOCUMENTATION CHECK

- Verify AGENTS.md reflects current App.jsx routes.
- Verify package.json name matches project.
- Verify the "Tablas de la DB" section lists all tables.
- Verify env vars section lists all required VITE_ variables.
- Verify Vercel config section matches actual vercel.json.

### 10. REPORT FORMAT

Output a structured report:

```
╔═══════════════════════════════════════════════════╗
║        QA INTEGRITY REPORT                        ║
╚═══════════════════════════════════════════════════╝

[BUILD]      ✅ message
[ROUTES]     ✅ message
[IMPORTS]    ✅ message
[CSS]        ✅ message
[SUPABASE]   ✅ message
[RESPONSIVE] ✅ message
[SEO]        ✅ message
[LINKS]      ✅ message
[DOCS]       ✅ message

--- Issues found ---
1. [FILE:line] Description of issue
2. [FILE:line] Description of issue

--- Summary ---
X/9 checks passed
```

If any check fails, suggest the exact fix (file path + line + change).
