import { useState } from 'react';

export default function RecuperarPassword() {
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:8000/api/usuarios/password-reset/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        setMensaje(data.message);
        setEnviado(true);
      } else {
        setError(data.error || 'Ocurrió un error al enviar el correo de recuperación.');
      }
    } catch (err) {
      setError('Error de conexión. Por favor, intenta nuevamente más tarde.');
    } finally {
      setIsLoading(false);
    }
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
        {/* Tarjeta principal */}
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full border-t-4 border-[#5e17eb] transform transition-all hover:scale-[1.02]">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#5e17eb] to-[#A67AFF] flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Recuperar contraseña</h2>
            <p className="text-gray-600">Te enviaremos un enlace para restablecer tu contraseña</p>
          </div>

          {/* Mensajes de éxito o error */}
          {mensaje && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded mb-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10l-1.293 1.293a1 1 0 001.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 8.707z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">{mensaje}</p>
                </div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
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

          {!enviado ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Correo electrónico</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    id="email"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5e17eb] focus:border-transparent transition"
                    placeholder="tu@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

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
                    Enviando...
                  </>
                ) : (
                  <>
                    <span>Enviar enlace de recuperación</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center py-6">
              <div className="mb-4">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944A11.955 11.955 0 0112 21c-2.17 0-4.207-.392-5.618-1.067L13 7l4 4 4-4m6 0v-2a9 9 0 00-9-9 9 9 0 00-9 9v2m0 0H7m9 0h6m0 0h6m0 0h6m0 0h6m0 0h6m0 0h6m0 0h6m0 0h6m0 0h6m0 0h6m0 0h6" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">¡Correo enviado!</h3>
              <p className="text-gray-600 mb-4">
                Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.
              </p>
              <p className="text-sm text-gray-500">
                No recibiste el correo? Revisa tu carpeta de spam o intenta nuevamente.
              </p>
              <button
                onClick={() => {
                  setEnviado(false);
                  setEmail('');
                  setMensaje('');
                }}
                className="mt-4 text-[#5e17eb] hover:text-[#A67AFF] font-medium"
              >
                Intentar con otro correo
              </button>
            </div>
          )}

          <div className="w-full flex flex-col md:flex-row justify-between items-center gap-2 text-sm mt-6 pt-4 border-t border-gray-100">
            <a href="/login" className="text-[#5e17eb] hover:text-[#A67AFF] transition-colors font-medium">Volver al inicio de sesión</a>
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