import { useState, useEffect, useRef, useCallback } from 'react';
import TourCard from './TourCard';
import { ProductCard } from './CardGrid';
import useInstagramPosts from '../hooks/useInstagramPosts';
import { fetchCategories, fetchProductsByCategory, supabase } from '../backend/supabase_client';
import { getSupabaseImageUrl } from '../utils/imageHelper';
import { useNavigate } from 'react-router-dom';
import '../styles/destination_card.css';

const AUTOPLAY_DELAY = 7000;

const tituloStyle = {
  textAlign: 'center',
  fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
  color: '#023e8a',
  fontWeight: '700',
  marginBottom: '30px',
  marginTop: '40px',
  letterSpacing: '-0.5px',
  fontFamily: "'Photogenic', serif"
};

let categoriasCache = null;

const cargarProductosDeCategoria = async (nombreCategoria) => {
  if (!categoriasCache) {
    categoriasCache = await fetchCategories();
  }
  const categoria = categoriasCache.find((c) => c.nombre.toLowerCase() === nombreCategoria);
  if (!categoria) return [];

  const productos = await fetchProductsByCategory(categoria.id);

  const cargarGaleria = async (productoId) => {
    const { data } = await supabase
      .from('galleries')
      .select('imagen_url')
      .eq('producto_id', productoId)
      .order('posicion_orden', { ascending: true });
    return (data || []).map((g) => g.imagen_url).filter(Boolean);
  };

  return Promise.all(
    productos.map(async (p) => {
      const galeria = await cargarGaleria(p.id);
      return {
        id: p.id,
        imagen: p.imagen ? getSupabaseImageUrl(p.imagen) : getSupabaseImageUrl('imagenes/default.jpg'),
        imagenes: galeria.map((url) => getSupabaseImageUrl(url)),
        titulo: p.titulo,
        ubicacion: p.ubicacion,
        precio: p.precio,
        descripcion: p.descripcion,
      };
    })
  );
};

const useRespaldoDestinos = (postsNormalizados, cargando, nombreCategoria) => {
  const [respaldo, setRespaldo] = useState(null);

  useEffect(() => {
    if (cargando || (postsNormalizados?.length > 0)) return undefined;

    let cancelled = false;
    cargarProductosDeCategoria(nombreCategoria)
      .then((datos) => {
        if (!cancelled) setRespaldo(datos);
      })
      .catch((err) => {
        console.error(`Error al cargar ${nombreCategoria}:`, err);
        if (!cancelled) setRespaldo([]);
      });

    return () => {
      cancelled = true;
    };
  }, [cargando, postsNormalizados?.length, nombreCategoria]);

  return respaldo;
};

const DestinosSection = () => {
  const navigate = useNavigate();
  const igNac = useInstagramPosts('destinosnacionales');
  const igInt = useInstagramPosts('destinosinternacionales');
  const respaldoNac = useRespaldoDestinos(igNac.postsNormalizados, igNac.cargando, 'destinos nacionales');
  const respaldoInt = useRespaldoDestinos(igInt.postsNormalizados, igInt.cargando, 'destinos internacionales');

  // Usar posts normalizados (formato producto) para Instagram, fallback a BD
  const itemsNac = igNac.postsNormalizados.length > 0 ? igNac.postsNormalizados : (respaldoNac || []);
  const itemsInt = igInt.postsNormalizados.length > 0 ? igInt.postsNormalizados : (respaldoInt || []);
  const cargando =
    igNac.cargando ||
    igInt.cargando ||
    (igNac.postsNormalizados.length === 0 && respaldoNac === null) ||
    (igInt.postsNormalizados.length === 0 && respaldoInt === null);

  if (cargando) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#666', fontSize: '1.1rem' }}>
        Cargando destinos...
      </div>
    );
  }

  return (
    <>
      <div style={{ marginTop: 'clamp(2rem, 4vw, 3rem)' }}>
        <DestinosCarousel
          items={itemsNac}
          titulo="Destinos Nacionales"
          navigate={navigate}
        />
      </div>
      <div style={{ marginTop: 'clamp(2rem, 4vw, 3rem)' }}>
        <DestinosCarousel
          items={itemsInt}
          titulo="Destinos Internacionales"
          navigate={navigate}
        />
      </div>

      <a
        href={`https://wa.me/584142783669?text=${encodeURIComponent('Hola, quiero información sobre los destinos')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        aria-label="Contactar por WhatsApp"
      >
        <i className="bi bi-whatsapp" aria-hidden="true"></i>
      </a>
    </>
  );
};

const getSlidesPerView = () => {
  const w = window.innerWidth;
  if (w <= 600) return 1;
  if (w <= 900) return 2;
  if (w <= 1200) return 3;
  return 4;
};

const DestinosCarousel = ({ items, titulo, navigate }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(getSlidesPerView);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const autoplayRef = useRef(null);
  const containerRef = useRef(null);
  const currentSlideRef = useRef(currentSlide);

  useEffect(() => {
    currentSlideRef.current = currentSlide;
  }, [currentSlide]);

  const totalSlides = items.length;
  const isLoop = totalSlides > slidesPerView;
  const maxSlide = Math.max(0, totalSlides - slidesPerView);
  const slideWidth = containerWidth / slidesPerView;

  useEffect(() => {
    const updateDimensions = () => {
      setSlidesPerView(getSlidesPerView());
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const goNext = useCallback(() => {
    if (isLoop) {
      if (currentSlideRef.current >= maxSlide) {
        setIsResetting(true);
        setCurrentSlide(0);
        requestAnimationFrame(() => requestAnimationFrame(() => setIsResetting(false)));
      } else {
        setCurrentSlide((prev) => prev + 1);
      }
    } else {
      setCurrentSlide((prev) => Math.min(prev + 1, Math.max(0, totalSlides - slidesPerView)));
    }
  }, [isLoop, totalSlides, slidesPerView, maxSlide]);

  const goPrev = useCallback(() => {
    if (isLoop) {
      if (currentSlideRef.current <= 0) {
        setIsResetting(true);
        setCurrentSlide(maxSlide);
        requestAnimationFrame(() => requestAnimationFrame(() => setIsResetting(false)));
      } else {
        setCurrentSlide((prev) => prev - 1);
      }
    } else {
      setCurrentSlide((prev) => Math.max(prev - 1, 0));
    }
  }, [isLoop, maxSlide]);

  useEffect(() => {
    if (isHovered || !isLoop) return;

    autoplayRef.current = setInterval(goNext, AUTOPLAY_DELAY);

    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [isHovered, isLoop, goNext]);

  const translateX = -currentSlide * slideWidth;

  const visibleBullets = isLoop ? maxSlide + 1 : Math.max(1, maxSlide + 1);
  const currentBullet = Math.min(currentSlide, maxSlide);

  const handleBulletClick = (index) => {
    if (isLoop) {
      setCurrentSlide(Math.min(index, maxSlide));
    } else {
      setCurrentSlide(Math.min(index, maxSlide));
    }
  };

  return (
    <div className="destinos-section-wrapper">
      <h2 style={tituloStyle}>{titulo}</h2>

      {items.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666' }}>
          No hay {titulo.toLowerCase()} disponibles.
        </p>
      ) : (
        <div
          className="destinos-carousel"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="destinos-carousel__viewport" ref={containerRef}>
            <div
              className={`destinos-carousel__track${isResetting ? ' destinos-carousel__track--resetting' : ''}`}
              style={{ transform: `translateX(${translateX}px)` }}
            >
              {items.map((dest) => (
                <div
                  key={dest.id}
                  className="destinos-carousel__slide"
                  style={{ flex: `0 0 ${100 / slidesPerView}%` }}
                >
                  {dest.esInstagram ? (
                    <ProductCard
                      imagen={dest.imagen}
                      titulo={dest.titulo}
                      ubicacion={dest.ubicacion}
                      fechaInicio={dest.fechaInicio}
                      fechaFin={dest.fechaFin}
                      precio={dest.precio}
                      colorFondo={dest.colorFondo}
                      onClick={() => navigate(`/detalles?id=${dest.id}`)}
                    />
                  ) : (
                    <TourCard
                      imagen={dest.imagen}
                      imagenes={dest.imagenes}
                      titulo={dest.titulo}
                      precio={dest.precio}
                      onClick={() => navigate(`/detalles?id=${dest.id}`)}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {(isLoop || totalSlides > slidesPerView) && (
            <>
              <button
                type="button"
                className="destinos-carousel__arrow destinos-carousel__arrow--prev"
                onClick={goPrev}
                aria-label="Anterior"
              >‹</button>
              <button
                type="button"
                className="destinos-carousel__arrow destinos-carousel__arrow--next"
                onClick={goNext}
                aria-label="Siguiente"
              >›</button>

              <div className="destinos-carousel__pagination">
                {Array.from({ length: visibleBullets }, (_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`destinos-carousel__bullet${i === currentBullet ? ' destinos-carousel__bullet--active' : ''}`}
                    onClick={() => handleBulletClick(i)}
                    aria-label={`Ir a página ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default DestinosSection;