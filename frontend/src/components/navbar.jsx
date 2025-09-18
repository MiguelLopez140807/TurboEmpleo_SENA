import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaBars, FaTimes, FaUserCircle, FaSearch, FaBriefcase, FaBuilding, FaBlog, FaEnvelope } from 'react-icons/fa';
import logo from '../assets/img/Logo/claro/logotipo.png';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user_data");
    if (token && userData) {
      setIsAuth(true);
      setUser(JSON.parse(userData));
    } else {
      setIsAuth(false);
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_data");
    setIsAuth(false);
    setUser(null);
    navigate("/login");
  };

  // Enlaces principales para todos los usuarios
  const mainLinks = (
    <>
      <Link to="/" className="text-gray-600 hover:text-[#5e17eb] transition-colors font-medium flex items-center gap-1">
        <FaSearch /> Inicio
      </Link>
      <Link to="/vacantes" className="text-gray-600 hover:text-[#5e17eb] transition-colors font-medium flex items-center gap-1">
        <FaBriefcase /> Vacantes
      </Link>
      <Link to="/empresas" className="text-gray-600 hover:text-[#5e17eb] transition-colors font-medium flex items-center gap-1">
        <FaBuilding /> Empresas
      </Link>
      <Link to="/blog" className="text-gray-600 hover:text-[#5e17eb] transition-colors font-medium flex items-center gap-1">
        <FaBlog /> Blog
      </Link>
      <Link to="/contacto" className="text-gray-600 hover:text-[#5e17eb] transition-colors font-medium flex items-center gap-1">
        <FaEnvelope /> Contacto
      </Link>
    </>
  );

  // Opciones para aspirante autenticado
  const aspiranteLinks = (
    <div className="relative">
      <button 
        onClick={() => setUserDropdownOpen(!userDropdownOpen)}
        className="flex items-center gap-2 text-[#5e17eb] font-medium"
      >
        <FaUserCircle className="text-2xl" />
        <span>Mi Cuenta</span>
      </button>
      
      {userDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
          <Link 
            to="/aspirantes/perfil" 
            className="block px-4 py-2 text-gray-800 hover:bg-[#f3e8ff] hover:text-[#5e17eb]"
            onClick={() => setUserDropdownOpen(false)}
          >
            Mi Perfil
          </Link>
          <Link 
            to="/aspirantes/postulaciones" 
            className="block px-4 py-2 text-gray-800 hover:bg-[#f3e8ff] hover:text-[#5e17eb]"
            onClick={() => setUserDropdownOpen(false)}
          >
            Mis Postulaciones
          </Link>
          <button 
            onClick={() => { setUserDropdownOpen(false); handleLogout(); }}
            className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );

  // Opciones para no autenticado
  const guestLinks = (
    <>
      <Link to="/login" className="text-[#5e17eb] font-medium px-4 py-2 rounded-lg hover:bg-[#f3e8ff] transition-colors">
        Iniciar sesión
      </Link>
      <Link to="/register" className="bg-[#5e17eb] text-white font-medium px-4 py-2 rounded-lg hover:bg-[#A67AFF] transition-colors">
        Registrarse
      </Link>
    </>
  );

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-sm py-3 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="TurboEmpleo Logo" className="w-72 h-auto" />
          </Link>

          {/* Menú para pantallas grandes */}
          <div className="hidden md:flex items-center space-x-8">
            {mainLinks}
            <div className="flex items-center space-x-4">
              {isAuth ? aspiranteLinks : guestLinks}
            </div>
          </div>

          {/* Botón hamburguesa para móviles */}
          <button
            className="md:hidden text-2xl text-[#5e17eb] focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Menú desplegable para móviles */}
        {menuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-4">
              {mainLinks}
              <div className="pt-4 border-t border-gray-200">
                {isAuth ? (
                  <>
                    <Link
                      to="/aspirantes/perfil"
                      className="flex items-center gap-2 text-[#5e17eb] font-medium py-2"
                      onClick={() => setMenuOpen(false)}
                    >
                      <FaUserCircle className="text-xl" /> Mi Perfil
                    </Link>
                    <Link
                      to="/aspirantes/postulaciones"
                      className="flex items-center gap-2 text-[#5e17eb] font-medium py-2"
                      onClick={() => setMenuOpen(false)}
                    >
                      <FaBriefcase className="text-xl" /> Mis Postulaciones
                    </Link>
                    <button
                      onClick={() => { setMenuOpen(false); handleLogout(); }}
                      className="flex items-center gap-2 text-red-600 font-medium py-2 w-full text-left"
                    >
                      <FaTimes className="text-xl" /> Cerrar sesión
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col space-y-3">
                    <Link
                      to="/login"
                      className="text-[#5e17eb] font-medium py-2 text-center"
                      onClick={() => setMenuOpen(false)}
                    >
                      Iniciar sesión
                    </Link>
                    <Link
                      to="/register"
                      className="bg-[#5e17eb] text-white font-medium py-2 rounded-lg text-center"
                      onClick={() => setMenuOpen(false)}
                    >
                      Registrarse
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;