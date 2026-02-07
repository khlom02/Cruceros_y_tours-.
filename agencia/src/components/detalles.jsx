import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "../styles/detalles.css";
import { fetchProductById } from "../backend/supabase_client.js";

const normalizeDetalle = (data) => {
    if (!data) return null;

    const gallery = Array.isArray(data.gallery)
        ? data.gallery
        : data.imagen_url
            ? [data.imagen_url]
            : [];

    return {
        id: data.id,
        title: data.nombre || data.title || "",
        location: data.ubicacion || data.location || "",
        rating: data.rating ?? null,
        reviews: data.reviews ?? null,
        description: data.descripcion || data.description || "",
        amenities: Array.isArray(data.amenities) ? data.amenities : [],
        highlights: Array.isArray(data.highlights) ? data.highlights : [],
        facilities: Array.isArray(data.facilities) ? data.facilities : [],
        rooms: Array.isArray(data.rooms) ? data.rooms : [],
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
            "Wi-Fi",
            "Piscina cubierta",
            "Mundo SPA",
            "Amenities cosmeticos de lujo",
            "Gimnasio",
            "Terraza",
            "Balcon",
            "Restaurante",
            "Sauna",
            "Vista a la playa",
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

const Detalles = () => {
    const [searchParams] = useSearchParams();
    const detalleId = searchParams.get("id");
    const [detalle, setDetalle] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;

        const loadDetalle = async () => {
            if (!detalleId) {
                if (!isMounted) return;
                setDetalle(null);
                setError("Selecciona una experiencia para ver sus detalles.");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError("");

            const data = await fetchProductById(detalleId);
            if (!isMounted) return;

            if (!data) {
                const fallback = mockDetalles[detalleId];
                if (fallback) {
                    setDetalle(normalizeDetalle(fallback));
                    setLoading(false);
                    return;
                }

                setDetalle(null);
                setError("No se encontro el detalle solicitado.");
                setLoading(false);
                return;
            }

            setDetalle(normalizeDetalle(data));
            setLoading(false);
        };

        loadDetalle();

        return () => {
            isMounted = false;
        };
    }, [detalleId]);

    const gallery = useMemo(() => detalle?.gallery || [], [detalle]);

    useEffect(() => {
        setActiveIndex(0);
    }, [gallery.length]);

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
                        />
                    ) : (
                        <div className="detalles-image-placeholder">
                            Sin imagen disponible
                        </div>
                    )}

                    {gallery.length > 1 && (
                        <div className="detalles-thumbs">
                            {gallery.map((imgUrl, index) => (
                                <button
                                    key={`${detalle.id}-thumb-${index}`}
                                    type="button"
                                    className={`detalles-thumb ${
                                        index === activeIndex ? "is-active" : ""
                                    }`}
                                    onClick={() => setActiveIndex(index)}
                                >
                                    <img src={imgUrl} alt={`${detalle.title} ${index + 1}`} />
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

            {detalle.rooms.length > 0 && (
                <section className="detalles-section">
                    <h2>Habitaciones disponibles</h2>
                    <div className="detalles-rooms">
                        {detalle.rooms.map((room, index) => (
                            <div
                                key={`${detalle.id}-room-${index}`}
                                className="detalles-room"
                            >
                                <div className="detalles-room-title">{room.title}</div>
                                {room.description && (
                                    <div className="detalles-room-desc">{room.description}</div>
                                )}
                                {room.price && (
                                    <div className="detalles-room-price">{room.price}</div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default Detalles;