import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { instagramToProduct } from '../utils/instagramToProduct';
import '../styles/destination_card.css';

/**
 * Card de Instagram que REUTILIZA exactamente las mismas clases visuales
 * que la card de la landing (destination-card / TourCard).
 * Solo cambia el contenido: imágenes, título y precio salen del post de IG.
 */
const InstagramCard = ({ post }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!post) return null;

  const imagenes = Array.isArray(post.media_urls) ? post.media_urls.filter(Boolean) : [];
  if (imagenes.length === 0) return null;

  const producto = instagramToProduct(post);
  if (!producto) return null;

  const hasMultiple = imagenes.length > 1;

  const goTo = (e, dir) => {
    e.stopPropagation();
    setCurrentIndex((prev) =>
      dir === 'next'
        ? (prev + 1) % imagenes.length
        : (prev - 1 + imagenes.length) % imagenes.length
    );
  };

  const abrirDetalle = () => navigate(`/detalles?id=${producto.id}`);

  const handleSeeClick = (e) => {
    e.stopPropagation();
    abrirDetalle();
  };

  return (
    <div
      className="destination-card"
      style={{ backgroundImage: `url(${imagenes[currentIndex]})` }}
      onClick={abrirDetalle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          abrirDetalle();
        }
      }}
    >
      <img
        className="destination-card__image"
        src={imagenes[currentIndex]}
        alt={producto.titulo || 'Publicación de Instagram'}
        loading="lazy"
      />

      <div className="destination-card__overlay" />

      {hasMultiple && (
        <>
          <button
            type="button"
            className="destination-card__arrow destination-card__arrow--left"
            onClick={(e) => goTo(e, 'prev')}
            aria-label="Imagen anterior"
          >
            ‹
          </button>
          <button
            type="button"
            className="destination-card__arrow destination-card__arrow--right"
            onClick={(e) => goTo(e, 'next')}
            aria-label="Siguiente imagen"
          >
            ›
          </button>
          <div className="destination-card__dots">
            {imagenes.map((_, i) => (
              <span
                key={i}
                className={`destination-card__dot${i === currentIndex ? ' destination-card__dot--active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(i);
                }}
              />
            ))}
          </div>
        </>
      )}

      <div className="destination-card__top">
        <h4 className="destination-card__titulo">{producto.titulo}</h4>
      </div>

      <div className="destination-card__ribbon">
        <div className="destination-card__price-area">
          <span className="destination-card__price-value">{producto.precio}</span>
        </div>

        <button type="button" className="destination-card__see-btn" onClick={handleSeeClick}>
          Ver
        </button>
      </div>
    </div>
  );
};

export default InstagramCard;
