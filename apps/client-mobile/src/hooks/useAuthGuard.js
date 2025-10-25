import { useAuth } from '../context/AuthContext';

export const useAuthGuard = () => {
  const { user, userRole, isAdmin, isClient, loading } = useAuth();

  const requireAuth = (callback) => {
    if (!user) {
      throw new Error('Usuario no autenticado');
    }
    return callback();
  };

  const requireRole = (role, callback) => {
    if (!user) {
      throw new Error('Usuario no autenticado');
    }
    
    if (userRole !== role) {
      throw new Error(`Rol requerido: ${role}, Rol actual: ${userRole}`);
    }
    
    return callback();
  };

  const requireAdmin = (callback) => {
    return requireRole('administrador', callback);
  };

  const requireClient = (callback) => {
    return requireRole('cliente', callback);
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    
    // Aquí puedes definir permisos específicos basados en roles
    const permissions = {
      'administrador': [
        'manage_users',
        'manage_restaurants',
        'view_reports',
        'change_user_roles',
        'access_admin_panel'
      ],
      'cliente': [
        'place_orders',
        'view_menu',
        'manage_profile',
        'view_order_history',
        'add_favorites'
      ]
    };

    return permissions[userRole]?.includes(permission) || false;
  };

  const canAccess = (resource) => {
    if (!user) return false;
    
    // Definir recursos y quién puede acceder a ellos
    const resourceAccess = {
      'admin_panel': ['administrador'],
      'user_management': ['administrador'],
      'restaurant_management': ['administrador'],
      'order_placement': ['cliente'],
      'profile_management': ['cliente', 'administrador'],
      'reports': ['administrador']
    };

    return resourceAccess[resource]?.includes(userRole) || false;
  };

  return {
    user,
    userRole,
    isAdmin,
    isClient,
    loading,
    requireAuth,
    requireRole,
    requireAdmin,
    requireClient,
    hasPermission,
    canAccess
  };
}; 