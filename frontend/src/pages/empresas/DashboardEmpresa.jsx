import React from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";


const DashboardEmpresa = () => {
    // Obtener datos de la empresa desde localStorage
    let nombre = "Empresa";
    try {
        const userData = JSON.parse(localStorage.getItem("user_data"));
        if (userData && (userData.em_nombre || userData.nombreEmpresa)) {
            nombre = userData.em_nombre || userData.nombreEmpresa;
        }
    } catch (e) {}

    return (
    <div className="min-h-screen flex flex-col bg-[#f6f4fa]">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-start py-10 px-4">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8 border-t-4 border-[#A67AFF]">
            <h1 className="text-3xl md:text-4xl font-bold text-[#A67AFF] mb-2 text-center">
            ¡Bienvenido, {nombre}!
            </h1>
            <p className="text-gray-600 text-center mb-8">Este es tu panel de control como empresa. Aquí podrás gestionar tu perfil, vacantes y revisar postulaciones de aspirantes.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {/* Widget: Perfil Empresa */}
            <div className="bg-[#f3e8ff] rounded-xl p-6 flex flex-col items-center shadow hover:shadow-lg transition">
                <span className="text-[#A67AFF] text-4xl mb-2">🏢</span>
                <h2 className="font-semibold text-lg mb-1">Mi Perfil</h2>
                <p className="text-gray-500 text-sm text-center mb-2">Consulta y edita la información de tu empresa.</p>
                <a href="/empresas/perfil" className="mt-2 px-4 py-2 bg-[#A67AFF] text-white rounded-lg font-semibold hover:bg-[#5e17eb] transition">Ver perfil</a>
            </div>
            {/* Widget: Vacantes */}
            <div className="bg-[#e0e7ff] rounded-xl p-6 flex flex-col items-center shadow hover:shadow-lg transition">
                <span className="text-[#A67AFF] text-4xl mb-2">💼</span>
                <h2 className="font-semibold text-lg mb-1">Vacantes</h2>
                <p className="text-gray-500 text-sm text-center mb-2">Crea, edita y elimina vacantes publicadas por tu empresa.</p>
                <a href="/empresas/vacantes" className="mt-2 px-4 py-2 bg-[#A67AFF] text-white rounded-lg font-semibold hover:bg-[#5e17eb] transition">Gestionar vacantes</a>
            </div>
            {/* Widget: Postulaciones */}
            <div className="bg-[#ede9fe] rounded-xl p-6 flex flex-col items-center shadow hover:shadow-lg transition">
                <span className="text-[#A67AFF] text-4xl mb-2">📄</span>
                <h2 className="font-semibold text-lg mb-1">Postulaciones recibidas</h2>
                <p className="text-gray-500 text-sm text-center mb-2">Revisa los aspirantes que han aplicado a tus vacantes.</p>
                <a href="/empresas/postulaciones" className="mt-2 px-4 py-2 bg-[#A67AFF] text-white rounded-lg font-semibold hover:bg-[#5e17eb] transition">Ver postulaciones</a>
            </div>
            </div>
        </div>
        </main>
        <Footer />
    </div>
    );
};

export default DashboardEmpresa;
