import React, { useEffect, useState, useRef } from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";


function PerfilEmpresa() {
    const [form, setForm] = useState(null);
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const logoInputRef = useRef();
    const [sidebarSection, setSidebarSection] = useState("datos");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Obtener token y datos de la empresa desde localStorage
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user_data") || "null");
    const empresaId = userData ? userData.id : null;

    // Previsualizar logo
    useEffect(() => {
        if (logoFile) {
            const reader = new FileReader();
            reader.onloadend = () => setLogoPreview(reader.result);
            reader.readAsDataURL(logoFile);
        } else {
            setLogoPreview(null);
        }
    }, [logoFile]);

    useEffect(() => {
        if (!token || !empresaId) {
            setError("No se encontró sesión activa.");
            setLoading(false);
            return;
        }
        fetch(`http://127.0.0.1:8000/api/empresas/${empresaId}/`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => {
                setForm(data);
                setLoading(false);
            })
            .catch(() => {
                setError("Error al cargar los datos del perfil de empresa.");
                setLoading(false);
            });
    }, [token, empresaId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        if (!form) return;
        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => {
            if (key === "em_idiomas") {
                // Enviar como string JSON
                formData.append("em_idiomas", JSON.stringify(value || []));
            } else if (key !== "em_logo" && key !== "em_curriculum") {
                formData.append(key, value ?? "");
            }
        });
        if (logoFile) {
            formData.append("em_logo", logoFile);
        }
        // Si en el futuro se agrega soporte para em_curriculum, aquí se puede manejar
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/empresas/${empresaId}/`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });
            if (res.ok) {
                setSuccess("Perfil actualizado correctamente.");
            } else {
                setError("Error al actualizar el perfil de empresa.");
            }
        } catch (err) {
            setError("Error de conexión al actualizar el perfil.");
        }
    };

    if (loading) return <div className="text-center mt-8">Cargando perfil...</div>;
    if (error) return <div className="text-center text-red-500 mt-8">{error}</div>;
    if (!form) return null;

    return (
        <div className="min-h-screen flex flex-col bg-[#f6f4fa]">
            <Navbar />
            <main className="flex-1 flex flex-row justify-center pt-24 pb-10 px-4">
                {/* Sidebar */}
                <aside className="w-64 bg-white rounded-2xl shadow-xl p-6 mr-8 h-fit sticky top-24 border-t-4 border-[#A67AFF] flex flex-col gap-4">
                    <button
                        className={`text-left px-4 py-3 rounded-lg font-semibold transition text-lg ${sidebarSection === "datos" ? "bg-[#A67AFF] text-white" : "bg-gray-100 text-[#A67AFF] hover:bg-[#5e17eb] hover:text-white"}`}
                        onClick={() => setSidebarSection("datos")}
                    >
                        Datos básicos
                    </button>
                    <button
                        className={`text-left px-4 py-3 rounded-lg font-semibold transition text-lg ${sidebarSection === "config" ? "bg-[#A67AFF] text-white" : "bg-gray-100 text-[#A67AFF] hover:bg-[#5e17eb] hover:text-white"}`}
                        onClick={() => setSidebarSection("config")}
                    >
                        Configuración
                    </button>
                </aside>
                {/* Contenido principal */}
                <section className="flex-1 max-w-3xl">
                    <h2 className="text-2xl font-bold text-[#A67AFF] mb-4 text-center">Perfil de Empresa</h2>
                    {sidebarSection === "datos" && (
                        <>
                            {error && <div className="w-full bg-red-100 text-red-700 px-4 py-2 rounded mb-2 text-center border border-red-300">{error}</div>}
                            {success && <div className="w-full bg-green-100 text-green-700 px-4 py-2 rounded mb-2 text-center border border-green-300">{success}</div>}
                            <form className="w-full bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-8 border-t-4 border-[#A67AFF]" onSubmit={handleSubmit} encType="multipart/form-data">
                                {/* Logo grande y centrado */}
                                <div className="flex flex-col items-center justify-center mb-6">
                                    {logoPreview ? (
                                        <img src={logoPreview} alt="Previsualización" className="w-40 h-40 object-cover rounded-full border-4 border-[#5e17eb] shadow-lg mb-2" />
                                    ) : form.em_logo ? (
                                        <img src={form.em_logo} alt="Logo actual" className="w-40 h-40 object-cover rounded-full border-4 border-[#5e17eb] shadow-lg mb-2" />
                                    ) : (
                                        <span className="text-gray-400 text-lg mb-2">Sin logo</span>
                                    )}
                                    <label className="block">
                                        <button
                                            type="button"
                                            onClick={() => logoInputRef.current && logoInputRef.current.click()}
                                            className="mt-2 px-6 py-2 rounded-lg bg-[#5e17eb] text-white font-semibold shadow hover:bg-[#A67AFF] transition"
                                        >
                                            Cambiar logo
                                        </button>
                                        <input
                                            type="file"
                                            name="em_logo"
                                            accept="image/*"
                                            ref={logoInputRef}
                                            onChange={e => setLogoFile(e.target.files[0])}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre</label>
                                            <input name="em_nombre" value={form.em_nombre || ""} onChange={handleChange} type="text" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#A67AFF]" required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">NIT</label>
                                            <input name="em_nit" value={form.em_nit || ""} onChange={handleChange} type="text" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#A67AFF]" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                                            <input name="em_email" value={form.em_email || ""} onChange={handleChange} type="email" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#A67AFF]" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Teléfono</label>
                                            <input name="em_telefono" value={form.em_telefono || ""} onChange={handleChange} type="text" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#A67AFF]" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Departamento</label>
                                            <input name="em_departamento" value={form.em_departamento || ""} onChange={handleChange} type="text" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#A67AFF]" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Ciudad</label>
                                            <input name="em_ciudad" value={form.em_ciudad || ""} onChange={handleChange} type="text" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#A67AFF]" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Sector</label>
                                            <input name="em_sector" value={form.em_sector || ""} onChange={handleChange} type="text" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#A67AFF]" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Contacto</label>
                                            <input name="em_contacto" value={form.em_contacto || ""} onChange={handleChange} type="text" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#A67AFF]" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción</label>
                                            <textarea name="em_descripcion" value={form.em_descripcion || ""} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#A67AFF]" rows={3} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Sitio Web</label>
                                            <input name="em_sitioWeb" value={form.em_sitioWeb || ""} onChange={handleChange} type="url" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#A67AFF]" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Tamaño</label>
                                            <input name="em_tamano" value={form.em_tamano || ""} onChange={handleChange} type="text" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#A67AFF]" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Dirección</label>
                                            <input name="em_direccion" value={form.em_direccion || ""} onChange={handleChange} type="text" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#A67AFF]" />
                                        </div>
                                    </div>
                                </div>
                                {/* Botones de acción */}
                                <div className="flex flex-col md:flex-row gap-4 mt-6">
                                    <button 
                                        type="button" 
                                        onClick={() => window.history.back()}
                                        className="flex-1 bg-transparent border-2 border-red-500 text-red-500 font-bold py-3 rounded-lg shadow hover:bg-red-500 hover:text-white transition text-lg"
                                    >
                                        Cancelar
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => {
                                            // Recargar los datos originales
                                            if (!token || !empresaId) return;
                                            fetch(`http://127.0.0.1:8000/api/empresas/${empresaId}/`, {
                                                headers: { Authorization: `Bearer ${token}` },
                                            })
                                                .then((res) => res.json())
                                                .then((data) => {
                                                    setForm(data);
                                                    setLogoFile(null);
                                                    setLogoPreview(null);
                                                    if (logoInputRef.current) logoInputRef.current.value = "";
                                                    setSuccess("Datos restablecidos");
                                                })
                                                .catch(() => setError("Error al restablecer los datos"));
                                        }}
                                        className="flex-1 bg-transparent border-2 border-gray-400 text-gray-600 font-bold py-3 rounded-lg shadow hover:bg-gray-400 hover:text-white transition text-lg"
                                    >
                                        Limpiar datos
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="flex-1 bg-[#A67AFF] text-white font-bold py-3 rounded-lg shadow hover:bg-[#5e17eb] transition text-lg"
                                    >
                                        Guardar cambios
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                    {sidebarSection === "config" && (
                        <div className="w-full bg-white rounded-2xl shadow-xl p-8 border-t-4 border-[#A67AFF] flex flex-col gap-8 max-w-lg mx-auto">
                            <h3 className="text-xl font-bold text-[#A67AFF] mb-2">Configuración de la cuenta</h3>
                            {/* Mensajes de feedback */}
                            {error && <div className="w-full bg-red-100 text-red-700 px-4 py-2 rounded mb-2 text-center border border-red-300">{error}</div>}
                            {success && <div className="w-full bg-green-100 text-green-700 px-4 py-2 rounded mb-2 text-center border border-green-300">{success}</div>}
                            {/* Cambiar contraseña */}
                            <form className="flex flex-col gap-4" onSubmit={async (e) => {
                                e.preventDefault();
                                setError("");
                                setSuccess("");
                                const current_password = e.target.current_password.value;
                                const new_password = e.target.new_password.value;
                                try {
                                    const res = await fetch(`http://127.0.0.1:8000/api/usuarios/cambiar-password/`, {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                            Authorization: `Bearer ${token}`
                                        },
                                        body: JSON.stringify({ current_password, new_password })
                                    });
                                    const data = await res.json();
                                    if (res.ok) {
                                        setSuccess("¡Contraseña cambiada correctamente!");
                                        e.target.reset();
                                        // Limpiar el mensaje después de 5 segundos
                                        setTimeout(() => setSuccess(""), 5000);
                                    } else {
                                        setError(data.detail || "Error al cambiar la contraseña.");
                                    }
                                } catch (err) {
                                    setError("Error de conexión al cambiar la contraseña.");
                                }
                            }}>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Contraseña actual</label>
                                <input name="current_password" type="password" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#A67AFF]" required />
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Nueva contraseña</label>
                                <input name="new_password" type="password" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#A67AFF]" required />
                                <button type="submit" className="w-full bg-[#A67AFF] text-white font-bold py-2 rounded-lg hover:bg-[#5e17eb] transition mt-2">Cambiar contraseña</button>
                            </form>
                            {/* Eliminar cuenta */}
                            <div className="mt-8">
                                <h4 className="text-lg font-semibold text-red-600 mb-2">Eliminar cuenta</h4>
                                <p className="text-gray-600 mb-4">Esta acción es irreversible. Todos los datos de la empresa serán eliminados.</p>
                                <button
                                    className="w-full bg-transparent border-2 border-red-500 text-red-500 font-bold py-2 rounded-lg shadow hover:bg-red-500 hover:text-white transition"
                                    onClick={async () => {
                                        if (!window.confirm("¿Estás seguro de que deseas eliminar tu cuenta de empresa? Esta acción no se puede deshacer.")) return;
                                        setError("");
                                        setSuccess("");
                                        try {
                                            const res = await fetch(`http://127.0.0.1:8000/api/usuarios/eliminar-cuenta/`, {
                                                method: "DELETE",
                                                headers: { Authorization: `Bearer ${token}` }
                                            });
                                            if (res.ok) {
                                                setSuccess("Cuenta eliminada correctamente. Cerrando sesión...");
                                                setTimeout(() => {
                                                    localStorage.clear();
                                                    window.location.href = "/";
                                                }, 2000);
                                            } else {
                                                setError("Error al eliminar la cuenta de empresa.");
                                            }
                                        } catch (err) {
                                            setError("Error de conexión al eliminar la cuenta.");
                                        }
                                    }}
                                >
                                    Eliminar cuenta de empresa
                                </button>
                            </div>
                        </div>
                    )}
                </section>
            </main>
            <Footer />
        </div>
    );
}

export default PerfilEmpresa;
