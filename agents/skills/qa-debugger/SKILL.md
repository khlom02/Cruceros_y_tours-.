---
name: qa-debugger
description: Automatically diagnose and fix issues found by qa-integrity checks. Trigger after a qa-integrity report reveals errors, or when the user says "fix the issues", "apply fixes", "debug", "repair", "correct the errors", "resolve the problems", "auto-fix", or "fix the project". Works as the remediation counterpart to qa-integrity — detect, fix, verify, loop. Use this skill immediately whenever the user references a QA report or asks to fix broken CSS, routes, links, imports, docs, or any project integrity issue.
---

# QA Debugger — Auto-Fix Agent

Automatic remediation companion to `qa-integrity`. Parses QA reports and applies systematic fixes.

## Workflow

### Phase 1: Receive or Re-run QA

If a `qa-integrity` report was just produced, parse it from context. Otherwise, re-run the checks:

```bash
cd agencia && npm run lint 2>&1
cd agencia && npm run build 2>&1
```

Read the full report and extract all issues.

---

### Phase 2: Fix by Priority

Apply fixes **in order**. After each fix, if the change is in a JS/CSS file, run build to verify no regression.

#### 2.1 — Undefined CSS Variables

**Issue:** `--color-secondary` and `--color-accent` referenced but never defined.

**Fix:** Edit `agencia/src/styles/variables.css`. Add:

```css
--color-secondary: #003366;
--color-accent: #D4AF37;
```

Use the project's actual color palette:
- `--color-secondary` should match `--color-text-primary` (#003366, azul oscuro)
- `--color-accent` should be the gold accent (#D4AF37 or similar)

After adding, verify the colors make visual sense with the existing palette.

#### 2.2 — `<a href>` → `<Link to>`

**Issue:** `header.jsx` lines 152, 172 and `footer.jsx` line 34 use `<a href>` causing full page reloads.

**Fix:** 
- `header.jsx:152`: `<a href="/servicios_especiales">` → `<Link to="/servicios_especiales" className="...">` + update closing tag `</a>` → `</Link>`
- `header.jsx:172`: `<a href="/contacto">` → `<Link to="/contacto">`
- `footer.jsx:34`: `<a href="/">` → `<Link to="/">` (usually the logo)

Must import `Link` from `react-router-dom` at the top of the file if not already imported.

#### 2.3 — Missing AGENTS.md Documentation

**Issue:** Routes `/faq`, `/guia-de-uso`, `/politicas-privacidad`, `/suscripciones`, `/nosotros` exist in App.jsx but not in AGENTS.md routing table.

**Fix:** Edit `AGENTS.md` (root of project, NOT inside `agencia/`). Add rows to the routing table:

```markdown
| `/faq` | `FAQ` |
| `/guia-de-uso` | `GuiaDeUso` |
| `/politicas-privacidad` | `PoliticasPrivacidad` |
| `/suscripciones` | `Suscripciones` |
| `/nosotros` | `SobreNosotros` |
```

Place them in alphabetical order within the existing table.

#### 2.4 — Hardcoded Colors

**Issue:** Hex/rgb colors used without CSS variables.

**Fix strategy:** For each CSS file, replace common patterns:

| Hardcoded | Replacement |
|---|---|
| `#003366` | `var(--color-text-primary)` |
| `#0FD3D3` | `var(--color-primary)` |
| `#ffffff` (background) | `var(--color-background)` or keep white |
| `#333` / `#333333` | `var(--color-text-primary)` |
| `#666` / `#999` | `var(--color-text-secondary)` |
| `#f8f9fa` / `#f5f5f5` | `var(--color-background-light)` |
| `#25D366` / `#25d366` | Keep (brand color — WhatsApp) |
| `#E1306C` | Keep (brand color — Instagram) |
| `#db4437` | Keep (brand color — Google) |
| `#1877f2` | Keep (brand color — Facebook) |
| `#dc3545` / `#c0392b` / `#cc0000` | Keep (status/error colors) |
| `#f39c12` / `#b7770d` / `#1e8449` | Keep (status colors) |

For each `.css` file, read it, identify the hardcoded colors, and replace using the mapping above. Do a file-by-file edit.

**Exceptions:** `variables.css` itself, `base.css` (global reset), social media brand colors, error/success/warning status colors.

#### 2.5 — `font-size` Without `clamp()`

**Issue:** Fixed `font-size` values that should use `clamp()` for responsiveness.

**Fix:** Apply the following replacements:

| Current | Replacement |
|---|---|
| `font-size: 2rem;` | `font-size: clamp(1.5rem, 4vw, 2rem);` |
| `font-size: 1.8rem;` | `font-size: clamp(1.4rem, 3.5vw, 1.8rem);` |
| `font-size: 1.6rem;` | `font-size: clamp(1.2rem, 3vw, 1.6rem);` |
| `font-size: 1.3rem;` | `font-size: clamp(1rem, 2.5vw, 1.3rem);` |
| `font-size: 1.1rem;` | `font-size: clamp(0.95rem, 2vw, 1.1rem);` |

Use `clamp(min, preferred, max)` where:
- `min` = ~75% of original
- `preferred` = `vw` proportional to original (original / 40–50)
- `max` = original value

Do NOT alter `font-size` values under 0.9rem (these are usually utility/tag sizes).

#### 2.6 — Undefined CSS Variable References

**Issue:** UI components reference `var(--color-secondary)` or `var(--color-accent)` which don't exist.

**Fix:** After defining them in `variables.css` (step 2.1), verify all references now resolve. If any component needs a different semantic mapping (e.g., `.secondary-text` should use `var(--color-text-secondary)` instead), adjust the CSS rule, not the variable.

---

### Phase 3: Verify Each Fix

After applying all fixes:

```bash
cd agencia && npm run build 2>&1
```

If build fails, revert the last change and re-apply with a corrected approach.

---

### Phase 4: Re-run Full QA

```bash
cd agencia && npm run lint 2>&1
cd agencia && npm run build 2>&1
```

Then re-run the qa-integrity checks manually (read App.jsx, AGENTS.md, CSS files, etc.) to confirm all flags are resolved.

---

### Phase 5: Report

Output a structured fix report:

```
╔═══════════════════════════════════════════════════╗
║        QA DEBUGGER — FIX REPORT                   ║
╚═══════════════════════════════════════════════════╝

[FIXED]      5 issues resolved
[SKIPPED]    2 issues (explain why)
[REGRESSED]  0 new issues introduced

--- Fixes applied ---
1. [variables.css] Added --color-secondary and --color-accent
2. [header.jsx:152] <a> → <Link> for /servicios_especiales
3. [header.jsx:172] <a> → <Link> for /contacto
4. [footer.jsx:34] <a> → <Link> for logo home
5. [AGENTS.md] Added 5 missing routes to routing table
6. [detalles.css:123] font-size: 2rem → clamp(1.5rem, 4vw, 2rem)
7. [productos.css:49] hardcoded #xxx → var(--color-*)

--- Still open ---
6. [card_cruceros.css:129] font-size: 1.3rem (needs visual review)

--- Build status ---
✅ Build passes (221 modules, X.XXs)
```

## Safety Rules

1. **Never change** `variables.css` without verifying the variable name doesn't already exist.
2. **Never remove** existing CSS variables — only add new ones.
3. **Never change** `base.css` or `fonts.css` (global reset / typography).
4. **Never change** JavaScript logic — only fix imports, links, and routing.
5. **Never edit** `supabase_client.js` logic — only verify table name strings.
6. **After every edit**, run `npm run build` to detect breakage.
7. **If build fails**, revert the last edit with `git checkout -- <file>` and report the conflict.
8. **Limit iterations** to 3 max. If after 3 passes issues remain, report them as requiring manual review.
