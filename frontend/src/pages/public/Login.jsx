import { useState } from "react";

function Login() {
  const [userNombre, setUserNombre] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState("username"); // "username" o "email"

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      // Intentar primero con nombre de usuario
      let payload = { password };
      if (loginMethod === "username") {
        payload.user_nombre = userNombre;
      } else {
        payload.email = userNombre; // Reutilizamos el mismo campo para email
      }

      const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Guardar token (aceptar tanto access como token por compatibilidad)
        const token = data.token || data.access;
        if (token) {
          localStorage.setItem("token", token);

          // Detectar si es aspirante o empresa
          if (data.user && (data.user.asp_nombre || data.user.asp_email || data.user.asp_cedula)) {
            // Es aspirante
            localStorage.setItem("user_data", JSON.stringify(data.user));
          } else if (data.user && (data.user.em_nombre || data.user.em_email || data.user.em_nit)) {
            // Es empresa
            localStorage.setItem("user_data", JSON.stringify(data.user));
          } else {
            // Intentar buscar datos de aspirante (compatibilidad vieja)
            try {
              const searchParam = loginMethod === "username" ? userNombre : userNombre;
              const aspRes = await fetch(`http://127.0.0.1:8000/api/aspirantes/?search=${searchParam}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              const aspData = await aspRes.json();
              if (aspRes.ok && Array.isArray(aspData) && aspData.length > 0) {
                localStorage.setItem("user_data", JSON.stringify(aspData[0]));
                console.log('user_data guardado tras login:', aspData[0]);
              }
            } catch (e) { 
              console.log("No se pudieron obtener datos del usuario:", e);
            }
          }

          // Forzar recarga para que Navbar detecte sesión
                    window.location.href = "/dashboard";
        } else {
          setError("No se recibió token de autenticación");
        }
      } else {
        // Si falla con el método actual, intentar con el otro método
        if (loginMethod === "username") {
          // Intentar con email
          const emailPayload = { email: userNombre, password };
          const emailResponse = await fetch("http://127.0.0.1:8000/api/login/", {
            method: "POST",
            headers: { 
              "Content-Type": "application/json"
            },
            body: JSON.stringify(emailPayload),
          });
          
          const emailData = await emailResponse.json();
          if (emailResponse.ok) {
            const token = emailData.token || emailData.access;
            if (token) {
              localStorage.setItem("token", token);
              window.location.href = "/dashboard";
              return;
            }
          }
        }
        
        // Si ambos métodos fallan, mostrar el error
        setError(data.detail || data.message || "Credenciales incorrectas");
      }
    } catch (err) {
      console.error("Error en login:", err);
      setError("Error de conexión");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLoginMethod = () => {
    setLoginMethod(loginMethod === "username" ? "email" : "username");
    setUserNombre("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f6f3ff] to-[#e9e4fa] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-[#5e17eb]"></div>
          <div className="absolute top-40 right-20 w-24 h-24 rounded-full bg-[#ffde59]"></div>
          <div className="absolute bottom-20 left-1/4 w-28 h-28 rounded-full bg-[#A67AFF]"></div>
          <div className="absolute bottom-40 right-1/3 w-36 h-36 rounded-full bg-[#5e17eb]"></div>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Tarjeta del formulario centrada */}
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full border-t-4 border-[#5e17eb] transform transition-all hover:scale-[1.02]">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
              <span className="text-2xl">🔑</span> Iniciar sesión
            </h2>
            <p className="text-gray-600 mt-2">Accede a tu cuenta de TurboEmpleo</p>
          </div>
          
          <form className="w-full flex flex-col gap-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="userNombre" className="block text-sm font-semibold text-gray-700 mb-2">
                {loginMethod === "username" ? "Nombre de usuario" : "Correo electrónico"}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {loginMethod === "username" ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  )}
                </div>
                <input
                  type={loginMethod === "username" ? "text" : "email"}
                  id="userNombre"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5e17eb] focus:border-transparent transition"
                  placeholder={loginMethod === "username" ? "Tu nombre de usuario" : "tu@correo.com"}
                  autoComplete={loginMethod === "username" ? "username" : "email"}
                  value={userNombre}
                  onChange={e => setUserNombre(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">Contraseña</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5e17eb] focus:border-transparent transition"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#5e17eb] hover:text-[#A67AFF] focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 016.856 6.856c.051.051.1.102.15.152M12 19a9.969 9.969 0 01-6.856-2.856m6.856 2.856A9.969 9.969 0 0112 19m0 0a3 3 0 100-6 3 3 0 000 6z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7S4.732 16.057 3.458 12z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            <button
              type="button"
              onClick={toggleLoginMethod}
              className="text-sm text-[#5e17eb] hover:text-[#A67AFF] transition-colors mb-2"
            >
              {loginMethod === "username" 
                ? "¿Prefieres iniciar sesión con correo electrónico?" 
                : "¿Prefieres iniciar sesión con nombre de usuario?"
              }
            </button>
            
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-gradient-to-r from-[#5e17eb] to-[#A67AFF] text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] flex items-center justify-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </>
              ) : (
                <>
                  <span>Ingresar</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>
          
          <div className="w-full flex flex-col md:flex-row justify-between items-center gap-2 text-sm mt-6 pt-4 border-t border-gray-100">
            <a href="/recuperar-password" className="text-[#5e17eb] hover:text-[#A67AFF] transition-colors font-medium">¿Olvidaste tu contraseña?</a>
            <a href="/register" className="text-[#5e17eb] hover:text-[#A67AFF] transition-colors font-medium">¿No tienes cuenta? Regístrate</a>
          </div>
        </div>
        
        {/* Información adicional */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>© 2025 TurboEmpleo. Todos los derechos reservados.</p>
          <div className="mt-2 flex justify-center space-x-4">
            <a href="#" className="text-gray-500 hover:text-[#5e17eb] transition-colors">Términos y condiciones</a>
            <a href="#" className="text-gray-500 hover:text-[#5e17eb] transition-colors">Política de privacidad</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;