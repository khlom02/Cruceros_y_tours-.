import { useNavigate } from 'react-router-dom';
import '../styles/services.css';
import bannerPrincipal from '../imagenes/banner_principal.jpeg';

// Agrega aqui nuevos servicios si se crean categorias adicionales en Supabase.
// seccionId define la subruta: /servicios_especiales/:seccionId
// categoryName debe coincidir exactamente con el nombre de la categoria en Supabase
// eslint-disable-next-line react-refresh/only-export-components
export const servicesData = [
    {
        id: 1,
        tipo: 'tren',
        seccionId: 'trenes',
        categoryName: 'Trenes',
        titulo: 'Trenes',
        descripcion: 'Reserva rapida en rutas nacionales e internacionales.',
        imagen: bannerPrincipal,
        cta: 'Ver trenes',
    },
    {
        id: 2,
        tipo: 'auto',
        seccionId: 'vehiculos',
        categoryName: 'Vehículos',
        titulo: 'Alquiler de autos',
        descripcion: 'Autos por dia o semana con seguro incluido.',
        imagen: bannerPrincipal,
        cta: 'Ver autos',
    },
    {
        id: 3,
        tipo: 'asistencia',
        seccionId: 'asistencia',
        categoryName: 'Asistencia de viajes',
        titulo: 'Asistencia de viajes',
        descripcion: 'Cobertura medica y soporte 24/7 en destino.',
        imagen: bannerPrincipal,
        cta: 'Ver servicios',
    },
];

// Tarjeta individual — navega a /servicios_especiales/:seccionId al hacer clic
export const ServiceCard = ({ item }) => {
    const navigate = useNavigate();
    const isRight = item.tipo === 'auto';
    const imagen = item.imagen || bannerPrincipal;

    const ir = () => navigate(`/servicios_especiales/${item.seccionId}`);

    return (
        <div
            className={`card_servicio ${isRight ? 'card_servicio--right' : 'card_servicio--left'}`}
            style={{ cursor: 'pointer' }}
            onClick={ir}
        >
            <div
                className="card_servicio__media"
                style={{ backgroundImage: `url(${imagen})` }}
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
                            onClick={(e) => { e.stopPropagation(); ir(); }}
                        >
                            {item.cta}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceCard;
