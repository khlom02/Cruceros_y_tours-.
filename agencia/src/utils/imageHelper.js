// Helper para generar URLs de imágenes desde Supabase Storage

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const BUCKET_NAME = "content media";

/**
 * Genera la URL pública de una imagen en Supabase Storage
 * @param {string} path - Ruta de la imagen en el bucket (ej: "imagenes/banner.jpg" o "assets/logo.png")
 * @returns {string} URL pública completa
 */
export const getSupabaseImageUrl = (path) => {
  if (!path) return "";
  
  // Si ya es una URL completa, devolverla tal cual
  if (path.startsWith("http")) {
    return path;
  }

  // Construir la URL de Supabase Storage
  const encodedBucket = encodeURIComponent(BUCKET_NAME);
  return `${SUPABASE_URL}/storage/v1/object/public/${encodedBucket}/${path}`;
};

/**
 * Genera URLs para múltiples imágenes
 * @param {object} obj - Objeto con propiedades que son rutas de imágenes
 * @param {array} imageProps - Array de nombres de propiedades que contienen rutas
 * @returns {object} Objeto con las mismas propiedades pero con URLs de Supabase
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
