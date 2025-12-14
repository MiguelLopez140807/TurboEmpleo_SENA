import VacantesDisponibles from './pages/aspirantes/VacantesDisponibles';
import PostulacionesAspirante from './pages/aspirantes/PostulacionesAspirante';
import DetallePostulacion from './pages/aspirantes/DetallePostulacion';
import DetalleVacante from './pages/aspirantes/DetalleVacante';
import RestablecerPassword from './pages/public/RestablecerPassword';
import ActivarCuenta from './pages/public/ActivarCuenta';
import RecuperarPassword from './pages/public/RecuperarPassword';
import CompletarPerfilAspirante from './pages/aspirantes/CompletarPerfilAspirante';
import PoliticaPrivacidad from './pages/public/PoliticaPrivacidad';
import TerminosUso from './pages/public/TerminosUso';
import PoliticaDatos from './pages/public/PoliticaDatos';
import Notificaciones from './pages/Notificaciones';
import Contacto from './pages/public/Contacto';
// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layouts y componentes de protección
import Layout from './components/layout';
import Navbar from './components/navbar';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

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


import DashboardEmpresa from './pages/empresas/DashboardEmpresa';
import PerfilEmpresa from './pages/empresas/PerfilEmpresa';
import VacantesEmpresa from './pages/empresas/VacantesEmpresa';
import EditarVacanteEmpresa from './pages/empresas/EditarVacanteEmpresa';
import PostulacionesRecibidasEmpresa from './pages/empresas/PostulacionesRecibidasEmpresa';
import Reportes from './pages/admin/Reportes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Layout><LandingPage /></Layout>} />
        <Route path="/login" element={
          <PublicRoute>
            <><Navbar /><Login /></>
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <Layout><Register /></Layout>
          </PublicRoute>
        } />

        {/* Rutas legales */}
        <Route path="/PoliticaPrivacidad" element={<Layout><PoliticaPrivacidad /></Layout>} />
        <Route path="/TerminosUso" element={<Layout><TerminosUso /></Layout>} />
        <Route path="/PoliticaDatos" element={<Layout><PoliticaDatos /></Layout>} />
        
        {/* Ruta de contacto */}
        <Route path="/contacto" element={<Layout><Contacto /></Layout>} />

        {/* Rutas de recuperación de contraseña */}
        <Route path="/activar-cuenta/:uidb64/:token" element={<Layout><ActivarCuenta /></Layout>} />
        <Route path="/recuperar-password" element={<Layout><RecuperarPassword /></Layout>} />
        <Route path="/restablecer-contraseña/:uidb64/:token" element={<Layout><RestablecerPassword /></Layout>} />

        {/* Rutas administrativas - Solo para administradores */}
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <Admin />
          </ProtectedRoute>
        } />
        <Route path="/admin/aspirantes" element={
          <ProtectedRoute requiredRole="admin">
            <Aspirantes />
          </ProtectedRoute>
        } />
        <Route path="/admin/empresas" element={
          <ProtectedRoute requiredRole="admin">
            <Empresas />
          </ProtectedRoute>
        } />
        <Route path="/admin/reportes" element={
          <ProtectedRoute requiredRole="admin">
            <Reportes />
          </ProtectedRoute>
        } />

        {/* Redirección inteligente para /dashboard */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardRedirect />
          </ProtectedRoute>
        } />

        {/* Rutas de aspirantes */}
        <Route path="/aspirantes/dashboard" element={
          <ProtectedRoute>
            <DashboardAspirante />
          </ProtectedRoute>
        } />
        <Route path="/aspirantes/perfil" element={
          <ProtectedRoute>
            <PerfilAspirante />
          </ProtectedRoute>
        } />
        <Route path="/aspirantes/completar-perfil" element={
          <ProtectedRoute>
            <CompletarPerfilAspirante />
          </ProtectedRoute>
        } />
        <Route path="/aspirantes/vacantes" element={
          <ProtectedRoute>
            <VacantesDisponibles />
          </ProtectedRoute>
        } />
        <Route path="/aspirantes/vacantes/:id" element={
          <ProtectedRoute>
            <DetalleVacante />
          </ProtectedRoute>
        } />
        <Route path="/aspirantes/postulaciones" element={
          <ProtectedRoute>
            <PostulacionesAspirante />
          </ProtectedRoute>
        } />
        <Route path="/aspirantes/postulaciones/:id" element={
          <ProtectedRoute>
            <DetallePostulacion />
          </ProtectedRoute>
        } />

        {/* Rutas de empresas */}
        <Route path="/empresas/dashboard" element={
          <ProtectedRoute>
            <DashboardEmpresa />
          </ProtectedRoute>
        } />
        <Route path="/empresas/perfil" element={
          <ProtectedRoute>
            <PerfilEmpresa />
          </ProtectedRoute>
        } />
        <Route path="/empresas/vacantes" element={
          <ProtectedRoute>
            <VacantesEmpresa />
          </ProtectedRoute>
        } />
        <Route path="/empresas/vacantes/editar/:id" element={
          <ProtectedRoute>
            <EditarVacanteEmpresa />
          </ProtectedRoute>
        } />
        <Route path="/empresas/postulaciones" element={
          <ProtectedRoute>
            <PostulacionesRecibidasEmpresa />
          </ProtectedRoute>
        } />

        {/* Rutas compartidas que requieren autenticación */}
        <Route path="/notificaciones" element={
          <ProtectedRoute>
            <Notificaciones />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
