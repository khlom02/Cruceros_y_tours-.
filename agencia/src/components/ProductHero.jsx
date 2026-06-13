import { useState, useEffect } from "react";
import "../styles/productHero.css";

const ProductHero = ({ detalle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const gallery = detalle.gallery || [];
  const showAsFeatured = gallery.length >= 3;
  const visibleImages = gallery.slice(0, 5);
  const remaining = gallery.length - 5;

  const open = (index) => { setCurrentIndex(index); setIsOpen(true); };
  const close = () => setIsOpen(false);
  const next = () => setCurrentIndex((p) => (p + 1) % gallery.length);
  const prev = () => setCurrentIndex((p) => (p - 1 + gallery.length) % gallery.length);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === "Escape") setIsOpen(false);
      if (e.key === "ArrowRight") setCurrentIndex((p) => (p + 1) % gallery.length);
      if (e.key === "ArrowLeft") setCurrentIndex((p) => (p - 1 + gallery.length) % gallery.length);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, gallery.length]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (gallery.length === 0) return null;

  return (
    <>
      <section className="product-hero">
        <div className={`product-hero__gallery ${showAsFeatured ? "product-hero__gallery--featured" : ""}`}>
          {visibleImages.map((img, i) => (
            <button
              key={i}
              className={`product-hero__thumb ${i === 0 && showAsFeatured ? "product-hero__thumb--featured" : ""}`}
              onClick={() => open(i)}
              type="button"
              aria-label={`Ver imagen ${i + 1} de ${gallery.length}`}
            >
              <img src={img} alt={`${detalle.title} ${i + 1}`} loading={i === 0 ? "eager" : "lazy"} />
              {i === visibleImages.length - 1 && remaining > 0 && (
                <span className="product-hero__badge">+{remaining}</span>
              )}
            </button>
          ))}
        </div>

        <div className="product-hero__info">
          <div className="product-hero__meta">
            {detalle.location && <span className="product-hero__location">{detalle.location}</span>}
            {detalle.rating != null && (
              <span className="product-hero__rating">
                ★ {detalle.rating}
                {detalle.reviews ? ` (${detalle.reviews} reseñas)` : ""}
              </span>
            )}
          </div>
          <h1 className="product-hero__title">{detalle.title}</h1>
        </div>
      </section>

      {isOpen && (
        <div className="lightbox" onClick={close} role="dialog" aria-modal="true" aria-label="Galería de imágenes">
          <div className="lightbox__content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox__close" onClick={close} aria-label="Cerrar">×</button>
            {gallery.length > 1 && (
              <>
                <button className="lightbox__nav lightbox__nav--prev" onClick={prev} aria-label="Anterior">‹</button>
                <button className="lightbox__nav lightbox__nav--next" onClick={next} aria-label="Siguiente">›</button>
              </>
            )}
            <img className="lightbox__image" src={gallery[currentIndex]} alt={`${detalle.title} ${currentIndex + 1}`} />
            <div className="lightbox__counter">{currentIndex + 1} / {gallery.length}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductHero;
