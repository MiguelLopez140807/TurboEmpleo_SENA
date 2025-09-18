import { useState } from 'react';

export default function RecuperarPassword() {
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');
    setEnviado(false);
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
        setError(data.error || 'Ocurrió un error.');
      }
    } catch (err) {
      setError('Error de conexión.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Recuperar contraseña</h2>
      {mensaje && <div className="bg-green-100 text-green-700 p-2 mb-4 rounded">{mensaje}</div>}
      {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}
      {!enviado && (
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-semibold">Correo electrónico</label>
          <input
            type="email"
            className="w-full p-2 border rounded mb-4"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Enviar enlace</button>
        </form>
      )}
      {enviado && (
        <div className="text-center mt-4 text-gray-600">
          Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.
        </div>
      )}
    </div>
  );
}
