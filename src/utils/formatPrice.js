/**
 * Formatea un número como un precio en pesos colombianos (COP).
 * @param {number} price El número a formatear.
 * @returns {string} El precio formateado con separadores de miles, ej: "100.000".
 */
export const formatPrice = (price) => {
  if (typeof price !== 'number' || isNaN(price)) {
    return '0'; // Devuelve 0 si el precio no es un número válido
  }

  // Usamos 'es-CO' para el formato de Colombia, que utiliza '.' como separador de miles.
  // No se incluyen decimales.
  const formattedPrice = price.toLocaleString('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return formattedPrice;
};
