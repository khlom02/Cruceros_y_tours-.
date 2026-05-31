// Helper para servir imágenes
// Usa Supabase Storage. Si una ruta local no está en Supabase, usa public/

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const BUCKET_NAME = "content media";

const getSupabaseStorageUrl = (path) => {
  const bucket = encodeURIComponent(BUCKET_NAME);
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
};

/**
 * Genera la URL de una imagen
 * - Si ya es URL completa (http), la devuelve tal cual
 * - Si la ruta existe en Supabase Storage, usa la URL de Storage
 * - Si no, usa la ruta local desde public/
 * @param {string} path - Ruta de la imagen
 * @returns {string} URL pública completa
 */
export const getSupabaseImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return getSupabaseStorageUrl(path);
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
