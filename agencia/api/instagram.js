import { createClient } from '@supabase/supabase-js';

export const maxDuration = 60;

const IG_API = 'https://graph.instagram.com/v25.0';
const BUCKET = 'instagram-media';
const SYNC_INTERVAL_MS = 30 * 60 * 1000;
const MEDIA_LIMIT = 30;
const MAX_MEDIA_POR_POST = 6;
const MAX_CONCURRENCIA = 4;

let syncEnCurso = null;
let ultimoIntento = 0;

const limpiarEnv = (valor = '') => valor.split('\n')[0].trim();

const normalizar = (texto = '') =>
  texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

const extraerHashtags = (caption = '') => {
  const coincidencias = caption.match(/#[\p{L}\p{N}_]+/gu) || [];
  return [...new Set(coincidencias.map((m) => normalizar(m.slice(1))).filter(Boolean))];
};

let categoriasSlugs = null;
let categoriasTs = 0;

const obtenerSlugsDeCategorias = async (admin) => {
  if (categoriasSlugs && Date.now() - categoriasTs < SYNC_INTERVAL_MS) {
    return categoriasSlugs;
  }
  const { data } = await admin.from('categorias').select('nombre');
  categoriasSlugs = (data || []).map((c) => normalizar(c.nombre)).filter(Boolean);
  categoriasTs = Date.now();
  return categoriasSlugs;
};

const coincideSeccion = (hashtags = [], seccion, slugs) => {
  const s = normalizar(seccion);
  if (!s) return true;
  return hashtags.some(
    (t) => t === s || (slugs.includes(t) && t.startsWith(s))
  );
};

const fuentesDeMedia = (item) => {
  if (item.media_type === 'CAROUSEL_ALBUM') {
    return (item.children?.data || [])
      .map((hijo) => hijo.media_url || hijo.thumbnail_url)
      .filter(Boolean)
      .slice(0, MAX_MEDIA_POR_POST);
  }
  if (item.media_type === 'VIDEO') {
    return [item.thumbnail_url || item.media_url].filter(Boolean);
  }
  return [item.media_url].filter(Boolean);
};

const obtenerPostsDeInstagram = async () => {
  const token = limpiarEnv(process.env.INSTAGRAM_ACCESS_TOKEN);
  const igId = limpiarEnv(process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID);
  if (!token || !igId) {
    throw new Error('Faltan INSTAGRAM_ACCESS_TOKEN o INSTAGRAM_BUSINESS_ACCOUNT_ID');
  }
  const campos =
    'id,caption,media_type,permalink,timestamp,thumbnail_url,children{id,media_type,media_url,thumbnail_url}';
  const url = `${IG_API}/${igId}/media?fields=${encodeURIComponent(campos)}&limit=${MEDIA_LIMIT}`;
  const respuesta = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(20000),
  });
  const cuerpo = await respuesta.json();
  if (!respuesta.ok || cuerpo.error) {
    throw new Error(cuerpo.error?.message || `Instagram API ${respuesta.status}`);
  }
  return cuerpo.data || [];
};

const reHospedarMedia = async (storage, mediaId, fuentes) => {
  const urls = [];
  for (let i = 0; i < fuentes.length; i += 1) {
    const ruta = `ig/${mediaId}_${i}.jpg`;
    const { data } = storage.from(BUCKET).getPublicUrl(ruta);
    const urlPublica = data?.publicUrl || '';
    try {
      const respuesta = await fetch(fuentes[i], { signal: AbortSignal.timeout(15000) });
      if (!respuesta.ok) {
        urls.push(urlPublica);
        continue;
      }
      const buffer = await respuesta.arrayBuffer();
      const contentType = respuesta.headers.get('content-type') || 'image/jpeg';
      const { error } = await storage
        .from(BUCKET)
        .upload(ruta, buffer, { contentType, upsert: true, cacheControl: '31536000' });
      urls.push(error ? '' : urlPublica);
    } catch {
      urls.push(urlPublica);
    }
  }
  return urls;
};

const sincronizar = async (admin) => {
  const items = await obtenerPostsDeInstagram();
  if (!items.length) throw new Error('Instagram devolvió 0 publicaciones');

  const { data: existentesData, error: errorExistentes } = await admin
    .from('posts_instagram')
    .select('id, media_urls');
  if (errorExistentes) throw new Error(errorExistentes.message);
  const existentes = existentesData || [];
  const previo = new Map(existentes.map((fila) => [fila.id, fila.media_urls || []]));

  const posts = [];
  for (let i = 0; i < items.length; i += MAX_CONCURRENCIA) {
    const bloque = items.slice(i, i + MAX_CONCURRENCIA);
    const procesados = await Promise.all(
      bloque.map(async (item) => {
        const fuentes = fuentesDeMedia(item);
        const previas = previo.get(item.id) || [];
        const mediaUrls =
          previas.length === fuentes.length && previas.every(Boolean)
            ? previas
            : await reHospedarMedia(admin.storage, item.id, fuentes);
        return {
          id: item.id,
          caption: item.caption || '',
          media_type: item.media_type,
          media_urls: mediaUrls,
          permalink: item.permalink || '',
          posted_at: item.timestamp || null,
          hashtags: extraerHashtags(item.caption),
          sincronizado_en: new Date().toISOString(),
        };
      })
    );
    posts.push(...procesados);
  }

  const { error: errorUpsert } = await admin
    .from('posts_instagram')
    .upsert(posts, { onConflict: 'id' });
  if (errorUpsert) throw new Error(errorUpsert.message);

  const idsActuales = new Set(posts.map((p) => p.id));
  const obsoletos = existentes.map((p) => p.id).filter((id) => !idsActuales.has(id));
  if (obsoletos.length) {
    await admin.from('posts_instagram').delete().in('id', obsoletos);
  }
  return posts.length;
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido', posts: [] });
  }

  const supabaseUrl = limpiarEnv(process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL);
  const serviceKey = limpiarEnv(process.env.SUPABASE_SERVICE_ROLE_KEY);
  if (!supabaseUrl) {
    return res.status(503).json({ error: 'Falta la variable VITE_SUPABASE_URL', posts: [] });
  }
  if (!serviceKey) {
    return res.status(503).json({ error: 'Falta la variable SUPABASE_SERVICE_ROLE_KEY', posts: [] });
  }

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  let errorSync = null;
  try {
    const { data: filas, error: errorFilas } = await admin
      .from('posts_instagram')
      .select('sincronizado_en')
      .order('sincronizado_en', { ascending: false })
      .limit(1);
    if (errorFilas) throw new Error(errorFilas.message);

    const ultima = (filas || [])[0]?.sincronizado_en;
    const desactualizado = !ultima || Date.now() - new Date(ultima).getTime() > SYNC_INTERVAL_MS;
    const puedeIntentar = Date.now() - ultimoIntento > SYNC_INTERVAL_MS;

    if (desactualizado && puedeIntentar) {
      ultimoIntento = Date.now();
      syncEnCurso = sincronizar(admin).finally(() => {
        syncEnCurso = null;
      });
      try {
        await syncEnCurso;
      } catch (e) {
        errorSync = e.message;
      }
    }

    const { data: postsData, error: errorPosts } = await admin
      .from('posts_instagram')
      .select('*')
      .order('posted_at', { ascending: false })
      .limit(60);
    if (errorPosts) throw new Error(errorPosts.message);
    const posts = postsData || [];

    if (!posts.length && errorSync) {
      return res.status(503).json({ error: errorSync, posts: [] });
    }

    const seccionParam = (req.query?.seccion || '').trim();
    const etiquetaParam = (req.query?.etiqueta || '').trim();
    const idParam = (req.query?.id || '').trim();
    const secciones = seccionParam
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    let filtrados = posts;

    // Filtrar por etiqueta/hashtag específico si se proporciona
    if (etiquetaParam) {
      const slugs = await obtenerSlugsDeCategorias(admin);
      filtrados = posts.filter((p) =>
        p.hashtags.some((h) => normalizar(h) === normalizar(etiquetaParam) || coincideSeccion(p.hashtags || [], etiquetaParam, slugs))
      );
    } else if (idParam) {
      filtrados = posts.filter((p) => p.id === idParam);
    } else if (secciones.length && !secciones.includes('inicio')) {
      const slugs = await obtenerSlugsDeCategorias(admin);
      filtrados = posts.filter((p) =>
        secciones.some((s) => coincideSeccion(p.hashtags || [], s, slugs))
      );
    }

    res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=3600');
    return res.status(200).json({
      posts: filtrados,
      stale: Boolean(errorSync),
      sincronizado_en: posts[0]?.sincronizado_en || null,
    });
  } catch (e) {
    console.error('Error en /api/instagram:', e);
    return res.status(500).json({ error: e.message, posts: [] });
  }
}