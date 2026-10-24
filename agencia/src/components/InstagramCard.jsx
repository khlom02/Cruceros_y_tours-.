import { useState } from 'react';

const WHATSAPP_NUMERO = '584142783669';

const InstagramCard = ({ post }) => {
  const [indice, setIndice] = useState(0);

  if (!post) return null;

  const imagenes = Array.isArray(post.media_urls) ? post.media_urls.filter(Boolean) : [];
  if (imagenes.length === 0) return null;
  const total = imagenes.length;
  const esCarrusel = post.media_type === 'CAROUSEL_ALBUM' && total > 1;
  const texto = (post.caption || '').trim();

  const abrirWhatsApp = () => {
    const mensaje = texto
      ? `Hola, vi su publicación de Instagram y me interesa: ${texto.slice(0, 120)}`
      : 'Hola, vi su publicación de Instagram y quiero más información.';
    window.open(
      `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`,
      '_blank',
      'noopener'
    );
  };

  const manejarTeclado = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      abrirWhatsApp();
    }
  };

  const cambiarImagen = (e, desplazamiento) => {
    e.stopPropagation();
    setIndice((prev) => (prev + desplazamiento + total) % total);
  };

  return (
    <article
      className="instagram-card"
      role="link"
      tabIndex={0}
      onClick={abrirWhatsApp}
      onKeyDown={manejarTeclado}
      aria-label={texto ? `Publicación de Instagram: ${texto.slice(0, 80)}` : 'Publicación de Instagram'}
      style={{
        minHeight: 'var(--card-hero-min-height)',
        borderRadius: 'var(--card-hero-radius)',
        boxShadow: 'var(--card-shadow)',
        height: '100%',
      }}
    >
      <div className="instagram-card__media">
        {total > 0 && (
          <img
            className="instagram-card__img"
            src={imagenes[indice]}
            alt={texto.slice(0, 80) || 'Publicación de Instagram'}
            loading="lazy"
            decoding="async"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        )}
        {esCarrusel && (
          <>
            <button
              type="button"
              className="instagram-card__nav instagram-card__nav--prev"
              aria-label="Imagen anterior"
              onClick={(e) => cambiarImagen(e, -1)}
            >
              ‹
            </button>
            <button
              type="button"
              className="instagram-card__nav instagram-card__nav--next"
              aria-label="Imagen siguiente"
              onClick={(e) => cambiarImagen(e, 1)}
            >
              ›
            </button>
            <div className="instagram-card__dots" aria-hidden="true">
              {imagenes.map((_, i) => (
                <span
                  key={i}
                  className={`instagram-card__dot${i === indice ? ' instagram-card__dot--active' : ''}`}
                />
              ))}
            </div>
          </>
        )}
        {post.media_type === 'VIDEO' && (
          <span className="instagram-card__video" aria-hidden="true">
            ▶
          </span>
        )}
      </div>
      {texto && <p className="instagram-card__caption" style={{ fontSize: 'clamp(0.75rem, 3vw, 1rem)' }}>{texto}</p>}
    </article>
  );
};

export default InstagramCard;
