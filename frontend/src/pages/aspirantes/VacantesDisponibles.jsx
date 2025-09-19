import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';

function VacantesDisponibles() {
    const navigate = useNavigate();
    const [vacantes, setVacantes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user_data") || "null");

    useEffect(() => {
    fetch("http://127.0.0.1:8000/api/vacantes/", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
        .then((res) => res.json())
        .then((data) => {
        setVacantes(Array.isArray(data) ? data : []);
        setLoading(false);
        })
        .catch(() => {
        setError("Error al cargar las vacantes.");
        setLoading(false);
        });
    }, [token]);

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
                <h1 className="text-3xl font-bold text-[#A67AFF] mb-6">Vacantes disponibles</h1>
                {loading ? (
                    <div>Cargando vacantes...</div>
                ) : error ? (
                    <div className="text-red-500">{error}</div>
                ) : vacantes.length === 0 ? (
                    <div>No hay vacantes disponibles.</div>
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
                                <div key={vac.id} className="bg-white rounded-xl shadow p-6 flex flex-col gap-2 border-t-4 border-[#A67AFF]">
                                    <div className="flex items-center gap-3 mb-2">
                                        {empresa && empresa.em_logo ? (
                                            <img src={empresa.em_logo} alt="Logo empresa" className="w-12 h-12 rounded-full object-cover border" />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-2xl font-bold">🏢</div>
                                        )}
                                        <div>
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
                                        onClick={() => navigate(`/aspirante/vacantes/${vac.id}`)}
                                    >
                                        Ver detalles
                                    </button>
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

export default VacantesDisponibles;
