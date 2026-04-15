import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "../styles/detalles.css";
import { fetchProductById, fetchSpecialServiceByKey, createReserva } from "../backend/supabase_client";
import { useAuth } from "../contexts/AuthContext";
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
    const [isInteracting, setIsInteracting] = useState(false);
    const intervalRef = useRef(null);

    // ─── Formulario de reserva ────────────────────────────────────────────
    const { user } = useAuth();
    const [reservaForm, setReservaForm] = useState(RESERVA_INICIAL);
    const [reservaLoading, setReservaLoading] = useState(false);
    const [reservaMsg, setReservaMsg] = useState(null);
    const [reservaEnviada, setReservaEnviada] = useState(false);

    // Pre-rellenar email si el usuario está autenticado
    useEffect(() => {
        if (user?.email) {
            setReservaForm((prev) => ({ ...prev, email: user.email }));
        }
    }, [user]);

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

            {/* ── Formulario de solicitud de reserva ── */}
            <section className="detalles-reserva">
              <div className="detalles-reserva__inner">
                <h2 className="detalles-reserva__title">¿Te interesa este paquete?</h2>
                <p className="detalles-reserva__subtitle">
                  Envía tu solicitud y un agente te contactará con una cotización personalizada sin costo.
                </p>

                {!user ? (
                  <div className="detalles-reserva__login-required">
                    <p>Para enviar una solicitud de reserva debes tener una cuenta.</p>
                    <div className="detalles-reserva__actions">
                      <a href="/login" className="detalles-reserva__btn-submit">Iniciar sesión</a>
                      <a href="/registro" className="detalles-reserva__btn-wa" style={{background: "var(--color-primary-dark)"}}>Crear cuenta</a>
                    </div>
                  </div>
                ) : reservaEnviada ? (
                  <div className="detalles-reserva__success">
                    <span className="detalles-reserva__success-icon">✓</span>
                    <div>
                      <strong>¡Solicitud enviada!</strong>
                      <p>Nos comunicaremos contigo en las próximas horas. También puedes escribirnos directamente:</p>
                      <a
                        href={`https://wa.me/584224560111128?text=Hola,%20hice%20una%20solicitud%20para%20el%20paquete:%20${encodeURIComponent(detalle.title)}`}
                        className="detalles-reserva__whatsapp"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        💬 Escribir por WhatsApp
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
                    <div className="detalles-reserva__field detalles-reserva__field--full">
                      <label htmlFor="res-comentarios">Comentarios o preguntas</label>
                      <textarea
                        id="res-comentarios"
                        value={reservaForm.comentarios}
                        onChange={(e) => setReservaForm((p) => ({ ...p, comentarios: e.target.value }))}
                        placeholder="¿Tienes preferencias, alergias, necesidades especiales...?"
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
                        className="detalles-reserva__btn-submit"
                        disabled={reservaLoading}
                      >
                        {reservaLoading ? "Enviando..." : "Solicitar información"}
                      </button>
                      <a
                        href={`https://wa.me/584224560111128?text=Hola,%20quiero%20información%20sobre%20el%20paquete:%20${encodeURIComponent(detalle.title)}`}
                        className="detalles-reserva__btn-wa"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        💬 WhatsApp
                      </a>
                    </div>
                  </form>
                )}
              </div>
            </section>
        </div>

    );
};

export default Detalles;