import { useState, useEffect } from 'react';
import DestinationCard from './DestinationCard';
import { fetchCategories, fetchProductsByCategory, supabase } from '../backend/supabase_client';
import { getSupabaseImageUrl } from '../utils/imageHelper';
import { useNavigate } from 'react-router-dom';
import '../styles/destination_card.css';

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

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '24px',
  padding: '0 24px',
  maxWidth: '1300px',
  margin: '0 auto 60px',
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
                titulo: p.ubicacion || p.titulo,
                subtitulo: p.titulo,
                precio: p.precio,
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
      {/* ── Destinos Nacionales ── */}
      <h2 style={tituloStyle}>Destinos Nacionales</h2>
      <div style={gridStyle}>
        {nacionales.length > 0 ? nacionales.map(dest => (
          <DestinationCard
            key={dest.id}
            imagen={dest.imagen}
            imagenes={dest.imagenes}
            titulo={dest.titulo}
            subtitulo={dest.subtitulo}
            precio={dest.precio}
            onClick={() => navigate(`/detalles?id=${dest.id}`)}
          />
        )) : (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#666' }}>
            No hay destinos nacionales disponibles.
          </p>
        )}
      </div>

      {/* ── Destinos Internacionales ── */}
      <h2 style={tituloStyle}>Destinos Internacionales</h2>
      <div style={gridStyle}>
        {internacionales.length > 0 ? internacionales.map(dest => (
          <DestinationCard
            key={dest.id}
            imagen={dest.imagen}
            imagenes={dest.imagenes}
            titulo={dest.titulo}
            subtitulo={dest.subtitulo}
            precio={dest.precio}
            onClick={() => navigate(`/detalles?id=${dest.id}`)}
          />
        )) : (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#666' }}>
            No hay destinos internacionales disponibles.
          </p>
        )}
      </div>
    </>
  );
};

export default DestinosSection;
