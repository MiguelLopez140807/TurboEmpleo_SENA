import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';

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
                    <div>No tienes postulaciones registradas.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
                        {postulaciones.map((post) => {
                            const vac = post.pos_vacante_fk;
                            const empresa = vac && vac.va_idEmpresa_fk;
                            return (
                                <div key={post.id} className="bg-white rounded-xl shadow p-6 flex flex-col gap-2 border-t-4 border-[#A67AFF] cursor-pointer hover:shadow-lg transition"
                                    onClick={() => navigate(`/aspirantes/postulaciones/${post.id}`)}
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        {empresa && empresa.em_logo ? (
                                            <img src={empresa.em_logo} alt="Logo empresa" className="w-10 h-10 rounded-full object-cover border" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xl font-bold">🏢</div>
                                        )}
                                        <div>
                                            <div className="font-bold text-md text-[#5e17eb]">{vac ? vac.va_titulo : 'Vacante'}</div>
                                            <div className="text-gray-700 font-semibold text-xs">{empresa && empresa.em_nombre ? empresa.em_nombre : 'Empresa'}</div>
                                        </div>
                                    </div>
                                    <div className="text-gray-700 text-sm">Estado: <span className="font-semibold">{post.pos_estado}</span></div>
                                    <div className="text-gray-400 text-xs mt-2">Fecha: {post.pos_fechaPostulacion ? new Date(post.pos_fechaPostulacion).toLocaleDateString('es-CO') : ''}</div>
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

export default PostulacionesAspirante;
