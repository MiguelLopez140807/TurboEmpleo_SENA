

import { useState } from "react";
import RegisterAspirante from "./RegisterAspirante";
import RegisterEmpresa from "./RegisterEmpresa";

function Register() {
	const [tipo, setTipo] = useState("aspirante");
	return (
		<div className="flex flex-col items-center justify-center min-h-[60vh] pt-24">
			<h2 className="text-2xl font-bold text-[#A67AFF] mb-4">Registro</h2>
			<div className="flex gap-4 mb-6">
				<button
					className={`px-6 py-2 rounded-lg font-semibold border-2 transition focus:outline-none ${tipo === "aspirante" ? "bg-[#5e17eb] text-white border-[#5e17eb]" : "bg-white text-[#5e17eb] border-[#5e17eb] hover:bg-[#f6f3ff]"}`}
					onClick={() => setTipo("aspirante")}
				>
					Soy Aspirante
				</button>
				<button
					className={`px-6 py-2 rounded-lg font-semibold border-2 transition focus:outline-none ${tipo === "empresa" ? "bg-[#A67AFF] text-white border-[#A67AFF]" : "bg-white text-[#A67AFF] border-[#A67AFF] hover:bg-[#f6f3ff]"}`}
					onClick={() => setTipo("empresa")}
				>
					Soy Empresa
				</button>
			</div>
			{tipo === "aspirante" ? <RegisterAspirante /> : <RegisterEmpresa />}
		</div>
	);
}

export default Register;
