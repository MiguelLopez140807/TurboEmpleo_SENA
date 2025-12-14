import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import Breadcrumbs from '../../components/Breadcrumbs';
import BadgeTurbo from '../../components/BadgeTurbo';
import { FaBuilding } from 'react-icons/fa';

function VacantesDisponibles() {
    const navigate = useNavigate();
    const [vacantes, setVacantes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user_data") || "null");

    // Estados para filtros
    const [filtroUbicacion, setFiltroUbicacion] = useState("");
    const [filtroTipoEmpleo, setFiltroTipoEmpleo] = useState("");
    const [filtroBusqueda, setFiltroBusqueda] = useState("");
    const [filtroTurbo, setFiltroTurbo] = useState(false);

    // Estados para paginación
    const [paginaActual, setPaginaActual] = useState(1);
    const vacantesPorPagina = 6;
    const [todasLasVacantes, setTodasLasVacantes] = useState([]);

    const breadcrumbItems = [
        { label: 'Dashboard', path: '/aspirantes/dashboard' },
        { label: 'Vacantes Disponibles', active: true }
    ];

    const fetchVacantes = () => {
        setLoading(true);
        setError(""); // Limpiar error anterior
        
        // Si filtro turbo está activado, usar endpoint especial
        let url;
        if (filtroTurbo) {
            url = 'http://127.0.0.1:8000/api/vacantes/turbo/';
        } else {
            // Construir parámetros de filtro normales
            const params = new URLSearchParams();
            if (filtroUbicacion) params.append('ubicacion', filtroUbicacion);
            if (filtroTipoEmpleo) params.append('tipo_empleo', filtroTipoEmpleo);
            if (filtroBusqueda) params.append('search', filtroBusqueda);
            params.append('estado', 'Activa'); // Solo mostrar vacantes activas
            url = `http://127.0.0.1:8000/api/vacantes/?${params.toString()}`;
        }
        
        fetch(url, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        .then((res) => {
            if (!res.ok) {
                // Si es error 401 (no autorizado), limpiar sesión
                if (res.status === 401) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user_data");
                    localStorage.removeItem("refresh_token");
                    // Redirigir al login o mostrar mensaje
                    setError("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
                    setTimeout(() => {
                        navigate("/login");
                    }, 2000);
                    throw new Error("Sesión expirada");
                }
                throw new Error(`Error ${res.status}`);
            }
            return res.json();
        })
        .then((data) => {
            const vacantesArray = Array.isArray(data) ? data : [];
            setTodasLasVacantes(vacantesArray);
            // Aplicar paginación
            const inicio = (paginaActual - 1) * vacantesPorPagina;
            const fin = inicio + vacantesPorPagina;
            setVacantes(vacantesArray.slice(inicio, fin));
            setLoading(false);
        })
        .catch((err) => {
            console.error("Error al cargar vacantes:", err);
            if (!error) { // Solo actualizar si no se estableció un error personalizado antes
                setError("Error al cargar las vacantes. Por favor, intenta de nuevo.");
            }
            setLoading(false);
        });
    };

    useEffect(() => {
        setPaginaActual(1); // Resetear a primera página cuando cambien los filtros
        fetchVacantes();
    }, [filtroUbicacion, filtroTipoEmpleo, filtroBusqueda, filtroTurbo]);

    // Efecto para actualizar paginación cuando cambian las vacantes
    useEffect(() => {
        if (todasLasVacantes.length > 0) {
            const inicio = (paginaActual - 1) * vacantesPorPagina;
            const fin = inicio + vacantesPorPagina;
            setVacantes(todasLasVacantes.slice(inicio, fin));
        }
    }, [paginaActual, todasLasVacantes]);

    const limpiarFiltros = () => {
        setFiltroUbicacion("");
        setFiltroTipoEmpleo("");
        setFiltroBusqueda("");
        setFiltroTurbo(false);
        setPaginaActual(1); // Resetear a primera página
    };

    // Funciones de paginación
    const totalPaginas = Math.ceil(todasLasVacantes.length / vacantesPorPagina);
    const irAPagina = (pagina) => {
        setPaginaActual(pagina);
        // Scroll hacia arriba cuando cambie de página
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const paginaAnterior = () => {
        if (paginaActual > 1) {
            irAPagina(paginaActual - 1);
        }
    };

    const paginaSiguiente = () => {
        if (paginaActual < totalPaginas) {
            irAPagina(paginaActual + 1);
        }
    };

    const handlePostular = async (vacanteId) => {
    if (!token || !userData) {
        alert("Debes iniciar sesión como aspirante para postularte.");
        return;
    }
    try {
        const res = await fetch(`http://127.0.0.1:8000/api/postulaciones/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            vacante: vacanteId,
            aspirante: userData.id,
        }),
        });
        if (res.ok) {
        alert("¡Postulación exitosa!");
        } else {
        alert("No se pudo postular. Intenta nuevamente.");
        }
    } catch {
        alert("Error de conexión al postularse.");
    }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen flex flex-col bg-[#f6f4fa] items-center py-10 pt-24">
                <div className="w-full max-w-6xl px-4">
                    <Breadcrumbs items={breadcrumbItems} />
                    <h1 className="text-3xl font-bold text-[#A67AFF] mb-6">Vacantes disponibles</h1>
                
                {/* Panel de Filtros */}
                <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg p-6 mb-6 border-t-4 border-[#5e17eb]">
                    <h2 className="text-xl font-bold text-[#5e17eb] mb-4">Filtrar vacantes</h2>
                    
                    {/* ⚡ Filtro Turbo destacado */}
                    <div className="mb-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border-2 border-yellow-300">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={filtroTurbo}
                                onChange={(e) => setFiltroTurbo(e.target.checked)}
                                className="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                            />
                            <span className="flex items-center gap-2 text-base font-bold text-gray-800">
                                <span className="text-2xl">⚡</span>
                                Solo vacantes con Modo Turbo (respuesta rápida garantizada)
                            </span>
                        </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Búsqueda</label>
                            <input
                                type="text"
                                placeholder="Título, descripción..."
                                value={filtroBusqueda}
                                onChange={(e) => setFiltroBusqueda(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5e17eb]"
                                disabled={filtroTurbo}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Ubicación</label>
                            <input
                                type="text"
                                placeholder="Ciudad o departamento"
                                value={filtroUbicacion}
                                onChange={(e) => setFiltroUbicacion(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5e17eb]"
                                disabled={filtroTurbo}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Tipo de contrato</label>
                            <select
                                value={filtroTipoEmpleo}
                                onChange={(e) => setFiltroTipoEmpleo(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5e17eb]"
                                disabled={filtroTurbo}
                            >
                                <option value="">Todos</option>
                                <option value="Tiempo completo">Tiempo completo</option>
                                <option value="Medio tiempo">Medio tiempo</option>
                                <option value="Por horas">Por horas</option>
                                <option value="Freelance">Freelance</option>
                                <option value="Temporal">Temporal</option>
                                <option value="Indefinido">Indefinido</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={limpiarFiltros}
                                className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-semibold"
                            >
                                Borrar filtros
                            </button>
                        </div>
                    </div>
                    <div className="mt-4 text-sm text-gray-600">
                        {vacantes.length} {vacantes.length === 1 ? 'vacante encontrada' : 'vacantes encontradas'}
                    </div>
                </div>

                {loading ? (
                    <div>Cargando vacantes...</div>
                ) : error ? (
                    <div className="text-red-500">{error}</div>
                ) : vacantes.length === 0 ? (
                    <div>No hay vacantes disponibles con los filtros seleccionados.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
                        {vacantes.map((vac) => {
                            // Obtener datos de empresa (nombre y logo)
                            const empresa = vac.va_idEmpresa_fk;
                            // Habilidades como array
                            let habilidades = [];
                            try {
                                habilidades = vac.va_habilidades ? JSON.parse(vac.va_habilidades) : [];
                            } catch {
                                habilidades = vac.va_habilidades ? [vac.va_habilidades] : [];
                            }
                            // Fecha de publicación formateada
                            const fecha = vac.va_fecha_publicacion ? new Date(vac.va_fecha_publicacion) : null;
                            const fechaStr = fecha ? fecha.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
                            return (
                                <div key={vac.id} className="bg-white rounded-xl shadow p-6 flex flex-col gap-2 border-t-4 border-[#A67AFF] relative">
                                    {/* ⚡ Badge Turbo en esquina superior derecha */}
                                    {vac.va_modo_turbo && (
                                        <div className="absolute top-3 right-3">
                                            <BadgeTurbo horasRespuesta={vac.va_tiempo_respuesta_horas} size="sm" />
                                        </div>
                                    )}
                                    
                                    <div className="flex items-center gap-3 mb-2">
                                        {empresa && empresa.em_logo ? (
                                            <img src={empresa.em_logo} alt="Logo empresa" className="w-12 h-12 rounded-full object-cover border" />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center text-purple-600 border-2 border-purple-300">
                                                <FaBuilding className="text-xl" />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <div className="font-bold text-lg text-[#5e17eb]">{vac.va_titulo}</div>
                                            <div className="text-gray-700 font-semibold text-sm">{empresa && empresa.em_nombre ? empresa.em_nombre : 'Empresa'}</div>
                                        </div>
                                    </div>
                                    <div className="text-gray-700 font-semibold">Ubicación: <span className="font-normal">{vac.va_ubicacion}</span></div>
                                    <div className="text-gray-700 font-semibold">Salario: <span className="font-normal">${vac.va_salario}</span></div>
                                    <div className="text-gray-700 font-semibold">Descripción:</div>
                                    <div className="text-gray-600 text-sm mb-1">{vac.va_descripcion}</div>
                                    {habilidades.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-1">
                                            {habilidades.map((hab, idx) => (
                                                <span key={idx} className="bg-[#f3e8ff] text-[#5e17eb] px-2 py-1 rounded text-xs font-medium">{hab}</span>
                                            ))}
                                        </div>
                                    )}
                                    <div className="text-gray-400 text-xs mt-2">Publicado: {fechaStr}</div>
                                    {/* Botón Ver detalles (próxima iteración) */}
                                    <button
                                        className="mt-2 px-4 py-1 bg-[#A67AFF] text-white rounded hover:bg-[#5e17eb] transition"
                                        onClick={() => navigate(`/aspirantes/vacantes/${vac.id}`)}
                                    >
                                        Ver detalles
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Componente de Paginación */}
                {todasLasVacantes.length > vacantesPorPagina && (
                    <div className="mt-8 flex justify-center">
                        <div className="flex items-center space-x-2">
                            {/* Botón Anterior */}
                            <button
                                onClick={paginaAnterior}
                                disabled={paginaActual === 1}
                                className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                                    paginaActual === 1
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-[#5e17eb] border border-[#5e17eb] hover:bg-[#5e17eb] hover:text-white'
                                }`}
                            >
                                ← Anterior
                            </button>

                            {/* Números de página */}
                            {[...Array(totalPaginas)].map((_, index) => {
                                const numeroPagina = index + 1;
                                return (
                                    <button
                                        key={numeroPagina}
                                        onClick={() => irAPagina(numeroPagina)}
                                        className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                                            paginaActual === numeroPagina
                                                ? 'bg-[#5e17eb] text-white'
                                                : 'bg-white text-[#5e17eb] border border-[#5e17eb] hover:bg-[#5e17eb] hover:text-white'
                                        }`}
                                    >
                                        {numeroPagina}
                                    </button>
                                );
                            })}

                            {/* Botón Siguiente */}
                            <button
                                onClick={paginaSiguiente}
                                disabled={paginaActual === totalPaginas}
                                className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                                    paginaActual === totalPaginas
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-[#5e17eb] border border-[#5e17eb] hover:bg-[#5e17eb] hover:text-white'
                                }`}
                            >
                                Siguiente →
                            </button>
                        </div>
                    </div>
                )}

                {/* Información de paginación */}
                {todasLasVacantes.length > 0 && (
                    <div className="mt-4 text-center text-sm text-gray-600">
                        Mostrando {((paginaActual - 1) * vacantesPorPagina) + 1} - {Math.min(paginaActual * vacantesPorPagina, todasLasVacantes.length)} de {todasLasVacantes.length} vacantes
                    </div>
                )}
                </div>
            </div>
            <Footer />
        </>
    );
}

export default VacantesDisponibles;
