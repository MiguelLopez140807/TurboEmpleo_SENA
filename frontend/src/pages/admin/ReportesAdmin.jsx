import React, { useState, useEffect } from 'react';
import { 
  FaDownload, FaCalendarAlt, FaFilter, FaUsers, 
  FaBriefcase, FaPaperPlane, FaChartBar, FaFileExport,
  FaSpinner, FaEye, FaSearch, FaFileExcel, FaFilePdf
} from 'react-icons/fa';

function ReportesAdmin() {
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
    setReportData(null);
    setError('');
    setSuccess('');
  };

  useEffect(() => {
    if (activeTab === 'dashboard') {
      cargarDashboardStats();
    }
  }, [activeTab]);

  // Componente de alertas
  const AlertMessage = ({ message, type = 'info' }) => {
    if (!message) return null;
    
    const colors = {
      success: 'bg-green-100 border-green-400 text-green-700',
      error: 'bg-red-100 border-red-400 text-red-700',
      info: 'bg-blue-100 border-blue-400 text-blue-700'
    };
    
    return (
      <div className={`border px-4 py-3 rounded mb-4 ${colors[type]}`}>
        {message}
      </div>
    );
  };

  // Componente de estadísticas del dashboard
  const DashboardStats = () => {
    if (!dashboardStats) return <div>Cargando estadísticas...</div>;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Postulaciones</p>
              <p className="text-3xl font-bold">{dashboardStats.postulaciones?.total || 0}</p>
              <p className="text-sm text-blue-100">Turbo: {dashboardStats.postulaciones?.turbo || 0}</p>
            </div>
            <FaPaperPlane className="text-4xl text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Vacantes</p>
              <p className="text-3xl font-bold">{dashboardStats.vacantes?.total || 0}</p>
              <p className="text-sm text-green-100">Activas: {dashboardStats.vacantes?.activas || 0}</p>
            </div>
            <FaBriefcase className="text-4xl text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Nuevos Aspirantes</p>
              <p className="text-3xl font-bold">{dashboardStats.usuarios?.aspirantes_nuevos || 0}</p>
            </div>
            <FaUsers className="text-4xl text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Nuevas Empresas</p>
              <p className="text-3xl font-bold">{dashboardStats.usuarios?.empresas_nuevas || 0}</p>
            </div>
            <FaBriefcase className="text-4xl text-orange-200" />
          </div>
        </div>
      </div>
    );
  };

  // Componente de filtros
  const FiltrosSection = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <FaFilter /> Filtros de Reporte
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
          <input
            type="date"
            value={filtros.fecha_inicio}
            onChange={(e) => handleFiltroChange('fecha_inicio', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
          <input
            type="date"
            value={filtros.fecha_fin}
            onChange={(e) => handleFiltroChange('fecha_fin', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <select
            value={filtros.estado}
            onChange={(e) => handleFiltroChange('estado', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos</option>
            <option value="Activa">Activa</option>
            <option value="Inactiva">Inactiva</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Rechazada">Rechazada</option>
            <option value="Aceptada">Aceptada</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Empresa ID</label>
          <input
            type="number"
            value={filtros.empresa_id}
            onChange={(e) => handleFiltroChange('empresa_id', e.target.value)}
            placeholder="ID de empresa"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo Usuario</label>
          <select
            value={filtros.tipo_usuario}
            onChange={(e) => handleFiltroChange('tipo_usuario', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos</option>
            <option value="aspirante">Aspirantes</option>
            <option value="empresa">Empresas</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={limpiarFiltros}
            className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Limpiar Filtros
          </button>
        </div>
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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
          <FaChartBar className="text-blue-600" />
          Sistema de Reportes
        </h2>
        
        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('reportes')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'reportes'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Generar Reportes
          </button>
        </div>
      </div>

      {/* Alertas */}
      <AlertMessage message={success} type="success" />
      <AlertMessage message={error} type="error" />

      {/* Contenido según tab activo */}
      {activeTab === 'dashboard' && (
        <div>
          <DashboardStats />
          {dashboardStats && dashboardStats.postulaciones && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4">Estadísticas por Estado</h3>
              <div className="space-y-2">
                {dashboardStats.postulaciones.por_estado?.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="capitalize">{item.pos_estado}</span>
                    <span className="font-semibold">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'reportes' && (
        <div>
          <FiltrosSection />
          <ReportButtons />
          
          {reportData && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4">Resultados del Reporte</h3>
              
              {/* Resumen */}
              {reportData.resumen && (
                <div className="mb-6 bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">📊 Resumen</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Total:</span>
                      <span className="font-semibold ml-2">
                        {reportData.resumen.total_postulaciones || 
                         reportData.resumen.total_vacantes || 
                         reportData.resumen.total_aspirantes || 
                         reportData.resumen.total_empresas || 0}
                      </span>
                    </div>
                    {reportData.resumen.filtros_aplicados && (
                      <>
                        {reportData.resumen.filtros_aplicados.fecha_inicio && (
                          <div>
                            <span className="text-gray-600">Desde:</span>
                            <span className="font-semibold ml-2">{reportData.resumen.filtros_aplicados.fecha_inicio}</span>
                          </div>
                        )}
                        {reportData.resumen.filtros_aplicados.fecha_fin && (
                          <div>
                            <span className="text-gray-600">Hasta:</span>
                            <span className="font-semibold ml-2">{reportData.resumen.filtros_aplicados.fecha_fin}</span>
                          </div>
                        )}
                        {reportData.resumen.filtros_aplicados.estado && (
                          <div>
                            <span className="text-gray-600">Estado:</span>
                            <span className="font-semibold ml-2">{reportData.resumen.filtros_aplicados.estado}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Estadísticas */}
              {reportData.estadisticas && (
                <div className="mb-6 bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">📈 Estadísticas</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {reportData.estadisticas.por_estado && (
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Por Estado:</h5>
                        <div className="space-y-1 text-sm">
                          {reportData.estadisticas.por_estado.map((item, index) => (
                            <div key={index} className="flex justify-between">
                              <span className="capitalize">{item.pos_estado || item.estado}</span>
                              <span className="font-semibold">{item.count}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {reportData.estadisticas.por_empresa && (
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Por Empresa:</h5>
                        <div className="space-y-1 text-sm">
                          {reportData.estadisticas.por_empresa.map((item, index) => (
                            <div key={index} className="flex justify-between">
                              <span>{item.pos_vacante_fk__va_idEmpresa_fk__em_nombre || item.empresa}</span>
                              <span className="font-semibold">{item.count}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Datos en tabla */}
              {reportData.datos && reportData.datos.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-4">📋 Datos Detallados</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full table-auto border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          {Object.keys(reportData.datos[0]).map((key) => (
                            <th key={key} className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-700 capitalize">
                              {key.replace(/_/g, ' ')}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.datos.slice(0, 100).map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            {Object.values(item).map((value, valueIndex) => (
                              <td key={valueIndex} className="border border-gray-300 px-4 py-2 text-sm">
                                {/* Formatear valores especiales */}
                                {typeof value === 'boolean' ? (
                                  value ? '✅ Sí' : '❌ No'
                                ) : typeof value === 'string' && value.includes('2025') ? (
                                  new Date(value).toLocaleString('es-ES', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })
                                ) : (
                                  String(value || '-')
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {reportData.datos.length > 100 && (
                      <div className="mt-4 text-center text-gray-600 text-sm">
                        Mostrando los primeros 100 registros de {reportData.datos.length} total. 
                        Usa la exportación para ver todos los datos.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Datos de usuarios (estructura especial) */}
              {reportData.datos && reportData.datos.aspirantes && (
                <div className="space-y-6">
                  {reportData.datos.aspirantes.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-4">👤 Aspirantes ({reportData.datos.aspirantes.length})</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full table-auto border-collapse border border-gray-300">
                          <thead>
                            <tr className="bg-blue-100">
                              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Nombre</th>
                              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Email</th>
                              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Ciudad</th>
                              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Postulaciones</th>
                              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Créditos Turbo</th>
                              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Registro</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reportData.datos.aspirantes.slice(0, 50).map((aspirante, index) => (
                              <tr key={index} className="hover:bg-blue-50">
                                <td className="border border-gray-300 px-4 py-2">{aspirante.nombre || '-'}</td>
                                <td className="border border-gray-300 px-4 py-2">{aspirante.email || '-'}</td>
                                <td className="border border-gray-300 px-4 py-2">{aspirante.ciudad || '-'}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">{aspirante.postulaciones}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">{aspirante.creditos_turbo}</td>
                                <td className="border border-gray-300 px-4 py-2">{aspirante.fecha_registro || '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {reportData.datos.empresas.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-orange-800 mb-4">🏢 Empresas ({reportData.datos.empresas.length})</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full table-auto border-collapse border border-gray-300">
                          <thead>
                            <tr className="bg-orange-100">
                              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Nombre</th>
                              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Email</th>
                              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Ciudad</th>
                              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Sector</th>
                              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Vacantes</th>
                              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Score Turbo</th>
                              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Registro</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reportData.datos.empresas.slice(0, 50).map((empresa, index) => (
                              <tr key={index} className="hover:bg-orange-50">
                                <td className="border border-gray-300 px-4 py-2">{empresa.nombre || '-'}</td>
                                <td className="border border-gray-300 px-4 py-2">{empresa.email || '-'}</td>
                                <td className="border border-gray-300 px-4 py-2">{empresa.ciudad || '-'}</td>
                                <td className="border border-gray-300 px-4 py-2">{empresa.sector || '-'}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">{empresa.vacantes_publicadas}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">{empresa.score_turbo}</td>
                                <td className="border border-gray-300 px-4 py-2">{empresa.fecha_registro || '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center gap-4">
            <FaSpinner className="animate-spin text-2xl text-blue-600" />
            <span className="text-lg">Generando reporte...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportesAdmin;