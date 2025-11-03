import { useState } from 'react';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import { FaLock, FaEnvelope, FaArrowRight, FaCheckCircle } from 'react-icons/fa';

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
    <>
      <Navbar />
      <div className="min-h-screen bg-[#f6f4fa] flex items-center justify-center py-10 pt-24 px-4">
        <div className="w-full max-w-md">
          {/* Tarjeta principal */}
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full border-t-4 border-[#5e17eb]">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#5e17eb] to-[#A67AFF] flex items-center justify-center shadow-lg">
                  <FaLock className="h-8 w-8 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-[#5e17eb] mb-2">Recuperar contraseña</h2>
              <p className="text-gray-600">Te enviaremos un enlace para restablecer tu contraseña</p>
            </div>

            {/* Mensajes de éxito o error */}
            {mensaje && (
              <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg mb-6 font-semibold flex items-center gap-2">
                <FaCheckCircle className="text-green-500 text-xl" />
                <span>{mensaje}</span>
              </div>
            )}
            
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 font-semibold">
                {error}
              </div>
            )}
            
            {!enviado ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Correo electrónico</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-gray-400" />
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
                className={`w-full bg-gradient-to-r from-[#5e17eb] to-[#A67AFF] text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
            <a href="/login" className="text-[#5e17eb] hover:text-[#A67AFF] transition-colors font-medium">← Volver al inicio de sesión</a>
            <a href="/register" className="text-[#5e17eb] hover:text-[#A67AFF] transition-colors font-medium">¿No tienes cuenta? Regístrate</a>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}