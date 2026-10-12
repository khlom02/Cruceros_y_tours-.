import { useEffect, useRef } from 'react';
import '../styles/banner_carrusel.css';
import { getSupabaseImageUrl } from '../utils/imageHelper';

const BANNER_IMAGE = getSupabaseImageUrl(
  'https://krpdacuthwpoyuccbihf.supabase.co/storage/v1/object/public/content%20media/WhatsApp%20Image%202026-10-12%20at%202.37.44%20PM.jpeg'
);

const SLIDES = [
  { id: 1, image: BANNER_IMAGE, alt: 'Crucero navegando en alta mar' },
  { id: 2, image: BANNER_IMAGE, alt: 'Crucero navegando en alta mar' },
  { id: 3, image: BANNER_IMAGE, alt: 'Crucero navegando en alta mar' },
  { id: 4, image: BANNER_IMAGE, alt: 'Crucero navegando en alta mar' },
  { id: 5, image: BANNER_IMAGE, alt: 'Crucero navegando en alta mar' },
  { id: 6, image: BANNER_IMAGE, alt: 'Crucero navegando en alta mar' },
];

const WHATSAPP_URL =
  'https://wa.me/584142783669?text=Hola,%20quiero%20información%20sobre%20un%20viaje';

const BannerCarrusel = () => {
  const carouselRef = useRef(null);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el || !window.bootstrap?.Carousel) return undefined;
    const instance = window.bootstrap.Carousel.getOrCreateInstance(el, {
      interval: 5000,
      ride: 'carousel',
      pause: 'hover',
      wrap: true,
      touch: true,
      keyboard: true,
    });
    return () => instance.dispose();
  }, []);

  return (
    <>
      <header className="banner_carrusel">
        <div
          id="bannerCarrusel"
          ref={carouselRef}
          className="carousel slide carousel-fade banner_carrusel__track"
        >
          <div className="carousel-indicators banner_carrusel__dots">
            {SLIDES.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                data-bs-target="#bannerCarrusel"
                data-bs-slide-to={index}
                className={index === 0 ? 'active' : ''}
                aria-current={index === 0 ? 'true' : undefined}
                aria-label={`Ir al slide ${index + 1}`}
              />
            ))}
          </div>

          <div className="carousel-inner">
            {SLIDES.map((slide, index) => (
              <div
                key={slide.id}
                className={`carousel-item${index === 0 ? ' active' : ''}`}
              >
                <img
                  src={slide.image}
                  alt={slide.alt}
                  className="banner_carrusel__img"
                  width="1600"
                  height="800"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  fetchPriority={index === 0 ? 'high' : 'low'}
                />
              </div>
            ))}
          </div>

          <button
            className="carousel-control-prev banner_carrusel__nav banner_carrusel__nav--prev"
            type="button"
            data-bs-target="#bannerCarrusel"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true" />
            <span className="visually-hidden">Anterior</span>
          </button>
          <button
            className="carousel-control-next banner_carrusel__nav banner_carrusel__nav--next"
            type="button"
            data-bs-target="#bannerCarrusel"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true" />
            <span className="visually-hidden">Siguiente</span>
          </button>
        </div>
      </header>

      <div className="banner_carrusel__wave">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          focusable="false"
        >
          <path
            className="banner_carrusel__wave-white"
            d="M0,56L48,50.7C96,45,192,35,288,40C384,45,480,67,576,72C672,77,768,67,864,56C960,45,1056,35,1152,40C1248,45,1344,67,1392,77.3L1440,88L1440,120L0,120Z"
          />
          <path
            className="banner_carrusel__wave-navy"
            transform="translate(0 16)"
            d="M0,56L48,50.7C96,45,192,35,288,40C384,45,480,67,576,72C672,77,768,67,864,56C960,45,1056,35,1152,40C1248,45,1344,67,1392,77.3L1440,88L1440,-40L0,-40Z"
          />
          <path
            className="banner_carrusel__wave-turquoise"
            d="M0,56L48,50.7C96,45,192,35,288,40C384,45,480,67,576,72C672,77,768,67,864,56C960,45,1056,35,1152,40C1248,45,1344,67,1392,77.3L1440,88L1440,0L0,0Z"
          />
        </svg>
      </div>

      <div className="banner_carrusel__cta">
        <a
          className="banner_carrusel__btn"
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Chatea con nosotros
        </a>
      </div>
    </>
  );
};

export default BannerCarrusel;
