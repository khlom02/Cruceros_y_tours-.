import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import SEO from './SEO.jsx';
import "../styles/detalles.css";
import { fetchProductById, fetchSpecialServiceByKey, createReserva } from "../backend/supabase_client";
import { useAuth } from "../contexts/AuthContext";
import Rooms from "./rooms.jsx";
import DetallesNavieras from "./detalles_navieras.jsx";

const normalizeDetalle = (data) => {
    if (!data) return null;
    const dbGallery = Array.isArray(data.gallery) ? data.gallery : [];
    const mainImage = data.imagen || data.imagen_url;
    return {
        id: data.id,
        title: data.titulo || data.title || "",
        location: data.ubicacion || data.location || "",
        rating: data.rating ?? null,
        reviews: data.cantidad_reviews ?? data.reviews ?? null,
        description: data.descripcion || data.description || "",
        precio: data.precio ?? null,
        fechaInicio: data.fecha_inicio || null,
        fechaFin: data.fecha_fin || null,
        amenities: Array.isArray(data.amenities) ? data.amenities.map(a => a.nombre || a) : [],
        highlights: Array.isArray(data.highlights) ? data.highlights : [],
        facilities: Array.isArray(data.amenities) ? data.amenities.map(a => ({ icon: a.icono_emoji || null, name: a.nombre || a })) : [],
        rooms: Array.isArray(data.rooms) ? data.rooms : [],
        anosServicio: data.detalles_crucero?.anos_servicio ?? data.anos_servicio ?? null,
        pasajerosMax: data.detalles_crucero?.pasajeros_max ?? data.pasajeros_max ?? null,
        tripulantes: data.detalles_crucero?.tripulantes ?? null,
        ratioEspacio: data.detalles_crucero?.ratio_espacio ?? data.ratio_espacio ?? null,
        ratioServicio: data.detalles_crucero?.ratio_servicio ?? data.ratio_servicio ?? null,
        cabinaSingle: data.detalles_crucero?.cabina_single ?? data.cabina_single ?? false,
        viajandoConNinos: data.detalles_crucero?.viajando_con_ninos ?? data.viajando_con_ninos ?? false,
        gallery: mainImage ? [mainImage, ...dbGallery] : dbGallery,
    };
};

const serviceTypes = ["tren", "auto", "asistencia"];

const normalizeServiceDetalle = (data) => {
    if (!data) return null;
    const dbGallery = Array.isArray(data.gallery) ? data.gallery : [];
    const mainImage = data.imagen_url;
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
        gallery: mainImage ? [mainImage, ...dbGallery] : dbGallery,
    };
};

const RESERVA_INICIAL = {
    nombre: "",
    email: "",
    telefono: "",
    fecha_viaje: "",
    pasajeros: 1,
    comentarios: "",
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
    const [galleryOpen, setGalleryOpen] = useState(false);
    const [showFloat, setShowFloat] = useState(false);
    const [heroDone, setHeroDone] = useState(false);
    const intervalRef = useRef(null);
    const heroRef = useRef(null);
    const contentRef = useRef(null);

    const { user } = useAuth();
    const [reservaForm, setReservaForm] = useState(RESERVA_INICIAL);
    const [reservaLoading, setReservaLoading] = useState(false);
    const [reservaMsg, setReservaMsg] = useState(null);
    const [reservaEnviada, setReservaEnviada] = useState(false);

    useEffect(() => {
        if (user?.email) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setReservaForm((prev) => ({ ...prev, email: user.email }));
        }
    }, [user?.email]);

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
                setError("No se encontró el detalle solicitado.");
                setLoading(false);
                return;
            }
            const normalized = isSpecialService
                ? normalizeServiceDetalle(data)
                : normalizeDetalle(data);
            setDetalle(normalized);
            setLoading(false);
        };
        loadDetalle();
        return () => { isMounted = false; };
    }, [detalleId, detalleTipo, isSpecialService]);

    const gallery = useMemo(() => detalle?.gallery || [], [detalle]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setActiveIndex(0);
    }, [gallery.length]);

    useEffect(() => {
        if (gallery.length <= 1) return;
        intervalRef.current = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % gallery.length);
        }, 4500);
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [gallery.length]);

    useEffect(() => {
        if (!heroRef.current) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) {
                    setShowFloat(true);
                } else {
                    setShowFloat(false);
                }
            },
            { threshold: 0 }
        );
        observer.observe(heroRef.current);
        return () => observer.disconnect();
    }, [loading]);

    useEffect(() => {
        const t = setTimeout(() => setHeroDone(true), 100);
        return () => clearTimeout(t);
    }, []);

    const goImage = useCallback((dir) => {
        setActiveIndex((prev) => {
            if (dir === "next") return (prev + 1) % gallery.length;
            return (prev - 1 + gallery.length) % gallery.length;
        });
    }, [gallery.length]);

    const formatPrice = (val) => {
        if (val == null) return null;
        const num = Number(val);
        if (isNaN(num)) return null;
        return num.toLocaleString("es-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    };

    const handleScrollToForm = () => {
        const el = document.getElementById("detalles-reserva");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    if (loading) {
        return (
            <div className="det-page">
                <div className="det-loading">
                    <span className="det-loading__marker">—</span>
                    <span>Cargando experiencia...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="det-page">
                <div className="det-error">
                    <span className="det-error__marker">●</span>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!detalle) {
        return (
            <div className="det-page">
                <div className="det-error">
                    <span className="det-error__marker">●</span>
                    <p>No hay información disponible.</p>
                </div>
            </div>
        );
    }

    const precio = formatPrice(detalle?.precio);
    const hasRating = detalle.rating != null;
    const stars = hasRating ? Math.round(detalle.rating) : 0;
    const descShort = detalle.description
        ? detalle.description.substring(0, 200) + (detalle.description.length > 200 ? "…" : "")
        : "";

    return (
        <>
            <SEO
                title={detalle.title}
                description={detalle.description?.substring(0, 160) || `${detalle.title} — reserva tu experiencia con Cruceros y Tours.`}
                canonical={`/detalles?id=${detalleId}${detalleTipo ? `&tipo=${detalleTipo}` : ''}`}
                image={gallery[0] || undefined}
            />

            {/* ── HERO: split-screen ── */}
            <header ref={heroRef} className={`det-hero ${heroDone ? "det-hero--ready" : ""}`}>
                <div className="det-hero__image">
                    {gallery.length > 0 ? (
                        <img
                            src={gallery[activeIndex]}
                            alt={detalle.title}
                            loading="eager"
                            decoding="async"
                        />
                    ) : (
                        <div className="det-hero__image-fallback" />
                    )}
                    <div className="det-hero__image-shade" />

                    {gallery.length > 1 && (
                        <>
                            <button
                                type="button"
                                className="det-hero__arrow det-hero__arrow--prev"
                                onClick={() => goImage("prev")}
                                aria-label="Anterior"
                            >‹</button>
                            <button
                                type="button"
                                className="det-hero__arrow det-hero__arrow--next"
                                onClick={() => goImage("next")}
                                aria-label="Siguiente"
                            >›</button>
                            <div className="det-hero__dots">
                                {gallery.map((_, i) => (
                                    <span
                                        key={i}
                                        className={`det-hero__dot ${i === activeIndex ? "is-active" : ""}`}
                                        onClick={() => setActiveIndex(i)}
                                    />
                                ))}
                            </div>
                        </>
                    )}

                    <button
                        type="button"
                        className="det-hero__expand-btn"
                        onClick={() => setGalleryOpen(true)}
                        aria-label="Abrir galería"
                    >
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <circle cx="11" cy="11" r="3" />
                            <path d="M21 21l-4.35-4.35" />
                            <path d="M11 8V6M11 14v2M8 11H6M14 11h2" />
                        </svg>
                        {gallery.length} fotos
                    </button>

                    {gallery.length > 1 && (
                        <div className="det-hero__counter">
                            {activeIndex + 1} / {gallery.length}
                        </div>
                    )}
                </div>

                <div className="det-hero__info">
                    <div className="det-hero__info-inner">
                        {detalle.location && (
                            <span className="det-hero__badge">{detalle.location}</span>
                        )}

                        <h1 className="det-hero__title">{detalle.title}</h1>

                        <div className="det-hero__rule" />

                        {descShort && (
                            <p className="det-hero__desc">{descShort}</p>
                        )}

                        {precio && (
                            <div className="det-hero__price">
                                <span className="det-hero__price-label">Desde</span>
                                <span className="det-hero__price-value">USD {precio}</span>
                            </div>
                        )}

                        {hasRating && (
                            <div className="det-hero__rating">
                                <span className="det-hero__stars">
                                    {Array.from({ length: 5 }, (_, i) => (
                                        <span key={i} className={i < stars ? "is-star" : "is-empty"}>★</span>
                                    ))}
                                </span>
                                <span className="det-hero__rating-num">{detalle.rating}</span>
                                {detalle.reviews && (
                                    <span className="det-hero__reviews">({detalle.reviews} reseñas)</span>
                                )}
                            </div>
                        )}

                        <div className="det-hero__actions">
                            <button
                                type="button"
                                className="det-hero__btn det-hero__btn--primary"
                                onClick={handleScrollToForm}
                            >
                                Reservar
                            </button>
                            <a
                                href={`https://wa.me/5842245601128?text=${encodeURIComponent(`Hola, quiero información sobre: ${detalle.title}`)}`}
                                className="det-hero__btn det-hero__btn--wa"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </header>

            {/* ── GALERÍA MODAL ── */}
            {galleryOpen && gallery.length > 0 && (
                <div className="det-gallery-modal" onClick={() => setGalleryOpen(false)}>
                    <button
                        className="det-gallery-modal__close"
                        onClick={() => setGalleryOpen(false)}
                        aria-label="Cerrar"
                    >
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                    <img
                        className="det-gallery-modal__img"
                        src={gallery[activeIndex]}
                        alt={`${detalle.title} ${activeIndex + 1}`}
                        onClick={(e) => e.stopPropagation()}
                    />
                    {gallery.length > 1 && (
                        <div className="det-gallery-modal__nav">
                            <button type="button" onClick={(e) => { e.stopPropagation(); goImage("prev"); }}>‹</button>
                            <span>{activeIndex + 1} / {gallery.length}</span>
                            <button type="button" onClick={(e) => { e.stopPropagation(); goImage("next"); }}>›</button>
                        </div>
                    )}
                </div>
            )}

            {/* ── CONTENIDO ── */}
            <div ref={contentRef} className="det-content">

                {/* STATS BAR */}
                {detalleTipo === "crucero" && (
                    <section className="det-section det-section--stats">
                        <DetallesNavieras
                            anosServicio={detalle.anosServicio}
                            pasajerosMax={detalle.pasajerosMax}
                            tripulantes={detalle.tripulantes}
                            ratioEspacio={detalle.ratioEspacio}
                            ratioServicio={detalle.ratioServicio}
                            cabinaSingle={detalle.cabinaSingle}
                            viajandoConNinos={detalle.viajandoConNinos}
                        />
                    </section>
                )}

                {/* HIGHLIGHTS */}
                {detalle.highlights.length > 0 && (
                    <section className="det-section">
                        <h2 className="det-section__title">
                            <span className="det-section__marker">●</span>
                            Experiencia
                        </h2>
                        <div className="det-highlights">
                            {detalle.highlights.map((item, i) => (
                                <div key={i} className="det-highlight">
                                    <span className="det-highlight__num">{String(i + 1).padStart(2, "0")}</span>
                                    <div className="det-highlight__content">
                                        <p>{item}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* SERVICIO INFO */}
                {isSpecialService && detalle.serviceInfo.length > 0 && (
                    <section className="det-section">
                        <h2 className="det-section__title">
                            <span className="det-section__marker">●</span>
                            Detalles del servicio
                        </h2>
                        <ul className="det-servicelist">
                            {detalle.serviceInfo.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* INCLUYE + AMENITIES en dos columnas */}
                {(detalle.amenities.length > 0 || detalle.facilities.length > 0) && (
                    <section className="det-section">
                        <h2 className="det-section__title">
                            <span className="det-section__marker">●</span>
                            Servicios
                        </h2>
                        <div className="det-split">
                            {detalle.amenities.length > 0 && (
                                <div className="det-split__col">
                                    <h3 className="det-split__subtitle">Incluye</h3>
                                    <ul className="det-includes">
                                        {detalle.amenities.map((item, i) => (
                                            <li key={i}>
                                                <span className="det-includes__check" aria-hidden="true">✓</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {detalle.facilities.length > 0 && (
                                <div className="det-split__col">
                                    <h3 className="det-split__subtitle">Instalaciones</h3>
                                    <div className="det-facilities">
                                        {detalle.facilities.map((item, i) => (
                                            <div key={i} className="det-facility">
                                                {item.icon && <span className="det-facility__icon">{item.icon}</span>}
                                                <span>{item.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* ROOMS */}
                <Rooms
                    serviceType={isSpecialService ? detalleTipo : ""}
                    rooms={!isSpecialService ? detalle.rooms : undefined}
                    title=""
                    subtitle=""
                />

                {/* DESCRIPCIÓN */}
                {detalle.description && (
                    <section className="det-section det-section--desc">
                        <h2 className="det-section__title">
                            <span className="det-section__marker">●</span>
                            Acerca de esta experiencia
                        </h2>
                        <div className="det-desc">
                            {detalle.description.split("\n").map((p, i) => (
                                <p key={i}>{p}</p>
                            ))}
                        </div>
                    </section>
                )}

                {/* RESERVA */}
                <section id="detalles-reserva" className="det-section det-section--reserva">
                    <div className="det-reserva">
                        <h2 className="det-reserva__title">Solicitar información</h2>
                        <p className="det-reserva__sub">
                            Completa el formulario y un agente te contactará con una cotización personalizada.
                        </p>

                        {!user ? (
                            <div className="det-reserva__login">
                                <p>Para solicitar una reserva necesitas una cuenta.</p>
                                <div className="det-reserva__actions">
                                    <a href="/login" className="det-reserva__btn det-reserva__btn--primary">Iniciar sesión</a>
                                    <a href="/registro" className="det-reserva__btn det-reserva__btn--ghost">Crear cuenta</a>
                                </div>
                            </div>
                        ) : reservaEnviada ? (
                            <div className="det-reserva__success">
                                <span className="det-reserva__check">✓</span>
                                <div>
                                    <strong>¡Solicitud enviada!</strong>
                                    <p>Te contactaremos pronto. Mientras tanto, escríbenos:</p>
                                    <a
                                        href={`https://wa.me/5842245601128?text=${encodeURIComponent(`Hola, hice una solicitud para: ${detalle.title}`)}`}
                                        className="det-reserva__whatsapp"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        WhatsApp
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <form
                                className="det-reserva__form"
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    if (!user) {
                                        setReservaMsg("Debes iniciar sesión.");
                                        return;
                                    }
                                    setReservaLoading(true);
                                    setReservaMsg(null);
                                    const result = await createReserva({
                                        user_id: user.id,
                                        nombre: reservaForm.nombre,
                                        email: reservaForm.email,
                                        telefono: reservaForm.telefono,
                                        paquete_id: detalle.id || null,
                                        paquete_nombre: detalle.title,
                                        fecha_viaje: reservaForm.fecha_viaje || null,
                                        pasajeros: Number(reservaForm.pasajeros) || 1,
                                        comentarios: reservaForm.comentarios,
                                    });
                                    setReservaLoading(false);
                                    if (result) {
                                        setReservaEnviada(true);
                                        setReservaForm(RESERVA_INICIAL);
                                    } else {
                                        setReservaMsg("Error al enviar. Intenta de nuevo o escríbenos por WhatsApp.");
                                    }
                                }}
                            >
                                <div className="det-reserva__grid">
                                    <div className="det-reserva__field">
                                        <label htmlFor="res-nombre">Nombre</label>
                                        <input id="res-nombre" type="text" value={reservaForm.nombre} onChange={(e) => setReservaForm(p => ({ ...p, nombre: e.target.value }))} placeholder="Tu nombre" required maxLength={100} />
                                    </div>
                                    <div className="det-reserva__field">
                                        <label htmlFor="res-email">Email</label>
                                        <input id="res-email" type="email" value={reservaForm.email} onChange={(e) => setReservaForm(p => ({ ...p, email: e.target.value }))} placeholder="tu@correo.com" required maxLength={120} />
                                    </div>
                                    <div className="det-reserva__field">
                                        <label htmlFor="res-tel">Teléfono</label>
                                        <input id="res-tel" type="tel" value={reservaForm.telefono} onChange={(e) => setReservaForm(p => ({ ...p, telefono: e.target.value }))} placeholder="+58 412 000 0000" maxLength={30} />
                                    </div>
                                    <div className="det-reserva__field">
                                        <label htmlFor="res-fecha">Fecha estimada</label>
                                        <input id="res-fecha" type="date" value={reservaForm.fecha_viaje} onChange={(e) => setReservaForm(p => ({ ...p, fecha_viaje: e.target.value }))} min={new Date().toISOString().split("T")[0]} />
                                    </div>
                                    <div className="det-reserva__field">
                                        <label htmlFor="res-pax">Pasajeros</label>
                                        <input id="res-pax" type="number" min="1" max="50" value={reservaForm.pasajeros} onChange={(e) => setReservaForm(p => ({ ...p, pasajeros: e.target.value }))} />
                                    </div>
                                </div>
                                <div className="det-reserva__field det-reserva__field--wide">
                                    <label htmlFor="res-com">Comentarios</label>
                                    <textarea id="res-com" value={reservaForm.comentarios} onChange={(e) => setReservaForm(p => ({ ...p, comentarios: e.target.value }))} placeholder="Preferencias, necesidades especiales…" rows={3} maxLength={500} />
                                </div>
                                {reservaMsg && <p className="det-reserva__error">{reservaMsg}</p>}
                                <div className="det-reserva__actions">
                                    <button type="submit" className="det-reserva__btn det-reserva__btn--primary" disabled={reservaLoading}>
                                        {reservaLoading ? "Enviando…" : "Enviar solicitud"}
                                    </button>
                                    <a href={`https://wa.me/5842245601128?text=${encodeURIComponent(`Hola, quiero información sobre: ${detalle.title}`)}`}
                                        className="det-reserva__btn det-reserva__btn--wa"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        WhatsApp
                                    </a>
                                </div>
                            </form>
                        )}
                    </div>
                </section>
            </div>

            {/* ── FLOATING CTA ── */}
            <div className={`det-float ${showFloat ? "det-float--show" : ""}`}>
                <button
                    type="button"
                    className="det-float__btn"
                    onClick={handleScrollToForm}
                >
                    <span className="det-float__label">Solicitar</span>
                    {precio && <span className="det-float__price">USD {precio}</span>}
                </button>
                <a
                    href={`https://wa.me/5842245601128?text=${encodeURIComponent(`Hola, quiero info sobre: ${detalle.title}`)}`}
                    className="det-float__wa"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                >
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                </a>
            </div>
        </>
    );
};

export default Detalles;
