import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function ActivarCuenta() {
    const { uidb64, token } = useParams();
        const [status, setStatus] = useState("pending");
    const [message, setMessage] = useState("");

    useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/usuarios/activar-cuenta/${uidb64}/${token}/`)
        .then((res) => res.json().then((data) => ({ ok: res.ok, ...data })))
        .then((data) => {
        if (data.ok) {
            setStatus("success");
            setMessage("¡Cuenta activada correctamente! Ya puedes iniciar sesión.");
        } else {
            setStatus("error");
            setMessage(data.detail || "El enlace no es válido o ha expirado.");
        }
        })
        .catch(() => {
        setStatus("error");
        setMessage("Error de conexión con el servidor.");
        });
    }, [uidb64, token]);

    return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f6f4fa] px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border-t-4 border-[#5e17eb]">
        <h2 className="text-2xl font-bold mb-4 text-[#5e17eb]">Activación de cuenta</h2>
        {status === "pending" && <p>Procesando activación...</p>}
        {status !== "pending" && <p className={status === "success" ? "text-green-600" : "text-red-600"}>{message}</p>}
        {status === "success" && (
            <Link to="/login" className="mt-6 inline-block bg-[#5e17eb] text-white font-bold py-2 px-6 rounded-lg shadow hover:bg-[#A67AFF] transition">Iniciar sesión</Link>
        )}
        </div>
    </div>
        );
}

export default ActivarCuenta;
