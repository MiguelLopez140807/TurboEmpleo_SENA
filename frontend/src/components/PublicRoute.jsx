import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  // Si el usuario ya está autenticado, redirigir al dashboard
  if (token) {
    try {
      // Verificar si el token está válido
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      if (tokenData.exp >= currentTime) {
        // Token válido, redirigir al dashboard
        return <Navigate to="/dashboard" replace />;
      }
    } catch (error) {
      // Token malformado, continuar con la página pública
    }
  }

  return children;
};

export default PublicRoute;