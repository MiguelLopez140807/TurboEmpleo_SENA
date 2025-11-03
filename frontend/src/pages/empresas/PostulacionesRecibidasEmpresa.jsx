import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import { FaSync, FaList, FaChartBar, FaMapMarkerAlt, FaCalendarAlt, FaUser, FaFileAlt, FaTimes, FaEnvelope, FaPhone, FaBriefcase, FaGraduationCap, FaLanguage, FaIdCard } from 'react-icons/fa';

function PostulacionesRecibidasEmpresa() {
    const [postulaciones, setPostulaciones] = useState([]);
    const [vacantes, setVacantes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("");
    const [filtroVacante, setFiltroVacante] = useState("");
    const [filtroBusqueda, setFiltroBusqueda] = useState("");
    const [filtroFechaDesde, setFiltroFechaDesde] = useState("");
    const [filtroFechaHasta, setFiltroFechaHasta] = useState("");
    const [ordenamiento, setOrdenamiento] = useState("reciente");
    const [vistaAgrupada, setVistaAgrupada] = useState(true);
    const [aspiranteSeleccionado, setAspiranteSeleccionado] = useState(null);
    const [modalAbierto, setModalAbierto] = useState(false);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    
    let empresaId = null;
    try {
        const userData = JSON.parse(localStorage.getItem("user_data"));
        if (userData && userData.id) {
            empresaId = userData.id;
        }
    } catch (e) {}

    useEffect(() => {
        if (!empresaId) return;
        
        // Cargar vacantes de la empresa
        fetch(`http://127.0.0.1:8000/api/vacantes/?empresa=${empresaId}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        })
        .then(res => res.json())
        .then(data => {
            setVacantes(Array.isArray(data) ? data : []);
        })
        .catch(err => console.error("Error al cargar vacantes:", err));
        
    }, [empresaId, token]);

    useEffect(() => {
        if (!empresaId) return;
        setLoading(true);
        
        // Construir URL con filtros
        const params = new URLSearchParams();
        if (filtroEstado) params.append('pos_estado', filtroEstado);
        
        // Obtener postulaciones de todas las vacantes de la empresa
        fetch(`http://127.0.0.1:8000/api/postulaciones/?${params.toString()}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        })
        .then((res) => res.json())
        .then((data) => {
            const allPostulaciones = Array.isArray(data) ? data : [];
            
            // Filtrar solo las postulaciones de vacantes de esta empresa
            const vacanteIds = vacantes.map(v => v.id);
            const postulacionesFiltradas = allPostulaciones.filter(post => 
                vacanteIds.includes(post.pos_vacante_fk?.id)
            );
            
            // Aplicar filtro por vacante específica si está seleccionado
            let postulacionesFinales = filtroVacante 
                ? postulacionesFiltradas.filter(post => post.pos_vacante_fk?.id === parseInt(filtroVacante))
                : postulacionesFiltradas;
            
            // Aplicar filtro de búsqueda por nombre del aspirante
            if (filtroBusqueda.trim()) {
                const busqueda = filtroBusqueda.toLowerCase();
                postulacionesFinales = postulacionesFinales.filter(post => {
                    const nombreCompleto = `${post.pos_aspirante_fk?.asp_nombre || ''} ${post.pos_aspirante_fk?.asp_apellido || ''}`.toLowerCase();
                    return nombreCompleto.includes(busqueda);
                });
            }
            
            // Aplicar filtro por fecha
            if (filtroFechaDesde) {
                postulacionesFinales = postulacionesFinales.filter(post => 
                    new Date(post.pos_fecha_postulacion) >= new Date(filtroFechaDesde)
                );
            }
            if (filtroFechaHasta) {
                const fechaHasta = new Date(filtroFechaHasta);
                fechaHasta.setHours(23, 59, 59, 999); // Incluir todo el día
                postulacionesFinales = postulacionesFinales.filter(post => 
                    new Date(post.pos_fecha_postulacion) <= fechaHasta
                );
            }
            
            // Aplicar ordenamiento
            postulacionesFinales.sort((a, b) => {
                switch(ordenamiento) {
                    case 'reciente':
                        return new Date(b.pos_fecha_postulacion) - new Date(a.pos_fecha_postulacion);
                    case 'antiguo':
                        return new Date(a.pos_fecha_postulacion) - new Date(b.pos_fecha_postulacion);
                    case 'nombre':
                        const nombreA = `${a.pos_aspirante_fk?.asp_nombre || ''} ${a.pos_aspirante_fk?.asp_apellido || ''}`;
                        const nombreB = `${b.pos_aspirante_fk?.asp_nombre || ''} ${b.pos_aspirante_fk?.asp_apellido || ''}`;
                        return nombreA.localeCompare(nombreB);
                    default:
                        return 0;
                }
            });
            
            setPostulaciones(postulacionesFinales);
            setLoading(false);
        })
        .catch(() => {
            setError("Error al cargar las postulaciones.");
            setLoading(false);
        });
    }, [empresaId, token, filtroEstado, filtroVacante, filtroBusqueda, filtroFechaDesde, filtroFechaHasta, ordenamiento, vacantes]);

    const cambiarEstadoPostulacion = async (postulacionId, nuevoEstado) => {
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/postulaciones/${postulacionId}/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ pos_estado: nuevoEstado })
            });
            
            if (res.ok) {
                setPostulaciones(prev => prev.map(post => 
                    post.id === postulacionId 
                        ? { ...post, pos_estado: nuevoEstado }
                        : post
                ));
                alert(`Postulación marcada como ${nuevoEstado}`);
            } else {
                alert("Error al actualizar el estado de la postulación");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error de conexión al actualizar estado");
        }
    };

    const abrirPerfilAspirante = (aspirante) => {
        try {
            if (!aspirante) {
                console.error('No se proporcionó información del aspirante');
                return;
            }
            console.log('Abriendo perfil del aspirante:', aspirante);
            setAspiranteSeleccionado(aspirante);
            setModalAbierto(true);
        } catch (error) {
            console.error('Error al abrir perfil del aspirante:', error);
            alert('Error al cargar el perfil del aspirante. Por favor, intenta de nuevo.');
        }
    };

    const cerrarModal = () => {
        setModalAbierto(false);
        setAspiranteSeleccionado(null);
    };

    const postulacionesAgrupadas = vistaAgrupada ? postulaciones.reduce((acc, post) => {
        const vacanteId = post.pos_vacante_fk?.id;
        if (!vacanteId) return acc;
        
        if (!acc[vacanteId]) {
            acc[vacanteId] = {
                vacante: post.pos_vacante_fk,
                postulaciones: []
            };
        }
        acc[vacanteId].postulaciones.push(post);
        return acc;
    }, {}) : null;

    return (
        <>
            <Navbar />
            
            {/* Modal de Perfil del Aspirante */}
            {modalAbierto && aspiranteSeleccionado && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={cerrarModal}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        {/* Header del Modal */}
                        <div className="sticky top-0 bg-gradient-to-r from-[#5e17eb] to-[#A67AFF] text-white p-6 rounded-t-2xl flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                {aspiranteSeleccionado?.asp_foto ? (
                                    <img src={aspiranteSeleccionado.asp_foto} alt="Foto" className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg" />
                                ) : (
                                    <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-[#5e17eb] border-4 border-white shadow-lg">
                                        <FaUser className="text-3xl" />
                                    </div>
                                )}
                                <div>
                                    <h2 className="text-2xl font-bold">
                                        {aspiranteSeleccionado?.asp_nombre || ''} {aspiranteSeleccionado?.asp_apellido || ''}
                                    </h2>
                                    <p className="text-purple-100">{aspiranteSeleccionado?.asp_cargo || 'Aspirante'}</p>
                                </div>
                            </div>
                            <button onClick={cerrarModal} className="text-white hover:bg-white hover:text-[#5e17eb] rounded-full p-2 transition">
                                <FaTimes className="text-2xl" />
                            </button>
                        </div>
                        
                        {/* Contenido del Modal */}
                        <div className="p-6 space-y-6">
                            {/* Información de Contacto */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                <h3 className="text-lg font-bold text-[#5e17eb] mb-4 flex items-center gap-2">
                                    <FaEnvelope /> Información de Contacto
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-600">Correo electrónico</p>
                                        <p className="text-gray-800">{aspiranteSeleccionado?.asp_correo || 'No especificado'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-600">Teléfono</p>
                                        <p className="text-gray-800 flex items-center gap-2">
                                            <FaPhone className="text-[#5e17eb]" /> {aspiranteSeleccionado?.asp_telefono || 'No especificado'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-600">Ubicación</p>
                                        <p className="text-gray-800 flex items-center gap-2">
                                            <FaMapMarkerAlt className="text-[#5e17eb]" /> 
                                            {aspiranteSeleccionado?.asp_ciudad || 'No especificado'}, {aspiranteSeleccionado?.asp_departamento || 'No especificado'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-600">Identificación</p>
                                        <p className="text-gray-800 flex items-center gap-2">
                                            <FaIdCard className="text-[#5e17eb]" /> 
                                            {aspiranteSeleccionado?.asp_tipoId || 'N/A'} {aspiranteSeleccionado?.asp_numeroId || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Perfil Profesional */}
                            {aspiranteSeleccionado?.asp_descripcion && aspiranteSeleccionado.asp_descripcion.trim() !== '' && (
                                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                    <h3 className="text-lg font-bold text-[#5e17eb] mb-4 flex items-center gap-2">
                                        <FaBriefcase /> Perfil Profesional
                                    </h3>
                                    <p className="text-gray-700 whitespace-pre-line">{aspiranteSeleccionado.asp_descripcion}</p>
                                </div>
                            )}
                            
                            {/* Ocupación Deseada */}
                            {aspiranteSeleccionado?.asp_ocupacion && aspiranteSeleccionado.asp_ocupacion.trim() !== '' && (
                                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                    <h3 className="text-lg font-bold text-[#5e17eb] mb-4 flex items-center gap-2">
                                        <FaBriefcase /> Ocupación Deseada
                                    </h3>
                                    <p className="text-gray-700">{aspiranteSeleccionado.asp_ocupacion}</p>
                                </div>
                            )}
                            
                            {/* Idiomas */}
                            {(() => {
                                try {
                                    const idiomas = aspiranteSeleccionado?.asp_idiomas 
                                        ? (typeof aspiranteSeleccionado.asp_idiomas === 'string' 
                                            ? JSON.parse(aspiranteSeleccionado.asp_idiomas) 
                                            : aspiranteSeleccionado.asp_idiomas)
                                        : [];
                                    
                                    if (Array.isArray(idiomas) && idiomas.length > 0) {
                                        return (
                                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                                <h3 className="text-lg font-bold text-[#5e17eb] mb-4 flex items-center gap-2">
                                                    <FaLanguage /> Idiomas
                                                </h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {idiomas.map((idioma, index) => (
                                                        <span key={index} className="px-3 py-1 bg-[#5e17eb] text-white rounded-full text-sm font-semibold">
                                                            {idioma}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                } catch (error) {
                                    console.error('Error parsing idiomas:', error);
                                    return null;
                                }
                            })()}
                            
                            {/* Información Personal */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                <h3 className="text-lg font-bold text-[#5e17eb] mb-4 flex items-center gap-2">
                                    <FaUser /> Información Personal
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {aspiranteSeleccionado?.asp_nacimiento_dia && (
                                        <div>
                                            <p className="text-sm font-semibold text-gray-600">Fecha de nacimiento</p>
                                            <p className="text-gray-800">
                                                {aspiranteSeleccionado.asp_nacimiento_dia}/{aspiranteSeleccionado.asp_nacimiento_mes}/{aspiranteSeleccionado.asp_nacimiento_anio}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {/* Currículum */}
                            {aspiranteSeleccionado?.asp_curriculum && (
                                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border-2 border-[#5e17eb]">
                                    <h3 className="text-lg font-bold text-[#5e17eb] mb-4 flex items-center gap-2">
                                        <FaFileAlt /> Currículum Vitae
                                    </h3>
                                    <a 
                                        href={aspiranteSeleccionado.asp_curriculum} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#5e17eb] text-white rounded-lg hover:bg-[#A67AFF] transition font-semibold shadow-md"
                                    >
                                        <FaFileAlt /> Descargar CV
                                    </a>
                                </div>
                            )}
                        </div>
                        
                        {/* Footer del Modal */}
                        <div className="sticky bottom-0 bg-gray-100 p-4 rounded-b-2xl flex justify-end">
                            <button 
                                onClick={cerrarModal}
                                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-semibold"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="min-h-screen flex flex-col bg-[#f6f4fa] items-center py-10 pt-24">
                <h1 className="text-3xl font-bold text-[#A67AFF] mb-6">Panel de Postulaciones</h1>
                
                {/* Panel de Filtros */}
                <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg p-6 mb-6 border-t-4 border-[#5e17eb]">
                    <h2 className="text-xl font-bold text-[#5e17eb] mb-4">Filtros y opciones</h2>
                    
                    {/* Primera fila de filtros */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Buscar aspirante</label>
                            <input
                                type="text"
                                value={filtroBusqueda}
                                onChange={(e) => setFiltroBusqueda(e.target.value)}
                                placeholder="Nombre o apellido..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5e17eb]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Vacante</label>
                            <select
                                value={filtroVacante}
                                onChange={(e) => setFiltroVacante(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5e17eb]"
                            >
                                <option value="">Todas las vacantes</option>
                                {vacantes.map(vac => (
                                    <option key={vac.id} value={vac.id}>{vac.va_titulo}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Estado</label>
                            <select
                                value={filtroEstado}
                                onChange={(e) => setFiltroEstado(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5e17eb]"
                            >
                                <option value="">Todos los estados</option>
                                <option value="Pendiente">Pendiente</option>
                                <option value="En Revisión">En Revisión</option>
                                <option value="Entrevista Programada">Entrevista Programada</option>
                                <option value="Aceptada">Aceptada</option>
                                <option value="Rechazada">Rechazada</option>
                            </select>
                        </div>
                    </div>
                    
                    {/* Segunda fila de filtros */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha desde</label>
                            <input
                                type="date"
                                value={filtroFechaDesde}
                                onChange={(e) => setFiltroFechaDesde(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5e17eb]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha hasta</label>
                            <input
                                type="date"
                                value={filtroFechaHasta}
                                onChange={(e) => setFiltroFechaHasta(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5e17eb]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Ordenar por</label>
                            <select
                                value={ordenamiento}
                                onChange={(e) => setOrdenamiento(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5e17eb]"
                            >
                                <option value="reciente">Más reciente</option>
                                <option value="antiguo">Más antiguo</option>
                                <option value="nombre">Nombre (A-Z)</option>
                            </select>
                        </div>
                    </div>
                    
                    {/* Botones de acción */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                            onClick={() => {
                                setFiltroVacante("");
                                setFiltroEstado("");
                                setFiltroBusqueda("");
                                setFiltroFechaDesde("");
                                setFiltroFechaHasta("");
                                setOrdenamiento("reciente");
                            }}
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-semibold flex items-center justify-center gap-2"
                        >
                            <FaSync /> Limpiar todos los filtros
                        </button>
                        <button
                            onClick={() => setVistaAgrupada(!vistaAgrupada)}
                            className="px-4 py-2 bg-[#5e17eb] text-white rounded-lg hover:bg-[#A67AFF] transition font-semibold flex items-center justify-center gap-2"
                        >
                            {vistaAgrupada ? <><FaList /> Vista lista</> : <><FaChartBar /> Vista agrupada</>}
                        </button>
                    </div>
                    
                    {/* Contador de resultados */}
                    <div className="mt-4 p-3 bg-[#f3e8ff] rounded-lg border-l-4 border-[#5e17eb]">
                        <p className="text-sm font-semibold text-[#5e17eb] flex items-center gap-2">
                            <FaChartBar /> {postulaciones.length} {postulaciones.length === 1 ? 'postulación encontrada' : 'postulaciones encontradas'}
                            {(filtroBusqueda || filtroVacante || filtroEstado || filtroFechaDesde || filtroFechaHasta) && 
                                <span className="ml-2 text-gray-600">(filtros activos)</span>
                            }
                        </p>
                    </div>
                </div>
                {loading ? (
                    <div>Cargando postulaciones...</div>
                ) : error ? (
                    <div className="text-red-500">{error}</div>
                ) : postulaciones.length === 0 ? (
                    <div className="bg-white rounded-xl shadow p-8 text-center max-w-md">
                        <p className="text-gray-600 mb-4">No hay postulaciones con los filtros seleccionados.</p>
                        <button
                            onClick={() => {
                                setFiltroVacante("");
                                setFiltroEstado("");
                                setFiltroBusqueda("");
                                setFiltroFechaDesde("");
                                setFiltroFechaHasta("");
                                setOrdenamiento("reciente");
                            }}
                            className="px-6 py-2 bg-[#5e17eb] text-white rounded-lg hover:bg-[#A67AFF] transition"
                        >
                            Ver todas las postulaciones
                        </button>
                    </div>
                ) : vistaAgrupada ? (
                    <div className="w-full max-w-6xl space-y-6">
                        {Object.values(postulacionesAgrupadas).map(({ vacante, postulaciones: posts }) => (
                            <div key={vacante.id} className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-[#A67AFF]">
                                <h3 className="text-2xl font-bold text-[#5e17eb] mb-2">{vacante.va_titulo}</h3>
                                <p className="text-gray-600 mb-4">{posts.length} {posts.length === 1 ? 'postulación' : 'postulaciones'}</p>
                                <div className="space-y-4">
                                    {posts.map(post => {
                                        const aspirante = post.pos_aspirante_fk;
                                        return (
                                            <div key={post.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-4">
                                                        {aspirante?.asp_foto ? (
                                                            <img src={aspirante.asp_foto} alt="Foto" className="w-12 h-12 rounded-full object-cover border-2 border-gray-300" />
                                                        ) : (
                                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center text-purple-600 border-2 border-purple-300">
                                                                <FaUser className="text-xl" />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p 
                                                                className="font-bold text-gray-800 hover:text-[#5e17eb] cursor-pointer transition"
                                                                onClick={() => abrirPerfilAspirante(aspirante)}
                                                            >
                                                                {aspirante?.asp_nombre} {aspirante?.asp_apellido}
                                                            </p>
                                                            <p className="text-sm text-gray-600 flex items-center gap-2">
                                                                <FaMapMarkerAlt /> {aspirante?.asp_ciudad} • <FaCalendarAlt /> {new Date(post.pos_fechaPostulacion).toLocaleDateString('es-CO')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                        post.pos_estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                                                        post.pos_estado === 'En Revisión' ? 'bg-blue-100 text-blue-800' :
                                                        post.pos_estado === 'Aceptada' || post.pos_estado === 'Entrevista Programada' ? 'bg-green-100 text-green-800' :
                                                        post.pos_estado === 'Rechazada' ? 'bg-red-100 text-red-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {post.pos_estado}
                                                    </span>
                                                </div>
                                                <div className="flex gap-2 flex-wrap">
                                                    <button
                                                        onClick={() => abrirPerfilAspirante(aspirante)}
                                                        className="px-3 py-1 bg-[#5e17eb] text-white rounded hover:bg-[#A67AFF] text-xs font-semibold flex items-center gap-1"
                                                    >
                                                        <FaUser /> Ver perfil completo
                                                    </button>
                                                    {aspirante?.asp_curriculum && (
                                                        <a 
                                                            href={aspirante.asp_curriculum} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-xs font-semibold flex items-center gap-1"
                                                        >
                                                            <FaFileAlt /> Ver CV
                                                        </a>
                                                    )}
                                                    {post.pos_estado === 'Pendiente' && (
                                                        <>
                                                            <button 
                                                                onClick={() => cambiarEstadoPostulacion(post.id, 'En Revisión')}
                                                                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs font-semibold"
                                                            >
                                                                En revisión
                                                            </button>
                                                            <button 
                                                                onClick={() => cambiarEstadoPostulacion(post.id, 'Entrevista Programada')}
                                                                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs font-semibold"
                                                            >
                                                                Entrevistar
                                                            </button>
                                                            <button 
                                                                onClick={() => cambiarEstadoPostulacion(post.id, 'Rechazada')}
                                                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs font-semibold"
                                                            >
                                                                Rechazar
                                                            </button>
                                                        </>
                                                    )}
                                                    {post.pos_estado === 'En Revisión' && (
                                                        <>
                                                            <button 
                                                                onClick={() => cambiarEstadoPostulacion(post.id, 'Entrevista Programada')}
                                                                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs font-semibold"
                                                            >
                                                                Programar entrevista
                                                            </button>
                                                            <button 
                                                                onClick={() => cambiarEstadoPostulacion(post.id, 'Rechazada')}
                                                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs font-semibold"
                                                            >
                                                                Rechazar
                                                            </button>
                                                        </>
                                                    )}
                                                    {post.pos_estado === 'Entrevista Programada' && (
                                                        <>
                                                            <button 
                                                                onClick={() => cambiarEstadoPostulacion(post.id, 'Aceptada')}
                                                                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs font-semibold"
                                                            >
                                                                Aceptar
                                                            </button>
                                                            <button 
                                                                onClick={() => cambiarEstadoPostulacion(post.id, 'Rechazada')}
                                                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs font-semibold"
                                                            >
                                                                Rechazar
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl">
                        {postulaciones.map((post) => {
                            const aspirante = post.pos_aspirante_fk;
                            const vacante = post.pos_vacante_fk;
                            return (
                                <div key={post.id} className="bg-white rounded-xl shadow-md p-6 border-t-4 border-[#A67AFF] hover:shadow-lg transition">
                                    <div className="flex items-center gap-3 mb-3">
                                        {aspirante?.asp_foto ? (
                                            <img src={aspirante.asp_foto} alt="Foto" className="w-12 h-12 rounded-full object-cover border" />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center text-purple-600 border-2 border-purple-300">
                                                <FaUser className="text-xl" />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <div 
                                                className="font-bold text-md text-[#5e17eb] hover:text-[#A67AFF] cursor-pointer transition"
                                                onClick={() => abrirPerfilAspirante(aspirante)}
                                            >
                                                {aspirante?.asp_nombre} {aspirante?.asp_apellido}
                                            </div>
                                            <div className="text-xs text-gray-500">Aplicó para: {vacante?.va_titulo}</div>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                                            post.pos_estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-700' :
                                            post.pos_estado === 'En Revisión' ? 'bg-blue-100 text-blue-700' :
                                            post.pos_estado === 'Aceptada' || post.pos_estado === 'Entrevista Programada' ? 'bg-green-100 text-green-700' :
                                            'bg-red-100 text-red-700'
                                        }`}>
                                            {post.pos_estado}
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-500 mb-3 flex items-center gap-2">
                                        <FaMapMarkerAlt /> {aspirante?.asp_ciudad} • <FaCalendarAlt /> {new Date(post.pos_fechaPostulacion).toLocaleDateString('es-CO')}
                                    </div>
                                    <div className="flex gap-2 flex-wrap">
                                        <button
                                            onClick={() => abrirPerfilAspirante(aspirante)}
                                            className="px-3 py-1 bg-[#5e17eb] text-white rounded hover:bg-[#A67AFF] text-xs font-semibold flex items-center gap-1"
                                        >
                                            <FaUser /> Ver perfil
                                        </button>
                                        {aspirante?.asp_curriculum && (
                                            <a 
                                                href={aspirante.asp_curriculum} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-xs font-semibold"
                                            >
                                                Ver CV
                                            </a>
                                        )}
                                        {post.pos_estado === 'Pendiente' && (
                                            <>
                                                <button 
                                                    onClick={() => cambiarEstadoPostulacion(post.id, 'En Revisión')}
                                                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs font-semibold"
                                                >
                                                    Revisar
                                                </button>
                                                <button 
                                                    onClick={() => cambiarEstadoPostulacion(post.id, 'Entrevista Programada')}
                                                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs font-semibold"
                                                >
                                                    Entrevistar
                                                </button>
                                                <button 
                                                    onClick={() => cambiarEstadoPostulacion(post.id, 'Rechazada')}
                                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs font-semibold"
                                                >
                                                    Rechazar
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}

export default PostulacionesRecibidasEmpresa;
