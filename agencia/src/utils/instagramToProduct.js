/**
 * Utilidad para normalizar posts de Instagram al formato de producto
 * usado por ProductCard y la vista de detalle.
 */

const PRECIO_REGEX = /(?:€|EUR|\$|USD)\s*(\d[\d.,]*)|(?:desde|desde\s*)\s*(?:€|EUR|\$|USD)?\s*(\d[\d.,]*)/i;
const UBICACIONES_CONOCIDAS = [
  'caribe', 'mediterraneo', 'mediterráneo', 'baltico', 'báltico', 'noruegos', 'fiordos',
  'alaska', 'asia', 'japon', 'japón', 'china', 'tailandia', 'vietnam', 'singapur',
  'dubai', 'emiratos', 'oman', 'antartida', 'antártida', 'transatlantico', 'transatlántico',
  'mundo', 'world', 'canarias', 'baleares', 'mallorca', 'ibiza', 'menorca',
  'barcelona', 'madrid', 'valencia', 'sevilla', 'malaga', 'málaga', 'granada',
  'venecia', 'roma', 'napoles', 'nápoles', 'civitavecchia', 'genova', 'genova',
  'santorini', 'mykonos', 'atenas', 'estambul', 'dubrovnik', 'split', 'kotor',
  'sydney', 'melbourne', 'auckland', 'fiji', 'hawaii', 'hawái', 'mexico', 'méxico',
  'cancun', 'cancún', 'cozumel', 'panama', 'panamá', 'cartagena', 'buenos aires',
  'rio de janeiro', 'río de janeiro', 'santos', 'montevideo', 'punta del este'
];

const normalizarTexto = (texto = '') =>
  texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ');

const extraerTitulo = (caption = '') => {
  const lineas = caption.split('\n').map(l => l.trim()).filter(Boolean);
  if (!lineas.length) return 'Experiencia Instagram';
  
  // Primera línea antes de hashtags o emojis decorativos
  const primera = lineas[0];
  const sinHashtags = primera.split('#')[0].trim();
  const sinEmojisIniciales = sinHashtags.replace(/^[\s\p{Emoji}]+/u, '').trim();
  
  return sinEmojisIniciales || primera.split('#')[0].trim() || 'Experiencia Instagram';
};

const extraerUbicacion = (hashtags = [], caption = '') => {
  const textoNormalizado = normalizarTexto(caption);
  const hashtagsNormalizados = hashtags.map(h => normalizarTexto(h));
  
  // Buscar en hashtags primero
  for (const tag of hashtagsNormalizados) {
    if (UBICACIONES_CONOCIDAS.some(u => tag.includes(u))) {
      // Devolver con capitalización bonita
      return tag
        .split(' ')
        .map(p => p.charAt(0).toUpperCase() + p.slice(1))
        .join(' ');
    }
  }
  
  // Buscar en caption
  for (const u of UBICACIONES_CONOCIDAS) {
    if (textoNormalizado.includes(u)) {
      return u
        .split(' ')
        .map(p => p.charAt(0).toUpperCase() + p.slice(1))
        .join(' ');
    }
  }
  
  // Fallback: primer hashtag geográfico aparente
  const geo = hashtagsNormalizados.find(h => 
    h.length > 3 && !['cruceros', 'crucerosytours', 'viajes', 'vacaciones', 'oferta', 'descuento'].includes(h)
  );
  
  if (geo) {
    return geo
      .split(' ')
      .map(p => p.charAt(0).toUpperCase() + p.slice(1))
      .join(' ');
  }
  
  return 'Destino por descubrir';
};

const extraerPrecio = (caption = '') => {
  const match = caption.match(PRECIO_REGEX);
  if (match) {
    const valor = match[1] || match[2];
    if (valor) {
      const num = parseFloat(valor.replace(',', '.'));
      if (!isNaN(num)) {
        return `Desde ${num.toLocaleString('es-ES', { minimumFractionDigits: 0 })} €`;
      }
    }
  }
  return 'Consultar precio';
};

const extraerHighlights = (caption = '') => {
  const lineas = caption.split('\n').map(l => l.trim()).filter(Boolean);
  const highlights = [];
  
  for (const linea of lineas.slice(1)) { // Saltar primera línea (título)
    const limpia = linea
      .replace(/^[\p{Emoji}\s•\-\*]+/u, '') // Quitar emojis/bullets iniciales
      .replace(/#[\p{L}\p{N}_]+/gu, '') // Quitar hashtags
      .trim();
    
    if (limpia.length > 10 && limpia.length < 200) {
      highlights.push(limpia);
    }
    if (highlights.length >= 4) break;
  }
  
  return highlights;
};

const formatearFechaRelativa = (fechaISO) => {
  if (!fechaISO) return '';
  const fecha = new Date(fechaISO);
  const ahora = new Date();
  const diffMs = ahora - fecha;
  const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDias === 0) return 'Hoy';
  if (diffDias === 1) return 'Ayer';
  if (diffDias < 7) return `Hace ${diffDias} días`;
  if (diffDias < 30) return `Hace ${Math.floor(diffDias / 7)} semana${Math.floor(diffDias / 7) > 1 ? 's' : ''}`;
  if (diffDias < 365) return `Hace ${Math.floor(diffDias / 30)} mes${Math.floor(diffDias / 30) > 1 ? 'es' : ''}`;
  return `Hace ${Math.floor(diffDias / 365)} año${Math.floor(diffDias / 365) > 1 ? 's' : ''}`;
};

export const instagramToProduct = (post) => {
  if (!post) return null;
  
  const imagenes = Array.isArray(post.media_urls) ? post.media_urls.filter(Boolean) : [];
  const caption = (post.caption || '').trim();
  const hashtags = Array.isArray(post.hashtags) ? post.hashtags : [];
  
  const titulo = extraerTitulo(caption);
  const ubicacion = extraerUbicacion(hashtags, caption);
  const precio = extraerPrecio(caption);
  const highlights = extraerHighlights(caption);
  const fechaRelativa = formatearFechaRelativa(post.posted_at);
  
  // Determinar color de fondo basado en hashtags/temática
  let colorFondo = 'verde';
  const tags = hashtags.map(h => normalizarTexto(h));
  if (tags.some(t => t.includes('crucero') || t.includes('barco') || t.includes('naviera'))) colorFondo = 'azul';
  else if (tags.some(t => t.includes('vuelo') || t.includes('avion') || t.includes('aereo'))) colorFondo = 'naranja';
  else if (tags.some(t => t.includes('tren') || t.includes('ferrocarril'))) colorFondo = 'gris';
  else if (tags.some(t => t.includes('asistencia') || t.includes('seguro'))) colorFondo = 'rojo';
  
  return {
    id: `ig_${post.id}`,
    imagen: imagenes[0] || '',
    imagenes,
    titulo,
    ubicacion,
    fechaInicio: fechaRelativa,
    fechaFin: '',
    precio,
    colorFondo,
    esInstagram: true,
    permalink: post.permalink || '',
    hashtags,
    caption,
    highlights,
    postedAt: post.posted_at,
    mediaType: post.media_type,
  };
};

export const instagramToDetail = (post) => {
  const producto = instagramToProduct(post);
  if (!producto) return null;
  
  return {
    ...producto,
    // Campos extra para la vista detalle
    descripcion: producto.caption,
    gallery: producto.imagenes,
    // Para compatibilidad con componentes existentes
    amenities: producto.highlights.map(h => ({ nombre: h, icono_emoji: '✨' })),
    facilities: producto.highlights,
  };
};