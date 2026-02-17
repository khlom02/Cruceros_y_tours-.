import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "../styles/detalles.css";
import { fetchProductById, fetchSpecialServiceByKey } from "../backend/supabase_client";
import Rooms from "./rooms.jsx";
import DetallesNavieras from "./detalles_navieras.jsx";

const normalizeDetalle = (data) => {
    if (!data) return null;

    // Usar galería de la DB o fallback a imagen principal
    const gallery = Array.isArray(data.gallery)
        ? data.gallery
        : data.imagen || data.imagen_url
            ? [data.imagen || data.imagen_url]
            : [];

    return {
        id: data.id,
        title: data.titulo || data.title || "",
        location: data.ubicacion || data.location || "",
        rating: data.rating ?? null,
        reviews: data.cantidad_reviews ?? data.reviews ?? null,
        description: data.descripcion || data.description || "",
        amenities: Array.isArray(data.amenities) ? data.amenities.map(a => a.nombre || a) : [],
        highlights: Array.isArray(data.highlights) ? data.highlights : [],
        facilities: Array.isArray(data.amenities) ? data.amenities.map(a => `${a.icono_emoji || '•'} ${a.nombre || a}`) : [],
        rooms: Array.isArray(data.rooms) ? data.rooms : [],
        anosServicio: data.detalles_crucero?.anos_servicio ?? data.anos_servicio ?? null,
        pasajerosMax: data.detalles_crucero?.pasajeros_max ?? data.pasajeros_max ?? null,
        tripulantes: data.detalles_crucero?.tripulantes ?? null,
        ratioEspacio: data.detalles_crucero?.ratio_espacio ?? data.ratio_espacio ?? null,
        ratioServicio: data.detalles_crucero?.ratio_servicio ?? data.ratio_servicio ?? null,
        cabinaSingle: data.detalles_crucero?.cabina_single ?? data.cabina_single ?? false,
        viajandoConNinos: data.detalles_crucero?.viajando_con_ninos ?? data.viajando_con_ninos ?? false,
        gallery,
    };
};

const mockDetalles = {
    "1": {
        id: 1,
        title: "Hotel Grand, Palma de Mallorca",
        location: "Ibiza/Islas Baleares/Espana",
        rating: 4.8,
        reviews: 245,
        descripcion:
            "Hotel Grand, situado en Torre de Pareis, ofrece habitaciones con balcon, TV satelital y WiFi gratuito. Disfruta un centro de fitness, spa, restaurante y servicios de excursiones.",
        highlights: [
            "Ubicacion centrica en Palma de Mallorca",
            "A 5 minutos del Puerto de Palma",
            "A 7 minutos de la Catedral de Santa Maria",
        ],
        amenities: [
            "Habitaciones con aire acondicionado",
            "Conexion WiFi gratuita",
            "Mundo SPA",
        ],
        facilities: [
            " 🛜 Wi-Fi",
            " 👙 Piscina",
            " 💆 SPA",
            " 💅 cosmeticos",
            " 🏋️ Gimnasio",
            " 🔭 Terraza",
            " 🏠 Balcon",
            " 🍽️ Restaurante",
            " 🧖 Sauna",
            " 🌅 Vista a la playa",
        ],
        rooms: [
            {
                title: "Suite Deluxe",
                description: "1 cama king, vista al mar, desayuno incluido.",
                price: "€ 290 / noche",
            },
            {
                title: "Habitacion ejecutiva",
                description: "1 cama queen, balcon privado, acceso al spa.",
                price: "€ 210 / noche",
            },
        ],
        gallery: [
            "/src/imagenes/banner_principal.jpeg",
            "/src/imagenes/MSC.jpg",
            "/src/imagenes/ncl.jpg",
            "/src/imagenes/celebrity.jpg",
            "/src/imagenes/costa.jpg",
        ],
    },
};

const serviceTypes = ["tren", "auto", "asistencia"];

const mockServicios = {
    tren: {
        id: 1,
        tipo: "tren",
        title: "Trenes de alta velocidad",
        location: "Rutas nacionales e internacionales",
        rating: 4.7,
        reviews: 182,
        description:
            "Conecta ciudades principales con horarios flexibles, asientos confort y opciones de tarifa segun tu plan.",
        highlights: [
            "Salidas diarias con multiples horarios",
            "Tarifas flexibles y cambios rapidos",
            "Check-in digital en minutos",
        ],
        amenities: [
            "Asientos reclinables",
            "Wifi a bordo",
            "Equipaje incluido",
        ],
        facilities: [
            "🎫 Boletos digitales",
            "🚉 Acceso prioritario",
            "🧳 Equipaje extra",
            "🪟 Ventanas panoramicas",
        ],
        serviceInfo: [
            "Tarifas por tramo con descuentos por ida y vuelta.",
            "Soporte 24/7 para cambios de horario.",
            "Opciones premium con lounge incluido.",
        ],
        gallery: [
            "/src/imagenes/banner_principal.jpeg",
            "/src/imagenes/MSC.jpg",
            "/src/imagenes/ncl.jpg",
        ],
    },
    auto: {
        id: 2,
        tipo: "auto",
        title: "Alquiler de autos flexible",
        location: "Retiro en aeropuerto o ciudad",
        rating: 4.6,
        reviews: 146,
        description:
            "Vehiculos nuevos con seguro incluido y planes por dia o semana. Reserva en minutos.",
        highlights: [
            "Retiro rapido con documentacion digital",
            "Seguro incluido en todas las tarifas",
            "Asistencia mecanica 24/7",
        ],
        amenities: [
            "Kilometraje flexible",
            "GPS disponible",
            "Entrega a domicilio",
        ],
        facilities: [
            "🚗 Flota premium",
            "🛡️ Seguro completo",
            "📍 Retiro flexible",
            "🔧 Soporte mecanico",
        ],
        serviceInfo: [
            "Planes semanales con tarifas preferenciales.",
            "Opciones SUV, sedan y compacto.",
            "Asesor personalizado para viajes largos.",
        ],
        gallery: [
            "/src/imagenes/celebrity.jpg",
            "/src/imagenes/costa.jpg",
            "/src/imagenes/banner_principal.jpeg",
        ],
    },
    asistencia: {
        id: 3,
        tipo: "asistencia",
        title: "Asistencia en viaje",
        location: "Cobertura internacional",
        rating: 4.9,
        reviews: 214,
        description:
            "Cobertura medica, soporte en destino y asistencia inmediata ante imprevistos.",
        highlights: [
            "Cobertura medica en destino",
            "Soporte 24/7 multicanal",
            "Reembolso por cancelaciones",
        ],
        amenities: [
            "Atencion medica",
            "Asistencia legal",
            "Cobertura de equipaje",
        ],
        facilities: [
            "🩺 Medico en linea",
            "🧾 Gestion de reclamos",
            "🌍 Cobertura global",
            "☎️ Soporte inmediato",
        ],
        serviceInfo: [
            "Planes por dias con cobertura total.",
            "Extensiones para deportes y aventura.",
            "Atencion personalizada en tu idioma.",
        ],
        gallery: [
            "/src/imagenes/MSC.jpg",
            "/src/imagenes/banner_principal.jpeg",
            "/src/imagenes/ncl.jpg",
        ],
    },
};

const normalizeServiceDetalle = (data) => {
    if (!data) return null;

    const gallery = Array.isArray(data.gallery)
        ? data.gallery
        : data.imagen_url
            ? [data.imagen_url]
            : [];

    return {
        id: data.id,
        tipo: data.tipo || "",
        title: data.nombre || data.title || "",
        location: data.ubicacion || data.location || "",
        rating: data.rating ?? null,
        reviews: data.reviews ?? null,
        description: data.descripcion || data.description || "",
        amenities: Array.isArray(data.amenities) ? data.amenities : [],
        highlights: Array.isArray(data.highlights) ? data.highlights : [],
        facilities: Array.isArray(data.facilities) ? data.facilities : [],
        serviceInfo: Array.isArray(data.serviceInfo)
            ? data.serviceInfo
            : Array.isArray(data.service_info)
                ? data.service_info
                : [],
        gallery,
    };
};

const Detalles = () => {
    const [searchParams] = useSearchParams();
    const detalleId = searchParams.get("id");
    const detalleTipo = searchParams.get("tipo");
    const isSpecialService = serviceTypes.includes(detalleTipo);
    const [detalle, setDetalle] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isInteracting, setIsInteracting] = useState(false);
    const intervalRef = useRef(null);

    useEffect(() => {
        let isMounted = true;

        const loadDetalle = async () => {
            if (!detalleId && !isSpecialService) {
                if (!isMounted) return;
                setDetalle(null);
                setError("Selecciona una experiencia para ver sus detalles.");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError("");

            const data = isSpecialService
                ? await fetchSpecialServiceByKey({ id: detalleId, tipo: detalleTipo })
                : await fetchProductById(detalleId);
            if (!isMounted) return;

            if (!data) {
                setDetalle(null);
                setError("No se encontró el detalle solicitado en la base de datos.");
                setLoading(false);
                return;
            }

            const normalizedDetalle = isSpecialService
                ? normalizeServiceDetalle(data)
                : normalizeDetalle(data);
            setDetalle(normalizedDetalle);
            setLoading(false);
        };

        loadDetalle();

        return () => {
            isMounted = false;
        };
    }, [detalleId, detalleTipo, isSpecialService]);

    const gallery = useMemo(() => detalle?.gallery || [], [detalle]);

    useEffect(() => {
        setActiveIndex(0);
    }, [gallery.length]);

    useEffect(() => {
        if (gallery.length <= 1 || isInteracting) return;

        intervalRef.current = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % gallery.length);
        }, 3000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [gallery.length, isInteracting]);

    const handleInteractStart = () => setIsInteracting(true);
    const handleInteractEnd = () => setIsInteracting(false);

    const activeImage = gallery[activeIndex];

    if (loading) {
        return (
            <div className="detalles-page">
                <div className="detalles-state">Cargando detalles...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="detalles-page">
                <div className="detalles-state">{error}</div>
            </div>
        );
    }

    if (!detalle) {
        return (
            <div className="detalles-page">
                <div className="detalles-state">No hay informacion disponible.</div>
            </div>
        );
    }

    return (
        <div className="detalles-page">
            <section className="detalles-hero">
                <div className="detalles-gallery">
                    {activeImage ? (
                        <img
                            className="detalles-main-image"
                            src={activeImage}
                            alt={detalle.title}
                            loading="eager"
                            decoding="async"
                            onMouseEnter={handleInteractStart}
                            onMouseLeave={handleInteractEnd}
                            onTouchStart={handleInteractStart}
                            onTouchEnd={handleInteractEnd}
                        />
                    ) : (
                        <div className="detalles-image-placeholder">
                            Sin imagen disponible
                        </div>
                    )}

                    {gallery.length > 1 && (
                        <div
                            className="detalles-thumbs"
                            onMouseEnter={handleInteractStart}
                            onMouseLeave={handleInteractEnd}
                            onTouchStart={handleInteractStart}
                            onTouchEnd={handleInteractEnd}
                        >
                            {gallery.map((imgUrl, index) => (
                                <button
                                    key={`${detalle.id}-thumb-${index}`}
                                    type="button"
                                    className={`detalles-thumb ${
                                        index === activeIndex ? "is-active" : ""
                                    }`}
                                    onClick={() => setActiveIndex(index)}
                                >
                                    <img
                                        src={imgUrl}
                                        alt={`${detalle.title} ${index + 1}`}
                                        loading="lazy"
                                        decoding="async"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="detalles-info">
                    <div className="detalles-meta">
                        {detalle.location && (
                            <span className="detalles-location">{detalle.location}</span>
                        )}
                        {detalle.rating && (
                            <span className="detalles-rating">
                                {detalle.rating}
                                {detalle.reviews ? ` (${detalle.reviews})` : ""}
                            </span>
                        )}
                    </div>

                    <h1 className="detalles-title">{detalle.title}</h1>

                    {detalleTipo === "crucero" && (
                        <DetallesNavieras
                            anosServicio={detalle.anosServicio}
                            pasajerosMax={detalle.pasajerosMax}
                            tripulantes={detalle.tripulantes}
                            ratioEspacio={detalle.ratioEspacio}
                            ratioServicio={detalle.ratioServicio}
                            cabinaSingle={detalle.cabinaSingle}
                            viajandoConNinos={detalle.viajandoConNinos}
                        />
                    )}

                    {isSpecialService && detalle.serviceInfo.length > 0 && (
                        <ul className="detalles-amenities">
                            {detalle.serviceInfo.map((item, index) => (
                                <li key={`${detalle.id}-service-info-${index}`}>{item}</li>
                            ))}
                        </ul>
                    )}

                    {detalle.highlights.length > 0 && (
                        <ul className="detalles-highlights">
                            {detalle.highlights.map((item, index) => (
                                <li key={`${detalle.id}-highlight-${index}`}>{item}</li>
                            ))}
                        </ul>
                    )}

                    {detalle.amenities.length > 0 && (
                        <ul className="detalles-amenities">
                            {detalle.amenities.map((item, index) => (
                                <li key={`${detalle.id}-amenity-${index}`}>{item}</li>
                            ))}
                        </ul>
                    )}
                </div>
            </section>

            {detalle.description && (
                <section className="detalles-section">
                    <h2>Descripcion</h2>
                    <p>{detalle.description}</p>
                </section>
            )}

            {detalle.facilities.length > 0 && (
                <section className="detalles-section">
                    <h2>Instalaciones</h2>
                    <div className="detalles-facilities">
                        {detalle.facilities.map((facility, index) => (
                            <div
                                key={`${detalle.id}-facility-${index}`}
                                className="detalles-facility"
                            >
                                {facility}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            
            <Rooms
                serviceType={isSpecialService ? detalleTipo : ""}
                title={isSpecialService ? "Opciones segun tu servicio" : "Opciones recomendadas"}
                subtitle={
                    isSpecialService
                        ? "Selecciona la alternativa que mejor se ajuste a tu plan."
                        : ""
                }
            />
        </div>

    );
};

export default Detalles;