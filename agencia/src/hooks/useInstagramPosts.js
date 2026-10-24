import { useState, useEffect, useMemo } from 'react';
import { instagramToProduct, instagramToDetail } from '../utils/instagramToProduct';

const CACHE_MS = 15 * 60 * 1000;

export const seccionDesdeNombre = (nombre = '') =>
  nombre
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');

const claveCache = (seccion) => `ig_posts_${seccion}`;

const leerCache = (seccion) => {
  try {
    const cache = sessionStorage.getItem(claveCache(seccion));
    if (!cache) return null;
    const { ts, data } = JSON.parse(cache);
    if (Date.now() - ts < CACHE_MS) return data;
    sessionStorage.removeItem(claveCache(seccion));
  } catch {
    sessionStorage.removeItem(claveCache(seccion));
  }
  return null;
};

const useInstagramPosts = (seccion, etiqueta) => {
  const [posts, setPosts] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  // Posts normalizados para ProductCard (lista/grid)
  const postsNormalizados = useMemo(
    () => posts.map(instagramToProduct).filter(Boolean),
    [posts]
  );

  // Post normalizado para vista detalle (si se pide uno solo)
  const postDetalle = useMemo(
    () => (posts.length === 1 ? instagramToDetail(posts[0]) : null),
    [posts]
  );

  useEffect(() => {
    if (!seccion) {
      Promise.resolve().then(() => {
        setPosts([]);
        setCargando(false);
        setError(false);
      });
      return undefined;
    }

    const cache = leerCache(seccion);
    if (cache) {
      Promise.resolve().then(() => {
        setPosts(cache);
        setCargando(false);
        setError(false);
      });
      return undefined;
    }

    const controlador = new AbortController();

    fetch(`/api/instagram?seccion=${encodeURIComponent(seccion)}&etiqueta=${encodeURIComponent(etiqueta || '')}`, {
      signal: controlador.signal,
    })
      .then((respuesta) => {
        if (!respuesta.ok) throw new Error('Error al cargar posts de Instagram');
        return respuesta.json();
      })
      .then((cuerpo) => {
        const datos = cuerpo.posts || [];
        setPosts(datos);
        setError(false);
        sessionStorage.setItem(claveCache(seccion), JSON.stringify({ ts: Date.now(), data: datos }));
      })
      .catch((e) => {
        if (e.name !== 'AbortError') {
          setPosts([]);
          setError(true);
        }
      })
      .finally(() => {
        if (!controlador.signal.aborted) setCargando(false);
      });

    return () => controlador.abort();
  }, [seccion, etiqueta]);

  return { posts, postsNormalizados, postDetalle, cargando, error };
};

export default useInstagramPosts;