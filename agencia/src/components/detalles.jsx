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

const serviceTypes = ["tren", "auto", "asistencia"];

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
                rooms={!isSpecialService ? detalle.rooms : undefined}
                title={
                    isSpecialService
                        ? "Nuestros socios"
                        : detalle.rooms?.length > 0
                            ? "Cabinas y opciones disponibles"
                            : ""
                }
                subtitle={
                    isSpecialService
                        ? "Selecciona la alternativa que mejor se ajuste a tu plan."
                        : detalle.rooms?.length > 0
                            ? "Elige la opcion que mejor se adapte a tu viaje."
                            : ""
                }
            />

            {/* CTA: Consultar este paquete */}
            <section className="detalles-cta">
              <div className="detalles-cta__content">
                <h2 className="detalles-cta__title">¿Te interesa este paquete?</h2>
                <p className="detalles-cta__text">Habla con uno de nuestros agentes y recibe una cotización personalizada sin costo.</p>
                <div className="detalles-cta__actions">
                  <a
                    href={`https://wa.me/584224560111128?text=Hola,%20quiero%20información%20sobre%20el%20paquete:%20${encodeURIComponent(detalle.title)}`}
                    className="detalles-cta__btn detalles-cta__btn--whatsapp"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    💬 Consultar por WhatsApp
                  </a>
                  <a href="/contacto" className="detalles-cta__btn detalles-cta__btn--contact">
                    ✉ Enviar consulta
                  </a>
                </div>
              </div>
            </section>
        </div>

    );
};

export default Detalles;