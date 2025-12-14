import React, { useState, useEffect } from 'react';
import { 
  FaDownload, FaCalendarAlt, FaFilter, FaUsers, 
  FaBriefcase, FaPaperPlane, FaChartBar, FaFileExport,
  FaSpinner, FaEye, FaSearch, FaFileExcel, FaFilePdf
} from 'react-icons/fa';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';

function Reportes() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Estados para filtros
  const [filtros, setFiltros] = useState({
    fecha_inicio: '',
    fecha_fin: '',
    estado: '',
    empresa_id: '',
    aspirante_id: '',
    tipo_usuario: ''
  });

  const token = localStorage.getItem("token");

  // Cargar estadísticas del dashboard
  const cargarDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://127.0.0.1:8000/api/reportes/dashboard_stats/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setDashboardStats(data);
      } else {
        setError('Error al cargar estadísticas');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  // Generar reporte
  const generarReporte = async (tipoReporte, formato = 'json') => {
    try {
      setLoading(true);
      setError('');
      
      // Construir parámetros de consulta
      const params = new URLSearchParams();
      Object.keys(filtros).forEach(key => {
        if (filtros[key]) {
          params.append(key, filtros[key]);
        }
      });
      if (formato !== 'json') {
        params.append('formato', formato);
      }

      const response = await fetch(
        `http://127.0.0.1:8000/api/reportes/${tipoReporte}/?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.ok) {
        if (formato === 'csv' || formato === 'excel' || formato === 'pdf') {
          // Descargar archivo
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          
          const extensiones = {
            'csv': 'csv',
            'excel': 'xlsx',
            'pdf': 'pdf'
          };
          
          link.download = `reporte_${tipoReporte}_${new Date().toISOString().split('T')[0]}.${extensiones[formato]}`;
          link.click();
          setSuccess('Reporte descargado exitosamente');
        } else {
          const data = await response.json();
          setReportData(data);
          setSuccess('Reporte generado exitosamente');
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error al generar reporte');
      }
    } catch (err) {
      setError('Error de conexión al generar reporte');
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambio de filtros
  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  // Limpiar filtros
  const limpiarFiltros = () => {
    setFiltros({
      fecha_inicio: '',
      fecha_fin: '',
      estado: '',
      empresa_id: '',
      aspirante_id: '',
      tipo_usuario: ''
    });
  };

  useEffect(() => {
    if (activeTab === 'dashboard') {
      cargarDashboardStats();
    }
  }, [activeTab]);

  // Componente de estadísticas del dashboard
  const DashboardStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm">Total Postulaciones</p>
            <p className="text-3xl font-bold">{dashboardStats?.postulaciones?.total || 0}</p>
            <p className="text-blue-200 text-xs">
              Turbo: {dashboardStats?.postulaciones?.turbo || 0}
            </p>
          </div>
          <FaPaperPlane className="text-3xl text-blue-200" />
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm">Vacantes Activas</p>
            <p className="text-3xl font-bold">{dashboardStats?.vacantes?.activas || 0}</p>
            <p className="text-green-200 text-xs">
              Total: {dashboardStats?.vacantes?.total || 0}
            </p>
          </div>
          <FaBriefcase className="text-3xl text-green-200" />
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100 text-sm">Nuevos Aspirantes</p>
            <p className="text-3xl font-bold">{dashboardStats?.usuarios?.aspirantes_nuevos || 0}</p>
          </div>
          <FaUsers className="text-3xl text-purple-200" />
        </div>
      </div>

      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-100 text-sm">Nuevas Empresas</p>
            <p className="text-3xl font-bold">{dashboardStats?.usuarios?.empresas_nuevas || 0}</p>
          </div>
          <FaUsers className="text-3xl text-orange-200" />
        </div>
      </div>
    </div>
  );

  // Componente de filtros
  const FiltrosSection = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <FaFilter className="text-[#5e17eb]" />
        Filtros de Reporte
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha Inicio
          </label>
          <input
            type="date"
            value={filtros.fecha_inicio}
            onChange={(e) => handleFiltroChange('fecha_inicio', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5e17eb] focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha Fin
          </label>
          <input
            type="date"
            value={filtros.fecha_fin}
            onChange={(e) => handleFiltroChange('fecha_fin', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5e17eb] focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estado
          </label>
          <select
            value={filtros.estado}
            onChange={(e) => handleFiltroChange('estado', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5e17eb] focus:border-transparent"
          >
            <option value="">Todos los estados</option>
            <option value="Postulado">Postulado</option>
            <option value="En revisión">En revisión</option>
            <option value="Entrevista">Entrevista</option>
            <option value="Contratado">Contratado</option>
            <option value="Rechazado">Rechazado</option>
            <option value="Activa">Activa</option>
            <option value="Inactiva">Inactiva</option>
          </select>
        </div>
      </div>
      
      <div className="mt-4 flex gap-3">
        <button
          onClick={limpiarFiltros}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Limpiar Filtros
        </button>
      </div>
    </div>
  );

  // Componente de botones de generación de reportes
  const ReportButtons = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h4 className="text-lg font-bold mb-3 text-center">Reporte de Postulaciones</h4>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => generarReporte('postulaciones')}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? <FaSpinner className="animate-spin" /> : <FaEye />}
            Ver Reporte
          </button>
          <button
            onClick={() => generarReporte('postulaciones', 'csv')}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            <FaDownload />
            Descargar CSV
          </button>
          <button
            onClick={() => generarReporte('postulaciones', 'excel')}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
          >
            <FaFileExcel />
            Descargar Excel
          </button>
          <button
            onClick={() => generarReporte('postulaciones', 'pdf')}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            <FaFilePdf />
            Descargar PDF
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h4 className="text-lg font-bold mb-3 text-center">Reporte de Vacantes</h4>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => generarReporte('vacantes')}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? <FaSpinner className="animate-spin" /> : <FaEye />}
            Ver Reporte
          </button>
          <button
            onClick={() => generarReporte('vacantes', 'csv')}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            <FaDownload />
            Descargar CSV
          </button>
          <button
            onClick={() => generarReporte('vacantes', 'excel')}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
          >
            <FaFileExcel />
            Descargar Excel
          </button>
          <button
            onClick={() => generarReporte('vacantes', 'pdf')}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            <FaFilePdf />
            Descargar PDF
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h4 className="text-lg font-bold mb-3 text-center">Reporte de Usuarios</h4>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => generarReporte('usuarios')}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? <FaSpinner className="animate-spin" /> : <FaEye />}
            Ver Reporte
          </button>
          <button
            onClick={() => generarReporte('usuarios', 'csv')}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            <FaDownload />
            Descargar CSV
          </button>
          <button
            onClick={() => generarReporte('usuarios', 'excel')}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
          >
            <FaFileExcel />
            Descargar Excel
          </button>
          <button
            onClick={() => generarReporte('usuarios', 'pdf')}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            <FaFilePdf />
            Descargar PDF
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#5e17eb] to-[#7c3aed] rounded-2xl p-8 mb-8 text-white">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <FaChartBar className="text-4xl" />
            Centro de Reportes
          </h1>
          <p className="text-purple-100">
            Genera reportes parametrizados y consulta estadísticas detalladas del sistema
          </p>
        </div>

        {/* Mensajes */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
            {success}
          </div>
        )}

        {/* Pestañas */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-6 py-3 rounded-xl font-medium transition-colors ${
              activeTab === 'dashboard' 
                ? 'bg-[#5e17eb] text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FaChartBar className="inline mr-2" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('reportes')}
            className={`px-6 py-3 rounded-xl font-medium transition-colors ${
              activeTab === 'reportes' 
                ? 'bg-[#5e17eb] text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FaFileExport className="inline mr-2" />
            Generar Reportes
          </button>
        </div>

        {/* Contenido */}
        {activeTab === 'dashboard' && (
          <div>
            {loading ? (
              <div className="text-center py-8">
                <FaSpinner className="animate-spin text-3xl text-[#5e17eb] mx-auto mb-4" />
                <p>Cargando estadísticas...</p>
              </div>
            ) : dashboardStats ? (
              <>
                <DashboardStats />
                
                {/* Gráficos de estadísticas por estado */}
                {dashboardStats.postulaciones?.por_estado?.length > 0 && (
                  <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <h3 className="text-lg font-bold mb-4">Postulaciones por Estado</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {dashboardStats.postulaciones.por_estado.map((item, index) => (
                        <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                          <p className="text-2xl font-bold text-[#5e17eb]">{item.count}</p>
                          <p className="text-sm text-gray-600">{item.pos_estado}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : null}
          </div>
        )}

        {activeTab === 'reportes' && (
          <div>
            <FiltrosSection />
            <ReportButtons />
            
            {/* Mostrar datos del reporte */}
            {reportData && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold mb-4">Resultados del Reporte</h3>
                
                {/* Resumen */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-600">Total de Registros</p>
                    <p className="text-2xl font-bold text-blue-800">
                      {reportData.resumen?.total_postulaciones || 
                       reportData.resumen?.total_vacantes || 
                       (reportData.resumen?.total_aspirantes || 0) + (reportData.resumen?.total_empresas || 0)}
                    </p>
                  </div>
                </div>

                {/* Tabla de datos */}
                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto">
                    <thead className="bg-gray-50">
                      <tr>
                        {reportData.datos && reportData.datos.length > 0 && 
                          Object.keys(reportData.datos[0]).map((key, index) => (
                            <th key={index} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {key.replace('_', ' ')}
                            </th>
                          ))
                        }
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {reportData.datos?.slice(0, 10).map((row, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          {Object.values(row).map((value, cellIndex) => (
                            <td key={cellIndex} className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                              {value?.toString() || '-'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {reportData.datos && reportData.datos.length > 10 && (
                    <p className="text-center text-gray-500 mt-4">
                      Mostrando 10 de {reportData.datos.length} registros. 
                      Descarga el CSV para ver todos los datos.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}

export default Reportes;