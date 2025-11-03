import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import { FaLock, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

export default function RestablecerPassword() {
  const { uidb64, token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    try {
      const response = await fetch(`http://localhost:8000/api/usuarios/password-reset-confirm/${uidb64}/${token}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (response.ok) {
        setMensaje(data.message || '¡Contraseña restablecida exitosamente!');
        setExito(true);
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(data.error || 'Ocurrió un error al restablecer la contraseña.');
      }
    } catch (err) {
      setError('Error de conexión. Por favor, intenta nuevamente.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f4fa]">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center pt-24 pb-10 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border-t-4 border-[#5e17eb]">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
              <FaLock className="text-3xl text-[#5e17eb]" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-2 text-center text-[#5e17eb]">Restablecer contraseña</h2>
          <p className="text-gray-600 text-center mb-6">Ingresa tu nueva contraseña</p>
          
          {mensaje && (
            <div className="bg-green-100 text-green-700 px-4 py-3 rounded-lg mb-4 text-center border border-green-300 flex items-center justify-center gap-2 font-semibold">
              <FaCheckCircle /> {mensaje} Redirigiendo al login...
            </div>
          )}
          
          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-4 text-center border border-red-300 flex items-center justify-center gap-2 font-semibold">
              <FaExclamationCircle /> {error}
            </div>
          )}
          
          {!exito && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Nueva contraseña</label>
                <input
                  type="password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5e17eb] focus:border-transparent transition"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Ingresa tu nueva contraseña"
                  minLength={6}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
              </div>
              
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Confirmar contraseña</label>
                <input
                  type="password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5e17eb] focus:border-transparent transition"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Confirma tu nueva contraseña"
                  minLength={6}
                  required
                />
              </div>
              
              <button 
                type="submit" 
                className="w-full bg-[#5e17eb] text-white font-bold py-3 rounded-lg shadow hover:bg-[#A67AFF] transition text-lg mt-6 flex items-center justify-center gap-2"
              >
                <FaCheckCircle /> Restablecer contraseña
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
