import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Obtiene el rol real del usuario autenticado desde localStorage
const getUserRole = () => {
  try {
    const userData = JSON.parse(localStorage.getItem("user_data"));
    if (!userData) return null;
    // Si tiene campos de empresa
    if (userData.em_nombre || userData.em_email || userData.em_nit) return "empresa";
    // Si tiene campos de aspirante
    if (userData.asp_nombre || userData.asp_email || userData.asp_cedula) return "aspirante";
    // Si tiene campo de rol explícito
    if (userData.user_rol) return userData.user_rol.toLowerCase();
  } catch (e) {}
  return null;
};

const DashboardRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const rol = getUserRole();
    if (rol === 'aspirante') {
      navigate('/aspirante/dashboard', { replace: true });
    } else if (rol === 'empresa') {
      navigate('/empresas/dashboard', { replace: true });
    } else if (rol === 'admin') {
      navigate('/admin', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  return null;
};

export default DashboardRedirect;
