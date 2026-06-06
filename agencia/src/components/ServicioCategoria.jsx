import { useParams } from 'react-router-dom';
import { servicesData } from './services';
import { CardGrid } from './CardGrid';
import SEO from './SEO.jsx';
import '../styles/card_cruceros.css';

const tituloStyle = {
  textAlign: 'center',
  fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
  color: '#023e8a',
  fontWeight: '700',
  marginBottom: '30px',
  marginTop: '40px',
  letterSpacing: '-0.5px',
  fontFamily: "'Photogenic', serif",
};

/**
 * ServicioCategoria — ruta dinamica /servicios_especiales/:categoria
 * Lee el param :categoria (trenes | vehiculos | asistencia),
 * lo cruza con servicesData para obtener el categoryName de Supabase
 * y renderiza el CardGrid correspondiente.
 * Para agregar una nueva subcategoria, solo agrega una entrada en servicesData (services.jsx).
 */
const ServicioCategoria = () => {
  const { categoria } = useParams();

  const seccion = servicesData.find((s) => s.seccionId === categoria);

  if (!seccion) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px', color: '#666' }}>
        Categoria no encontrada.
      </div>
    );
  }

  return (
    <div style={{ minHeight: '60vh', padding: '0 0 60px' }}>
      <SEO
        title={seccion.titulo}
        description={`Explora nuestros servicios de ${seccion.titulo.toLowerCase()}. Encuentra las mejores opciones para tu viaje con Cruceros y Tours.`}
        canonical={`/servicios_especiales/${categoria}`}
      />
      <h2 style={tituloStyle}>{seccion.titulo}</h2>
      <CardGrid
        categoryName={seccion.categoryName}
        cardRootClassName="tour-card"
        cardBaseClassName="tour-card"
        withFilters={false}
      />
    </div>
  );
};

export default ServicioCategoria;
