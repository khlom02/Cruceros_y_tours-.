import { useNavigate } from 'react-router-dom';
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
    const navigate = useNavigate();

    return (
        <section className="services">
            {servicesData.map((item) => {
                const isRight = item.tipo === 'auto';

                const imagen = item.imagen || bannerPrincipal;

                return (
                    <div
                        key={item.id}
                        className={`card_servicio ${isRight ? 'card_servicio--right' : 'card_servicio--left'}`}
                    >
                        <div
                            className="card_servicio__media"
                            style={{
                                backgroundImage: `url(${imagen})`,
                            }}
                            role="img"
                            aria-label={item.titulo}
                        />

                        <div className="card_servicio__panel">
                            <div className="card_servicio__overlay">
                                <div className="card_servicio__content">
                                    <h3 className="card_servicio__titulo">{item.titulo}</h3>
                                    <p className="card_servicio__descripcion">{item.descripcion}</p>
                                    <button
                                        className="card_servicio__btn"
                                        type="button"
                                        onClick={() =>
                                            navigate(`/detalles?id=${item.id}&tipo=${item.tipo}`)
                                        }
                                    >
                                        {item.cta}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </section>
    );
};

export default Services;