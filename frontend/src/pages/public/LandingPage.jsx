import { useState } from 'react';  // Solo necesitamos useState para el formulario del newsletter
import { Link } from 'react-router-dom';
import img_personas2 from '../../assets/img/LandingPage/img_personas2.jpg';
import imgcolombiano from '../../assets/img/LandingPage/imgcolombiano.jpg';

const LandingPage = () => {
  // Estado solo para el formulario del newsletter
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el formulario
    alert('Gracias por suscribirte a nuestro newsletter');
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="pt-24 bg-gradient-to-br from-[#5e17eb] to-[#A67AFF] text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            {/* Contenido del Hero */}
            <div className="md:w-1/2 space-y-8">
              <div className="space-y-4">
                <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                  Plataforma #1 de empleo en Colombia
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Tu próximo empleo está a <span className="text-[#ffde59]">un clic</span> de distancia
                </h1>
              </div>
              
              <p className="text-lg md:text-xl text-white/90 max-w-xl">
                Conectamos talento con oportunidades. Encuentra el trabajo ideal o publica tus vacantes en minutos.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link 
                  to="/vacantes" 
                  className="px-8 py-4 bg-[#ffde59] text-[#5e17eb] font-bold rounded-full hover:bg-opacity-90 transition-all transform hover:scale-105 text-center shadow-lg"
                >
                  Buscar Empleo
                </Link>
                <Link 
                  to="/empresas" 
                  className="px-8 py-4 bg-white text-[#5e17eb] font-bold rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 text-center shadow-lg"
                >
                  Publicar Vacante
                </Link>
              </div>
              
              {/* Estadísticas rápidas */}
              <div className="flex flex-wrap gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ffde59]"></div>
                  <span className="text-white/90">+10,000 vacantes</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ffde59]"></div>
                  <span className="text-white/90">+5,000 empresas</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ffde59]"></div>
                  <span className="text-white/90">+25,000 contratos</span>
                </div>
              </div>
            </div>
            
            {/* Imagen del Hero */}
            <div className="md:w-1/2 flex justify-center relative">
              <div className="relative">
                {/* Círculo decorativo */}
                <div className="absolute -inset-4 bg-gradient-to-r from-[#ffde59]/30 to-transparent rounded-full blur-xl opacity-50"></div>
                
                {/* Imagen principal */}
                <img 
                  src={imgcolombiano} 
                  alt="Profesionales colombianos conectando con oportunidades laborales" 
                  className="relative max-w-full h-auto rounded-2xl shadow-2xl border-4 border-white/20"
                />
                
                {/* Elementos decorativos flotantes */}
                <div className="absolute -top-6 -right-6 w-16 h-16 rounded-full bg-[#ffde59] flex items-center justify-center shadow-lg">
                  <i className="fas fa-briefcase text-[#5e17eb] text-xl"></i>
                </div>
                <div className="absolute -bottom-6 -left-6 w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg">
                  <i className="fas fa-check text-[#5e17eb] text-xl"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Onda decorativa al final del Hero */}
      <div className="relative h-16 bg-white">
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-0">
          <svg className="relative block w-[calc(100%+1.3px)] h-16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
                  className="fill-[#A67AFF]"></path>
          </svg>
        </div>
      </div>

      {/* Búsqueda Rápida */}
      <div className="bg-[#F8F8F8] py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Encuentra tu empleo ideal</h2>
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">¿Qué buscas?</label>
                <input type="text" placeholder="Cargo, keywords o empresa" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5e17eb]" />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">¿Dónde?</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5e17eb]">
                  <option value="">Todas las ciudades</option>
                  <option value="bogota">Bogotá</option>
                  <option value="medellin">Medellín</option>
                  <option value="cali">Cali</option>
                  <option value="barranquilla">Barranquilla</option>
                  <option value="cartagena">Cartagena</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Categoría</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5e17eb]">
                  <option value="">Todas las categorías</option>
                  <option value="tecnologia">Tecnología</option>
                  <option value="marketing">Marketing</option>
                  <option value="ventas">Ventas</option>
                  <option value="administracion">Administración</option>
                  <option value="salud">Salud</option>
                </select>
              </div>
            </div>
            <div className="mt-6 text-center">
              <button className="px-8 py-3 bg-[#5e17eb] text-white font-semibold rounded-full hover:bg-opacity-90">
                <i className="fas fa-search mr-2"></i>Buscar Ahora
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Categorías Destacadas */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Categorías destacadas</h2>
          <p className="text-gray-600 text-center mb-10">Explora oportunidades laborales por sector</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { icon: 'fa-laptop-code', title: 'Tecnología', jobs: '+1,200 empleos' },
              { icon: 'fa-chart-line', title: 'Marketing', jobs: '+850 empleos' },
              { icon: 'fa-coins', title: 'Finanzas', jobs: '+920 empleos' },
              { icon: 'fa-handshake', title: 'Ventas', jobs: '+1,050 empleos' },
              { icon: 'fa-user-tie', title: 'Administración', jobs: '+760 empleos' },
              { icon: 'fa-heartbeat', title: 'Salud', jobs: '+680 empleos' },
              { icon: 'fa-university', title: 'Educación', jobs: '+520 empleos' },
              { icon: 'fa-ellipsis-h', title: 'Más Categorías', jobs: '+3,500 empleos' }
            ].map((category, index) => (
              <Link 
                key={index} 
                to={`/categorias/${category.title.toLowerCase()}`} 
                className="group bg-white rounded-xl shadow-md p-6 text-center hover:bg-[#5e17eb] transition-all transform hover:-translate-y-1"
              >
                <div className="w-16 h-16 mx-auto bg-[#ffde59] rounded-full flex items-center justify-center group-hover:bg-white transition-all">
                  <i className={`fas ${category.icon} text-[#5e17eb] text-2xl`}></i>
                </div>
                <h3 className="text-xl font-semibold mt-4 group-hover:text-white">{category.title}</h3>
                <p className="text-gray-600 mt-2 group-hover:text-white">{category.jobs}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Ofertas Destacadas */}
      <div className="bg-[#F8F8F8] py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Ofertas destacadas</h2>
          <p className="text-gray-600 text-center mb-10">Las mejores oportunidades laborales actualizadas diariamente</p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Oferta 1 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden transform transition-transform hover:-translate-y-1">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <img src="https://cdn.pixabay.com/photo/2022/01/30/13/33/github-6980894_1280.png" alt="Logo Empresa" className="w-12 h-12 object-contain" />
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold">Desarrollador Full Stack</h3>
                    <p className="text-gray-600">TechCorp Colombia</p>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <i className="fas fa-map-marker-alt mr-2 text-[#5e17eb]"></i>
                  <span>Bogotá (Remoto)</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <i className="fas fa-money-bill-wave mr-2 text-[#5e17eb]"></i>
                  <span>$4.500.000 - $6.000.000</span>
                </div>
                <p className="text-gray-700 mb-6 line-clamp-3">
                  Buscamos desarrollador full stack con experiencia en React, Node.js y bases de datos SQL/NoSQL. Mínimo 3 años de experiencia en desarrollo web.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 bg-purple-100 text-[#5e17eb] text-xs rounded-full">React</span>
                  <span className="px-3 py-1 bg-purple-100 text-[#5e17eb] text-xs rounded-full">Node.js</span>
                  <span className="px-3 py-1 bg-purple-100 text-[#5e17eb] text-xs rounded-full">MongoDB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Hace 2 días</span>
                  <Link to={`/vacantes/1`} className="px-4 py-2 bg-[#5e17eb] text-white rounded-full hover:bg-opacity-90">Ver detalles</Link>
                </div>
              </div>
            </div>

            {/* Oferta 2 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden transform transition-transform hover:-translate-y-1">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <img src="https://cdn.pixabay.com/photo/2018/05/08/21/29/paypal-3384015_1280.png" alt="Logo Empresa" className="w-12 h-12 object-contain" />
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold">Ejecutivo de Ventas Senior</h3>
                    <p className="text-gray-600">Marketing Global S.A.S</p>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <i className="fas fa-map-marker-alt mr-2 text-[#5e17eb]"></i>
                  <span>Medellín</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <i className="fas fa-money-bill-wave mr-2 text-[#5e17eb]"></i>
                  <span>$3.200.000 - $4.800.000 + comisiones</span>
                </div>
                <p className="text-gray-700 mb-6 line-clamp-3">
                  Importante empresa de marketing digital busca ejecutivo comercial con experiencia en ventas B2B y manejo de cartera de clientes. Ofrecemos excelente plan de comisiones.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 bg-purple-100 text-[#5e17eb] text-xs rounded-full">Ventas</span>
                  <span className="px-3 py-1 bg-purple-100 text-[#5e17eb] text-xs rounded-full">Marketing Digital</span>
                  <span className="px-3 py-1 bg-purple-100 text-[#5e17eb] text-xs rounded-full">B2B</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Hace 1 día</span>
                  <Link to={`/vacantes/2`} className="px-4 py-2 bg-[#5e17eb] text-white rounded-full hover:bg-opacity-90">Ver detalles</Link>
                </div>
              </div>
            </div>

            {/* Oferta 3 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden transform transition-transform hover:-translate-y-1">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <img src="https://cdn.pixabay.com/photo/2013/02/12/09/07/microsoft-80658_1280.png" alt="Logo Empresa" className="w-12 h-12 object-contain" />
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold">Analista Financiero</h3>
                    <p className="text-gray-600">Grupo Financiero Nacional</p>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <i className="fas fa-map-marker-alt mr-2 text-[#5e17eb]"></i>
                  <span>Cali</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <i className="fas fa-money-bill-wave mr-2 text-[#5e17eb]"></i>
                  <span>$3.800.000 - $4.500.000</span>
                </div>
                <p className="text-gray-700 mb-6 line-clamp-3">
                  Se requiere profesional en finanzas, contaduría o áreas afines para analizar indicadores financieros, elaborar reportes y apoyar en la toma de decisiones estratégicas.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 bg-purple-100 text-[#5e17eb] text-xs rounded-full">Finanzas</span>
                  <span className="px-3 py-1 bg-purple-100 text-[#5e17eb] text-xs rounded-full">Excel Avanzado</span>
                  <span className="px-3 py-1 bg-purple-100 text-[#5e17eb] text-xs rounded-full">SAP</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Hace 3 días</span>
                  <Link to={`/vacantes/3`} className="px-4 py-2 bg-[#5e17eb] text-white rounded-full hover:bg-opacity-90">Ver detalles</Link>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link to="/vacantes" className="px-8 py-3 bg-white border border-[#5e17eb] text-[#5e17eb] font-semibold rounded-full hover:bg-[#5e17eb] hover:text-white transition-colors">
              Ver todas las vacantes
            </Link>
          </div>
        </div>
      </div>

      {/* Cómo Funciona */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">¿Cómo funciona TurboEmpleo?</h2>
          <p className="text-gray-600 text-center mb-16">Tres simples pasos para encontrar el trabajo de tus sueños</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-[#ffde59] rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-user-plus text-[#5e17eb] text-3xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3">1. Crea tu perfil</h3>
              <p className="text-gray-600">
                Regístrate, completa tu perfil profesional y sube tu hoja de vida para destacar tus habilidades y experiencia.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-[#ffde59] rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-search text-[#5e17eb] text-3xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3">2. Busca oportunidades</h3>
              <p className="text-gray-600">
                Explora miles de ofertas de empleo filtradas según tus preferencias y guarda tus búsquedas favoritas.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-[#ffde59] rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-paper-plane text-[#5e17eb] text-3xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3">3. Postúlate y conecta</h3>
              <p className="text-gray-600">
                Aplica a las vacantes con un solo clic y recibe notificaciones sobre el estado de tus postulaciones.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Para Empresas */}
      <div className="bg-gradient-to-r from-[#5e17eb] to-[#A67AFF] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-3xl font-bold mb-4">¿Eres una empresa y buscas talento?</h2>
              <p className="text-lg mb-6">
                Publica tus vacantes, gestiona postulaciones y encuentra a los mejores profesionales para tu equipo. Ofrecemos planes flexibles para empresas de todos los tamaños.
              </p>
              <Link to="/empresas" className="px-8 py-3 bg-white text-[#5e17eb] font-semibold rounded-full hover:bg-[#ffde59] transition-colors inline-block">
                Publicar Vacante Ahora
              </Link>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img src={img_personas2} alt="Empresas" className="rounded-lg shadow-lg max-w-full h-auto" />
            </div>
          </div>
        </div>
      </div>

      {/* Testimonios */}
      <div className="bg-[#F8F8F8] py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Lo que dicen nuestros usuarios</h2>
          <p className="text-gray-600 text-center mb-12">Historias de éxito que nos motivan a seguir mejorando</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonio 1 */}
            <div className="bg-white rounded-xl shadow-md p-6 transform transition-transform hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <img src="https://cdn.pixabay.com/photo/2016/11/21/12/42/beard-1845166_1280.jpg" alt="Usuario" className="w-14 h-14 rounded-full object-cover" />
                <div className="ml-4">
                  <h3 className="font-semibold">Carlos Rodríguez</h3>
                  <p className="text-gray-600 text-sm">Desarrollador Web</p>
                </div>
              </div>
              <p className="text-gray-700 italic mb-4">
                "Gracias a TurboEmpleo encontré mi trabajo ideal en menos de dos semanas. La plataforma es muy intuitiva y el sistema de notificaciones me mantuvo informado en todo momento."
              </p>
              <div className="flex text-[#ffde59]">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className="fas fa-star"></i>
                ))}
              </div>
            </div>

            {/* Testimonio 2 */}
            <div className="bg-white rounded-xl shadow-md p-6 transform transition-transform hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <img src="https://cdn.pixabay.com/photo/2017/02/16/23/10/smile-2072907_1280.jpg" alt="Usuario" className="w-14 h-14 rounded-full object-cover" />
                <div className="ml-4">
                  <h3 className="font-semibold">Laura Martínez</h3>
                  <p className="text-gray-600 text-sm">Gerente de Marketing</p>
                </div>
              </div>
              <p className="text-gray-700 italic mb-4">
                "Como reclutadora, TurboEmpleo ha revolucionado nuestra forma de encontrar talento. La calidad de los candidatos es excelente y el panel de gestión nos ahorra mucho tiempo."
              </p>
              <div className="flex text-[#ffde59]">
                {[...Array(4)].map((_, i) => (
                  <i key={i} className="fas fa-star"></i>
                ))}
                <i className="fas fa-star-half-alt"></i>
              </div>
            </div>

            {/* Testimonio 3 */}
            <div className="bg-white rounded-xl shadow-md p-6 transform transition-transform hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <img src="https://cdn.pixabay.com/photo/2016/11/29/09/38/adult-1868750_1280.jpg" alt="Usuario" className="w-14 h-14 rounded-full object-cover" />
                <div className="ml-4">
                  <h3 className="font-semibold">Andrés Gómez</h3>
                  <p className="text-gray-600 text-sm">Contador</p>
                </div>
              </div>
              <p className="text-gray-700 italic mb-4">
                "Después de varios meses buscando empleo sin éxito, me registré en TurboEmpleo y en un mes ya estaba trabajando. El filtro de búsqueda por ciudad y salario fue clave."
              </p>
              <div className="flex text-[#ffde59]">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className="fas fa-star"></i>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Blog / Artículos */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Blog de empleo</h2>
          <p className="text-gray-600 text-center mb-10">Consejos para impulsar tu carrera profesional</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Artículo 1 */}
            <div className="overflow-hidden rounded-xl shadow-md transform transition-transform hover:-translate-y-1">
              <img src="https://cdn.pixabay.com/photo/2020/07/08/04/12/work-5382501_1280.jpg" alt="Blog Post" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3">Cómo preparar una entrevista laboral exitosa</h3>
                <p className="text-gray-600 mb-4">Consejos prácticos para destacar en tu próxima entrevista y conseguir el trabajo que deseas.</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Mayo 15, 2025</span>
                  <Link to="/blog/1" className="text-[#5e17eb] font-medium hover:underline">Leer más</Link>
                </div>
              </div>
            </div>

            {/* Artículo 2 */}
            <div className="overflow-hidden rounded-xl shadow-md transform transition-transform hover:-translate-y-1">
              <img src="https://cdn.pixabay.com/photo/2017/10/12/22/17/business-2846221_1280.jpg" alt="Blog Post" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3">Las 10 habilidades más demandadas en 2025</h3>
                <p className="text-gray-600 mb-4">Descubre cuáles son las competencias profesionales más valoradas por las empresas actualmente.</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Mayo 8, 2025</span>
                  <Link to="/blog/2" className="text-[#5e17eb] font-medium hover:underline">Leer más</Link>
                </div>
              </div>
            </div>

            {/* Artículo 3 */}
            <div className="overflow-hidden rounded-xl shadow-md transform transition-transform hover:-translate-y-1">
              <img src="https://cdn.pixabay.com/photo/2015/07/17/22/43/student-849825_1280.jpg" alt="Blog Post" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3">Cómo crear un CV que capture la atención</h3>
                <p className="text-gray-600 mb-4">Guía paso a paso para elaborar un currículum efectivo que destaque entre la competencia.</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Mayo 1, 2025</span>
                  <Link to="/blog/3" className="text-[#5e17eb] font-medium hover:underline">Leer más</Link>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link to="/blog" className="px-8 py-3 border border-[#5e17eb] text-[#5e17eb] font-semibold rounded-full hover:bg-[#5e17eb] hover:text-white transition-colors">
              Ver todos los artículos
            </Link>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="relative bg-gradient-to-r from-[#5e17eb] to-[#A67AFF] py-20 overflow-hidden">
        {/* Elementos decorativos de fondo */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-10 left-10 w-24 h-24 rounded-full bg-white"></div>
            <div className="absolute top-32 right-16 w-16 h-16 rounded-full bg-white"></div>
            <div className="absolute bottom-20 left-1/4 w-20 h-20 rounded-full bg-white"></div>
            <div className="absolute bottom-10 right-1/3 w-32 h-32 rounded-full bg-white"></div>
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Icono representativo */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">¿Quieres recibir ofertas exclusivas?</h2>
            <p className="text-lg text-white/90 mb-10 max-w-2xl mx-auto">
              Suscríbete a nuestro newsletter y recibe las mejores oportunidades laborales directamente en tu bandeja de entrada.
            </p>
            
            {/* Formulario mejorado */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2 max-w-2xl mx-auto">
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Tu correo electrónico" 
                    className="w-full px-6 py-4 bg-white rounded-full text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ffde59]"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  className="px-8 py-4 bg-[#ffde59] text-[#5e17eb] font-bold rounded-full hover:bg-opacity-90 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ffde59] shadow-lg"
                >
                  Suscribirme
                </button>
              </form>
            </div>
            
            {/* Mensaje de garantía */}
            <p className="text-white/70 text-sm mt-6 flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              No compartimos tu correo. Puedes darte de baja cuando quieras.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage; 