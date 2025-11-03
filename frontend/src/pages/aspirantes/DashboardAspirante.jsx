
import React from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import { FaUser, FaBriefcase, FaFileAlt } from 'react-icons/fa';

const DashboardAspirante = () => {
  // Intenta obtener los datos del usuario desde localStorage
  let nombre = "Aspirante";
  let apellido = "";
  try {
    const userData = JSON.parse(localStorage.getItem("user_data"));
    if (userData && userData.asp_nombre) {
      nombre = userData.asp_nombre;
      apellido = userData.asp_apellido || "";
    }
  } catch (e) {}

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f4fa]">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-start pt-24 pb-10 px-4">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8 border-t-4 border-[#5e17eb]">
          <h1 className="text-3xl md:text-4xl font-bold text-[#5e17eb] mb-2 text-center">
            ¡Bienvenido, {nombre} {apellido}!
          </h1>
          <p className="text-gray-600 text-center mb-8">Este es tu panel de control como aspirante. Aquí podrás ver tu información, postularte a vacantes y gestionar tu perfil.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {/* Widget: Perfil */}
            <div className="bg-[#f3e8ff] rounded-xl p-6 flex flex-col items-center shadow hover:shadow-lg transition">
              <span className="text-[#5e17eb] text-4xl mb-2"><FaUser /></span>
              <h2 className="font-semibold text-lg mb-1">Mi Perfil</h2>
              <p className="text-gray-500 text-sm text-center mb-2">Consulta y edita tu información personal.</p>
              <a href="/aspirantes/perfil" className="mt-2 px-4 py-2 bg-[#5e17eb] text-white rounded-lg font-semibold hover:bg-[#A67AFF] transition">Ver perfil</a>
            </div>
            {/* Widget: Vacantes */}
            <div className="bg-[#e0e7ff] rounded-xl p-6 flex flex-col items-center shadow hover:shadow-lg transition">
              <span className="text-[#5e17eb] text-4xl mb-2"><FaBriefcase /></span>
              <h2 className="font-semibold text-lg mb-1">Vacantes</h2>
              <p className="text-gray-500 text-sm text-center mb-2">Explora y postúlate a nuevas oportunidades laborales.</p>
              <a href="/aspirantes/vacantes" className="mt-2 px-4 py-2 bg-[#5e17eb] text-white rounded-lg font-semibold hover:bg-[#A67AFF] transition">Ver vacantes</a>
            </div>
            {/* Widget: Mis postulaciones */}
            <div className="bg-[#ede9fe] rounded-xl p-6 flex flex-col items-center shadow hover:shadow-lg transition">
              <span className="text-[#5e17eb] text-4xl mb-2"><FaFileAlt /></span>
              <h2 className="font-semibold text-lg mb-1">Mis Postulaciones</h2>
              <p className="text-gray-500 text-sm text-center mb-2">Revisa el estado de tus postulaciones.</p>
              <a href="/aspirantes/postulaciones" className="mt-2 px-4 py-2 bg-[#5e17eb] text-white rounded-lg font-semibold hover:bg-[#A67AFF] transition">Ver postulaciones</a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DashboardAspirante;
