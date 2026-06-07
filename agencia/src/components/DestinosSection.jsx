import { useState, useEffect, useRef, useCallback } from 'react';
import { FaWhatsappSquare } from 'react-icons/fa';
import DestinationCard from './DestinationCard';
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

const DestinosSection = () => {
  const navigate = useNavigate();
  const [nacionales, setNacionales] = useState([]);
  const [internacionales, setInternacionales] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const cargar = async () => {
      try {
        setCargando(true);
        const categorias = await fetchCategories();

        if (cancelled) return;

        const catNac = categorias.find(c => c.nombre.toLowerCase() === 'destinos nacionales');
        const catInt = categorias.find(c => c.nombre.toLowerCase() === 'destinos internacionales');

        const [productosNac, productosInt] = await Promise.all([
          catNac ? fetchProductsByCategory(catNac.id) : Promise.resolve([]),
          catInt ? fetchProductsByCategory(catInt.id) : Promise.resolve([]),
        ]);

        if (cancelled) return;

        const cargarGaleria = async (productoId) => {
          const { data } = await supabase
            .from('galleries')
            .select('imagen_url')
            .eq('producto_id', productoId)
            .order('posicion_orden', { ascending: true });
          return (data || []).map(g => g.imagen_url).filter(Boolean);
        };

        const mapear = async (productos) => {
          const results = await Promise.all(
            productos.map(async (p) => {
              const galeria = await cargarGaleria(p.id);
              const imagenes = galeria.map(url => getSupabaseImageUrl(url));
              return {
                id: p.id,
                imagen: p.imagen ? getSupabaseImageUrl(p.imagen) : getSupabaseImageUrl('imagenes/default.jpg'),
                imagenes,
                titulo: p.titulo,
                ubicacion: p.ubicacion,
                precio: p.precio,
                descripcion: p.descripcion,
              };
            })
          );
          return results;
        };

        setNacionales(await mapear(productosNac));
        setInternacionales(await mapear(productosInt));
      } catch (err) {
        console.error('Error al cargar destinos:', err);
      } finally {
        if (!cancelled) setCargando(false);
      }
    };

    cargar();
    return () => { cancelled = true; };
  }, []);

  if (cargando) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#666', fontSize: '1.1rem' }}>
        Cargando destinos...
      </div>
    );
  }

  return (
    <>
      <DestinosCarousel
        items={nacionales}
        titulo="Destinos Nacionales"
        navigate={navigate}
      />
      <DestinosCarousel
        items={internacionales}
        titulo="Destinos Internacionales"
        navigate={navigate}
      />

      <a
        href={`https://wa.me/584142783669?text=${encodeURIComponent('Hola, quiero información sobre los destinos')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        aria-label="Contactar por WhatsApp"
      >
        <FaWhatsappSquare size={30} />
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
  const autoplayRef = useRef(null);
  const containerRef = useRef(null);

  const totalSlides = items.length;
  const isLoop = totalSlides > slidesPerView;
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
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    } else {
      setCurrentSlide((prev) => Math.min(prev + 1, Math.max(0, totalSlides - slidesPerView)));
    }
  }, [isLoop, totalSlides, slidesPerView]);

  const goPrev = useCallback(() => {
    if (isLoop) {
      setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    } else {
      setCurrentSlide((prev) => Math.max(prev - 1, 0));
    }
  }, [isLoop, totalSlides]);

  useEffect(() => {
    if (isHovered || !isLoop) return;

    autoplayRef.current = setInterval(goNext, AUTOPLAY_DELAY);

    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [isHovered, isLoop, goNext]);

  const translateX = -currentSlide * slideWidth;

  const visibleBullets = isLoop ? totalSlides : Math.max(1, totalSlides - slidesPerView + 1);
  const currentBullet = isLoop
    ? currentSlide % totalSlides
    : Math.min(currentSlide, visibleBullets - 1);

  const handleBulletClick = (index) => {
    if (isLoop) {
      setCurrentSlide(index % totalSlides);
    } else {
      setCurrentSlide(Math.min(index, totalSlides - slidesPerView));
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
              className="destinos-carousel__track"
              style={{ transform: `translateX(${translateX}px)` }}
            >
              {items.map((dest) => (
                <div
                  key={dest.id}
                  className="destinos-carousel__slide"
                  style={{ flex: `0 0 ${100 / slidesPerView}%` }}
                >
                  <DestinationCard
                    imagen={dest.imagen}
                    imagenes={dest.imagenes}
                    titulo={dest.titulo}
                    precio={dest.precio}
                    onClick={() => navigate(`/detalles?id=${dest.id}`)}
                  />
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
