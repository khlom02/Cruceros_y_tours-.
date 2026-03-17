import { CardGrid } from "./CardGrid";

// Estilo compartido para los títulos de sección
const tituloStyle = {
  textAlign: 'center',
  fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
  color: '#023e8a',
  fontWeight: '700',
  marginBottom: '30px',
  marginTop: '40px',
  letterSpacing: '-0.5px',
  fontFamily: "'Photogenic', serif"
};

/**
 * DestinosSection
 * Renderiza las secciones de Destinos Nacionales y Destinos Internacionales
 * en la landing page usando el componente generico CardGrid.
 *
 * Para agregar productos a estas secciones, crealos en el panel de admin
 * con las categorias:
 *   - "Destinos Nacionales"  → aparece en la primera seccion
 *   - "Destinos Internacionales" → aparece en la segunda seccion
 */
const DestinosSection = () => {
  return (
    <>
      {/* ── Destinos Nacionales ── */}
      <h2 style={tituloStyle}>Destinos Nacionales</h2>
      <CardGrid
        categoryName="Destinos Nacionales"
        cardRootClassName="tour-card"
        cardBaseClassName="tour-card"
        withFilters={false}
      />

      {/* ── Destinos Internacionales ── */}
      <h2 style={tituloStyle}>Destinos Internacionales</h2>
      <CardGrid
        categoryName="Destinos Internacionales"
        cardRootClassName="tour-card"
        cardBaseClassName="tour-card"
        withFilters={false}
      />
    </>
  );
};

export default DestinosSection;
