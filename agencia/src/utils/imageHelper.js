// Helper para servir imágenes
// Prioriza URLs locales en public/, con fallback a Supabase Storage

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const BUCKET_NAME = "content media";

/**
 * Genera la URL de una imagen
 * Usa URLs locales desde public/ (recomendado)
 * Con fallback a Supabase Storage si se configura
 * @param {string} path - Ruta de la imagen (ej: "imagenes/banner.jpg" o "assets/logo.png")
 * @returns {string} URL pública completa
 */
export const getSupabaseImageUrl = (path) => {
  if (!path) return "";
  
  // Si ya es una URL completa, devolverla tal cual
  if (path.startsWith("http")) {
    return path;
  }

  // PRIORIDAD 1: URLs locales desde public/
  // Las imágenes están en public/imagenes/ y public/assets/
  // Se sirven como /imagenes/ y /assets/ en producción
  return `/${path}`;

  // FALLBACK: Si necesitas Supabase en el futuro, descomentar:
  // const encodedBucket = encodeURIComponent(BUCKET_NAME);
  // return `${SUPABASE_URL}/storage/v1/object/public/${encodedBucket}/${path}`;
};

/**
 * Genera URLs para múltiples imágenes
 * @param {object} obj - Objeto con propiedades que son rutas de imágenes
 * @param {array} imageProps - Array de nombres de propiedades que contienen rutas
 * @returns {object} Objeto con las mismas propiedades pero con URLs públicas
 */
export const mapToSupabaseUrls = (obj, imageProps) => {
  const result = { ...obj };
  imageProps.forEach(prop => {
    if (obj[prop]) {
      result[prop] = getSupabaseImageUrl(obj[prop]);
    }
  });
  return result;
};
