
import React, { useState, useEffect } from "react";

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
        <form className="bg-white rounded-xl shadow p-6 mb-8 w-full max-w-2xl border-t-4 border-[#A67AFF] flex flex-col gap-4" onSubmit={handleSubmit}>
            <h2 className="text-xl font-bold text-[#A67AFF] mb-2">{vacanteEditar ? "Editar vacante" : "Crear nueva vacante"}</h2>
            {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded text-center">{error}</div>}
            {success && <div className="bg-green-100 text-green-700 px-4 py-2 rounded text-center">{success}</div>}
            <label className="font-semibold">Título de la vacante
                <input name="va_titulo" value={form.va_titulo} onChange={handleChange} required className="w-full mt-1 px-3 py-2 border rounded" />
            </label>
            <label className="font-semibold">Salario
                <input name="va_salario" value={form.va_salario} onChange={handleChange} required className="w-full mt-1 px-3 py-2 border rounded" type="number" min="0" />
            </label>
            <label className="font-semibold">Ubicación
                <input name="va_ubicacion" value={form.va_ubicacion} onChange={handleChange} required className="w-full mt-1 px-3 py-2 border rounded" />
            </label>
            <label className="font-semibold">Descripción
                <textarea name="va_descripcion" value={form.va_descripcion} onChange={handleChange} required className="w-full mt-1 px-3 py-2 border rounded" rows={3} />
            </label>
            <label className="font-semibold">Requisitos
                <textarea name="va_requisitos" value={form.va_requisitos} onChange={handleChange} required className="w-full mt-1 px-3 py-2 border rounded" rows={2} />
            </label>
            <label className="font-semibold">Tipo de empleo
                <input name="va_tipo_empleo" value={form.va_tipo_empleo} onChange={handleChange} className="w-full mt-1 px-3 py-2 border rounded" placeholder="Ej: Tiempo completo, Medio tiempo, Remoto..." />
            </label>
            <label className="font-semibold">Responsabilidades
                <textarea name="va_responsabilidades" value={form.va_responsabilidades} onChange={handleChange} className="w-full mt-1 px-3 py-2 border rounded" rows={2} placeholder="Lista o descripción de responsabilidades" />
            </label>
            <label className="font-semibold">Beneficios
                <textarea name="va_beneficios" value={form.va_beneficios} onChange={handleChange} className="w-full mt-1 px-3 py-2 border rounded" rows={2} placeholder="Lista o descripción de beneficios" />
            </label>
            <label className="font-semibold">Habilidades
                <textarea name="va_habilidades" value={form.va_habilidades} onChange={handleChange} className="w-full mt-1 px-3 py-2 border rounded" rows={2} placeholder="Lista de habilidades requeridas" />
            </label>
            <div className="flex gap-2 mt-2">
                <button type="submit" className="bg-[#A67AFF] text-white font-bold py-2 rounded hover:bg-[#5e17eb] transition">
                    {vacanteEditar ? "Actualizar vacante" : "Crear vacante"}
                </button>
                {vacanteEditar && (
                    <button type="button" className="bg-gray-300 text-gray-700 font-bold py-2 rounded hover:bg-gray-400 transition" onClick={cancelarEdicion}>
                        Cancelar
                    </button>
                )}
            </div>
        </form>
    );
}

export default FormVacanteEmpresa;
