import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import SEO from "./SEO.jsx";
import Carousel3DSection from "./Carousel3DSection.jsx";
import {
  fetchAlojamientoById,
  createReserva,
} from "../backend/supabase_client";
import { useAuth } from "../contexts/AuthContext";
import "../styles/detalles_alojamiento.css";

const DEFAULT_SERVICES = [
  "WiFi",
  "Aparcamiento",
  "Piscina",
  "Aire acondicionado",
  "Servicio de lavandería",
];

const DEFAULT_ROOM_TYPES = [
  "Superior",
  "Primera calidad",
  "Doble superior",
  "Doble premium",
];

const DEFAULT_TARIFA_INCLUDES = [
  "Desayuno incluido",
  "Impuestos incluidos",
  "Acceso a áreas comunes",
];

const MOCK_ALOJAMIENTO = {
  id: 9999,
  titulo: "Hotel Paraíso Caribeño",
  precio: 185,
  imagen_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80",
  estrellas: 5,
  distancia_centro: "1.2 km",
  categoria: "todo incluido",
  tipo_habitacion: "doble premium",
  descripcion:
    "Un refugio frente al mar con instalaciones de primera clase, ideal para desconectar y disfrutar del Caribe. Cuenta con piscinas infinity, restaurantes temáticos y actividades para toda la familia.",
  direccion: "Av. Playa Azul 123, Cancún, México",
  latitud: 21.1619,
  longitud: -86.8515,
  texto_venta:
    "Reserva hoy y vive una experiencia todo incluido con vista al mar. ¡Tarifas especiales por tiempo limitado!",
  servicios_incluidos: ["WiFi", "Aparcamiento", "Piscina", "Aire acondicionado", "Servicio de lavandería"],
  tarifa_incluye: ["Desayuno buffet", "Impuestos", "Acceso a la playa", "WiFi premium"],
  tipos_habitacion: ["Superior", "Doble superior", "Doble premium", "Suite junior"],
  imagenes: [
    { id: 1, tipo: "hotel", imagen_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80", titulo: "Vista general" },
    { id: 2, tipo: "hotel", imagen_url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80", titulo: "Lobby" },
    { id: 3, tipo: "hotel", imagen_url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80", titulo: "Piscina" },
    { id: 4, tipo: "habitacion", imagen_url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80", titulo: "Habitación premium" },
    { id: 5, tipo: "habitacion", imagen_url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80", titulo: "Suite" },
    { id: 6, tipo: "habitacion", imagen_url: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&q=80", titulo: "Vista desde la habitación" },
    { id: 7, tipo: "comida", imagen_url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80", titulo: "Restaurante principal" },
    { id: 8, tipo: "comida", imagen_url: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80", titulo: "Cena gourmet" },
    { id: 9, tipo: "comida", imagen_url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80", titulo: "Desayuno buffet" },
  ],
};

const parseJsonArray = (value, fallback = []) => {
  if (!value) return fallback;
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};

const normalizeAlojamiento = (data) => {
  if (!data) return null;

  const servicios = parseJsonArray(data.servicios_incluidos, DEFAULT_SERVICES);
  const tarifa = parseJsonArray(data.tarifa_incluye, DEFAULT_TARIFA_INCLUDES);
  const habitaciones = parseJsonArray(
    data.tipos_habitacion,
    DEFAULT_ROOM_TYPES
  );

  const imagenes = Array.isArray(data.imagenes) ? data.imagenes : [];

  return {
    id: data.id,
    titulo: data.titulo || "Alojamiento",
    precio: data.precio ?? null,
    imagen_url: data.imagen_url || "",
    estrellas: data.estrellas || 0,
    distancia_centro: data.distancia_centro || "",
    categoria: data.categoria || "",
    tipo_habitacion: data.tipo_habitacion || "",
    descripcion: data.descripcion || "",
    direccion: data.direccion || "",
    latitud: data.latitud ?? null,
    longitud: data.longitud ?? null,
    texto_venta:
      data.texto_venta ||
      "Disfruta de una estadía inolvidable con el mejor confort y ubicación. Reserva ahora y asegura tu experiencia.",
    servicios_incluidos: servicios,
    tarifa_incluye: tarifa,
    tipos_habitacion: habitaciones,
    imagenes_hotel: imagenes.filter((i) => i.tipo === "hotel"),
    imagenes_habitacion: imagenes.filter((i) => i.tipo === "habitacion"),
    imagenes_comida: imagenes.filter((i) => i.tipo === "comida"),
    imagenes_servicio: imagenes.filter((i) => i.tipo === "servicio"),
  };
};

const toCarouselItems = (imagenes, fallbackTitle) =>
  imagenes.map((img) => ({
    id: img.id,
    img: img.imagen_url,
    title: img.titulo || fallbackTitle,
    subtitle: img.titulo ? fallbackTitle : "",
  }));

const MiniServiceCarousel = ({ items }) => {
  const [index, setIndex] = useState(0);

  if (!items.length) return null;

  const visible = items.slice(index, index + 3);

  return (
    <div className="alojamiento-mini-carousel">
      <button
        type="button"
        className="alojamiento-mini-carousel__arrow"
        onClick={() => setIndex((p) => (p === 0 ? items.length - 1 : p - 1))}
        aria-label="Anterior servicio"
      >
        ‹
      </button>
      <div className="alojamiento-mini-carousel__track">
        {visible.map((item, i) => (
          <div key={`${item}-${i}`} className="alojamiento-mini-carousel__item">
            <span className="alojamiento-mini-carousel__label">{item}</span>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="alojamiento-mini-carousel__arrow"
        onClick={() => setIndex((p) => (p === items.length - 1 ? 0 : p + 1))}
        aria-label="Siguiente servicio"
      >
        ›
      </button>
    </div>
  );
};

const BookingCard = ({ alojamiento, user }) => {
  const [pasajeros, setPasajeros] = useState(1);
  const [noches, setNoches] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();

  const precioBase = Number(alojamiento.precio) || 0;
  const precioTotal = precioBase * pasajeros * noches;

  const handleReservar = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setLoading(true);
    setMsg(null);
    const result = await createReserva({
      user_id: user.id,
      nombre: user.user_metadata?.full_name || user.email,
      email: user.email,
      paquete_id: alojamiento.id,
      paquete_nombre: alojamiento.titulo,
      pasajeros,
      comentarios: `Reserva de alojamiento. Noches: ${noches}. Precio estimado: $${precioTotal.toLocaleString()}`,
    });
    setLoading(false);

    if (result) {
      setSent(true);
    } else {
      setMsg("Error al procesar la reserva. Intenta de nuevo.");
    }
  };

  return (
    <aside className="alojamiento-booking">
      <div className="alojamiento-booking__price-row">
        <span className="alojamiento-booking__label">Total estimado</span>
        <span className="alojamiento-booking__price">
          ${precioTotal.toLocaleString()}
        </span>
        {precioBase > 0 && (
          <span className="alojamiento-booking__base">
            ${precioBase.toLocaleString()} / noche
          </span>
        )}
      </div>

      <div className="alojamiento-booking__controls">
        <label className="alojamiento-booking__field">
          <span>Pasajeros</span>
          <input
            type="number"
            min={1}
            max={20}
            value={pasajeros}
            onChange={(e) => setPasajeros(Number(e.target.value) || 1)}
          />
        </label>
        <label className="alojamiento-booking__field">
          <span>Noches</span>
          <input
            type="number"
            min={1}
            max={30}
            value={noches}
            onChange={(e) => setNoches(Number(e.target.value) || 1)}
          />
        </label>
      </div>

      {sent ? (
        <div className="alojamiento-booking__success">
          <span>✓</span>
          <div>
            <strong>¡Solicitud enviada!</strong>
            <p>Nos comunicaremos contigo en breve.</p>
          </div>
        </div>
      ) : (
        <>
          {msg && <p className="alojamiento-booking__error">{msg}</p>}
          <button
            type="button"
            className="alojamiento-booking__cta"
            onClick={handleReservar}
            disabled={loading}
          >
            {loading ? "Procesando..." : "Reservar ahora"}
          </button>
        </>
      )}

      <p className="alojamiento-booking__note">
        Precio sujeto a disponibilidad. No se realiza cargo inmediato.
      </p>
    </aside>
  );
};

const MapEmbed = ({ latitud, longitud, direccion, titulo }) => {
  const hasCoords = latitud != null && longitud != null;
  const query = encodeURIComponent(direccion || titulo || "");
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;

  return (
    <div className="alojamiento-map">
      <div className="alojamiento-map__container">
        {hasCoords ? (
          <iframe
            title={`Ubicación de ${titulo}`}
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${
              longitud - 0.01
            }%2C${latitud - 0.01}%2C${longitud + 0.01}%2C${
              latitud + 0.01
            }&layer=mapnik&marker=${latitud}%2C${longitud}`}
            loading="lazy"
          />
        ) : (
          <div className="alojamiento-map__placeholder">
            <span>🗺️</span>
            <p>Mapa no disponible</p>
          </div>
        )}
      </div>
      <a
        href={googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="alojamiento-map__directions"
      >
        Cómo desplazarse →
      </a>
    </div>
  );
};

const DetallesAlojamiento = () => {
  const [searchParams] = useSearchParams();
  const alojamientoId = searchParams.get("id");
  const [alojamiento, setAlojamiento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (!alojamientoId) {
        if (import.meta.env.DEV) {
          if (!mounted) return;
          setAlojamiento(normalizeAlojamiento(MOCK_ALOJAMIENTO));
          setError("");
          setLoading(false);
          return;
        }
        if (!mounted) return;
        setError("No se especificó un alojamiento.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      const data = await fetchAlojamientoById(alojamientoId);

      if (!mounted) return;

      if (!data) {
        setError("No se encontró el alojamiento solicitado.");
        setAlojamiento(null);
      } else {
        setAlojamiento(normalizeAlojamiento(data));
      }
      setLoading(false);
    };

    load();
    return () => {
      mounted = false;
    };
  }, [alojamientoId]);

  const carruselHotel = useMemo(
    () =>
      toCarouselItems(
        alojamiento?.imagenes_hotel?.length
          ? alojamiento.imagenes_hotel
          : alojamiento?.imagen_url
          ? [{ id: "main", imagen_url: alojamiento.imagen_url, titulo: alojamiento.titulo }]
          : [],
        "Hotel"
      ),
    [alojamiento]
  );

  const carruselHabitacion = useMemo(
    () => toCarouselItems(alojamiento?.imagenes_habitacion || [], "Habitación"),
    [alojamiento]
  );

  const carruselComida = useMemo(
    () => toCarouselItems(alojamiento?.imagenes_comida || [], "Gastronomía"),
    [alojamiento]
  );

  if (loading) {
    return (
      <main className="detalles-alojamiento-page">
        <div className="detalles-alojamiento-state">Cargando alojamiento...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="detalles-alojamiento-page">
        <div className="detalles-alojamiento-state">{error}</div>
      </main>
    );
  }

  if (!alojamiento) {
    return (
      <main className="detalles-alojamiento-page">
        <div className="detalles-alojamiento-state">
          No hay información disponible.
        </div>
      </main>
    );
  }

  const serviciosActivos = alojamiento.servicios_incluidos.filter(
    (s) => typeof s === "string" && s.trim().length > 0
  );

  return (
    <>
      <SEO
        title={alojamiento.titulo}
        description={(alojamiento.descripcion || alojamiento.texto_venta || "").slice(0, 160)}
        canonical={`/detalles-alojamiento?id=${alojamientoId}`}
        image={alojamiento.imagen_url || undefined}
      />

      <main className="detalles-alojamiento-page">
        <section className="alojamiento-hero">
          <div className="alojamiento-hero__info">
            <h1 className="alojamiento-hero__title">{alojamiento.titulo}</h1>
            <div className="alojamiento-hero__meta">
              {alojamiento.estrellas > 0 && (
                <span className="alojamiento-hero__stars">
                  {"⭐".repeat(alojamiento.estrellas)}
                </span>
              )}
              {alojamiento.categoria && (
                <span className="alojamiento-hero__badge">
                  {alojamiento.categoria}
                </span>
              )}
              {alojamiento.distancia_centro && (
                <span className="alojamiento-hero__distance">
                  📍 {alojamiento.distancia_centro}
                </span>
              )}
            </div>
          </div>
        </section>

        <Carousel3DSection
          items={carruselHotel}
          title="Galería del hotel"
          subtitle="Conoce cada rincón de tu próxima estadía"
        />

        <Carousel3DSection
          items={carruselHabitacion}
          title="Habitaciones"
          subtitle="Espacios diseñados para tu descanso"
        />

        <Carousel3DSection
          items={carruselComida}
          title="Gastronomía"
          subtitle="Sabores que harán memorable tu viaje"
        />

        <section className="alojamiento-info-grid">
          <div className="alojamiento-info-grid__main">
            <article className="alojamiento-card alojamiento-card--property">
              <h2 className="alojamiento-card__title">Sobre la propiedad</h2>
              {alojamiento.descripcion ? (
                <p className="alojamiento-card__description">
                  {alojamiento.descripcion}
                </p>
              ) : null}
              <p className="alojamiento-card__pitch">{alojamiento.texto_venta}</p>
              {alojamiento.direccion && (
                <p className="alojamiento-card__address">
                  📍 {alojamiento.direccion}
                </p>
              )}
            </article>

            <article className="alojamiento-card alojamiento-card--rooms">
              <h2 className="alojamiento-card__title">
                Tipos de habitaciones disponibles
              </h2>
              <ul className="alojamiento-card__list">
                {alojamiento.tipos_habitacion.map((tipo, idx) => (
                  <li key={idx} className="alojamiento-card__list-item">
                    <span>🛏️</span>
                    {typeof tipo === "string" ? tipo : tipo.nombre}
                  </li>
                ))}
              </ul>
            </article>

            <article className="alojamiento-card alojamiento-card--services">
              <h2 className="alojamiento-card__title">Servicios incluidos</h2>
              <ul className="alojamiento-card__services">
                {serviciosActivos.map((servicio, idx) => (
                  <li key={idx} className="alojamiento-card__service">
                    {servicio}
                  </li>
                ))}
              </ul>
              <MiniServiceCarousel items={serviciosActivos.slice(0, 3)} />
            </article>
          </div>

          <div className="alojamiento-info-grid__side">
            <article className="alojamiento-card alojamiento-card--tarifa">
              <h2 className="alojamiento-card__title">La tarifa incluye</h2>
              <ul className="alojamiento-card__list">
                {alojamiento.tarifa_incluye.map((item, idx) => (
                  <li key={idx} className="alojamiento-card__list-item">
                    <span>✓</span>
                    {typeof item === "string" ? item : item.item}
                  </li>
                ))}
              </ul>
            </article>

            <MapEmbed
              latitud={alojamiento.latitud}
              longitud={alojamiento.longitud}
              direccion={alojamiento.direccion}
              titulo={alojamiento.titulo}
            />

            <BookingCard alojamiento={alojamiento} user={user} />
          </div>
        </section>
      </main>
    </>
  );
};

export default DetallesAlojamiento;
