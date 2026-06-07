import { useState } from 'react';
import { FaMapMarkerAlt, FaMoon, FaHiking } from 'react-icons/fa';
import '../styles/destination_card.css';

const BADGE_CLASSES = {
  exclusive: 'destination-card__badge--exclusive',
  package: 'destination-card__badge--package',
  recommended: 'destination-card__badge--recommended',
};

const DestinationCard = ({
  imagen,
  imagenes = [],
  titulo,
  precio = null,
  badge = null,
  badgeType = 'default',
  destinosCount = null,
  nightsCount = null,
  activityCount = null,
  onClick = null,
  className = '',
}) => {
  const allImages = [imagen, ...imagenes].filter(Boolean);

  const [currentIndex, setCurrentIndex] = useState(0);
  const hasMultiple = allImages.length > 1;

  const goTo = (e, dir) => {
    e.stopPropagation();
    setCurrentIndex((prev) => {
      if (dir === 'next') return (prev + 1) % allImages.length;
      return (prev - 1 + allImages.length) % allImages.length;
    });
  };

  const handleCardClick = () => {
    if (onClick) onClick();
  };

  const handleSeeClick = (e) => {
    e.stopPropagation();
    if (onClick) onClick();
  };

  return (
    <div
      className={`destination-card ${className}`}
      onClick={handleCardClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="destination-card__image-wrapper">
        <img
          className="destination-card__image"
          src={allImages[currentIndex] || ''}
          alt={titulo || 'Destino'}
          loading="lazy"
        />

        {hasMultiple && (
          <>
            <button
              className="destination-card__arrow destination-card__arrow--left"
              onClick={(e) => goTo(e, 'prev')}
              aria-label="Imagen anterior"
            >
              ‹
            </button>
            <button
              className="destination-card__arrow destination-card__arrow--right"
              onClick={(e) => goTo(e, 'next')}
              aria-label="Siguiente imagen"
            >
              ›
            </button>
            <div className="destination-card__dots">
              {allImages.map((_, i) => (
                <span
                  key={i}
                  className={`destination-card__dot${i === currentIndex ? ' destination-card__dot--active' : ''}`}
                  onClick={(e) => { e.stopPropagation(); setCurrentIndex(i); }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="destination-card__content">
        {badge && (
          <span className={`destination-card__badge ${BADGE_CLASSES[badgeType] || 'destination-card__badge--default'}`}>
            {badge}
          </span>
        )}

        <h3 className="destination-card__titulo">{titulo}</h3>

        {(destinosCount || nightsCount || activityCount) && (
          <div className="destination-card__stats">
            {destinosCount && (
              <span className="destination-card__stat">
                <FaMapMarkerAlt className="destination-card__stat-icon" />
                {destinosCount} {destinosCount === 1 ? 'Destino' : 'Destinos'}
              </span>
            )}
            {nightsCount && (
              <span className="destination-card__stat">
                <FaMoon className="destination-card__stat-icon" />
                {nightsCount} {nightsCount === 1 ? 'Noche' : 'Noches'}
              </span>
            )}
            {activityCount && (
              <span className="destination-card__stat">
                <FaHiking className="destination-card__stat-icon" />
                {activityCount} {activityCount === 1 ? 'Actividad' : 'Actividades'}
              </span>
            )}
          </div>
        )}

        {precio !== null && (
          <div className="destination-card__price-area">
            <span className="destination-card__price-from">Desde</span>
            <span className="destination-card__price-value">US${precio}</span>
            <span className="destination-card__price-label">Precio Total</span>
          </div>
        )}

        <button
          type="button"
          className="destination-card__see-btn"
          onClick={handleSeeClick}
        >
          Ver
        </button>
      </div>
    </div>
  );
};

export default DestinationCard;
