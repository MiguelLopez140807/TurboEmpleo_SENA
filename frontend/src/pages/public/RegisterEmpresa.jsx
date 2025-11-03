import { Link } from 'react-router-dom';
// ...existing code...

import React, { useRef, useState } from "react";

function RegisterEmpresa() {
  const fileInputRef = useRef();
  const [form, setForm] = useState({
    nombreEmpresa: "",
    nit: "",
    email: "",
    telefono: "",
    departamento: "",
    ciudad: "",
    sector: "",
    contacto: "",
    password: "",
    descripcion: "",
    sitioWeb: "",
    tamano: "",
    direccion: "",
    curriculum: null,
    logo: null,
    idiomas: [],
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [aceptaDatos, setAceptaDatos] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setForm((f) => ({ ...f, [name]: files[0] }));
    } else if (name === "idiomas") {
      const selected = Array.from(e.target.selectedOptions, option => option.value);
      setForm((f) => ({ ...f, idiomas: selected }));
    } else if (name === "telefono" || name === "nit") {
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
    if (!form.nit) {
      setError("El NIT es obligatorio.");
      return;
    }
    if (!/^[0-9]+$/.test(form.nit)) {
      setError("El NIT solo puede contener números.");
      return;
    }
    if (form.telefono.length < 7) {
      setError("El teléfono debe tener al menos 7 dígitos y solo números.");
      return;
    }
    if (!/^[0-9]+$/.test(form.telefono)) {
      setError("El teléfono solo puede contener números.");
      return;
    }
    if (!form.sitioWeb) {
      setError("El sitio web es obligatorio.");
      return;
    }
    if (!/^https?:\/\/.+\..+/.test(form.sitioWeb)) {
      setError("La URL del sitio web no es válida. Debe comenzar con http:// o https://");
      return;
    }
    const formData = new FormData();
    formData.append('user_nombre', form.nombreEmpresa); // Usar nombre de empresa como usuario
    formData.append('user_contraseña', form.password);
    formData.append('user_rol', 'Empresa');
    formData.append('em_nombre', form.nombreEmpresa);
    formData.append('em_nit', form.nit);
    formData.append('em_email', form.email);
    formData.append('em_telefono', form.telefono);
    formData.append('em_departamento', form.departamento);
    formData.append('em_ciudad', form.ciudad);
    formData.append('em_sector', form.sector);
    formData.append('em_contacto', form.contacto);
    formData.append('em_password', form.password);
    formData.append('em_descripcion', form.descripcion);
    formData.append('em_sitioWeb', form.sitioWeb);
    formData.append('em_tamano', form.tamano);
    formData.append('em_direccion', form.direccion);
    if (form.curriculum) formData.append('em_curriculum', form.curriculum);
    if (form.logo) formData.append('em_logo', form.logo);
    if (form.idiomas && form.idiomas.length > 0) {
      formData.append('em_idiomas', JSON.stringify(form.idiomas));
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
        setSuccess('¡Registro de empresa enviado exitosamente!');
        setForm({
          nombreEmpresa: "",
          nit: "",
          email: "",
          telefono: "",
          departamento: "",
          ciudad: "",
          sector: "",
          contacto: "",
          password: "",
          descripcion: "",
          sitioWeb: "",
          tamano: "",
          direccion: "",
          curriculum: null,
          logo: null,
          idiomas: [],
        });
      } else {
        setError(data.message || data.detail || 'Error al registrar empresa');
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
          <h2 className="text-3xl font-bold text-[#5e17eb] mb-2">Crea tu cuenta empresarial</h2>
          <p className="text-gray-600">Completa el formulario para registrar tu empresa en TurboEmpleo</p>
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
              <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Información de la Empresa</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la empresa</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <input 
                      name="nombreEmpresa" 
                      value={form.nombreEmpresa} 
                      onChange={handleChange} 
                      type="text" 
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5e17eb] focus:border-transparent transition" 
                      required 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">NIT</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                      </svg>
                    </div>
                    <input 
                      name="nit" 
                      value={form.nit} 
                      onChange={handleChange} 
                      type="text" 
                      pattern="[0-9]*" 
                      inputMode="numeric" 
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5e17eb] focus:border-transparent transition" 
                      required 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correo de contacto</label>
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
              <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Información de Contacto</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sector</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input 
                      name="sector" 
                      value={form.sector} 
                      onChange={handleChange} 
                      type="text" 
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5e17eb] focus:border-transparent transition" 
                      required 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Persona de contacto</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input 
                      name="contacto" 
                      value={form.contacto} 
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sitio web</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                    </div>
                    <input 
                      name="sitioWeb" 
                      value={form.sitioWeb} 
                      onChange={handleChange} 
                      type="url" 
                      placeholder="https://" 
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5e17eb] focus:border-transparent transition" 
                      required 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tamaño de empresa</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <select 
                      name="tamano" 
                      value={form.tamano} 
                      onChange={handleChange} 
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5e17eb] focus:border-transparent transition appearance-none"
                    >
                      <option value="">Selecciona...</option>
                      <option value="1-10">1-10 empleados</option>
                      <option value="11-50">11-50 empleados</option>
                      <option value="51-200">51-200 empleados</option>
                      <option value="201-500">201-500 empleados</option>
                      <option value=">500">Más de 500 empleados</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <input 
                      name="direccion" 
                      value={form.direccion} 
                      onChange={handleChange} 
                      type="text" 
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5e17eb] focus:border-transparent transition" 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Idiomas requeridos</label>
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
                    <span className="text-xs text-gray-500 mt-2 block">Selecciona todos los idiomas requeridos para la vacante.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción de la empresa</label>
            <textarea 
              name="descripcion" 
              value={form.descripcion} 
              onChange={handleChange} 
              placeholder="Describe brevemente a tu empresa, misión, visión, etc." 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5e17eb] focus:border-transparent transition" 
              rows={4} 
              required 
            />
          </div>
          
          {/* Inputs de logo y presentación */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {/* Input de logo */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-3">Logo de la empresa</label>
              <div className="flex flex-col items-center">
                <input
                  name="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5e17eb] focus:border-transparent transition"
                />
                {form.logo && (
                  <div className="mt-3 flex items-center gap-2 text-green-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm">Archivo seleccionado: {form.logo.name}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Input de presentación */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-3">Adjunta la presentación de tu empresa (PDF)</label>
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  className="w-full px-6 py-4 rounded-lg border-2 border-dashed border-[#5e17eb] bg-[#f6f3ff] text-[#5e17eb] font-semibold text-center shadow-sm hover:bg-[#ede7fa] transition flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                  {form.curriculum ? `Archivo seleccionado: ${form.curriculum.name}` : "Haz clic para seleccionar el PDF de presentación"}
                </button>
                <input
                  name="curriculum"
                  type="file"
                  accept="application/pdf"
                  ref={fileInputRef}
                  onChange={handleChange}
                  className="hidden"
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
                      <span className="text-sm text-gray-500 mt-2">Formato PDF</span>
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Registrar empresa
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterEmpresa;
