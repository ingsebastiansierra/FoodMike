/**
 * Normaliza una fuente de imagen para ser compatible con el componente Image de React Native.
 * Maneja strings, objetos con propiedad 'uri', y valores inválidos/nulos.
 *
 * @param {string | { uri: string } | null | undefined} image - Los datos de imagen del API.
 * @returns {{ uri: string } | null} Un objeto fuente válido para el componente Image o null.
 */
export const normalizeImageSource = (image) => {
  // Si la imagen es un string no vacío, tratarlo como URI
  if (typeof image === 'string' && image.trim() !== '') {
    return { uri: image };
  }

  // Si la imagen es un objeto con una propiedad 'uri' no vacía, usarlo directamente
  if (image && typeof image === 'object' && image.uri && typeof image.uri === 'string' && image.uri.trim() !== '') {
    return image;
  }

  // En todos los demás casos (null, undefined, string vacío, objeto malformado), retornar una imagen local por defecto
  return require('../../../assets/logos/food_logo_1.png');
};

/**
 * Verifica si una URL de imagen es válida
 * @param {string} url - La URL a verificar
 * @returns {boolean} - True si la URL es válida
 */
export const isValidImageUrl = (url) => {
  if (!url || typeof url !== 'string') return false;

  // Verificar que sea una URL válida
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Obtiene una imagen por defecto para usar como fallback
 * @returns {object} - Objeto de imagen por defecto
 */
export const getDefaultImage = () => {
  // Puedes cambiar esto por una imagen local si tienes una
  return { uri: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400' };
};
