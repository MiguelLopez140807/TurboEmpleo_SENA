import RestablecerPassword from './pages/public/RestablecerPassword';
import ActivarCuenta from './pages/public/ActivarCuenta';
import RecuperarPassword from './pages/public/RecuperarPassword';
import CompletarPerfilAspirante from './pages/aspirantes/CompletarPerfilAspirante';
import PoliticaPrivacidad from './pages/public/PoliticaPrivacidad';
import TerminosUso from './pages/public/TerminosUso';
import PoliticaDatos from './pages/public/PoliticaDatos';
// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layouts
import Layout from './components/layout';
import Navbar from './components/navbar';

// Vistas públicas
import LandingPage from './pages/public/LandingPage';
import Login from './pages/public/Login';
import Register from './pages/public/Register';

// Vistas privadas (admin)
import Admin from './pages/admin/Admin';
import Aspirantes from './pages/aspirantes/Aspirantes';
import DashboardAspirante from './pages/aspirantes/DashboardAspirante';
import PerfilAspirante from './pages/aspirantes/PerfilAspirante';
import Empresas from './pages/empresas/Empresas';
import DashboardRedirect from './pages/DashboardRedirect';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Layout><LandingPage /></Layout>} />
  <Route path="/login" element={<><Navbar /><Login /></>} />
        <Route path="/register" element={<Layout><Register /></Layout>} />

  {/* Rutas legales */}
  <Route path="/PoliticaPrivacidad" element={<Layout><PoliticaPrivacidad /></Layout>} />
  <Route path="/TerminosUso" element={<Layout><TerminosUso /></Layout>} />
  <Route path="/PoliticaDatos" element={<Layout><PoliticaDatos /></Layout>} />

        {/* Rutas privadas (admin) */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/aspirantes" element={<Aspirantes />} />
        <Route path="/admin/empresas" element={<Empresas />} />
  {/* Dashboard privado del aspirante */}
  <Route path="/aspirante/dashboard" element={<DashboardAspirante />} />
  <Route path="/aspirantes/perfil" element={<PerfilAspirante />} />
  {/* Redirección inteligente para /dashboard */}
  <Route path="/dashboard" element={<DashboardRedirect />} />
        <Route path="/aspirantes/completar-perfil" element={<CompletarPerfilAspirante />} />
        {/* Activación de cuenta */}
    <Route path="/activar-cuenta/:uidb64/:token" element={<Layout><ActivarCuenta /></Layout>} />
  <Route path="/recuperar-password" element={<Layout><RecuperarPassword /></Layout>} />
  <Route path="/restablecer-contraseña/:uidb64/:token" element={<Layout><RestablecerPassword /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
