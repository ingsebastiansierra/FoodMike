import { Alert } from 'react-native';

// Utilidades de alertas
export const showAlert = (title, message) => {
  Alert.alert(title, message, [{ text: 'OK' }]);
};

export const showErrorAlert = (message, title = 'Error') => {
  showAlert(title, message);
};

export const showSuccessAlert = (message, title = 'Éxito') => {
  showAlert(title, message);
};

export const showConfirmAlert = (title, message, onConfirm, onCancel) => {
  Alert.alert(
    title,
    message,
    [
      {
        text: 'Cancelar',
        style: 'cancel',
        onPress: onCancel,
      },
      {
        text: 'Confirmar',
        onPress: onConfirm,
      },
    ],
    { cancelable: false }
  );
};
