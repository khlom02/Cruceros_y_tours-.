import React, { useEffect, useMemo, useRef, useState } from "react";
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
    const gallery = mainImage
      ? [mainImage, ...dbGallery]
      : dbGallery;

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

    const dbGallery = Array.isArray(data.gallery) ? data.gallery : [];
    const mainImage = data.imagen_url;
    const gallery = mainImage
      ? [mainImage, ...dbGallery]
      : dbGallery;

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

const RESERVA_INICIAL = {
    nombre: "",
    email: "",
    telefono: "",
    fecha_viaje: "",
    pasajeros: 1,
    comentarios: "",
};

const FAQ_ITEMS = [
    { q: "¿Cómo hago una reserva?", a: "Completa el formulario de solicitud y un agente te contactará en las próximas horas para coordinar los detalles de tu reserva." },
    { q: "¿Aceptan pagos internacionales?", a: "Sí, trabajamos con transferencias bancarias internacionales, Zelle, PayPal y depósitos en cuentas locales." },
    { q: "¿Puedo cancelar o modificar mi reserva?", a: "Las políticas de cancelación varían según el proveedor del servicio. Te informaremos los términos antes de confirmar." },
    { q: "¿El precio incluye impuestos y tasas?", a: "Los precios mostrados incluyen impuestos y tasas de servicio, salvo que se indique lo contrario." },
    { q: "¿Ofrecen financiamiento?", a: "Sí, ofrecemos planes de pago flexibles. Consulta con tu agente las opciones disponibles para tu paquete." },
];

const Detalles = () => {
    const [searchParams] = useSearchParams();
    const detalleId = searchParams.get("id");
    const detalleTipo = searchParams.get("tipo");
    const isSpecialService = serviceTypes.includes(detalleTipo);
    const [detalle, setDetalle] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [faqOpen, setFaqOpen] = useState(null);
    const [showStickyBar, setShowStickyBar] = useState(true);
    const intervalRef = useRef(null);
    const lastScrollRef = useRef(0);

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
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setActiveIndex(0);
    }, [gallery.length]);

    useEffect(() => {
        if (gallery.length <= 1) return;

        intervalRef.current = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % gallery.length);
        }, 4000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [gallery.length]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            if (scrollY > lastScrollRef.current && scrollY > 300) {
                setShowStickyBar(false);
            } else {
                setShowStickyBar(true);
            }
            lastScrollRef.current = scrollY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const activeImage = gallery[activeIndex];

    const formatPrice = (val) => {
        if (val == null) return null;
        const num = Number(val);
        if (isNaN(num)) return null;
        return num.toLocaleString("es-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    };

    const precioFormateado = formatPrice(detalle?.precio);

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

    const productTitle = detalle?.title || "Detalles del producto";
    const productDescription = detalle?.description?.substring(0, 160) || `Información detallada sobre ${productTitle}. Reserva tu paquete.`;

    return (
        <>
            <SEO
                title={productTitle}
                description={productDescription}
                canonical={`/detalles?id=${detalleId}${detalleTipo ? `&tipo=${detalleTipo}` : ''}`}
                image={detalle?.gallery?.[0] || undefined}
            />

            {/* HERO — full-bleed */}
            <header className="detalles-hero">
                <div className="detalles-hero__bg">
                    {activeImage ? (
                        <img
                            src={activeImage}
                            alt={detalle.title}
                            loading="eager"
                            decoding="async"
                        />
                    ) : (
                        <div className="detalles-hero__placeholder" />
                    )}
                    <div className="detalles-hero__shade" />
                </div>

                <div className="detalles-hero__info">
                    <div className="detalles-hero__meta">
                        {detalle.location && (
                            <span className="detalles-hero__location">{detalle.location}</span>
                        )}
                        {detalle.rating != null && (
                            <span className="detalles-hero__rating">
                                <span className="detalles-hero__stars">{'★'.repeat(Math.round(detalle.rating))}</span>
                                <span>{detalle.rating}</span>
                                {detalle.reviews ? <span className="detalles-hero__reviews">({detalle.reviews} reseñas)</span> : null}
                            </span>
                        )}
                    </div>

                    <h1 className="detalles-hero__title">{detalle.title}</h1>

                    {precioFormateado && (
                        <div className="detalles-hero__price">
                            <span className="detalles-hero__price-label">Desde</span>
                            <span className="detalles-hero__price-value">USD ${precioFormateado}</span>
                        </div>
                    )}

                    <div className="detalles-hero__actions">
                        <button
                            type="button"
                            className="detalles-hero__btn detalles-hero__btn--primary"
                            onClick={() => {
                                const el = document.getElementById("detalles-reserva");
                                if (el) el.scrollIntoView({ behavior: "smooth" });
                            }}
                        >
                            Reservar ahora
                        </button>
                        <a
                            href={`https://wa.me/5842245601128?text=${encodeURIComponent(`Hola, quiero información sobre: ${detalle.title}`)}`}
                            className="detalles-hero__btn detalles-hero__btn--whatsapp"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            WhatsApp
                        </a>
                    </div>
                </div>

                {gallery.length > 1 && (
                    <div className="detalles-hero__thumbs">
                        {gallery.map((imgUrl, index) => (
                            <button
                                key={`thumb-${index}`}
                                type="button"
                                className={`detalles-hero__thumb ${index === activeIndex ? "is-active" : ""}`}
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

                {gallery.length > 1 && (
                    <button
                        type="button"
                        className="detalles-hero__expand"
                        onClick={() => setLightboxOpen(true)}
                        aria-label="Ver galería completa"
                    >
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="3" /><path d="M21 21l-4.35-4.35" /><path d="M11 8V6" /><path d="M11 14v2" /><path d="M8 11H6" /><path d="M14 11h2" />
                        </svg>
                        Ver galería
                    </button>
                )}
            </header>

            {/* LIGHTBOX */}
            {lightboxOpen && gallery.length > 0 && (
                <div className="detalles-lightbox" onClick={() => setLightboxOpen(false)}>
                    <button className="detalles-lightbox__close" onClick={() => setLightboxOpen(false)} aria-label="Cerrar galería">
                        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                    </button>
                    <img
                        className="detalles-lightbox__img"
                        src={gallery[activeIndex]}
                        alt={`${detalle.title} - imagen ${activeIndex + 1}`}
                        onClick={(e) => e.stopPropagation()}
                    />
                    {gallery.length > 1 && (
                        <div className="detalles-lightbox__nav">
                            <button onClick={(e) => { e.stopPropagation(); setActiveIndex((prev) => (prev - 1 + gallery.length) % gallery.length); }} aria-label="Anterior">
                                <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
                            </button>
                            <span className="detalles-lightbox__counter">{activeIndex + 1} / {gallery.length}</span>
                            <button onClick={(e) => { e.stopPropagation(); setActiveIndex((prev) => (prev + 1) % gallery.length); }} aria-label="Siguiente">
                                <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* CONTENIDO */}
            <div className="detalles-page">
                {/* STATS BAR (cruceros) */}
                {detalleTipo === "crucero" && (
                    <section className="detalles-stats">
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

                {/* HIGHLIGHTS como timeline */}
                {detalle.highlights.length > 0 && (
                    <section className="detalles-section">
                        <h2 className="detalles-section__title">Itinerario</h2>
                        <div className="detalles-timeline">
                            {detalle.highlights.map((item, index) => (
                                <div key={`hl-${index}`} className="detalles-timeline__item">
                                    <span className="detalles-timeline__num">{index + 1}</span>
                                    <div className="detalles-timeline__content">
                                        <p>{item}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* SERVICIO INFO (for special services) */}
                {isSpecialService && detalle.serviceInfo.length > 0 && (
                    <section className="detalles-section">
                        <h2 className="detalles-section__title">Detalles del servicio</h2>
                        <ul className="detalles-servicelist">
                            {detalle.serviceInfo.map((item, index) => (
                                <li key={`si-${index}`}>
                                    <span className="detalles-servicelist__icon" aria-hidden="true">✓</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* INCLUYE */}
                {detalle.amenities.length > 0 && (
                    <section className="detalles-section">
                        <h2 className="detalles-section__title">Incluye</h2>
                        <div className="detalles-includes">
                            {detalle.amenities.map((item, index) => (
                                <div key={`inc-${index}`} className="detalles-includes__item">
                                    <span className="detalles-includes__check" aria-hidden="true">✓</span>
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* INSTALACIONES / AMENITIES GRID */}
                {detalle.facilities.length > 0 && (
                    <section className="detalles-section">
                        <h2 className="detalles-section__title">Instalaciones y servicios</h2>
                        <div className="detalles-amenities-grid">
                            {detalle.facilities.map((facility, index) => (
                                <div key={`fac-${index}`} className="detalles-amenities-grid__card">
                                    {facility}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* ROOMS / CABINAS */}
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

                {/* DESCRIPCIÓN */}
                {detalle.description && (
                    <section className="detalles-section">
                        <h2 className="detalles-section__title">Descripción del viaje</h2>
                        <div className="detalles-description">
                            {detalle.description.split('\n').map((p, i) => (
                                <p key={`desc-${i}`}>{p}</p>
                            ))}
                        </div>
                    </section>
                )}

                {/* FAQ */}
                <section className="detalles-section">
                    <h2 className="detalles-section__title">Preguntas frecuentes</h2>
                    <div className="detalles-faq">
                        {FAQ_ITEMS.map((item, index) => (
                            <div
                                key={`faq-${index}`}
                                className={`detalles-faq__item ${faqOpen === index ? 'is-open' : ''}`}
                            >
                                <button
                                    type="button"
                                    className="detalles-faq__question"
                                    onClick={() => setFaqOpen(faqOpen === index ? null : index)}
                                    aria-expanded={faqOpen === index}
                                >
                                    <span>{item.q}</span>
                                    <svg
                                        className="detalles-faq__arrow"
                                        viewBox="0 0 24 24"
                                        width="20"
                                        height="20"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path d="M6 9l6 6 6-6" />
                                    </svg>
                                </button>
                                <div className="detalles-faq__answer">
                                    <p>{item.a}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* FORMULARIO DE RESERVA */}
                <section id="detalles-reserva" className="detalles-reserva">
                    <div className="detalles-reserva__inner">
                        <h2 className="detalles-reserva__title">¿Te interesa este paquete?</h2>
                        <p className="detalles-reserva__subtitle">
                            Déjanos tus datos y un agente te contactará con una cotización personalizada sin compromiso.
                        </p>

                        {!user ? (
                            <div className="detalles-reserva__login-required">
                                <p>Para enviar una solicitud de reserva debes tener una cuenta.</p>
                                <div className="detalles-reserva__actions">
                                    <a href="/login" className="detalles-reserva__btn detalles-reserva__btn--primary">Iniciar sesión</a>
                                    <a href="/registro" className="detalles-reserva__btn detalles-reserva__btn--secondary">Crear cuenta</a>
                                </div>
                            </div>
                        ) : reservaEnviada ? (
                            <div className="detalles-reserva__success">
                                <span className="detalles-reserva__success-icon">✓</span>
                                <div>
                                    <strong>¡Solicitud enviada!</strong>
                                    <p>Nos comunicaremos contigo en las próximas horas. También puedes escribirnos directamente:</p>
                                    <a
                                        href={`https://wa.me/5842245601128?text=${encodeURIComponent(`Hola, hice una solicitud para el paquete: ${detalle.title}`)}`}
                                        className="detalles-reserva__whatsapp"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Escribir por WhatsApp
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <form
                                className="detalles-reserva__form"
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    if (!user) {
                                        setReservaMsg("Debes iniciar sesión para enviar una solicitud.");
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
                                        setReservaMsg("Error al enviar la solicitud. Intenta de nuevo o escríbenos por WhatsApp.");
                                    }
                                }}
                            >
                                <div className="detalles-reserva__grid">
                                    <div className="detalles-reserva__field">
                                        <label htmlFor="res-nombre">Nombre completo *</label>
                                        <input
                                            id="res-nombre"
                                            type="text"
                                            value={reservaForm.nombre}
                                            onChange={(e) => setReservaForm((p) => ({ ...p, nombre: e.target.value }))}
                                            placeholder="Tu nombre"
                                            required
                                            maxLength={100}
                                        />
                                    </div>
                                    <div className="detalles-reserva__field">
                                        <label htmlFor="res-email">Correo electrónico *</label>
                                        <input
                                            id="res-email"
                                            type="email"
                                            value={reservaForm.email}
                                            onChange={(e) => setReservaForm((p) => ({ ...p, email: e.target.value }))}
                                            placeholder="tu@correo.com"
                                            required
                                            maxLength={120}
                                        />
                                    </div>
                                    <div className="detalles-reserva__field">
                                        <label htmlFor="res-telefono">Teléfono</label>
                                        <input
                                            id="res-telefono"
                                            type="tel"
                                            value={reservaForm.telefono}
                                            onChange={(e) => setReservaForm((p) => ({ ...p, telefono: e.target.value }))}
                                            placeholder="+58 412 000 0000"
                                            maxLength={30}
                                        />
                                    </div>
                                    <div className="detalles-reserva__field">
                                        <label htmlFor="res-fecha">Fecha de viaje estimada</label>
                                        <input
                                            id="res-fecha"
                                            type="date"
                                            value={reservaForm.fecha_viaje}
                                            onChange={(e) => setReservaForm((p) => ({ ...p, fecha_viaje: e.target.value }))}
                                            min={new Date().toISOString().split("T")[0]}
                                        />
                                    </div>
                                    <div className="detalles-reserva__field">
                                        <label htmlFor="res-pasajeros">Número de pasajeros</label>
                                        <input
                                            id="res-pasajeros"
                                            type="number"
                                            min="1"
                                            max="50"
                                            value={reservaForm.pasajeros}
                                            onChange={(e) => setReservaForm((p) => ({ ...p, pasajeros: e.target.value }))}
                                        />
                                    </div>
                                </div>
                                <div className="detalles-reserva__field">
                                    <label htmlFor="res-comentarios">Comentarios o preguntas</label>
                                    <textarea
                                        id="res-comentarios"
                                        value={reservaForm.comentarios}
                                        onChange={(e) => setReservaForm((p) => ({ ...p, comentarios: e.target.value }))}
                                        placeholder="¿Tienes preferencias, necesidades especiales...?"
                                        rows={3}
                                        maxLength={500}
                                    />
                                </div>
                                {reservaMsg && (
                                    <p className="detalles-reserva__error">{reservaMsg}</p>
                                )}
                                <div className="detalles-reserva__actions">
                                    <button
                                        type="submit"
                                        className="detalles-reserva__btn detalles-reserva__btn--primary"
                                        disabled={reservaLoading}
                                    >
                                        {reservaLoading ? "Enviando..." : "Solicitar información"}
                                    </button>
                                    <a
                                        href={`https://wa.me/5842245601128?text=${encodeURIComponent(`Hola, quiero información sobre: ${detalle.title}`)}`}
                                        className="detalles-reserva__btn detalles-reserva__btn--whatsapp"
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

            {/* STICKY BOOKING BAR */}
            <div className={`detalles-sticky ${showStickyBar ? 'is-visible' : 'is-hidden'}`}>
                <div className="detalles-sticky__inner">
                    <div className="detalles-sticky__info">
                        <span className="detalles-sticky__title">{detalle.title}</span>
                        {precioFormateado && (
                            <span className="detalles-sticky__price">USD ${precioFormateado}</span>
                        )}
                    </div>
                    <div className="detalles-sticky__actions">
                        <a
                            href={`https://wa.me/5842245601128?text=${encodeURIComponent(`Hola, quiero reservar: ${detalle.title}`)}`}
                            className="detalles-sticky__wa"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Contactar por WhatsApp"
                        >
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                            <span>WhatsApp</span>
                        </a>
                        <button
                            type="button"
                            className="detalles-sticky__cta"
                            onClick={() => {
                                const el = document.getElementById("detalles-reserva");
                                if (el) el.scrollIntoView({ behavior: "smooth" });
                            }}
                        >
                            Solicitar información
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Detalles;
