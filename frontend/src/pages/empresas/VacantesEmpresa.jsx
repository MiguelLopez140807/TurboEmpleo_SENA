import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import FormVacanteEmpresa from "./FormVacanteEmpresa";

function VacantesEmpresa() {
    const navigate = useNavigate();
    const [vacantes, setVacantes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editVacante, setEditVacante] = useState(null);
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
            <main className="flex-1 flex flex-col items-center py-10 px-4 pt-24">
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
                    <div>No tienes vacantes publicadas.</div>
                ) : Array.isArray(vacantes) ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
                        {vacantes.map((vac) => (
                            <div key={vac.id} className="bg-white rounded-xl shadow p-6 flex flex-col gap-2 border-t-4 border-[#A67AFF]">
                                <div className="flex items-center gap-3 mb-2">
                                    {userData.em_logo && (
                                        <img src={`http://127.0.0.1:8000${userData.em_logo}`} alt="Logo" className="w-12 h-12 object-cover rounded-full border-2 border-[#A67AFF]" />
                                    )}
                                    <div>
                                        <div className="font-bold text-lg text-[#5e17eb]">{vac.va_titulo}</div>
                                        <div className="text-sm text-gray-500">{userData.em_nombre}</div>
                                    </div>
                                </div>
                                <div className="text-gray-700 font-semibold">Salario: <span className="font-normal">${vac.va_salario}</span></div>
                                <div className="text-gray-700 font-semibold">Ubicación: <span className="font-normal">{vac.va_ubicacion}</span></div>
                                {vac.va_tipo_empleo && (
                                    <div className="text-gray-700 font-semibold">Tipo de empleo: <span className="font-normal">{vac.va_tipo_empleo}</span></div>
                                )}
                                <div className="text-gray-700 font-semibold">Descripción:</div>
                                <div className="text-gray-600 text-sm mb-1">{vac.va_descripcion}</div>
                                <div className="text-gray-700 font-semibold">Requisitos:</div>
                                <div className="text-gray-600 text-sm mb-1">{vac.va_requisitos}</div>
                                {vac.va_responsabilidades && (
                                    <>
                                        <div className="text-gray-700 font-semibold">Responsabilidades:</div>
                                        <div className="text-gray-600 text-sm mb-1">{vac.va_responsabilidades}</div>
                                    </>
                                )}
                                {vac.va_beneficios && (
                                    <>
                                        <div className="text-gray-700 font-semibold">Beneficios:</div>
                                        <div className="text-gray-600 text-sm mb-1">{vac.va_beneficios}</div>
                                    </>
                                )}
                                {vac.va_habilidades && (
                                    <>
                                        <div className="text-gray-700 font-semibold">Habilidades:</div>
                                        <div className="text-gray-600 text-sm mb-1">{vac.va_habilidades}</div>
                                    </>
                                )}
                                <div className="flex gap-2 mt-2">
                                    <button
                                        className="px-4 py-1 bg-[#A67AFF] text-white rounded hover:bg-[#5e17eb] transition"
                                        onClick={() => navigate(`/empresas/vacantes/editar/${vac.id}`)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-700 transition"
                                        onClick={() => handleEliminar(vac.id)}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-red-500">Error al cargar las vacantes. {typeof vacantes === 'object' && vacantes && vacantes.detail ? vacantes.detail : ''}</div>
                )}
            </main>
            <Footer />
        </div>
    );
}

export default VacantesEmpresa;
