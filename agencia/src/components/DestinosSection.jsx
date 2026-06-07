import { useState, useEffect } from 'react';
import { FaWhatsappSquare } from 'react-icons/fa';
import DestinationCard from './DestinationCard';
import { fetchCategories, fetchProductsByCategory, supabase } from '../backend/supabase_client';
import { getSupabaseImageUrl } from '../utils/imageHelper';
import { useNavigate } from 'react-router-dom';
import '../styles/destination_card.css';

const ITEMS_POR_PAGINA = 4;

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
  const [pageNac, setPageNac] = useState(0);
  const [pageInt, setPageInt] = useState(0);

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

  const renderSeccion = (items, titulo, page, setPage) => {
    const esCarousel = items.length > ITEMS_POR_PAGINA;
    const totalPaginas = esCarousel ? Math.ceil(items.length / ITEMS_POR_PAGINA) : 1;
    const inicio = esCarousel ? page * ITEMS_POR_PAGINA : 0;
    const visibles = items.slice(inicio, inicio + ITEMS_POR_PAGINA);

    const onPrev = () => setPage((p) => (p - 1 + totalPaginas) % totalPaginas);
    const onNext = () => setPage((p) => (p + 1) % totalPaginas);

    return (
      <div className="destinos-section-wrapper">
        <h2 style={tituloStyle}>{titulo}</h2>

        <div className={esCarousel ? 'destinos-carousel-section' : undefined}>
          <div className={`destinos-grid${esCarousel ? ' destinos-grid--carousel' : ''}`}>
            {visibles.length > 0 ? visibles.map((dest) => (
              <DestinationCard
                key={dest.id}
                imagen={dest.imagen}
                imagenes={dest.imagenes}
                titulo={dest.titulo}
                precio={dest.precio}
                onClick={() => navigate(`/detalles?id=${dest.id}`)}
              />
            )) : (
              <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#666' }}>
                No hay {titulo.toLowerCase()} disponibles.
              </p>
            )}
          </div>

          {esCarousel && (
            <>
              <button
                type="button"
                className="carousel3d-indicator-row__arrow carousel3d-indicator-row__arrow--prev"
                onClick={onPrev}
                aria-label="Anterior"
              >‹</button>
              <button
                type="button"
                className="carousel3d-indicator-row__arrow carousel3d-indicator-row__arrow--next"
                onClick={onNext}
                aria-label="Siguiente"
              >›</button>

              <div className="carousel3d-indicators">
                <div className="carousel3d-indicator-row">
                  {Array.from({ length: totalPaginas }, (_, i) => (
                    <button
                      key={i}
                      type="button"
                      className={`carousel3d-indicator${i === page ? ' is-active' : ''}`}
                      onClick={() => setPage(i)}
                      aria-label={`Ir a página ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  if (cargando) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#666', fontSize: '1.1rem' }}>
        Cargando destinos...
      </div>
    );
  }

  return (
    <>
      {renderSeccion(nacionales, 'Destinos Nacionales', pageNac, setPageNac)}
      {renderSeccion(internacionales, 'Destinos Internacionales', pageInt, setPageInt)}

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

export default DestinosSection;
