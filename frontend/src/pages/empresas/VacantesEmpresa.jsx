import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import FormVacanteEmpresa from "./FormVacanteEmpresa";
import { FaDollarSign, FaMapMarkerAlt, FaClock, FaEye, FaEdit, FaTrash, FaTimes, FaCheckCircle, FaTimesCircle, FaBriefcase, FaFileAlt, FaClipboardList, FaBullseye, FaGift } from 'react-icons/fa';

function VacantesEmpresa() {
    const navigate = useNavigate();
    const [vacantes, setVacantes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editVacante, setEditVacante] = useState(null);
    const [vacanteDetalle, setVacanteDetalle] = useState(null);
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user_data") || "null");
    const empresaId = userData ? userData.id : null;

    // Eliminar vacante
    const handleEliminar = async (vacanteId) => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar esta vacante?")) return;
        if (!token) {
            setError("No se encontró sesión activa.");
            return;
        }
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/vacantes/${vacanteId}/`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                setVacantes((prev) => Array.isArray(prev) ? prev.filter((v) => v.id !== vacanteId) : prev);
            } else {
                setError("No se pudo eliminar la vacante.");
            }
        } catch {
            setError("Error de conexión al eliminar la vacante.");
        }
    };

    const fetchVacantes = () => {
        if (!token || !empresaId) {
            setError("No se encontró sesión activa.");
            setLoading(false);
            return;
        }
        fetch(`http://127.0.0.1:8000/api/vacantes/?empresa=${empresaId}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => {
                setVacantes(data);
                setLoading(false);
            })
            .catch(() => {
                setError("Error al cargar las vacantes.");
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchVacantes();
        // eslint-disable-next-line
    }, [token, empresaId]);

    return (
        <div className="min-h-screen flex flex-col bg-[#f6f4fa]">
            <Navbar />
            <main className="flex-1 flex flex-col items-center pt-24 pb-10 px-4">
                <h1 className="text-3xl font-bold text-[#A67AFF] mb-6">Vacantes publicadas</h1>
                <FormVacanteEmpresa
                    onSuccess={() => {
                        fetchVacantes();
                        setEditVacante(null);
                    }}
                    vacanteEditar={editVacante}
                    cancelarEdicion={() => setEditVacante(null)}
                />
                {loading ? (
                    <div>Cargando vacantes...</div>
                ) : error ? (
                    <div className="text-red-500">{error}</div>
                ) : Array.isArray(vacantes) && vacantes.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
                        <p className="text-gray-600 mb-2 flex items-center justify-center gap-2">
                            <FaBriefcase className="text-2xl" /> No tienes vacantes publicadas.
                        </p>
                        <p className="text-sm text-gray-500">Crea tu primera vacante usando el formulario de arriba.</p>
                    </div>
                ) : Array.isArray(vacantes) ? (
                    <>
                        <div className="w-full max-w-6xl mb-4">
                            <h2 className="text-2xl font-bold text-[#5e17eb] mb-4">Mis Vacantes ({vacantes.length})</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
                            {vacantes.map((vac) => (
                                <div key={vac.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition p-6 flex flex-col border-t-4 border-[#A67AFF]">
                                    {/* Header con logo y título */}
                                    <div className="flex items-start gap-3 mb-4">
                                        {userData.em_logo && (
                                            <img 
                                                src={`http://127.0.0.1:8000${userData.em_logo}`} 
                                                alt="Logo" 
                                                className="w-14 h-14 object-cover rounded-lg border-2 border-[#A67AFF] flex-shrink-0" 
                                            />
                                        )}
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg text-[#5e17eb] mb-1 line-clamp-2">{vac.va_titulo}</h3>
                                            <p className="text-sm text-gray-500">{userData.em_nombre}</p>
                                        </div>
                                    </div>
                                    
                                    {/* Información clave */}
                                    <div className="flex-1 space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <FaDollarSign className="text-[#5e17eb]" />
                                            <span className="font-semibold text-sm">Salario:</span>
                                            <span className="text-sm">${parseInt(vac.va_salario).toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <FaMapMarkerAlt className="text-[#5e17eb]" />
                                            <span className="font-semibold text-sm">Ubicación:</span>
                                            <span className="text-sm">{vac.va_ubicacion}</span>
                                        </div>
                                        {vac.va_tipo_empleo && (
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <FaClock className="text-[#5e17eb]" />
                                                <span className="font-semibold text-sm">Tipo:</span>
                                                <span className="text-sm">{vac.va_tipo_empleo}</span>
                                            </div>
                                        )}
                                        <div className="mt-3">
                                            <p className="text-gray-600 text-sm line-clamp-3">{vac.va_descripcion}</p>
                                        </div>
                                    </div>
                                    
                                    {/* Botón ver detalles */}
                                    <button
                                        onClick={() => setVacanteDetalle(vac)}
                                        className="w-full mb-3 px-4 py-2 bg-[#5e17eb] text-white rounded-lg hover:bg-[#A67AFF] transition font-semibold text-sm flex items-center justify-center gap-2"
                                    >
                                        <FaEye /> Ver detalles completos
                                    </button>
                                    
                                    {/* Estado de la vacante */}
                                    <div className="flex items-center justify-center gap-2 pb-3 border-b border-gray-200">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                                            vac.va_estado === 'Activa' 
                                                ? 'bg-green-100 text-green-700' 
                                                : 'bg-gray-100 text-gray-700'
                                        }`}>
                                            {vac.va_estado === 'Activa' ? <><FaCheckCircle /> Activa</> : <><FaTimesCircle /> Inactiva</>}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Modal de detalles */}
                        {vacanteDetalle && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setVacanteDetalle(null)}>
                                <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                                    {/* Header del modal */}
                                    <div className="sticky top-0 bg-gradient-to-r from-[#5e17eb] to-[#A67AFF] text-white p-6 rounded-t-2xl">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-4">
                                                {userData.em_logo && (
                                                    <img 
                                                        src={`http://127.0.0.1:8000${userData.em_logo}`} 
                                                        alt="Logo" 
                                                        className="w-16 h-16 object-cover rounded-lg border-2 border-white" 
                                                    />
                                                )}
                                                <div>
                                                    <h2 className="text-2xl font-bold mb-1">{vacanteDetalle.va_titulo}</h2>
                                                    <p className="text-purple-100">{userData.em_nombre}</p>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => setVacanteDetalle(null)}
                                                className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition"
                                            >
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* Contenido del modal */}
                                    <div className="p-6 space-y-6">
                                        {/* Información general */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-[#5e17eb]">
                                                <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                                                    <FaDollarSign className="text-[#5e17eb]" /> Salario
                                                </p>
                                                <p className="text-lg font-bold text-[#5e17eb]">${parseInt(vacanteDetalle.va_salario).toLocaleString()}</p>
                                            </div>
                                            <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-[#A67AFF]">
                                                <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                                                    <FaMapMarkerAlt className="text-[#5e17eb]" /> Ubicación
                                                </p>
                                                <p className="text-lg font-bold text-[#5e17eb]">{vacanteDetalle.va_ubicacion}</p>
                                            </div>
                                            <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-[#5e17eb]">
                                                <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                                                    <FaClock className="text-[#5e17eb]" /> Tipo de empleo
                                                </p>
                                                <p className="text-lg font-bold text-[#5e17eb]">{vacanteDetalle.va_tipo_empleo || 'No especificado'}</p>
                                            </div>
                                        </div>
                                        
                                        {/* Descripción */}
                                        <div>
                                            <h3 className="text-lg font-bold text-[#5e17eb] mb-2 flex items-center gap-2">
                                                <FaFileAlt /> Descripción
                                            </h3>
                                            <p className="text-gray-700 leading-relaxed">{vacanteDetalle.va_descripcion}</p>
                                        </div>
                                        
                                        {/* Requisitos */}
                                        <div>
                                            <h3 className="text-lg font-bold text-[#5e17eb] mb-2 flex items-center gap-2">
                                                <FaCheckCircle /> Requisitos
                                            </h3>
                                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{vacanteDetalle.va_requisitos}</p>
                                        </div>
                                        
                                        {/* Responsabilidades */}
                                        {vacanteDetalle.va_responsabilidades && (
                                            <div>
                                                <h3 className="text-lg font-bold text-[#5e17eb] mb-2 flex items-center gap-2">
                                                    <FaClipboardList /> Responsabilidades
                                                </h3>
                                                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{vacanteDetalle.va_responsabilidades}</p>
                                            </div>
                                        )}
                                        
                                        {/* Habilidades */}
                                        {vacanteDetalle.va_habilidades && (
                                            <div>
                                                <h3 className="text-lg font-bold text-[#5e17eb] mb-2 flex items-center gap-2">
                                                    <FaBullseye /> Habilidades requeridas
                                                </h3>
                                                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{vacanteDetalle.va_habilidades}</p>
                                            </div>
                                        )}
                                        
                                        {/* Beneficios */}
                                        {vacanteDetalle.va_beneficios && (
                                            <div>
                                                <h3 className="text-lg font-bold text-[#5e17eb] mb-2 flex items-center gap-2">
                                                    <FaGift /> Beneficios
                                                </h3>
                                                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{vacanteDetalle.va_beneficios}</p>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Footer con botones de acción */}
                                    <div className="sticky bottom-0 bg-gray-50 p-6 rounded-b-2xl border-t border-gray-200">
                                        <div className="flex justify-between gap-4">
                                            <button
                                                onClick={() => {
                                                    if (window.confirm("¿Estás seguro de que deseas eliminar esta vacante?")) {
                                                        handleEliminar(vacanteDetalle.id);
                                                        setVacanteDetalle(null);
                                                    }
                                                }}
                                                className="px-6 py-3 bg-transparent border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition font-semibold flex items-center justify-center gap-2"
                                            >
                                                <FaTrash /> Eliminar vacante
                                            </button>
                                            <button
                                                onClick={() => {
                                                    navigate(`/empresas/vacantes/editar/${vacanteDetalle.id}`);
                                                    setVacanteDetalle(null);
                                                }}
                                                className="px-6 py-3 bg-[#A67AFF] text-white rounded-lg hover:bg-[#5e17eb] transition font-semibold flex items-center justify-center gap-2"
                                            >
                                                <FaEdit /> Editar vacante
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-red-500">Error al cargar las vacantes. {typeof vacantes === 'object' && vacantes && vacantes.detail ? vacantes.detail : ''}</div>
                )}
            </main>
            <Footer />
        </div>
    );
}

export default VacantesEmpresa;
