import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import { FaBuilding, FaArrowLeft } from 'react-icons/fa';

function DetallePostulacion() {
    const { id } = useParams();
    const [postulacion, setPostulacion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
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
    }, [id, token]);

    if (loading) return <div className="pt-32 text-center">Cargando postulación...</div>;
    if (error) return <div className="pt-32 text-center text-red-500">{error}</div>;
    if (!postulacion) return null;

    const vac = postulacion.pos_vacante_fk;
    const empresa = vac && vac.va_idEmpresa_fk;

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
                    <div className="text-gray-700 text-md font-semibold">Estado de la postulación: <span className="text-[#5e17eb]">{postulacion.pos_estado}</span></div>
                    
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
