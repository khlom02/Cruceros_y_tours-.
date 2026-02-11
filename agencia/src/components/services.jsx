import '../styles/services.css';
import bannerPrincipal from '../imagenes/banner_principal.jpeg';

const servicesData = [
    {
        id: 1,
        tipo: 'tren',
        titulo: 'Trenes',
        descripcion: 'Reserva rapida en rutas nacionales e internacionales.',
        imagen: bannerPrincipal,
        cta: 'Ver trenes',
    },
    {
        id: 2,
        tipo: 'auto',
        titulo: 'Alquiler de autos',
        descripcion: 'Autos por dia o semana con seguro incluido.',
        imagen: bannerPrincipal,
        cta: 'Ver autos',
    },
    {
        id: 3,
        tipo: 'asistencia',
        titulo: 'Asistencia de viajes',
        descripcion: 'Cobertura medica y soporte 24/7 en destino.',
        imagen: bannerPrincipal,
        cta: 'Ver asistencia',
    },
];

const Services = () => {
    return (
        <section className="services">
            {servicesData.map((item) => {
                const isRight = item.tipo === 'auto';

                const imagen = item.imagen || bannerPrincipal;

                return (
                    <div
                        key={item.id}
                        className={`card_servicio ${isRight ? 'card_servicio--right' : 'card_servicio--left'}`}
                        style={{
                            backgroundImage: `url(${imagen})`,
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: isRight ? 'left center' : 'right center',
                        }}
                    >
                        <div className="card_servicio__overlay">
                            <div className="card_servicio__content">
                                <h3 className="card_servicio__titulo">{item.titulo}</h3>
                                <p className="card_servicio__descripcion">{item.descripcion}</p>
                                <button className="card_servicio__btn" type="button">
                                    {item.cta}
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </section>
    );
};

export default Services;