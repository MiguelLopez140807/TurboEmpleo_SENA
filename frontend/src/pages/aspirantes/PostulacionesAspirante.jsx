import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import { FaMapMarkerAlt, FaDollarSign, FaClock, FaBuilding } from 'react-icons/fa';

function PostulacionesAspirante() {
    const [postulaciones, setPostulaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user_data") || "null");
    const navigate = useNavigate();

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
                        <div className="mb-4 text-gray-700">
                            Total de postulaciones: <span className="font-bold">{postulaciones.length}</span>
                        </div>
                        <div className="grid grid-cols-1 gap-6">
                            {postulaciones.map((post) => {
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
                                    <div key={post.id} className="bg-white rounded-xl shadow-md p-6 border-l-4 border-[#A67AFF] hover:shadow-lg transition">
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                            <div className="flex items-start gap-4 flex-1">
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
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}

export default PostulacionesAspirante;
