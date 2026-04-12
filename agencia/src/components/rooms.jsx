import "../styles/rooms.css";
import { useMemo } from "react";
import PropTypes from "prop-types";
import railEuropa from "../imagenes/rail_europa.png";
import renfeLogo from "../imagenes/Renfe.png";
import budgetLogo from "../imagenes/Budget.png";
import agentCarsLogo from "../imagenes/agentcars.png";
import interWeltLogo from "../imagenes/logo_interwelt.png";
import simplyLogo from "../imagenes/logo_simply.png";
import runAwayLogo from "../imagenes/logo_runaway.png";

// ─── Marcas asociadas por tipo de servicio especial ──────────────────────────
const serviceRoomsByType = {
    tren: [
        {
            id: "tren-rail-europa",
            title: "Rail Europa",
            imageUrl: railEuropa,
            isBrand: true,
            features: [
                "Rutas internacionales",
                "Trenes de alta velocidad",
                "Salida diaria",
                "Asientos reclinables",
                "WiFi a bordo",
                "Equipaje incluido",
                "Reserva flexible",
                "Atencion 24/7",
            ],
        },
        {
            id: "tren-renfe",
            title: "Renfe",
            imageUrl: renfeLogo,
            isBrand: true,
            features: [
                "Rutas nacionales",
                "Trenes AVE",
                "Frecuencias diarias",
                "Asientos confort",
                "WiFi a bordo",
                "Snack incluido",
                "Cambios sin cargo",
                "Check-in digital",
            ],
        },
    ],
    auto: [
        {
            id: "auto-budget",
            title: "Budget",
            imageUrl: budgetLogo,
            isBrand: true,
            features: [
                "Retiro en aeropuerto",
                "Tarifa diaria",
                "Seguro incluido",
                "Kilometraje flexible",
                "Asistencia 24/7",
                "Cambio sin costo",
                "Entrega en ciudad",
                "Reserva digital",
            ],
        },
        {
            id: "auto-agentcars",
            title: "Agent Cars",
            imageUrl: agentCarsLogo,
            isBrand: true,
            features: [
                "Entrega a domicilio",
                "Flota premium",
                "Planes semanales",
                "GPS disponible",
                "Seguro completo",
                "Soporte mecanico",
                "Retiro flexible",
                "Pago facil",
            ],
        },
    ],
    asistencia: [
        {
            id: "asistencia-interwelt",
            title: "InterWelt",
            imageUrl: interWeltLogo,
            isBrand: true,
            features: [
                "Cobertura medica internacional",
                "Asistencia 24/7 multicanal",
                "Evacuacion medica",
                "Reembolso gastos medicos",
                "Asistencia legal",
                "Cobertura de equipaje",
                "Cancelacion de viajes",
                "Soporte en tu idioma",
            ],
        },
        {
            id: "asistencia-simply",
            title: "Simply",
            imageUrl: simplyLogo,
            isBrand: true,
            features: [
                "Proteccion medica completa",
                "Emergencias sin limites",
                "Asistencia dental",
                "Retorno anticipado",
                "Atencion psicologica",
                "Rescate en montaña",
                "Seguro de accidentes",
                "Red de clinicas",
            ],
        },
        {
            id: "asistencia-runaway",
            title: "RunAway",
            imageUrl: runAwayLogo,
            isBrand: true,
            features: [
                "Cobertura flexible",
                "Planes personalizados",
                "Asistencia en destino",
                "Gestion de reclamos",
                "Repatriacion",
                "Cobertura ante robo",
                "Asistencia transporte",
                "Chat disponible 24/7",
            ],
        },
    ],
};

const SPECIAL_SERVICES = ["tren", "auto", "asistencia"];

// ─── Icono generico para features de marca ───────────────────────────────────
const IconCheck = () => (
    <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
        <path d="M5 13l4 4L19 7" />
    </svg>
);

// ─── Card para opciones de marca (servicios especiales) ──────────────────────
const BrandCard = ({ room }) => (
    <article className="room-card room-card--brand">
        <div className="room-media">
            <h3 className="room-title">{room.title}</h3>
            <img
                className="room-image room-image--contain"
                src={room.imageUrl}
                alt={room.title}
                loading="lazy"
                decoding="async"
            />
        </div>

        <div className="room-divider" aria-hidden="true" />

        <ul className="room-features">
            {room.features.map((feature) => (
                <li key={`${room.id}-${feature}`}>
                    <span className="room-icon"><IconCheck /></span>
                    <span>{feature}</span>
                </li>
            ))}
        </ul>

        <button className="room-cta" type="button">Cotizar ahora</button>
    </article>
);

// ─── Card para cabinas/opciones del producto (cruceros, tours, etc.) ─────────
const ProductRoomCard = ({ room }) => (
    <article className="room-card room-card--product">
        {room.imageUrl && (
            <div className="room-product-image-wrap">
                <img
                    className="room-product-image"
                    src={room.imageUrl}
                    alt={room.title}
                    loading="lazy"
                    decoding="async"
                />
            </div>
        )}
        <div className="room-product-body">
            <div className="room-product-header">
                <h3 className="room-title">{room.title}</h3>
                {room.price != null && (
                    <span className="room-price">
                        Desde <strong>${Number(room.price).toLocaleString("es-AR")}</strong>
                    </span>
                )}
            </div>
            {room.description && (
                <p className="room-product-desc">{room.description}</p>
            )}
            <button className="room-cta" type="button">Reservar ahora</button>
        </div>
    </article>
);

// ─── Componente principal ─────────────────────────────────────────────────────
// Props:
//   serviceType  — "tren" | "auto" | "asistencia" | "" (para cruceros/tours)
//   rooms        — array de rooms precargados desde el producto (para cruceros/tours)
//   title        — titulo de la seccion
//   subtitle     — subtitulo opcional
const Rooms = ({ serviceType = "", rooms = [], title = "", subtitle = "" }) => {
    const isSpecialService = SPECIAL_SERVICES.includes(serviceType);

    // Para servicios especiales: usar las cards de marca
    // Para productos normales: usar los rooms del producto pasados como prop
    const cards = useMemo(() => {
        if (isSpecialService) {
            return serviceRoomsByType[serviceType] || [];
        }
        return (rooms || []).map((r) => ({
            id: r.id,
            title: r.titulo || r.title || "",
            imageUrl: r.imagen_url || r.imageUrl || "",
            description: r.descripcion || r.description || "",
            price: r.precio ?? r.price ?? null,
            isBrand: false,
        }));
    }, [isSpecialService, serviceType, rooms]);

    // No renderizar si no hay nada que mostrar
    if (cards.length === 0) return null;

    const sectionTitle = title || (isSpecialService ? "Nuestros socios" : "Opciones disponibles");

    return (
        <div className="container container-rooms">
            {(sectionTitle || subtitle) && (
                <div className="rooms-header">
                    {sectionTitle && <h2 className="rooms-title">{sectionTitle}</h2>}
                    {subtitle && <p className="rooms-subtitle">{subtitle}</p>}
                </div>
            )}

            <section className="cheque_rooms">
                {cards.map((room, index) =>
                    room.isBrand
                        ? <BrandCard key={room.id || index} room={room} />
                        : <ProductRoomCard key={room.id || index} room={room} />
                )}
            </section>
        </div>
    );
};

// ─── PropTypes ───────────────────────────────────────────────────────────────
const roomShape = PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    imageUrl: PropTypes.string,
    features: PropTypes.arrayOf(PropTypes.string),
    isBrand: PropTypes.bool,
    description: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
});

BrandCard.propTypes = {
    room: roomShape.isRequired,
};

ProductRoomCard.propTypes = {
    room: roomShape.isRequired,
};

Rooms.propTypes = {
    serviceType: PropTypes.string,
    rooms: PropTypes.array,
    title: PropTypes.string,
    subtitle: PropTypes.string,
};

export default Rooms;
