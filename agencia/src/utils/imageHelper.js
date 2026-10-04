// Helper para servir imágenes
// Prioriza URLs locales en public/

/**
 * Genera la URL de una imagen
 * Usa URLs locales desde public/ (recomendado)
 * @param {string} path - Ruta de la imagen (ej: "imagenes/banner.jpg" o "assets/logo.png")
 * @returns {string} URL pública completa
 */
export const getSupabaseImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `/${path}`;
};
