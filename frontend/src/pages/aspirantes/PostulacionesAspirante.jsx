import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import Breadcrumbs from '../../components/Breadcrumbs';
import BadgeTurbo from '../../components/BadgeTurbo';
import { FaMapMarkerAlt, FaDollarSign, FaClock, FaBuilding } from 'react-icons/fa';

function PostulacionesAspirante() {
    const [postulaciones, setPostulaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filtroTurbo, setFiltroTurbo] = useState(false);
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user_data") || "null");
    const navigate = useNavigate();

    // Estados para paginación
    const [paginaActual, setPaginaActual] = useState(1);
    const postulacionesPorPagina = 4;

    const breadcrumbItems = [
        { label: 'Dashboard', path: '/aspirantes/dashboard' },
        { label: 'Mis Postulaciones', active: true }
    ];

    // Cálculos de paginación
    const postulacionesFiltradas = filtroTurbo 
        ? postulaciones.filter(p => p.pos_es_turbo)
        : postulaciones;
    
    const indiceUltimaPostulacion = paginaActual * postulacionesPorPagina;
    const indicePrimeraPostulacion = indiceUltimaPostulacion - postulacionesPorPagina;
    const postulacionesActuales = postulacionesFiltradas.slice(indicePrimeraPostulacion, indiceUltimaPostulacion);
    const totalPaginas = Math.ceil(postulacionesFiltradas.length / postulacionesPorPagina);

    // Funciones de paginación
    const irAPaginaSiguiente = () => {
        if (paginaActual < totalPaginas) {
            setPaginaActual(paginaActual + 1);
        }
    };

    const irAPaginaAnterior = () => {
        if (paginaActual > 1) {
            setPaginaActual(paginaActual - 1);
        }
    };

    // Resetear página cuando cambie el filtro
    useEffect(() => {
        setPaginaActual(1);
    }, [filtroTurbo]);

    useEffect(() => {
        if (!userData?.id) return;
        fetch(`http://127.0.0.1:8000/api/postulaciones/?pos_aspirante_fk=${userData.id}`,
            { headers: token ? { Authorization: `Bearer ${token}` } : {} }
        )
            .then((res) => res.json())
            .then((data) => {
                setPostulaciones(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => {
                setError("Error al cargar las postulaciones.");
                setLoading(false);
            });
    }, [token, userData?.id]);

    return (
        <>
            <Navbar />
            <div className="min-h-screen flex flex-col bg-[#f6f4fa] items-center py-10 pt-24">
                <div className="w-full max-w-6xl px-4">
                    <Breadcrumbs items={breadcrumbItems} />
                </div>
                <h1 className="text-3xl font-bold text-[#A67AFF] mb-6">Mis Postulaciones</h1>
                {loading ? (
                    <div>Cargando postulaciones...</div>
                ) : error ? (
                    <div className="text-red-500">{error}</div>
                ) : postulaciones.length === 0 ? (
                    <div className="bg-white rounded-xl shadow p-8 text-center max-w-md">
                        <p className="text-gray-600 mb-4">No tienes postulaciones registradas.</p>
                        <button
                            onClick={() => navigate("/aspirantes/vacantes")}
                            className="px-6 py-2 bg-[#5e17eb] text-white rounded-lg hover:bg-[#A67AFF] transition"
                        >
                            Ver vacantes disponibles
                        </button>
                    </div>
                ) : (
                    <div className="w-full max-w-6xl">
                        {/* Filtro Turbo */}
                        <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border-2 border-yellow-300">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={filtroTurbo}
                                    onChange={(e) => setFiltroTurbo(e.target.checked)}
                                    className="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                                />
                                <span className="flex items-center gap-2 text-base font-bold text-gray-800">
                                    <span className="text-2xl">⚡</span>
                                    Solo mostrar postulaciones con Modo Turbo
                                </span>
                            </label>
                        </div>
                        
                        <div className="mb-4 text-gray-700">
                            Total de postulaciones: <span className="font-bold">{postulacionesFiltradas.length}</span>
                            {filtroTurbo && (
                                <span className="ml-2 text-sm text-gray-500">
                                    (filtrando solo turbo)
                                </span>
                            )}
                        </div>
                        <div className="grid grid-cols-1 gap-6">
                            {postulacionesActuales.length === 0 ? (
                                <div className="bg-white rounded-xl shadow p-8 text-center">
                                    <p className="text-gray-600 mb-2">
                                        {filtroTurbo ? "No tienes postulaciones turbo." : "No tienes postulaciones."}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {filtroTurbo 
                                            ? "Busca vacantes con el badge ⚡ Turbo para obtener respuestas rápidas."
                                            : "Ve a las vacantes disponibles para aplicar a trabajos."}
                                    </p>
                                </div>
                            ) : postulacionesActuales.map((post) => {
                                const vac = post.pos_vacante_fk;
                                const empresa = vac && vac.va_idEmpresa_fk;
                                
                                // Color del estado
                                const getEstadoColor = (estado) => {
                                    switch(estado?.toLowerCase()) {
                                        case 'pendiente':
                                            return 'bg-yellow-100 text-yellow-800';
                                        case 'en revisión':
                                        case 'en revision':
                                            return 'bg-blue-100 text-blue-800';
                                        case 'aceptada':
                                        case 'entrevista programada':
                                            return 'bg-green-100 text-green-800';
                                        case 'rechazada':
                                            return 'bg-red-100 text-red-800';
                                        default:
                                            return 'bg-gray-100 text-gray-800';
                                    }
                                };
                                
                                return (
                                    <div key={post.id} className="bg-white rounded-xl shadow-md p-6 border-l-4 border-[#A67AFF] hover:shadow-lg transition relative overflow-hidden">
                                        {/* ⚡ Badge Turbo en esquina superior derecha - diferenciado por tipo */}
                                        {post.pos_es_turbo && (
                                            <div className="absolute top-4 right-4 z-10">
                                                <BadgeTurbo 
                                                    horasRespuesta={vac?.va_tiempo_respuesta_horas || 48} 
                                                    size="sm" 
                                                    tipo={post.tipo_turbo || 'vacante'}
                                                />
                                            </div>
                                        )}
                                        
                                        <div className="flex flex-col gap-4">
                                            {/* Fila principal con logo, info y estado */}
                                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                                <div className="flex items-start gap-4 flex-1 pr-20 md:pr-0">
                                                    {empresa && empresa.em_logo ? (
                                                        <img src={empresa.em_logo} alt="Logo empresa" className="w-16 h-16 rounded-lg object-cover border-2 border-gray-200" />
                                                    ) : (
                                                        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center text-purple-600 border-2 border-purple-300">
                                                            <FaBuilding className="text-2xl" />
                                                        </div>
                                                    )}
                                                    <div className="flex-1">
                                                        <h3 className="font-bold text-xl text-[#5e17eb] mb-1">{vac ? vac.va_titulo : 'Vacante'}</h3>
                                                        <p className="text-gray-700 font-semibold text-sm mb-2">{empresa && empresa.em_nombre ? empresa.em_nombre : 'Empresa'}</p>
                                                        {vac && (
                                                            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                                                                <span className="flex items-center gap-1"><FaMapMarkerAlt /> {vac.va_ubicacion}</span>
                                                                <span className="flex items-center gap-1"><FaDollarSign /> ${vac.va_salario}</span>
                                                                {vac.va_tipo_empleo && <span className="flex items-center gap-1"><FaClock /> {vac.va_tipo_empleo}</span>}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    <span className={`px-4 py-2 rounded-full text-sm font-bold ${getEstadoColor(post.pos_estado)}`}>
                                                        {post.pos_estado}
                                                    </span>
                                                    <p className="text-gray-400 text-xs">
                                                        Postulado: {post.pos_fechaPostulacion ? new Date(post.pos_fechaPostulacion).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
                                                    </p>
                                                    <button
                                                        onClick={() => navigate(`/aspirantes/postulaciones/${post.id}`)}
                                                        className="px-4 py-1 bg-[#A67AFF] text-white rounded-lg hover:bg-[#5e17eb] transition text-sm mt-2"
                                                    >
                                                        Ver detalles
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            {/* ⚡ Mensaje informativo para postulaciones turbo - Diferenciado por tipo */}
                                            {post.pos_es_turbo && (
                                                <div className={`w-full p-3 rounded-lg shadow-sm -mx-0 ${
                                                    post.tipo_turbo === 'premium' 
                                                        ? 'bg-gradient-to-r from-purple-50 via-pink-50 to-red-50 border-2 border-purple-400'
                                                        : post.tipo_turbo === 'aspirante'
                                                            ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-400'
                                                            : 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-400'
                                                }`}>
                                                    <p className="text-sm text-gray-800 flex items-center gap-2">
                                                        <span className="text-xl">
                                                            {post.tipo_turbo === 'premium' ? '⚡⚡' : '⚡'}
                                                        </span>
                                                        <span className="font-bold">
                                                            {post.tipo_turbo === 'premium' 
                                                                ? `¡PRIORIDAD MÁXIMA! Respuesta garantizada en ${vac?.va_tiempo_respuesta_horas || 48} horas`
                                                                : post.tipo_turbo === 'aspirante'
                                                                    ? 'Solicitaste respuesta prioritaria en 48 horas'
                                                                    : `Respuesta garantizada en ${vac?.va_tiempo_respuesta_horas || 48} horas`
                                                            }
                                                        </span>
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        
                        {/* Controles de paginación */}
                        {postulacionesFiltradas.length > postulacionesPorPagina && (
                            <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white rounded-lg shadow p-4">
                                <div className="text-sm text-gray-600">
                                    Mostrando {Math.min(indicePrimeraPostulacion + 1, postulacionesFiltradas.length)} - {Math.min(indiceUltimaPostulacion, postulacionesFiltradas.length)} de {postulacionesFiltradas.length} postulaciones
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={irAPaginaAnterior}
                                        disabled={paginaActual === 1}
                                        className={`px-4 py-2 rounded-lg border transition-colors ${
                                            paginaActual === 1
                                                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        Anterior
                                    </button>
                                    
                                    <div className="flex items-center gap-2">
                                        {Array.from({ length: Math.min(5, totalPaginas) }, (_, index) => {
                                            let pagina;
                                            if (totalPaginas <= 5) {
                                                pagina = index + 1;
                                            } else if (paginaActual <= 3) {
                                                pagina = index + 1;
                                            } else if (paginaActual >= totalPaginas - 2) {
                                                pagina = totalPaginas - 4 + index;
                                            } else {
                                                pagina = paginaActual - 2 + index;
                                            }
                                            
                                            return (
                                                <button
                                                    key={pagina}
                                                    onClick={() => setPaginaActual(pagina)}
                                                    className={`w-10 h-10 rounded-lg border transition-colors ${
                                                        paginaActual === pagina
                                                            ? 'bg-[#A67AFF] text-white border-[#A67AFF]'
                                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    {pagina}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    
                                    <button
                                        onClick={irAPaginaSiguiente}
                                        disabled={paginaActual === totalPaginas}
                                        className={`px-4 py-2 rounded-lg border transition-colors ${
                                            paginaActual === totalPaginas
                                                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        Siguiente
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}

export default PostulacionesAspirante;
