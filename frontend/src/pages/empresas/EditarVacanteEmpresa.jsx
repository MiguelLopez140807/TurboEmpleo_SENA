import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

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
        const res = await fetch(`http://127.0.0.1:8000/api/vacantes/${id}/`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
        });
        if (res.ok) {
        setSuccess("Vacante actualizada correctamente.");
        setTimeout(() => navigate("/empresas/vacantes"), 1200);
        } else {
        setError("Error al actualizar la vacante.");
        }
    } catch {
        setError("Error de conexión al actualizar la vacante.");
    }
    };

    if (loading) return <div className="p-8">Cargando vacante...</div>;
    if (error) return <div className="p-8 text-red-500">{error}</div>;
    if (!form) return null;

    return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f6f4fa] py-10">
        <form className="bg-white rounded-xl shadow p-6 w-full max-w-2xl border-t-4 border-[#A67AFF] flex flex-col gap-4" onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold text-[#A67AFF] mb-2">Editar vacante</h2>
        {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded text-center">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 px-4 py-2 rounded text-center">{success}</div>}
        <label className="font-semibold">Título de la vacante
            <input name="va_titulo" value={form.va_titulo || ""} onChange={handleChange} required className="w-full mt-1 px-3 py-2 border rounded" />
        </label>
        <label className="font-semibold">Salario
            <input name="va_salario" value={form.va_salario || ""} onChange={handleChange} required className="w-full mt-1 px-3 py-2 border rounded" type="number" min="0" />
        </label>
        <label className="font-semibold">Ubicación
            <input name="va_ubicacion" value={form.va_ubicacion || ""} onChange={handleChange} required className="w-full mt-1 px-3 py-2 border rounded" />
        </label>
        <label className="font-semibold">Descripción
            <textarea name="va_descripcion" value={form.va_descripcion || ""} onChange={handleChange} required className="w-full mt-1 px-3 py-2 border rounded" rows={3} />
        </label>
        <label className="font-semibold">Requisitos
            <textarea name="va_requisitos" value={form.va_requisitos || ""} onChange={handleChange} required className="w-full mt-1 px-3 py-2 border rounded" rows={2} />
        </label>
        <label className="font-semibold">Tipo de empleo
            <input name="va_tipo_empleo" value={form.va_tipo_empleo || ""} onChange={handleChange} className="w-full mt-1 px-3 py-2 border rounded" placeholder="Ej: Tiempo completo, Medio tiempo, Remoto..." />
        </label>
        <label className="font-semibold">Responsabilidades
            <textarea name="va_responsabilidades" value={form.va_responsabilidades || ""} onChange={handleChange} className="w-full mt-1 px-3 py-2 border rounded" rows={2} placeholder="Lista o descripción de responsabilidades" />
        </label>
        <label className="font-semibold">Beneficios
            <textarea name="va_beneficios" value={form.va_beneficios || ""} onChange={handleChange} className="w-full mt-1 px-3 py-2 border rounded" rows={2} placeholder="Lista o descripción de beneficios" />
        </label>
        <label className="font-semibold">Habilidades
            <textarea name="va_habilidades" value={form.va_habilidades || ""} onChange={handleChange} className="w-full mt-1 px-3 py-2 border rounded" rows={2} placeholder="Lista de habilidades requeridas" />
        </label>
        <div className="flex gap-2 mt-2">
            <button type="submit" className="bg-[#A67AFF] text-white font-bold py-2 rounded hover:bg-[#5e17eb] transition">Actualizar vacante</button>
            <button type="button" className="bg-gray-300 text-gray-700 font-bold py-2 rounded hover:bg-gray-400 transition" onClick={() => navigate("/empresas/vacantes")}>Cancelar</button>
        </div>
        </form>
    </div>
    );
}

export default EditarVacanteEmpresa;
