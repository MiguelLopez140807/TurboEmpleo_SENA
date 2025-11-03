import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import { FaBuilding, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';

function DetalleVacante() {
    const { id } = useParams();
    const [vacante, setVacante] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user_data") || "null");
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/vacantes/${id}/`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
            .then((res) => res.json())
            .then((data) => {
                setVacante(data);
                setLoading(false);
            })
            .catch(() => {
                setError("Error al cargar la vacante.");
                setLoading(false);
            });
    }, [id, token]);

    const handlePostular = async () => {
        if (!token || !userData) {
            alert("Debes iniciar sesión como aspirante para postularte.");
            return;
        }
        
        // Validar que el aspirante tenga CV cargado
        if (!userData.asp_curriculum) {
            const confirmar = window.confirm(
                "No has cargado tu hoja de vida. ¿Deseas ir a tu perfil para cargarla?"
            );
            if (confirmar) {
                navigate("/aspirantes/perfil");
            }
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
                    pos_estado: "Pendiente",
                    pos_aspirante_fk: userData.id,
                    pos_vacante_fk: vacante.id,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                alert("¡Postulación exitosa! Tu solicitud ha sido enviada al empleador.");
                
                // Actualizar user_data en localStorage con la nueva postulación
                const updatedUserData = { ...userData };
                localStorage.setItem("user_data", JSON.stringify(updatedUserData));
                
                navigate("/aspirantes/postulaciones");
            } else {
                if (res.status === 400 && data.detail && data.detail.includes("ya postulado")) {
                    alert("Ya te has postulado a esta vacante anteriormente.");
                } else {
                    alert(data.detail || JSON.stringify(data) || "No se pudo postular. Intenta nuevamente.");
                }
                console.error("Error postulación:", data);
            }
        } catch (e) {
            alert("Error de conexión al postularse.");
            console.error("Error de red:", e);
        }
    };

    if (loading) return <div className="pt-32 text-center">Cargando vacante...</div>;
    if (error) return <div className="pt-32 text-center text-red-500">{error}</div>;
    if (!vacante) return null;

    // Datos de empresa y habilidades
    const empresa = vacante.va_idEmpresa_fk;
    let habilidades = [];
    try {
        habilidades = vacante.va_habilidades ? JSON.parse(vacante.va_habilidades) : [];
    } catch {
        habilidades = vacante.va_habilidades ? [vacante.va_habilidades] : [];
    }
    const fecha = vacante.va_fecha_publicacion ? new Date(vacante.va_fecha_publicacion) : null;
    const fechaStr = fecha ? fecha.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' }) : '';

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-[#f6f4fa] flex flex-col items-center py-10 pt-24">
                <div className="bg-white rounded-xl shadow p-8 w-full max-w-3xl flex flex-col gap-4 border-t-4 border-[#A67AFF]">
                    <div className="flex items-center gap-4 mb-2">
                        {empresa && empresa.em_logo ? (
                            <img src={empresa.em_logo} alt="Logo empresa" className="w-16 h-16 rounded-full object-cover border" />
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center text-purple-600 border-2 border-purple-300">
                                <FaBuilding className="text-2xl" />
                            </div>
                        )}
                        <div>
                            <div className="font-bold text-2xl text-[#5e17eb]">{vacante.va_titulo}</div>
                            <div className="text-gray-700 font-semibold text-lg">{empresa && empresa.em_nombre ? empresa.em_nombre : 'Empresa'}</div>
                            <div className="text-gray-400 text-xs mt-1">Publicado: {fechaStr}</div>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-4 mb-2">
                        <span className="bg-[#f3e8ff] text-[#5e17eb] px-3 py-1 rounded text-xs font-medium">{vacante.va_tipo_empleo}</span>
                        <span className="text-green-600 font-bold">${vacante.va_salario}</span>
                        <span className="text-gray-700">{vacante.va_ubicacion}</span>
                    </div>
                    <div>
                        <h2 className="font-semibold text-lg mb-1">Descripción del Empleo</h2>
                        <p className="text-gray-700 mb-2">{vacante.va_descripcion}</p>
                    </div>
                    {vacante.va_responsabilidades && (
                        <div>
                            <h2 className="font-semibold text-lg mb-1">Responsabilidades</h2>
                            <ul className="list-disc ml-6 text-gray-700">
                                {vacante.va_responsabilidades.split('\n').map((resp, idx) => (
                                    <li key={idx}>{resp}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {vacante.va_requisitos && (
                        <div>
                            <h2 className="font-semibold text-lg mb-1">Requisitos</h2>
                            <ul className="list-disc ml-6 text-gray-700">
                                {vacante.va_requisitos.split('\n').map((req, idx) => (
                                    <li key={idx}>{req}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {habilidades.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                            {habilidades.map((hab, idx) => (
                                <span key={idx} className="bg-[#f3e8ff] text-[#5e17eb] px-2 py-1 rounded text-xs font-medium">{hab}</span>
                            ))}
                        </div>
                    )}
                    <div className="flex gap-4 mt-4">
                        <button
                            className="flex-1 px-6 py-2 bg-transparent border-2 border-gray-400 text-gray-700 rounded hover:bg-gray-100 transition text-lg font-semibold flex items-center justify-center gap-2"
                            onClick={() => navigate('/aspirantes/vacantes')}
                        >
                            <FaArrowLeft /> Volver
                        </button>
                        <button
                            className="flex-1 px-6 py-2 bg-[#A67AFF] text-white rounded hover:bg-[#5e17eb] transition text-lg font-semibold flex items-center justify-center gap-2"
                            onClick={handlePostular}
                        >
                            <FaCheckCircle /> Postularme
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default DetalleVacante;
