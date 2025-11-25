import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import BadgeTurbo from '../../components/BadgeTurbo';
import { FaBuilding, FaArrowLeft } from 'react-icons/fa';

function DetallePostulacion() {
    const { id } = useParams();
    const [postulacion, setPostulacion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activandoTurbo, setActivandoTurbo] = useState(false);
    const [creditosTurbo, setCreditosTurbo] = useState(0);
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user_data") || "null");
    const navigate = useNavigate();

    useEffect(() => {
        // Cargar postulación
        fetch(`http://127.0.0.1:8000/api/postulaciones/${id}/`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
            .then((res) => res.json())
            .then((data) => {
                setPostulacion(data);
                setLoading(false);
            })
            .catch(() => {
                setError("Error al cargar la postulación.");
                setLoading(false);
            });
        
        // Cargar créditos turbo del aspirante
        if (userData && userData.id) {
            fetch(`http://127.0.0.1:8000/api/aspirantes/${userData.id}/`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => res.json())
                .then((data) => {
                    setCreditosTurbo(data.asp_creditos_turbo_disponibles || 0);
                })
                .catch((err) => console.error("Error al cargar créditos turbo:", err));
        }
    }, [id, token]);

    const activarModoTurbo = async () => {
        if (creditosTurbo <= 0) {
            alert("No tienes créditos turbo disponibles.");
            return;
        }
        
        if (!confirm(`¿Quieres usar 1 crédito turbo para solicitar respuesta prioritaria en 48 horas?\n\nCréditos disponibles: ${creditosTurbo}`)) {
            return;
        }
        
        setActivandoTurbo(true);
        
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/postulaciones/${id}/activar_turbo_aspirante/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });
            
            const data = await res.json();
            
            if (res.ok) {
                alert(`⚡ Modo Turbo activado exitosamente!\n\nCréditos restantes: ${data.creditos_restantes}`);
                // Recargar postulación para actualizar estado
                const resPost = await fetch(`http://127.0.0.1:8000/api/postulaciones/${id}/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const dataPost = await resPost.json();
                setPostulacion(dataPost);
                setCreditosTurbo(data.creditos_restantes);
            } else {
                alert(data.error || "Error al activar modo turbo");
            }
        } catch (e) {
            alert("Error de conexión al activar modo turbo");
            console.error("Error:", e);
        } finally {
            setActivandoTurbo(false);
        }
    };

    if (loading) return <div className="pt-32 text-center">Cargando postulación...</div>;
    if (error) return <div className="pt-32 text-center text-red-500">{error}</div>;
    if (!postulacion) return null;

    const vac = postulacion.pos_vacante_fk;
    const empresa = vac && vac.va_idEmpresa_fk;
    
    // Verificar si puede activar turbo
    const puedeActivarTurbo = !postulacion.pos_es_turbo && 
                               postulacion.pos_estado === 'Pendiente' && 
                               creditosTurbo > 0;

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-[#f6f4fa] flex flex-col items-center py-10 pt-24">
                <div className="bg-white rounded-xl shadow p-8 w-full max-w-3xl flex flex-col gap-4 border-t-4 border-[#A67AFF] relative">
                    {/* ⚡ Badge Turbo si está activado */}
                    {postulacion.pos_es_turbo && (
                        <div className="absolute top-4 right-4">
                            <BadgeTurbo 
                                horasRespuesta={vac?.va_tiempo_respuesta_horas || 48} 
                                size="md" 
                                tipo={postulacion.tipo_turbo || 'vacante'}
                            />
                        </div>
                    )}
                    
                    <div className="flex items-center gap-4 mb-2 pr-32">
                        {empresa && empresa.em_logo ? (
                            <img src={empresa.em_logo} alt="Logo empresa" className="w-16 h-16 rounded-full object-cover border" />
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center text-purple-600 border-2 border-purple-300">
                                <FaBuilding className="text-2xl" />
                            </div>
                        )}
                        <div>
                            <div className="font-bold text-2xl text-[#5e17eb]">{vac ? vac.va_titulo : 'Vacante'}</div>
                            <div className="text-gray-700 font-semibold text-lg">{empresa && empresa.em_nombre ? empresa.em_nombre : 'Empresa'}</div>
                            <div className="text-gray-400 text-xs mt-1">Postulado: {postulacion.pos_fechaPostulacion ? new Date(postulacion.pos_fechaPostulacion).toLocaleDateString('es-CO') : ''}</div>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-4 mb-2">
                        <span className="bg-[#f3e8ff] text-[#5e17eb] px-3 py-1 rounded text-xs font-medium">{vac && vac.va_tipo_empleo}</span>
                        <span className="text-green-600 font-bold">${vac && vac.va_salario}</span>
                        <span className="text-gray-700">{vac && vac.va_ubicacion}</span>
                    </div>
                    <div>
                        <h2 className="font-semibold text-lg mb-1">Descripción del Empleo</h2>
                        <p className="text-gray-700 mb-2">{vac && vac.va_descripcion}</p>
                    </div>
                    {vac && vac.va_responsabilidades && (
                        <div>
                            <h2 className="font-semibold text-lg mb-1">Responsabilidades</h2>
                            <ul className="list-disc ml-6 text-gray-700">
                                {vac.va_responsabilidades.split('\n').map((resp, idx) => (
                                    <li key={idx}>{resp}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {vac && vac.va_requisitos && (
                        <div>
                            <h2 className="font-semibold text-lg mb-1">Requisitos</h2>
                            <ul className="list-disc ml-6 text-gray-700">
                                {vac.va_requisitos.split('\n').map((req, idx) => (
                                    <li key={idx}>{req}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    
                    {/* Estado de postulación */}
                    <div className="text-gray-700 text-md font-semibold">
                        Estado de la postulación: <span className="text-[#5e17eb]">{postulacion.pos_estado}</span>
                    </div>
                    
                    {/* ⚡ OPCIÓN ACTIVAR MODO TURBO (si aún no está activado) */}
                    {puedeActivarTurbo && (
                        <div className="my-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-400 rounded-lg">
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">⚡</span>
                                    <span className="font-bold text-blue-700 text-lg">¿Necesitas respuesta urgente?</span>
                                </div>
                                <p className="text-sm text-gray-700">
                                    Activa el <strong>Modo Turbo</strong> para solicitar respuesta prioritaria de la empresa en 48 horas. 
                                    La empresa recibirá una notificación especial.
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full font-semibold">
                                        {creditosTurbo} créditos disponibles
                                    </span>
                                    <button
                                        onClick={activarModoTurbo}
                                        disabled={activandoTurbo}
                                        className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition font-bold shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {activandoTurbo ? (
                                            <>⏳ Activando...</>
                                        ) : (
                                            <>⚡ Activar Modo Turbo</>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Mensaje informativo si ya tiene turbo activado */}
                    {postulacion.pos_es_turbo && (
                        <div className={`my-4 p-4 rounded-lg border-2 ${
                            postulacion.tipo_turbo === 'premium'
                                ? 'bg-gradient-to-r from-purple-50 via-pink-50 to-red-50 border-purple-400'
                                : postulacion.tipo_turbo === 'aspirante'
                                    ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-400'
                                    : 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-400'
                        }`}>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xl">{postulacion.tipo_turbo === 'premium' ? '⚡⚡' : '⚡'}</span>
                                <span className="font-bold text-gray-800">
                                    {postulacion.tipo_turbo === 'premium'
                                        ? '¡PRIORIDAD MÁXIMA ACTIVADA!'
                                        : postulacion.tipo_turbo === 'aspirante'
                                            ? 'Modo Turbo Activado'
                                            : 'Esta vacante es Turbo'
                                    }
                                </span>
                            </div>
                            <p className="text-sm text-gray-700">
                                {postulacion.tipo_turbo === 'premium'
                                    ? `La empresa se compromete a responder en ${vac?.va_tiempo_respuesta_horas || 48} horas y has solicitado respuesta prioritaria. ¡Doble turbo!`
                                    : postulacion.tipo_turbo === 'aspirante'
                                        ? 'Solicitaste respuesta prioritaria en 48 horas. La empresa ha sido notificada.'
                                        : `La empresa se compromete a responder en ${vac?.va_tiempo_respuesta_horas || 48} horas.`
                                }
                            </p>
                        </div>
                    )}
                    
                    <button
                        className="mt-4 px-6 py-2 bg-transparent border-2 border-gray-400 text-gray-700 rounded hover:bg-gray-100 transition text-lg font-semibold flex items-center justify-center gap-2"
                        onClick={() => navigate('/aspirantes/postulaciones')}
                    >
                        <FaArrowLeft /> Volver a mis postulaciones
                    </button>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default DetallePostulacion;
