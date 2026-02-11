import "../styles/rooms.css";
import { useEffect, useMemo, useState } from "react";
import { fetchRooms } from "../backend/supabase_client.js";

const featureIcons = {
    "1 double bed": (
        <svg viewBox="0 0 24 24" role="img">
            <path d="M3 12h18v6H3z" />
            <path d="M5 12V8h14v4" />
            <path d="M3 18v2M21 18v2" />
        </svg>
    ),
    "100 sq ft": (
        <svg viewBox="0 0 24 24" role="img">
            <rect x="4" y="4" width="16" height="16" />
            <path d="M8 8h2M12 8h2M16 8h2" />
        </svg>
    ),
    "air-condition": (
        <svg viewBox="0 0 24 24" role="img">
            <path d="M3 8h10c2 0 2-2 0-2" />
            <path d="M3 12h12c2 0 2-2 0-2" />
            <path d="M3 16h8c2 0 2-2 0-2" />
        </svg>
    ),
    "mini bar": (
        <svg viewBox="0 0 24 24" role="img">
            <path d="M10 3h4v3h-4z" />
            <path d="M9 6h6v14H9z" />
        </svg>
    ),
    tv: (
        <svg viewBox="0 0 24 24" role="img">
            <rect x="4" y="6" width="16" height="10" />
            <path d="M10 20h4" />
        </svg>
    ),
    "all inclusive": (
        <svg viewBox="0 0 24 24" role="img">
            <path d="M4 12c2.5-4 6.5-4 8 0" />
            <path d="M12 12c2.5 4 6.5 4 8 0" />
            <path d="M4 12c2.5 4 6.5 4 8 0" />
            <path d="M12 12c2.5-4 6.5-4 8 0" />
        </svg>
    ),
    "sea-side view": (
        <svg viewBox="0 0 24 24" role="img">
            <path d="M3 8c2 2 4 2 6 0s4-2 6 0 4 2 6 0" />
            <path d="M3 12c2 2 4 2 6 0s4-2 6 0 4 2 6 0" />
        </svg>
    ),
    bath: (
        <svg viewBox="0 0 24 24" role="img">
            <path d="M4 14c0-3 2-5 5-5h6c3 0 5 2 5 5v3H4z" />
            <path d="M8 9V6" />
        </svg>
    ),
};

const mockRooms = [
    {
        id: "room-1",
        title: "Doble Estándar",
        image_url: "/src/imagenes/banner_principal.jpeg",
        serviceType: "asistencia",
        features: [
            "1 doble cama",
            "10 metros cuadrados",
            "aire acondicionado",
            "mini bar",
            "TV",
            "todo incluido",
            "vista al mar",
            "bath",
        ],
    },
    {
        id: "room-2",
        title: "Premium Oceánico",
        image_url: "/src/imagenes/MSC.jpg",
        serviceType: "tren",
        features: [
            "2 doble cama",
            "20 metros cuadrados",
            "aire acondicionado",
            "mini bar",
            "TV",
            "incluido desayuno",
            "vista al mar",
            "bath",
        ],
    },
    {
        id: "room-3",
        title: "Suite Ejecutiva",
        image_url: "/src/imagenes/celebrity.jpg",
        serviceType: "auto",
        features: [
            "1 doble cama",
            "50 metros cuadrados",
            "aire acondicionado",
            "mini bar",
            "TV 45 pulgadas",
            "todo incluido",
            "vista al mar",
            "jacuzzi",
        ],
    },
];

const normalizeFeatures = (features) => {
    if (Array.isArray(features)) {
        return features;
    }

    if (typeof features === "string") {
        return features
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
    }

    return [];
};

const normalizeRooms = (data) =>
    (data || []).map((room) => ({
        id: room.id,
        title: room.title || room.nombre || "",
        imageUrl: room.image_url || room.imagen_url || "",
        serviceType: room.service_type || room.serviceType || "",
        features: normalizeFeatures(room.features),
    }));

const Rooms = ({ serviceType = "", title = "Opciones recomendadas", subtitle = "" }) => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;

        const loadRooms = async () => {
            setLoading(true);
            setError("");

            const data = await fetchRooms({ serviceType });
            if (!isMounted) return;

            const normalized = normalizeRooms(data);
            const fallback = normalizeRooms(mockRooms);
            const baseRooms = normalized.length > 0 ? normalized : fallback;
            const filteredRooms = serviceType
                ? baseRooms.filter((room) => room.serviceType === serviceType)
                : baseRooms;

            if (filteredRooms.length > 0) {
                setRooms(filteredRooms);
            } else {
                setRooms([]);
                setError("No hay opciones disponibles para este servicio.");
            }

            setLoading(false);
        };

        loadRooms();

        return () => {
            isMounted = false;
        };
    }, [serviceType]);

    const roomCards = useMemo(() => {
        return rooms.map((room) => ({
            ...room,
            features: room.features.map((feature) => {
                const key = feature.toLowerCase();
                return {
                    label: feature,
                    icon: featureIcons[key] || (
                        <svg viewBox="0 0 24 24" role="img">
                            <circle cx="12" cy="12" r="4" />
                        </svg>
                    ),
                };
            }),
        }));
    }, [rooms]);

    return (
        <div className="container container-rooms">
            {(title || subtitle) && (
                <div className="rooms-header">
                    {title && <h2 className="rooms-title">{title}</h2>}
                    {subtitle && <p className="rooms-subtitle">{subtitle}</p>}
                </div>
            )}

            <section className="cheque_rooms">
                {loading && <div className="rooms-state">Cargando habitaciones...</div>}
                {!loading && error && <div className="rooms-state">{error}</div>}

                {!loading && !error && roomCards.map((room) => (
                    <article className="room-card" key={room.id}>
                        <div className="room-media">
                            <h3 className="room-title">{room.title}</h3>
                            <img
                                className="room-image"
                                src={room.imageUrl}
                                alt={room.title}
                            />
                        </div>

                        <div className="room-divider" aria-hidden="true" />

                        <ul className="room-features">
                            {room.features.map((feature, index) => (
                                <li key={`${room.id}-feature-${index}`}>
                                    <span className="room-icon" aria-hidden="true">
                                        {feature.icon}
                                    </span>
                                    <span>{feature.label}</span>
                                </li>
                            ))}
                        </ul>

                        <button className="room-cta" type="button">Reserva Ahora</button>
                    </article>
                ))}
            </section>
        </div>
    )
}

export default Rooms;