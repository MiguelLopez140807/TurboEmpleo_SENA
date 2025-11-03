import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import { FaTimes, FaCheckCircle } from 'react-icons/fa';

function CompletarPerfilAspirante() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user_data") || "null");
    const aspiranteId = userData ? userData.id : null;
    const [expLaboral, setExpLaboral] = useState([
    { exla_nombreEmpresa: "", exla_cargo: "", exla_fechaInicio: "", exla_fechaFin: "", exla_salario: "", exla_funcion: "", exla_descripcion: "" },
    ]);
    const [expEscolar, setExpEscolar] = useState([
    { exes_nombreInstitucion: "", exes_titulo: "", exes_fechaInicio: "", exes_fechaFin: "", exes_description: "", exes_nivelEducativo: "" },
    ]);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

  // Handlers para experiencia laboral
    const handleLaboralChange = (i, e) => {
    const { name, value } = e.target;
    setExpLaboral((prev) => prev.map((item, idx) => idx === i ? { ...item, [name]: value } : item));
    };
    const addLaboral = () => setExpLaboral([...expLaboral, { exla_nombreEmpresa: "", exla_cargo: "", exla_fechaInicio: "", exla_fechaFin: "", exla_salario: "", exla_funcion: "", exla_descripcion: "" }]);
    const removeLaboral = async (i) => {
    const exp = expLaboral[i];
    if (exp.id) {
        try {
        await fetch(`http://127.0.0.1:8000/api/experiencia_laboral/${exp.id}/`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });
        } catch (err) {}
    }
    setExpLaboral(expLaboral.filter((_, idx) => idx !== i));
    };

  // Handlers para experiencia escolar
    const handleEscolarChange = (i, e) => {
    const { name, value } = e.target;
    setExpEscolar((prev) => prev.map((item, idx) => idx === i ? { ...item, [name]: value } : item));
    };
    const addEscolar = () => setExpEscolar([...expEscolar, { exes_nombreInstitucion: "", exes_titulo: "", exes_fechaInicio: "", exes_fechaFin: "", exes_description: "", exes_nivelEducativo: "" }]);
    const removeEscolar = async (i) => {
    const exp = expEscolar[i];
    if (exp.id) {
        try {
        await fetch(`http://127.0.0.1:8000/api/experiencia_escolar/${exp.id}/`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });
        } catch (err) {}
    }
    setExpEscolar(expEscolar.filter((_, idx) => idx !== i));
    };

  // Cargar experiencia laboral y escolar al montar
    useEffect(() => {
    if (!token || !aspiranteId) return;
    // Experiencia Laboral
    fetch(`http://127.0.0.1:8000/api/experiencia_laboral/?exla_aspirante_fk=${aspiranteId}`, {
        headers: { Authorization: `Bearer ${token}` },
    })
        .then(res => res.ok ? res.json() : [])
        .then(data => {
        if (Array.isArray(data) && data.length > 0) setExpLaboral(data);
        });
    // Experiencia Escolar
    fetch(`http://127.0.0.1:8000/api/experiencia_escolar/?exes_aspirante_fk=${aspiranteId}`, {
        headers: { Authorization: `Bearer ${token}` },
    })
        .then(res => res.ok ? res.json() : [])
        .then(data => {
        if (Array.isArray(data) && data.length > 0) setExpEscolar(data);
        });
    }, [token, aspiranteId]);

  // Guardar experiencia laboral y escolar
    const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    
    if (!token || !aspiranteId) {
        setError("No se encontró sesión activa. Por favor, inicia sesión nuevamente.");
        return;
    }
    
    try {
      // Guardar experiencia laboral
        for (const exp of expLaboral) {
        const method = exp.id ? "PUT" : "POST";
        const url = exp.id
            ? `http://127.0.0.1:8000/api/experiencia_laboral/${exp.id}/`
            : `http://127.0.0.1:8000/api/experiencia_laboral/`;
        
        const response = await fetch(url, {
            method,
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ ...exp, exla_aspirante_fk: aspiranteId }),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error al guardar experiencia laboral:', errorData);
            throw new Error(errorData.detail || 'Error al guardar experiencia laboral');
        }
        }
        
      // Guardar experiencia escolar
        for (const exp of expEscolar) {
        const method = exp.id ? "PUT" : "POST";
        const url = exp.id
            ? `http://127.0.0.1:8000/api/experiencia_escolar/${exp.id}/`
            : `http://127.0.0.1:8000/api/experiencia_escolar/`;
        
        const response = await fetch(url, {
            method,
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ ...exp, exes_aspirante_fk: aspiranteId }),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error al guardar experiencia escolar:', errorData);
            throw new Error(errorData.detail || 'Error al guardar experiencia escolar');
        }
        }
        
        setSuccess("¡Datos guardados correctamente!");
        
        // Recargar los datos desde el servidor para actualizar los IDs
        if (!token || !aspiranteId) return;
        
        // Cargar experiencia laboral actualizada
        const labRes = await fetch(`http://127.0.0.1:8000/api/experiencia_laboral/?exla_aspirante_fk=${aspiranteId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (labRes.ok) {
            const labData = await labRes.json();
            if (Array.isArray(labData) && labData.length > 0) {
                setExpLaboral(labData);
            }
        }
        
        // Cargar experiencia escolar actualizada
        const escRes = await fetch(`http://127.0.0.1:8000/api/experiencia_escolar/?exes_aspirante_fk=${aspiranteId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (escRes.ok) {
            const escData = await escRes.json();
            if (Array.isArray(escData) && escData.length > 0) {
                setExpEscolar(escData);
            }
        }
        
    } catch (err) {
        console.error('Error en handleSubmit:', err);
        setError(err.message || "Error al guardar los datos. Verifica tu conexión e intenta nuevamente.");
    }
    };

    return (
    <div className="min-h-screen flex flex-col bg-[#f6f4fa]">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center pt-24 pb-10 px-4">
        <h2 className="text-2xl font-bold text-[#5e17eb] mb-4 text-center">Completa tu perfil</h2>
        <p className="text-gray-600 text-center mb-8">Agrega tu experiencia laboral y escolar para mejorar tus oportunidades.</p>
        {success && <div className="w-full max-w-3xl bg-green-100 text-green-700 px-4 py-2 rounded mb-2 text-center border border-green-300">{success}</div>}
        {error && <div className="w-full max-w-3xl bg-red-100 text-red-700 px-4 py-2 rounded mb-2 text-center border border-red-300">{error}</div>}
        <form className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-10 border-t-4 border-[#5e17eb]" onSubmit={handleSubmit}>
          {/* Experiencia Laboral */}
            <div>
            <h3 className="text-xl font-semibold text-[#5e17eb] mb-4">Experiencia Laboral</h3>
            {expLaboral.map((exp, i) => (
                <div key={i} className="mb-6 border-b pb-4 border-gray-200 flex flex-col gap-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="exla_nombreEmpresa" value={exp.exla_nombreEmpresa} onChange={e => handleLaboralChange(i, e)} placeholder="Empresa" className="px-4 py-2 rounded-lg border border-gray-300" required />
                    <input name="exla_cargo" value={exp.exla_cargo} onChange={e => handleLaboralChange(i, e)} placeholder="Cargo" className="px-4 py-2 rounded-lg border border-gray-300" required />
                    <div className="flex flex-col">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha inicio</label>
                    <input name="exla_fechaInicio" value={exp.exla_fechaInicio} onChange={e => handleLaboralChange(i, e)} type="date" className="px-4 py-2 rounded-lg border border-gray-300" required />
                    </div>
                    <div className="flex flex-col">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha fin</label>
                    <input name="exla_fechaFin" value={exp.exla_fechaFin} onChange={e => handleLaboralChange(i, e)} type="date" className="px-4 py-2 rounded-lg border border-gray-300" />
                    </div>
                    <input name="exla_salario" value={exp.exla_salario} onChange={e => handleLaboralChange(i, e)} placeholder="Salario" type="number" className="px-4 py-2 rounded-lg border border-gray-300" />
                    <input name="exla_funcion" value={exp.exla_funcion} onChange={e => handleLaboralChange(i, e)} placeholder="Función principal" className="px-4 py-2 rounded-lg border border-gray-300" />
                </div>
                <textarea name="exla_descripcion" value={exp.exla_descripcion} onChange={e => handleLaboralChange(i, e)} placeholder="Descripción" className="w-full px-4 py-2 rounded-lg border border-gray-300 mt-2" rows={2} />
                <div className="flex justify-end gap-2 mt-2">
                    {expLaboral.length > 1 && <button type="button" onClick={() => removeLaboral(i)} className="text-red-500 hover:underline">Eliminar</button>}
                    {i === expLaboral.length - 1 && <button type="button" onClick={addLaboral} className="text-[#5e17eb] hover:underline">Agregar</button>}
                </div>
                </div>
            ))}
            </div>
          {/* Experiencia Escolar */}
            <div>
            <h3 className="text-xl font-semibold text-[#5e17eb] mb-4">Formación Académica</h3>
            {expEscolar.map((exp, i) => (
                <div key={i} className="mb-6 border-b pb-4 border-gray-200 flex flex-col gap-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="exes_nombreInstitucion" value={exp.exes_nombreInstitucion} onChange={e => handleEscolarChange(i, e)} placeholder="Institución" className="px-4 py-2 rounded-lg border border-gray-300" required />
                    <input name="exes_titulo" value={exp.exes_titulo} onChange={e => handleEscolarChange(i, e)} placeholder="Título obtenido" className="px-4 py-2 rounded-lg border border-gray-300" required />
                    <div className="flex flex-col">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha inicio</label>
                    <input name="exes_fechaInicio" value={exp.exes_fechaInicio} onChange={e => handleEscolarChange(i, e)} type="date" className="px-4 py-2 rounded-lg border border-gray-300" required />
                    </div>
                    <div className="flex flex-col">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha fin</label>
                    <input name="exes_fechaFin" value={exp.exes_fechaFin} onChange={e => handleEscolarChange(i, e)} type="date" className="px-4 py-2 rounded-lg border border-gray-300" />
                    </div>
                    <input name="exes_nivelEducativo" value={exp.exes_nivelEducativo} onChange={e => handleEscolarChange(i, e)} placeholder="Nivel educativo" className="px-4 py-2 rounded-lg border border-gray-300" />
                </div>
                <textarea name="exes_description" value={exp.exes_description} onChange={e => handleEscolarChange(i, e)} placeholder="Descripción" className="w-full px-4 py-2 rounded-lg border border-gray-300 mt-2" rows={2} />
                <div className="flex justify-end gap-2 mt-2">
                    {expEscolar.length > 1 && <button type="button" onClick={() => removeEscolar(i)} className="text-red-500 hover:underline">Eliminar</button>}
                    {i === expEscolar.length - 1 && <button type="button" onClick={addEscolar} className="text-[#5e17eb] hover:underline">Agregar</button>}
                </div>
                </div>
            ))}
            </div>
            
            <div className="flex gap-4 mt-6">
                <button 
                    type="button" 
                    onClick={() => navigate('/aspirantes/perfil')}
                    className="flex-1 bg-transparent border-2 border-gray-400 text-gray-700 font-bold py-3 rounded-lg shadow hover:bg-gray-100 transition text-lg flex items-center justify-center gap-2"
                >
                    <FaTimes /> Cancelar
                </button>
                <button 
                    type="submit" 
                    className="flex-1 bg-[#5e17eb] text-white font-bold py-3 rounded-lg shadow hover:bg-[#A67AFF] transition text-lg flex items-center justify-center gap-2"
                >
                    <FaCheckCircle /> Guardar todo
                </button>
            </div>
        </form>
        </main>
        <Footer />
    </div>
    );
}

export default CompletarPerfilAspirante;
