import { CURRENCY_CONFIG } from '../../constants';

// Utilidades de formato
export const formatCurrency = (amount, currency = 'COP') => {
  if (typeof amount !== 'number') return '$0';
  
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  };
  
  return new Date(date).toLocaleDateString('es-CO', defaultOptions);
};

export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDateTime = (date) => {
  return `${formatDate(date)} ${formatTime(date)}`;
};

export const formatPhoneNumber = (phone) => {
  // Eliminar todos los caracteres no numéricos
  const cleaned = phone.replace(/\D/g, '');
  
  // Formatear según la longitud
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  return phone;
};
