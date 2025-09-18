import { Link } from 'react-router-dom';
import React, { useRef, useState } from "react";

function RegisterAspirante() {
  const fileInputRef = useRef();
  const fotoInputRef = useRef();
  const [fotoPreview, setFotoPreview] = useState(null);
  const [form, setForm] = useState({
    nombreCompleto: "",
    apellido: "",
    usuario: "",
    password: "",
    email: "",
    telefono: "",
    departamento: "",
    ciudad: "",
    ocupacion: "",
    nacimiento_dia: "",
    nacimiento_mes: "",
    nacimiento_anio: "",
    tipoId: "CC",
    numeroId: "",
    foto: null,
    idiomas: [],
    cargo: "",
    descripcion: "",
    curriculum: null,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [aceptaDatos, setAceptaDatos] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setForm((f) => ({ ...f, [name]: files[0] }));
      if (name === "foto" && files[0]) {
        const reader = new FileReader();
        reader.onloadend = () => setFotoPreview(reader.result);
        reader.readAsDataURL(files[0]);
      }
    } else if (name === "idiomas") {
      const selected = Array.from(e.target.selectedOptions, option => option.value);
      setForm((f) => ({ ...f, idiomas: selected }));
    } else if (name === "telefono" || name === "numeroId") {
      // Solo permitir números
      const numericValue = value.replace(/[^0-9]/g, "");
      setForm((f) => ({ ...f, [name]: numericValue }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!aceptaDatos) {
      setError("Debes aceptar el tratamiento de datos personales para continuar.");
      return;
    }
    // Validaciones básicas en frontend
    if (!form.email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
      setError("El correo electrónico no es válido.");
      return;
    }
    if (form.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (form.telefono.length < 7) {
      setError("El teléfono debe tener al menos 7 dígitos y solo números.");
      return;
    }
    if (!/^[0-9]+$/.test(form.numeroId)) {
      setError("El número de identificación solo puede contener números.");
      return;
    }
    // Validar que la fecha de nacimiento sea mayor a 18 años
    const dia = parseInt(form.nacimiento_dia, 10);
    const mes = parseInt(form.nacimiento_mes, 10) - 1; // Mes en JS es 0-index
    const anio = parseInt(form.nacimiento_anio, 10);
    const fechaNacimiento = new Date(anio, mes, dia);
    const hoy = new Date();
    const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const cumpleEsteAnio = hoy.getMonth() > mes || (hoy.getMonth() === mes && hoy.getDate() >= dia);
    const edadFinal = cumpleEsteAnio ? edad : edad - 1;
    if (isNaN(edadFinal) || edadFinal < 18) {
      setError("Debes ser mayor de 18 años para registrarte.");
      return;
    }
    const formData = new FormData();
    formData.append('user_nombre', form.usuario);
    formData.append('user_contraseña', form.password);
    formData.append('user_rol', 'Aspirante');
    formData.append('asp_nombre', form.nombreCompleto);
    formData.append('asp_apellido', form.apellido);
    formData.append('asp_correo', form.email);
    formData.append('asp_telefono', form.telefono);
    formData.append('asp_departamento', form.departamento);
    formData.append('asp_ciudad', form.ciudad);
    formData.append('asp_ocupacion', form.ocupacion);
    formData.append('asp_nacimiento_dia', form.nacimiento_dia);
    formData.append('asp_nacimiento_mes', form.nacimiento_mes);
    formData.append('asp_nacimiento_anio', form.nacimiento_anio);
    formData.append('asp_tipoId', form.tipoId);
    formData.append('asp_numeroId', form.numeroId);
    formData.append('asp_cargo', form.cargo);
    formData.append('asp_descripcion', form.descripcion);
    if (form.foto) formData.append('asp_foto', form.foto);
    if (form.curriculum) formData.append('asp_curriculum', form.curriculum);
    if (form.idiomas && form.idiomas.length > 0) {
      formData.append('asp_idiomas', JSON.stringify(form.idiomas));
    }
    try {
      const response = await fetch('http://127.0.0.1:8000/api/registro/', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        // Guardar token y user_data si vienen en la respuesta
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        if (data.user) {
          localStorage.setItem('user_data', JSON.stringify(data.user));
        }
        setSuccess('¡Registro enviado exitosamente!');
        setForm({
          nombreCompleto: "",
          apellido: "",
          usuario: "",
          password: "",
          email: "",
          telefono: "",
          departamento: "",
          ciudad: "",
          ocupacion: "",
          nacimiento_dia: "",
          nacimiento_mes: "",
          nacimiento_anio: "",
          tipoId: "CC",
          numeroId: "",
          foto: null,
          idiomas: [],
          cargo: "",
          descripcion: "",
          curriculum: null,
        });
      } else {
        setError(data.message || data.detail || 'Error al registrar aspirante');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f6f3ff] to-[#e9e4fa] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-[#5e17eb]"></div>
          <div className="absolute top-40 right-20 w-24 h-24 rounded-full bg-[#ffde59]"></div>
          <div className="absolute bottom-20 left-1/4 w-28 h-28 rounded-full bg-[#A67AFF]"></div>
          <div className="absolute bottom-40 right-1/3 w-36 h-36 rounded-full bg-[#5e17eb]"></div>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#5e17eb] mb-2">Crea tu cuenta</h2>
          <p className="text-gray-600">Completa el formulario para unirte a TurboEmpleo</p>
        </div>

        {error && (
          <div className="w-full bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-red-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="w-full bg-green-50 border-l-4 border-green-500 p-4 rounded-lg mb-6">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        )}

        <form className="w-full bg-white rounded-2xl shadow-xl p-8 border-t-4 border-[#5e17eb]" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Columna izquierda */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Información Personal</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input 
                      name="nombreCompleto" 
                      value={form.nombreCompleto} 
                      onChange={handleChange} 
                      type="text" 
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5e17eb] focus:border-transparent transition" 
                      required 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input 
                      name="apellido" 
                      value={form.apellido} 
                      onChange={handleChange} 
                      type="text" 
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5e17eb] focus:border-transparent transition" 
                      required 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de Usuario</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input 
                      name="usuario" 
                      value={form.usuario} 
                      onChange={handleChange} 
                      type="text" 
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5e17eb] focus:border-transparent transition" 
                      required 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input 
                      name="password" 
                      value={form.password} 
                      onChange={handleChange} 
                      type="password" 
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5e17eb] focus:border-transparent transition" 
                      required 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input 
                      name="email" 
                      value={form.email} 
                      onChange={handleChange} 
                      type="email" 
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5e17eb] focus:border-transparent transition" 
                      required 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de nacimiento</label>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <input 
                        name="nacimiento_dia" 
                        value={form.nacimiento_dia} 
                        onChange={handleChange} 
                        type="number" 
                        min="1" 
                        max="31" 
                        placeholder="Día" 
                        className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5e17eb] focus:border-transparent transition" 
                        required 
                      />
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <input 
                        name="nacimiento_mes" 
                        value={form.nacimiento_mes} 
                        onChange={handleChange} 
                        type="number" 
                        min="1" 
                        max="12" 
                        placeholder="Mes" 
                        className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5e17eb] focus:border-transparent transition" 
                        required 
                      />
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <input 
                        name="nacimiento_anio" 
                        value={form.nacimiento_anio} 
                        onChange={handleChange} 
                        type="number" 
                        min="1900" 
                        max="2100" 
                        placeholder="Año" 
                        className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5e17eb] focus:border-transparent transition" 
                        required 
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <input 
                      name="departamento" 
                      value={form.departamento} 
                      onChange={handleChange} 
                      type="text" 
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5e17eb] focus:border-transparent transition" 
                      required 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <input 
                      name="ciudad" 
                      value={form.ciudad} 
                      onChange={handleChange} 
                      type="text" 
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5e17eb] focus:border-transparent transition" 
                      required 
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Columna derecha */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Información Profesional</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <input 
                      name="telefono" 
                      value={form.telefono} 
                      onChange={handleChange} 
                      type="tel" 
                      pattern="[0-9]*" 
                      inputMode="numeric" 
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5e17eb] focus:border-transparent transition" 
                      required 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ocupación deseada</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input 
                      name="ocupacion" 
                      value={form.ocupacion} 
                      onChange={handleChange} 
                      type="text" 
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5e17eb] focus:border-transparent transition" 
                      required 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Perfil Profesional</label>
                  <div className="relative mb-2">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input 
                      name="cargo" 
                      value={form.cargo} 
                      onChange={handleChange} 
                      type="text" 
                      placeholder="Cargo o título deseado" 
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5e17eb] focus:border-transparent transition" 
                      required 
                    />
                  </div>
                  <textarea 
                    name="descripcion" 
                    value={form.descripcion} 
                    onChange={handleChange} 
                    placeholder="Descripción breve de su perfil profesional" 
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5e17eb] focus:border-transparent transition" 
                    rows={3} 
                    required 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Identificación</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                        </svg>
                      </div>
                      <select 
                        name="tipoId" 
                        value={form.tipoId} 
                        onChange={handleChange} 
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5e17eb] focus:border-transparent transition"
                      >
                        <option value="CC">C.C.</option>
                        <option value="TI">T.I.</option>
                        <option value="CE">C.E.</option>
                        <option value="PAS">Pasaporte</option>
                      </select>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                        </svg>
                      </div>
                      <input 
                        name="numeroId" 
                        value={form.numeroId} 
                        onChange={handleChange} 
                        type="text" 
                        pattern="[0-9]*" 
                        inputMode="numeric" 
                        placeholder="N° documento" 
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5e17eb] focus:border-transparent transition" 
                        required 
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Idiomas</label>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex flex-wrap gap-3">
                      {['Español (Nativo)', 'Inglés', 'Francés', 'Alemán', 'Portugués', 'Otro'].map((idioma) => (
                        <label 
                          key={idioma} 
                          className="flex items-center gap-2 text-sm text-gray-700 bg-white px-3 py-2 rounded-lg border border-gray-300 hover:bg-[#f6f3ff] hover:border-[#5e17eb] transition cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            name="idiomas"
                            value={idioma}
                            checked={form.idiomas.includes(idioma)}
                            onChange={e => {
                              if (e.target.checked) {
                                setForm(f => ({ ...f, idiomas: [...f.idiomas, idioma] }));
                              } else {
                                setForm(f => ({ ...f, idiomas: f.idiomas.filter(i => i !== idioma) }));
                              }
                            }}
                            className="accent-[#5e17eb]"
                          />
                          {idioma}
                        </label>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 mt-2 block">Selecciona todos los idiomas que dominas.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Inputs de foto de perfil y currículum */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {/* Input de foto de perfil */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-3">Foto de perfil</label>
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => fotoInputRef.current && fotoInputRef.current.click()}
                  className="w-full px-6 py-4 rounded-lg border-2 border-dashed border-[#5e17eb] bg-[#f6f3ff] text-[#5e17eb] font-semibold text-center shadow-sm hover:bg-[#ede7fa] transition flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  {form.foto ? `Archivo seleccionado: ${form.foto.name}` : "Haz clic para seleccionar tu foto"}
                </button>
                <input
                  name="foto"
                  type="file"
                  accept="image/*"
                  ref={fotoInputRef}
                  onChange={handleChange}
                  className="hidden"
                />
                {/* Previsualización */}
                <div className="mt-4">
                  {fotoPreview ? (
                    <div className="relative">
                      <img src={fotoPreview} alt="Previsualización" className="w-24 h-24 object-cover rounded-full border-4 border-white shadow-md" />
                      <div className="absolute inset-0 rounded-full bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </div>
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white shadow-md flex items-center justify-center text-gray-400">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Input de currículum */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-3">Sube tu currículum en PDF</label>
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  className="w-full px-6 py-4 rounded-lg border-2 border-dashed border-[#5e17eb] bg-[#f6f3ff] text-[#5e17eb] font-semibold text-center shadow-sm hover:bg-[#ede7fa] transition flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                  {form.curriculum ? `Archivo seleccionado: ${form.curriculum.name}` : "Haz clic para seleccionar tu currículum"}
                </button>
                <input
                  name="curriculum"
                  type="file"
                  accept="application/pdf"
                  ref={fileInputRef}
                  onChange={handleChange}
                  className="hidden"
                  required
                />
                <div className="mt-4 text-center">
                  {form.curriculum ? (
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>PDF listo para subir</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-sm text-gray-500 mt-2">Formato PDF requerido</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Checkbox de tratamiento de datos */}
          <div className="flex items-start mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <input
              type="checkbox"
              id="aceptaDatos"
              checked={aceptaDatos}
              onChange={e => setAceptaDatos(e.target.checked)}
              className="accent-[#5e17eb] mt-1 mr-3"
              required
            />
            <label htmlFor="aceptaDatos" className="text-sm text-gray-700">
              Acepto el <Link to="/PoliticaDatos" target="_blank" rel="noopener noreferrer" className="underline text-[#5e17eb] font-medium">tratamiento de datos personales</Link> y los términos y condiciones de TurboEmpleo
            </label>
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-[#5e17eb] to-[#A67AFF] text-white font-bold py-4 rounded-lg shadow-md hover:shadow-xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 mt-6"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Registrar cuenta
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterAspirante;