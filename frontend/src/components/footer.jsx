
import { Link } from "react-router-dom";
import logo from '../assets/img/Logo/oscuro/logotipo.png';

function Footer() {
  return (
    <footer className="bg-[#333333] text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="mb-6 flex items-center">
              <img src={logo} alt="TurboEmpleo Logo" className="w-60 h-auto" />
            </div>
            <p className="text-gray-400 mb-6">
              Conectamos talento con oportunidades laborales en todo Colombia de manera rápida y efectiva.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/turboempleo/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#5e17eb] transition-colors">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#5e17eb] transition-colors">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#5e17eb] transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#5e17eb] transition-colors">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Enlaces rápidos</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-400 hover:text-[#ffde59]">Inicio</Link></li>
              <li><Link to="/vacantes" className="text-gray-400 hover:text-[#ffde59]">Buscar empleo</Link></li>
              <li><Link to="/empresas" className="text-gray-400 hover:text-[#ffde59]">Empresas</Link></li>
              <li><Link to="/blog" className="text-gray-400 hover:text-[#ffde59]">Blog</Link></li>
              <li><Link to="/nosotros" className="text-gray-400 hover:text-[#ffde59]">Sobre nosotros</Link></li>
              <li><Link to="/contacto" className="text-gray-400 hover:text-[#ffde59]">Contacto</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Para empresas</h3>
            <ul className="space-y-3">
              <li><Link to="/empresas/publicar" className="text-gray-400 hover:text-[#ffde59]">Publicar vacante</Link></li>
              <li><Link to="/empresas/planes" className="text-gray-400 hover:text-[#ffde59]">Planes y precios</Link></li>
              <li><Link to="/empresas/recursos" className="text-gray-400 hover:text-[#ffde59]">Recursos para reclutadores</Link></li>
              <li><Link to="/empresas/testimonios" className="text-gray-400 hover:text-[#ffde59]">Testimonios</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Contacto</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt mt-1 mr-3 text-[#ffde59]"></i>
                <span>Calle 123 #45-67, Bogotá, Colombia</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-phone-alt mr-3 text-[#ffde59]"></i>
                <span>+57 601 234 5678</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-envelope mr-3 text-[#ffde59]"></i>
                <span>contacto@turboempleo.co</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
          <p>© 2025 TurboEmpleo. Todos los derechos reservados.</p>
          <div className="flex justify-center space-x-6 mt-4">
            <Link to="/PoliticaPrivacidad" className="hover:text-[#ffde59]">Política de privacidad</Link>
            <Link to="/TerminosUso" className="hover:text-[#ffde59]">Términos de uso</Link>
            <Link to="/PoliticaDatos" className="hover:text-[#ffde59]">Tratamiento de datos personales</Link>
          </div>
          <p className="mt-4">⚡ Proyecto académico desarrollado en el SENA – 2025.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;