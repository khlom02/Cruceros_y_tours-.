import "../styles/card-base.css";
import "../styles/destinoCard.css";

const CATEGORIA_LABELS = {
  "todo incluido": "Todo incluido",
  "solo alojamiento": "Solo alojamiento",
  "desayunos": "Desayunos",
  "media pension": "Media pensión",
};

const HABITACION_LABELS = {
  superior: "Superior",
  "primera calidad": "Primera calidad",
  "doble superior": "Doble superior",
  "doble premium": "Doble premium",
};

const HabitacionIcon = ({ tipo }) => {
  if (!tipo) return null;
  const label = HABITACION_LABELS[tipo] || tipo;
  return <span>🛏️ {label}</span>;
};

const Estrellas = ({ count }) => {
  if (!count) return null;
  const filled = "⭐".repeat(Math.min(count, 5));
  const empty = "☆".repeat(Math.max(0, 5 - count));
  return <span className="destino-card__stars">{filled}{empty}</span>;
};

const DestinoCard = ({ alojamiento, compact }) => {
  const {
    titulo,
    precio,
    imagen_url,
    estrellas,
    distancia_centro,
    categoria,
    tipo_habitacion,
    enlace_externo,
  } = alojamiento;

  const backgroundStyle = imagen_url
    ? { backgroundImage: `url(${imagen_url})` }
    : {};

  const handleVisitar = () => {
    if (enlace_externo) {
      window.open(enlace_externo, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <article className={`card card--destino${compact ? " card--destino--compact" : ""}`} style={backgroundStyle}>
      <div className="card--destino__overlay" />

      {precio != null && (
        <span className="card--destino__precio">
          ${Number(precio).toLocaleString()}
        </span>
      )}

      <div className="card--destino__body">
        <h3 className="card--destino__titulo">{titulo}</h3>

        <Estrellas count={estrellas} />

        {distancia_centro && (
          <p className="card--destino__distancia">📍 {distancia_centro}</p>
        )}

        {categoria && (
          <p className="card--destino__categoria">
            🏷️ {CATEGORIA_LABELS[categoria] || categoria}
          </p>
        )}

        {tipo_habitacion && (
          <p className="card--destino__habitacion">
            <HabitacionIcon tipo={tipo_habitacion} />
          </p>
        )}

        <button
          type="button"
          className="card--destino__btn"
          onClick={handleVisitar}
        >
          Visitar
        </button>
      </div>
    </article>
  );
};

export default DestinoCard;
