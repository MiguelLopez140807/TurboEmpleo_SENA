import React, { useEffect, useState } from "react";
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';

function PostulacionesRecibidasEmpresa() {
    const [postulaciones, setPostulaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const token = localStorage.getItem("token");
    let empresaId = null;
    try {
        const userData = JSON.parse(localStorage.getItem("user_data"));
        if (userData && userData.id) {
            empresaId = userData.id;
        }
    } catch (e) {}

    useEffect(() => {
        if (!empresaId) return;
        setLoading(true);
        fetch(`http://127.0.0.1:8000/api/postulaciones/?empresa=${empresaId}`,
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
    }, [empresaId, token]);

    return (
        <>
            <Navbar />
            <div className="min-h-screen flex flex-col bg-[#f6f4fa] items-center py-10 pt-24">
                <h1 className="text-3xl font-bold text-[#A67AFF] mb-6">Postulaciones Recibidas</h1>
                {loading ? (
                    <div>Cargando postulaciones...</div>
                ) : error ? (
                    <div className="text-red-500">{error}</div>
                ) : postulaciones.length === 0 ? (
                    <div>No tienes postulaciones recibidas.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
                        {postulaciones.map((post) => {
                            const aspirante = post.pos_aspirante_fk;
                            const vacante = post.pos_vacante_fk;
                            const ciudad = aspirante?.asp_ciudad || "Ciudad";
                            const experiencia = aspirante?.asp_experiencia || "3+ años";
                            const porcentaje = aspirante?.asp_porcentaje_ajuste || 87;
                            const estado = post.pos_estado || "Pendiente";
                            const fecha = post.pos_fechaPostulacion ? new Date(post.pos_fechaPostulacion).toLocaleDateString('es-CO') : '';
                            return (
                                <div key={post.id} className="bg-white rounded-xl shadow p-6 flex flex-col gap-2 border-t-4 border-[#A67AFF]">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xl font-bold">
                                            {aspirante?.asp_foto ? (
                                                <img src={aspirante.asp_foto} alt="Foto" className="w-10 h-10 rounded-full object-cover" />
                                            ) : (
                                                <span>👤</span>
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-bold text-md text-[#5e17eb]">{aspirante?.asp_nombre || 'Nombre Aspirante'}</div>
                                            <div className="text-xs text-gray-500">Aplicó para: {vacante?.va_titulo || 'Vacante'}</div>
                                        </div>
                                        <div className="flex flex-col items-end ml-auto">
                                            <span className={`text-xs px-2 py-1 rounded-full font-semibold ${estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-700' : estado === 'Revisando' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>{estado}</span>
                                            <span className="text-xs text-gray-400 mt-1">{fecha}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 items-center text-xs text-gray-500 mt-1">
                                        <span>📍 {ciudad}</span>
                                        <span>•</span>
                                        <span>{experiencia}</span>
                                        <span>•</span>
                                        <span className={`font-bold ${porcentaje > 90 ? 'text-green-500' : porcentaje > 80 ? 'text-blue-500' : 'text-gray-400'}`}>{porcentaje}% {porcentaje > 90 ? 'Excelente' : porcentaje > 80 ? 'Bueno' : ''}</span>
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-xs font-semibold">Ver Perfil</button>
                                        <button className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs font-semibold">Aceptar</button>
                                        <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs font-semibold">Rechazar</button>
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
