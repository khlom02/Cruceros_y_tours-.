# Instrucciones para Copilot (Proyecto Agencia)

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
