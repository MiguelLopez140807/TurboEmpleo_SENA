
import React, { useState, useEffect } from "react";
import { FaCheckCircle } from 'react-icons/fa';

function FormVacanteEmpresa({ onSuccess, vacanteEditar, cancelarEdicion }) {
    const [form, setForm] = useState({
        va_titulo: "",
        va_requisitos: "",
        va_salario: "",
        va_ubicacion: "",
        va_descripcion: "",
        va_tipo_empleo: "",
        va_responsabilidades: "",
        va_beneficios: "",
        va_habilidades: "",
        va_estado: "Activa"
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user_data") || "null");
    const empresaId = userData ? userData.id : null;

    useEffect(() => {
        if (vacanteEditar) {
            setForm({
                va_titulo: vacanteEditar.va_titulo || "",
                va_requisitos: vacanteEditar.va_requisitos || "",
                va_salario: vacanteEditar.va_salario || "",
                va_ubicacion: vacanteEditar.va_ubicacion || "",
                va_descripcion: vacanteEditar.va_descripcion || "",
                va_tipo_empleo: vacanteEditar.va_tipo_empleo || "",
                va_responsabilidades: vacanteEditar.va_responsabilidades || "",
                va_beneficios: vacanteEditar.va_beneficios || "",
                va_habilidades: vacanteEditar.va_habilidades || "",
                va_estado: vacanteEditar.va_estado || "Activa"
            });
        } else {
            setForm({
                va_titulo: "",
                va_requisitos: "",
                va_salario: "",
                va_ubicacion: "",
                va_descripcion: "",
                va_tipo_empleo: "",
                va_responsabilidades: "",
                va_beneficios: "",
                va_habilidades: "",
                va_estado: "Activa"
            });
        }
    }, [vacanteEditar]);

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError("");
        setSuccess("");
        if (!token || !empresaId) {
            setError("No se encontró sesión activa.");
            return;
        }
        try {
            let res;
            if (vacanteEditar) {
                // Actualizar vacante existente
                res = await fetch(`http://127.0.0.1:8000/api/vacantes/${vacanteEditar.id}/`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        ...form,
                        va_idEmpresa_fk: empresaId
                    })
                });
            } else {
                // Crear nueva vacante
                res = await fetch("http://127.0.0.1:8000/api/vacantes/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        ...form,
                        va_idEmpresa_fk: empresaId
                    })
                });
            }
            if (res.ok) {
                setSuccess(vacanteEditar ? "Vacante actualizada correctamente." : "Vacante creada correctamente.");
                setForm({
                    va_titulo: "",
                    va_requisitos: "",
                    va_salario: "",
                    va_ubicacion: "",
                    va_descripcion: "",
                    va_tipo_empleo: "",
                    va_responsabilidades: "",
                    va_beneficios: "",
                    va_habilidades: "",
                    va_estado: "Activa"
                });
                if (onSuccess) onSuccess();
            } else {
                setError(vacanteEditar ? "Error al actualizar la vacante." : "Error al crear la vacante.");
            }
        } catch {
            setError(vacanteEditar ? "Error de conexión al actualizar la vacante." : "Error de conexión al crear la vacante.");
        }
    };

    return (
        <form className="bg-white rounded-2xl shadow-xl p-8 mb-8 w-full max-w-4xl border-t-4 border-[#A67AFF] flex flex-col gap-6" onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold text-[#A67AFF] mb-2 text-center">{vacanteEditar ? "Editar vacante" : "Crear nueva vacante"}</h2>
            {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded border border-red-300 text-center">{error}</div>}
            {success && <div className="bg-green-100 text-green-700 px-4 py-2 rounded border border-green-300 text-center">{success}</div>}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Título de la vacante *</label>
                    <input 
                        name="va_titulo" 
                        value={form.va_titulo} 
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
                        value={form.va_salario} 
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
                        value={form.va_ubicacion} 
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
                        value={form.va_tipo_empleo} 
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
                    value={form.va_descripcion} 
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
                    value={form.va_requisitos} 
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
                    value={form.va_responsabilidades} 
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
                        value={form.va_beneficios} 
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
                        value={form.va_habilidades} 
                        onChange={handleChange} 
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#A67AFF]" 
                        rows={3} 
                        placeholder="Lista las habilidades necesarias..."
                    />
                </div>
            </div>
            
            <div className="flex gap-4 mt-4">
                {vacanteEditar && (
                    <button 
                        type="button" 
                        className="flex-1 bg-transparent border-2 border-gray-400 text-gray-600 font-bold py-3 rounded-lg hover:bg-gray-400 hover:text-white transition text-lg" 
                        onClick={cancelarEdicion}
                    >
                        Cancelar
                    </button>
                )}
                <button 
                    type="submit" 
                    className="flex-1 bg-[#A67AFF] text-white font-bold py-3 rounded-lg shadow hover:bg-[#5e17eb] transition text-lg"
                >
                    <span className="flex items-center justify-center gap-2">
                        <FaCheckCircle />
                        {vacanteEditar ? "Actualizar vacante" : "Crear vacante"}
                    </span>
                </button>
            </div>
        </form>
    );
}

export default FormVacanteEmpresa;
