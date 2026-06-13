import "../styles/infoSection.css";
import DetallesNavieras from "./detalles_navieras.jsx";

const InfoSection = ({ detalle, detalleTipo, isSpecialService }) => {
  const hasHighlights = detalle.highlights && detalle.highlights.length > 0;
  const hasAmenities = detalle.amenities && detalle.amenities.length > 0;
  const hasDescription = !!detalle.description;
  const hasServiceInfo = isSpecialService && detalle.serviceInfo && detalle.serviceInfo.length > 0;

  const isEmpty = !hasHighlights && !hasAmenities && !hasDescription && !hasServiceInfo && detalleTipo !== "crucero";

  if (isEmpty) return null;

  return (
    <section id="seccion-info" className="info-section">
      <h2 className="info-section__title">Información del paquete</h2>

      <div className="info-section__grid">
        {hasHighlights && (
          <div className="info-section__card">
            <h3 className="info-section__card-title">Destacados</h3>
            <ul className="info-section__list">
              {detalle.highlights.map((item, i) => (
                <li key={i} className="info-section__list-item">
                  <span className="info-section__check">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {hasAmenities && (
          <div className="info-section__card">
            <h3 className="info-section__card-title">Servicios incluidos</h3>
            <ul className="info-section__list">
              {detalle.amenities.map((item, i) => (
                <li key={i} className="info-section__list-item">
                  <span className="info-section__dot">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {hasServiceInfo && (
          <div className="info-section__card">
            <h3 className="info-section__card-title">Información del servicio</h3>
            <ul className="info-section__list">
              {detalle.serviceInfo.map((item, i) => (
                <li key={i} className="info-section__list-item">
                  <span className="info-section__dot">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {detalleTipo === "crucero" && (
        <div className="info-section__naviera">
          <DetallesNavieras
            anosServicio={detalle.anosServicio}
            pasajerosMax={detalle.pasajerosMax}
            tripulantes={detalle.tripulantes}
            ratioEspacio={detalle.ratioEspacio}
            ratioServicio={detalle.ratioServicio}
            cabinaSingle={detalle.cabinaSingle}
            viajandoConNinos={detalle.viajandoConNinos}
          />
        </div>
      )}

      {hasDescription && (
        <div className="info-section__desc">
          <p>{detalle.description}</p>
        </div>
      )}
    </section>
  );
};

export default InfoSection;
