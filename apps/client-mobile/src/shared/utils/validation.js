/**
 * Utilidades de validación para formularios
 */

/**
 * Valida formato de email
 * @param {string} email - Email a validar
 * @returns {boolean} - True si es válido
 */
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
};

/**
 * Verifica si el email tiene un dominio no soportado (.edu, .gov, etc.)
 * @param {string} email - Email a verificar
 * @returns {boolean} - True si es un dominio no soportado
 */
export const hasUnsupportedDomain = (email) => {
    const unsupportedDomains = ['.edu', '.gov', '.mil'];
    const emailLower = email.toLowerCase().trim();
    return unsupportedDomains.some(domain => emailLower.includes(domain));
};

/**
 * Valida longitud de contraseña
 * @param {string} password - Contraseña a validar
 * @param {number} minLength - Longitud mínima (default: 6)
 * @returns {boolean} - True si es válida
 */
export const validatePassword = (password, minLength = 6) => {
    return password && password.length >= minLength;
};

/**
 * Valida que las contraseñas coincidan
 * @param {string} password - Contraseña
 * @param {string} confirmPassword - Confirmación de contraseña
 * @returns {boolean} - True si coinciden
 */
export const validatePasswordMatch = (password, confirmPassword) => {
    return password === confirmPassword;
};

/**
 * Valida nombre (mínimo 2 caracteres)
 * @param {string} name - Nombre a validar
 * @returns {boolean} - True si es válido
 */
export const validateName = (name) => {
    return name && name.trim().length >= 2;
};

/**
 * Valida número de teléfono (formato básico)
 * @param {string} phone - Teléfono a validar
 * @returns {boolean} - True si es válido
 */
export const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Obtiene mensaje de error personalizado para validación de email
 * @param {string} email - Email a validar
 * @returns {string|null} - Mensaje de error o null si es válido
 */
export const getEmailError = (email) => {
    if (!email || !email.trim()) {
        return 'El correo es requerido';
    }
    if (hasUnsupportedDomain(email)) {
        return 'Los dominios .edu, .gov no están soportados. Usa Gmail, Outlook, etc.';
    }
    if (!validateEmail(email)) {
        return 'Formato de correo inválido';
    }
    return null;
};

/**
 * Obtiene mensaje de error personalizado para validación de contraseña
 * @param {string} password - Contraseña a validar
 * @param {number} minLength - Longitud mínima
 * @returns {string|null} - Mensaje de error o null si es válida
 */
export const getPasswordError = (password, minLength = 6) => {
    if (!password) {
        return 'La contraseña es requerida';
    }
    if (!validatePassword(password, minLength)) {
        return `La contraseña debe tener al menos ${minLength} caracteres`;
    }
    return null;
};

/**
 * Obtiene mensaje de error para confirmación de contraseña
 * @param {string} password - Contraseña
 * @param {string} confirmPassword - Confirmación
 * @returns {string|null} - Mensaje de error o null si coinciden
 */
export const getPasswordMatchError = (password, confirmPassword) => {
    if (!confirmPassword) {
        return 'Confirma tu contraseña';
    }
    if (!validatePasswordMatch(password, confirmPassword)) {
        return 'Las contraseñas no coinciden';
    }
    return null;
};

/**
 * Obtiene mensaje de error para validación de nombre
 * @param {string} name - Nombre a validar
 * @returns {string|null} - Mensaje de error o null si es válido
 */
export const getNameError = (name) => {
    if (!name || !name.trim()) {
        return 'El nombre es requerido';
    }
    if (!validateName(name)) {
        return 'El nombre debe tener al menos 2 caracteres';
    }
    return null;
};
