import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const token = localStorage.getItem('token');
  const userData = JSON.parse(localStorage.getItem('user_data') || '{}');

  // Verificar si hay token
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Verificar si el token está expirado
  try {
    const tokenData = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    if (tokenData.exp < currentTime) {
      // Token expirado, limpiar localStorage y redirigir
      localStorage.removeItem('token');
      localStorage.removeItem('user_data');
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    // Token malformado, limpiar y redirigir
    localStorage.removeItem('token');
    localStorage.removeItem('user_data');
    return <Navigate to="/login" replace />;
  }

  // Verificar rol específico si se requiere
  if (requiredRole) {
    // Detectar el tipo de usuario de múltiples formas
    let userType = userData?.user_type || userData?.rol_nombre || '';
    
    // Detectar por campos específicos si no hay rol explícito
    if (!userType) {
      if (userData?.is_superuser || userData?.is_staff) {
        userType = 'admin';
      } else if (userData?.asp_nombre || userData?.asp_email || userData?.asp_cedula) {
        userType = 'aspirante';
      } else if (userData?.em_nombre || userData?.em_email || userData?.em_nit) {
        userType = 'empresa';
      }
    }
    
    // Normalizar nombres de rol
    const normalizeRole = (role) => {
      if (!role) return '';
      const lowerRole = role.toLowerCase();
      if (lowerRole.includes('admin') || lowerRole.includes('administrador')) return 'admin';
      if (lowerRole.includes('aspirant') || lowerRole === 'aspirante') return 'aspirante';
      if (lowerRole.includes('empres') || lowerRole === 'empresa') return 'empresa';
      return lowerRole;
    };
    
    const normalizedUserType = normalizeRole(userType);
    const normalizedRequiredRole = normalizeRole(requiredRole);
    
    console.log('ProtectedRoute - Required:', normalizedRequiredRole, 'User:', normalizedUserType, 'UserData:', userData);
    
    if (normalizedRequiredRole && normalizedUserType !== normalizedRequiredRole) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;