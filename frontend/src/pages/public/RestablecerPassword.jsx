import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

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
    try {
      const response = await fetch(`http://localhost:8000/api/usuarios/password-reset-confirm/${uidb64}/${token}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (response.ok) {
        setMensaje(data.message);
        setExito(true);
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(data.error || 'Ocurrió un error.');
      }
    } catch (err) {
      setError('Error de conexión.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Restablecer contraseña</h2>
      {mensaje && <div className="bg-green-100 text-green-700 p-2 mb-4 rounded">{mensaje} Redirigiendo al login...</div>}
      {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}
      {!exito && (
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-semibold">Nueva contraseña</label>
          <input
            type="password"
            className="w-full p-2 border rounded mb-4"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <label className="block mb-2 font-semibold">Confirmar contraseña</label>
          <input
            type="password"
            className="w-full p-2 border rounded mb-4"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Restablecer</button>
        </form>
      )}
    </div>
  );
}
