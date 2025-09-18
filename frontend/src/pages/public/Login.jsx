

import { useState } from "react";


function Login() {
	const [userNombre, setUserNombre] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		try {
			const response = await fetch("http://127.0.0.1:8000/api/login/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ user_nombre: userNombre, password }),
			});
			const data = await response.json();
			if (response.ok) {
				// Guardar token (aceptar tanto access como token por compatibilidad)
				if (data.token) {
				  localStorage.setItem("token", data.token);
				} else if (data.access) {
				  localStorage.setItem("token", data.access);
				}
				// Obtener datos del aspirante tras login exitoso
				try {
					const aspRes = await fetch(`http://127.0.0.1:8000/api/aspirantes/?search=${userNombre}`, {
						headers: { Authorization: `Bearer ${data.token || data.access}` },
					});
					const aspData = await aspRes.json();
					if (aspRes.ok && Array.isArray(aspData) && aspData.length > 0) {
						localStorage.setItem("user_data", JSON.stringify(aspData[0]));
						console.log('user_data guardado tras login:', aspData[0]);
					}
				} catch (e) { /* No bloquear login si falla */ }
				// Forzar recarga para que Navbar detecte sesión
				window.location.href = "/dashboard";
			} else {
				setError(data.detail || "Credenciales incorrectas");
			}
		} catch (err) {
			setError("Error de conexión");
		}
	};

	return (
		<div className="flex flex-col items-center justify-center bg-gradient-to-br from-[#f6f3ff] to-[#e9e4fa] w-full min-h-[calc(100vh-64px)]">
			<div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col items-center gap-6 border-t-4 border-[#5e17eb]">
				<h2 className="text-3xl font-extrabold text-[#5e17eb] mb-2 flex items-center gap-2">
					<span className="text-4xl">🔑</span> Iniciar sesión
				</h2>
				<form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
					<div>
						<label htmlFor="user_nombre" className="block text-sm font-semibold text-gray-700 mb-1">Nombre de usuario</label>
						<input
							type="text"
							id="user_nombre"
							className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5e17eb]"
							placeholder="Tu nombre de usuario"
							autoComplete="username"
							value={userNombre}
							onChange={e => setUserNombre(e.target.value)}
							required
						/>
					</div>
					<div className="relative">
						<label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">Contraseña</label>
						<input
							type={showPassword ? "text" : "password"}
							id="password"
							className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5e17eb]"
							placeholder="••••••••"
							autoComplete="current-password"
							value={password}
							onChange={e => setPassword(e.target.value)}
							required
						/>
						<button
							type="button"
							onClick={() => setShowPassword((v) => !v)}
							className="absolute right-3 top-8 text-[#5e17eb] text-sm focus:outline-none"
							tabIndex={-1}
						>
							{showPassword ? "Ocultar" : "Mostrar"}
						</button>
					</div>
					{error && <div className="text-red-500 text-sm mb-2">{error}</div>}
					<button
						type="submit"
						className="w-full bg-[#5e17eb] text-white font-bold py-3 rounded-lg shadow hover:bg-[#A67AFF] transition text-lg mt-2"
					>
						Ingresar
					</button>
				</form>
				<div className="w-full flex flex-col md:flex-row justify-between items-center gap-2 text-sm mt-2">
									<a href="/recuperar-password" className="text-[#5e17eb] hover:underline">¿Olvidaste tu contraseña?</a>
					<a href="/register" className="text-[#5e17eb] hover:underline">¿No tienes cuenta? Regístrate</a>
				</div>
			</div>
		</div>
	);
}

export default Login;
