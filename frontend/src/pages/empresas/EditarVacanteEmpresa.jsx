import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import { FaEdit, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';

function EditarVacanteEmpresa() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const token = localStorage.getItem("token");

        useEffect(() => {
    if (!token) {
        setError("No se encontró sesión activa.");
        setLoading(false);
        return;
    }
    fetch(`http://127.0.0.1:8000/api/vacantes/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
    })
        .then((res) => res.json())
        .then((data) => {
        setForm(data);
        setLoading(false);
        })
        .catch(() => {
        setError("Error al cargar la vacante.");
        setLoading(false);
        });
    }, [id, token]);

    const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
        // Preparar datos para enviar - convertir va_idEmpresa_fk a solo el ID
        const dataToSend = {
            ...form,
            va_idEmpresa_fk: typeof form.va_idEmpresa_fk === 'object' 
                ? form.va_idEmpresa_fk.id 
                : form.va_idEmpresa_fk
        };
        
        const res = await fetch(`http://127.0.0.1:8000/api/vacantes/${id}/`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
        });
        if (res.ok) {
        setSuccess("Vacante actualizada correctamente.");
        setTimeout(() => navigate("/empresas/vacantes"), 1200);
        } else {
        const errorData = await res.json();
        console.error("Error del servidor:", errorData);
        setError("Error al actualizar la vacante.");
        }
    } catch (error) {
        console.error("Error de conexión:", error);
        setError("Error de conexión al actualizar la vacante.");
    }
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col bg-[#f6f4fa]">
            <Navbar />
            <div className="flex-1 flex items-center justify-center pt-24">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A67AFF] mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando vacante...</p>
                </div>
            </div>
            <Footer />
        </div>
    );
    
    if (error) return (
        <div className="min-h-screen flex flex-col bg-[#f6f4fa]">
            <Navbar />
            <div className="flex-1 flex items-center justify-center pt-24">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md border-t-4 border-red-500">
                    <p className="text-red-500 text-center mb-4">{error}</p>
                    <button
                        onClick={() => navigate("/empresas/vacantes")}
                        className="w-full px-4 py-2 bg-[#A67AFF] text-white rounded-lg hover:bg-[#5e17eb] transition"
                    >
                        Volver a vacantes
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
    
    if (!form) return null;

    return (
        <div className="min-h-screen flex flex-col bg-[#f6f4fa]">
            <Navbar />
            <main className="flex-1 flex flex-col items-center pt-24 pb-10 px-4">
                <form className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-4xl border-t-4 border-[#A67AFF] flex flex-col gap-6" onSubmit={handleSubmit}>
                    <h2 className="text-2xl font-bold text-[#A67AFF] mb-2 text-center flex items-center justify-center gap-2">
                        <FaEdit /> Editar vacante
                    </h2>
                    {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded border border-red-300 text-center">{error}</div>}
                    {success && <div className="bg-green-100 text-green-700 px-4 py-2 rounded border border-green-300 text-center">{success}</div>}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Título de la vacante *</label>
                            <input 
                                name="va_titulo" 
                                value={form.va_titulo || ""} 
                                onChange={handleChange} 
                                required 
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#A67AFF]" 
                                placeholder="Ej: Desarrollador Full Stack"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Salario mensual *</label>
                            <input 
                                name="va_salario" 
                                value={form.va_salario || ""} 
                                onChange={handleChange} 
                                required 
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#A67AFF]" 
                                type="number" 
                                min="0"
                                placeholder="Ej: 3000000"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Ubicación *</label>
                            <input 
                                name="va_ubicacion" 
                                value={form.va_ubicacion || ""} 
                                onChange={handleChange} 
                                required 
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#A67AFF]" 
                                placeholder="Ej: Bogotá, Colombia"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Tipo de empleo</label>
                            <select 
                                name="va_tipo_empleo" 
                                value={form.va_tipo_empleo || ""} 
                                onChange={handleChange} 
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#A67AFF]"
                            >
                                <option value="">Seleccionar tipo</option>
                                <option value="Tiempo completo">Tiempo completo</option>
                                <option value="Medio tiempo">Medio tiempo</option>
                                <option value="Remoto">Remoto</option>
                                <option value="Híbrido">Híbrido</option>
                                <option value="Freelance">Freelance</option>
                                <option value="Contrato">Contrato</option>
                                <option value="Pasantía">Pasantía</option>
                            </select>
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción *</label>
                        <textarea 
                            name="va_descripcion" 
                            value={form.va_descripcion || ""} 
                            onChange={handleChange} 
                            required 
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#A67AFF]" 
                            rows={3}
                            placeholder="Describe brevemente la vacante..."
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Requisitos *</label>
                        <textarea 
                            name="va_requisitos" 
                            value={form.va_requisitos || ""} 
                            onChange={handleChange} 
                            required 
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#A67AFF]" 
                            rows={3}
                            placeholder="Lista los requisitos principales (uno por línea)..."
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Responsabilidades</label>
                        <textarea 
                            name="va_responsabilidades" 
                            value={form.va_responsabilidades || ""} 
                            onChange={handleChange} 
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#A67AFF]" 
                            rows={3} 
                            placeholder="Lista las responsabilidades del cargo..."
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Beneficios</label>
                            <textarea 
                                name="va_beneficios" 
                                value={form.va_beneficios || ""} 
                                onChange={handleChange} 
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#A67AFF]" 
                                rows={3} 
                                placeholder="Ej: Seguro médico, bonos, etc..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Habilidades requeridas</label>
                            <textarea 
                                name="va_habilidades" 
                                value={form.va_habilidades || ""} 
                                onChange={handleChange} 
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#A67AFF]" 
                                rows={3} 
                                placeholder="Lista las habilidades necesarias..."
                            />
                        </div>
                    </div>
                    
                    <div className="flex gap-4 mt-4">
                        <button 
                            type="button" 
                            onClick={() => navigate("/empresas/vacantes")}
                            className="flex-1 bg-transparent border-2 border-gray-400 text-gray-600 font-bold py-3 rounded-lg hover:bg-gray-400 hover:text-white transition text-lg"
                        >
                            <span className="flex items-center justify-center gap-2">
                                <FaArrowLeft /> Cancelar
                            </span>
                        </button>
                        <button 
                            type="submit" 
                            className="flex-1 bg-[#A67AFF] text-white font-bold py-3 rounded-lg shadow hover:bg-[#5e17eb] transition text-lg"
                        >
                            <span className="flex items-center justify-center gap-2">
                                <FaCheckCircle /> Actualizar vacante
                            </span>
                        </button>
                    </div>
                </form>
            </main>
            <Footer />
        </div>
    );
}

export default EditarVacanteEmpresa;
