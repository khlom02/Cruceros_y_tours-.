import { ServiceCard, servicesData } from './services';
import '../styles/services.css';
import SEO from './SEO.jsx';

// Pagina principal de servicios especiales.
// Cada tarjeta navega a su propia ruta: /servicios_especiales/:seccionId
const ServiciosEspeciales = () => (
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
  </div>
);

export default ServiciosEspeciales;
