import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { instagramToDetail } from '../utils/instagramToProduct';
import ProductCard from './CardGrid';
import '../styles/instagramDetailView.css';

const WHATSAPP_NUMERO = '584142783669';

const InstagramDetailView = ({ post }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [indiceImagen, setIndiceImagen] = useState(0);
  const [detalle, setDetalle] = useState(null);
  const [postsRelacionados, setPostsRelacionados] = useState([]);
  const [cargandoRelacionados, setCargandoRelacionados] = useState(false);

  // Normalizar el post recibido (viene crudo de la URL o props)
  useEffect(() => {
    if (post) {
      setDetalle(instagramToDetail(post));
    }
  }, [post]);

  // Cargar posts relacionados de la misma sección (primer hashtag geográfico)
  useEffect(() => {
    if (!detalle) return;

    const primerHashtagGeo = detalle.hashtags?.find(h => {
      const n = h.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      return n.length > 3 && !['cruceros', 'crucerosytours', 'viajes', 'vacaciones', 'oferta', 'descuento', 'instagram', 'reel'].includes(n);
    });

    if (!primerHashtagGeo) return;

    let cancelado = false;
    setCargandoRelacionados(true);

    fetch(`/api/instagram?seccion=${encodeURIComponent(primerHashtagGeo)}`)
      .then(res => res.json())
      .then(cuerpo => {
        if (cancelado) return;
        const relacionados = (cuerpo.posts || [])
          .filter(p => p.id !== detalle.id)
          .slice(0, 3)
          .map(instagramToDetail)
          .filter(Boolean);
        setPostsRelacionados(relacionados);
      })
      .catch(console.error)
      .finally(() => {
        if (!cancelado) setCargandoRelacionados(false);
      });

    return () => { cancelado = true; };
  }, [detalle]);

  const abrirWhatsApp = useCallback(() => {
    const texto = detalle?.caption
      ? `Hola, vi su publicación de Instagram y me interesa: ${detalle.caption.slice(0, 120)}`
      : 'Hola, vi su publicación de Instagram y quiero más información.';
    window.open(
      `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(texto)}`,
      '_blank',
      'noopener'
    );
  }, [detalle]);

  const abrirInstagram = useCallback(() => {
    if (detalle?.permalink) {
      window.open(detalle.permalink, '_blank', 'noopener');
    }
  }, [detalle]);

  const cambiarImagen = (desplazamiento) => {
    if (!detalle?.gallery?.length) return;
    setIndiceImagen(prev => (prev + desplazamiento + detalle.gallery.length) % detalle.gallery.length);
  };

  const manejarTeclado = (e) => {
    if (e.key === 'ArrowLeft') cambiarImagen(-1);
    if (e.key === 'ArrowRight') cambiarImagen(1);
  };

  useEffect(() => {
    window.addEventListener('keydown', manejarTeclado);
    return () => window.removeEventListener('keydown', manejarTeclado);
  }, []);

  if (!detalle) {
    return (
      <div className="instagram-detail-view">
        <div className="instagram-detail__loading">Cargando...</div>
      </div>
    );
  }

  const { gallery = [], titulo, ubicacion, hashtags = [], highlights = [], permalink, mediaType, postedAt, caption } = detalle;
  const totalImagenes = gallery.length;
  const esCarrusel = mediaType === 'CAROUSEL_ALBUM' && totalImagenes > 1;
  const esVideo = mediaType === 'VIDEO';

  return (
    <div className="instagram-detail-view">
      {/* Hero Carousel */}
      <section className="instagram-detail__hero" role="region" aria-label="Galería de imágenes">
        {totalImagenes > 0 && (
          <div className="instagram-detail__carousel">
            <img
              className="instagram-detail__img"
              src={gallery[indiceImagen]}
              alt={`${titulo} - Imagen ${indiceImagen + 1} de ${totalImagenes}`}
              loading={indiceImagen === 0 ? 'eager' : 'lazy'}
              decoding="async"
            />
            {totalImagenes > 1 && (
              <>
                <button
                  type="button"
                  className="instagram-detail__nav instagram-detail__nav--prev"
                  aria-label="Imagen anterior"
                  onClick={() => cambiarImagen(-1)}
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="instagram-detail__nav instagram-detail__nav--next"
                  aria-label="Imagen siguiente"
                  onClick={() => cambiarImagen(1)}
                >
                  ›
                </button>
                <div className="instagram-detail__dots" aria-hidden="true">
                  {gallery.map((_, i) => (
                    <span
                      key={i}
                      className={`instagram-detail__dot${i === indiceImagen ? ' instagram-detail__dot--active' : ''}`}
                      onClick={() => setIndiceImagen(i)}
                    />
                  ))}
                </div>
              </>
            )}
            {esVideo && (
              <span className="instagram-detail__video-badge" aria-hidden="true">
                ▶ Video
              </span>
            )}
          </div>
        )}
        {totalImagenes > 1 && (
          <div className="instagram-detail__counter" aria-hidden="true">
            {indiceImagen + 1} / {totalImagenes}
          </div>
        )}
      </section>

      {/* Info Principal */}
      <section className="instagram-detail__info">
        <header className="instagram-detail__header">
          <h1 className="instagram-detail__titulo">{titulo}</h1>
          <div className="instagram-detail__meta">
            <span className="instagram-detail__ubicacion">
              <svg className="icono-ubicacion" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {ubicacion}
            </span>
            {postedAt && (
              <time className="instagram-detail__fecha" dateTime={postedAt}>
                {new Date(postedAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
              </time>
            )}
          </div>
          {hashtags.length > 0 && (
            <div className="instagram-detail__hashtags" aria-label="Hashtags">
              {hashtags.slice(0, 8).map((tag, i) => (
                <span key={i} className="instagram-detail__hashtag">#{tag}</span>
              ))}
            </div>
          )}
        </header>

        {highlights.length > 0 && (
          <div className="instagram-detail__highlights" aria-label="Destacados">
            {highlights.map((h, i) => (
              <div key={i} className="instagram-detail__highlight">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="highlight-icon">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>{h}</span>
              </div>
            ))}
          </div>
        )}

        {caption && (
          <div className="instagram-detail__caption">
            <p>{caption.replace(/\n/g, '<br />')}</p>
          </div>
        )}
      </section>

      {/* CTA Bar - Sticky en mobile */}
      <div className="instagram-detail__cta-bar">
        <button
          type="button"
          className="instagram-detail__btn instagram-detail__btn--whatsapp"
          onClick={abrirWhatsApp}
          aria-label="Contactar por WhatsApp"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="btn-icon">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.472.099-.174.05-.369-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.378-.01-.57-.01-.184 0-.36.008-.53.01-.183.009-.52.199-.96.688-1.774 1.74-2.008 1.975-1.986 2.322-.004.163-.01.336-.01.51 0 .174.09.448.199.657.098.198.848 1.46 1.483 3.22.634 1.765 1.218 3.37 1.435 3.985.204.586.245.875.136 1.115-.09.184-.262.243-.57.198-.338-.05-1.456-.68-4.578-2.765z"/>
          </svg>
          <span>WhatsApp</span>
        </button>
        <a
          href={permalink}
          target="_blank"
          rel="noopener noreferrer"
          className="instagram-detail__btn instagram-detail__btn--instagram"
          aria-label="Ver en Instagram"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="btn-icon">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
          <span>Ver en Instagram</span>
        </a>
      </div>

      {/* Posts Relacionados */}
      {postsRelacionados.length > 0 && (
        <section className="instagram-detail__related" aria-label="Publicaciones relacionadas">
          <h2 className="instagram-detail__related-title">Más experiencias similares</h2>
          <div className="instagram-detail__related-grid">
            {postsRelacionados.map((p) => (
              <ProductCard
                key={p.id}
                imagen={p.imagen}
                titulo={p.titulo}
                ubicacion={p.ubicacion}
                fechaInicio={p.fechaInicio}
                fechaFin={p.fechaFin}
                precio={p.precio}
                colorFondo={p.colorFondo}
                onClick={() => navigate(`/detalles?id=${p.id}`)}
              />
            ))}
          </div>
        </section>
      )}

      <style jsx>{`
        .instagram-detail__caption p {
          white-space: pre-wrap;
          line-height: 1.7;
        }
      `}</style>
    </div>
  );
};

export default InstagramDetailView;