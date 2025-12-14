import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Obtiene el rol real del usuario autenticado desde localStorage
const getUserRole = () => {
  try {
    const userData = JSON.parse(localStorage.getItem("user_data"));
    if (!userData) return null;
    
    // Verificar primero si hay un user_type o rol_nombre explícito
    let userType = userData.user_type || userData.rol_nombre || '';
    
    // Si no hay rol explícito, detectar por campos
    if (!userType) {
      if (userData.is_superuser || userData.is_staff) {
        userType = 'admin';
      } else if (userData.em_nombre || userData.em_email || userData.em_nit) {
        userType = 'empresa';
      } else if (userData.asp_nombre || userData.asp_email || userData.asp_cedula) {
        userType = 'aspirante';
      } else if (userData.user_rol) {
        userType = userData.user_rol;
      }
    }
    
    // Normalizar el tipo de usuario
    const normalizeRole = (role) => {
      if (!role) return null;
      const lowerRole = role.toLowerCase();
      if (lowerRole.includes('admin') || lowerRole.includes('administrador')) return 'admin';
      if (lowerRole.includes('aspirant') || lowerRole === 'aspirante') return 'aspirante';
      if (lowerRole.includes('empres') || lowerRole === 'empresa') return 'empresa';
      return lowerRole;
    };
    
    return normalizeRole(userType);
  } catch (e) {
    console.error('Error al obtener rol del usuario:', e);
  }
  return null;
};

const DashboardRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user_data") || '{}');
    const rol = getUserRole();
    
    console.log('DashboardRedirect - UserData:', userData);
    console.log('DashboardRedirect - Detected Role:', rol);
    
    if (rol === 'aspirante') {
      console.log('Redirecting to aspirante dashboard');
      navigate('/aspirantes/dashboard', { replace: true });
    } else if (rol === 'empresa') {
      console.log('Redirecting to empresa dashboard');
      navigate('/empresas/dashboard', { replace: true });
    } else if (rol === 'admin') {
      console.log('Redirecting to admin dashboard');
      navigate('/admin', { replace: true });
    } else {
      console.log('No valid role found, redirecting to home');
      navigate('/', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5e17eb] mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirigiendo al dashboard...</p>
      </div>
    </div>
  );
};

export default DashboardRedirect;
