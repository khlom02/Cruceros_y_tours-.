import { ServiceCard, servicesData } from './services';
import '../styles/services.css';

// Pagina principal de servicios especiales.
// Cada tarjeta navega a su propia ruta: /servicios_especiales/:seccionId
const ServiciosEspeciales = () => (
  <div className="servicios_especiales_container">
    <section className="services">
      {servicesData.map((item) => (
        <ServiceCard key={item.seccionId} item={item} />
      ))}
    </section>
  </div>
);

export default ServiciosEspeciales;
