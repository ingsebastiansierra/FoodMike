import { useState, useCallback } from 'react';

/**
 * Hook personalizado para manejar estados de carga
 * @param {boolean} initialLoading - Estado inicial de carga
 * @returns {object} - Objeto con estado y funciones de control
 */
export const useLoading = (initialLoading = false) => {
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [error, setError] = useState(null);

  const startLoading = useCallback(() => {
    setIsLoading(true);
    setError(null);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  const setLoadingError = useCallback((errorMessage) => {
    setError(errorMessage);
    setIsLoading(false);
  }, []);

  const executeWithLoading = useCallback(async (asyncFunction) => {
    try {
      startLoading();
      const result = await asyncFunction();
      stopLoading();
      return result;
    } catch (err) {
      setLoadingError(err.message || 'Error desconocido');
      throw err;
    }
  }, [startLoading, stopLoading, setLoadingError]);

  return {
    isLoading,
    error,
    startLoading,
    stopLoading,
    setLoadingError,
    executeWithLoading,
  };
};

/**
 * Hook para manejar múltiples estados de carga
 * @param {object} initialStates - Estados iniciales { key: boolean }
 * @returns {object} - Objeto con estados y funciones de control
 */
export const useMultipleLoading = (initialStates = {}) => {
  const [loadingStates, setLoadingStates] = useState(initialStates);
  const [errors, setErrors] = useState({});

  const setLoading = useCallback((key, isLoading) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: isLoading
    }));
    
    if (isLoading) {
      setErrors(prev => ({
        ...prev,
        [key]: null
      }));
    }
  }, []);

  const setError = useCallback((key, error) => {
    setErrors(prev => ({
      ...prev,
      [key]: error
    }));
    setLoading(key, false);
  }, [setLoading]);

  const executeWithLoading = useCallback(async (key, asyncFunction) => {
    try {
      setLoading(key, true);
      const result = await asyncFunction();
      setLoading(key, false);
      return result;
    } catch (err) {
      setError(key, err.message || 'Error desconocido');
      throw err;
    }
  }, [setLoading, setError]);

  const isAnyLoading = Object.values(loadingStates).some(Boolean);

  return {
    loadingStates,
    errors,
    isAnyLoading,
    setLoading,
    setError,
    executeWithLoading,
    isLoading: (key) => loadingStates[key] || false,
    getError: (key) => errors[key] || null,
  };
};

export default useLoading;