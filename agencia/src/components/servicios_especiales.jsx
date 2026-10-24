import { ServiceCard, servicesData } from './services';
import useInstagramPosts from '../hooks/useInstagramPosts';
import InstagramCard from './InstagramCard';
import '../styles/services.css';
import SEO from './SEO.jsx';

// Pagina principal de servicios especiales.
// Cada tarjeta navega a su propia ruta: /servicios_especiales/:seccionId
const ServiciosEspeciales = () => {
  const { posts, cargando } = useInstagramPosts(
    'serviciosespeciales,asistencia,trenes,vehiculos'
  );

  return (
    <div className="servicios_especiales_container">
      <SEO
        title="Servicios Especiales de Viaje"
        description="Servicios complementarios para tu viaje: trenes de alta velocidad, alquiler de autos con seguro incluido y asistencia médica 24/7 en destino."
        canonical="/servicios_especiales"
      />
      <section className="services">
        {servicesData.map((item) => (
          <ServiceCard key={item.seccionId} item={item} />
        ))}
      </section>

      {!cargando && posts.length > 0 && (
        <section aria-label="Publicaciones de Instagram">
          <h2
            style={{
              textAlign: 'center',
              fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
              color: 'var(--color-text-primary)',
              fontWeight: '700',
              margin: '70px 0 35px',
              paddingTop: '20px',
            }}
          >
            Novedades en Instagram
          </h2>
          <div className="destinos-grid">
            {(posts || [])
              .filter((p) => Array.isArray(p.media_urls) && p.media_urls.some(Boolean))
              .map((post) => (
                <InstagramCard key={post.id} post={post} />
              ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ServiciosEspeciales;
