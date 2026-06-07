import { useState } from 'react';
import '../styles/destination_card.css';

const DestinationCard = ({
  imagen,
  imagenes = [],
  titulo,
  subtitulo = '',
  precio = null,
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

  return (
    <div
      className={`destination-card ${className}`}
      style={{ backgroundImage: allImages.length > 0 ? `url(${allImages[currentIndex]})` : 'none' }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="destination-card__overlay" />

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

      <div className="destination-card__content">
        <h3 className="destination-card__titulo">{titulo}</h3>
        {subtitulo && (
          <p className="destination-card__subtitulo">{subtitulo}</p>
        )}
        {precio !== null && (
          <p className="destination-card__precio">Desde USD {precio}</p>
        )}
      </div>
    </div>
  );
};

export default DestinationCard;
