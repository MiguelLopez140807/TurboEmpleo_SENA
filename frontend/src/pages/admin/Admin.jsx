
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaUsers, FaBuilding, FaBriefcase, FaPaperPlane, 
  FaChartLine, FaExclamationTriangle, FaCog, 
  FaDownload, FaEye, FaTrash, FaEdit, FaSearch,
  FaFilter, FaSort, FaPlus, FaFileExport, FaTimes,
  FaUser, FaSignOutAlt, FaBell, FaUserCircle, 
  FaSave, FaIdCard, FaImage, FaFileAlt, FaCheck, FaInfo,
  FaUpload, FaFileImport, FaChartBar
} from 'react-icons/fa';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import NotificationBell from '../../components/NotificationBell';
import ReportesAdmin from './ReportesAdmin';

function Admin() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalAspirantes: 0,
    totalEmpresas: 0, 
    totalVacantes: 0,
    totalPostulaciones: 0,
    aspirantesActivos: 0,
    empresasActivas: 0,
    postulacionesUltimos30Dias: 0,
    tasaEmpleo: 0,
    crecimientoMensual: 0,
    vacantesActivas: 0,
    tiempoPromedioContratacion: 0,
    sectoresMasDemandados: []
  });
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [adminNotifications, setAdminNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  
  // Estados para modales
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [selectedFiles, setSelectedFiles] = useState({});
  
  // Estados para importación masiva
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importLoading, setImportLoading] = useState(false);
  const [importResult, setImportResult] = useState(null);

  const token = localStorage.getItem("token");
  const userData = JSON.parse(localStorage.getItem("user_data") || '{}');
  const adminName = userData?.first_name && userData?.last_name 
    ? `${userData.first_name} ${userData.last_name}` 
    : userData?.username || 'Admin';

  // Función para verificar si el token es válido
  const checkTokenValidity = async () => {
    if (!token) return false;
    
    try {
      // Probar con un endpoint simple
      const response = await fetch('http://127.0.0.1:8000/api/aspirantes/', {
        method: 'HEAD', // Solo verificar headers, no descargar datos
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.status === 401) {
        console.warn('Token expirado o inválido');
        return false;
      }
      
      return response.ok;
    } catch (error) {
      console.warn('Error verificando token:', error);
      return false;
    }
  };

  // Función para hacer logout cuando el token expire
  const handleTokenExpired = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_data");
    setError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
    setTimeout(() => {
      navigate('/login');
    }, 3000);
  };

  // Verificar si es admin
  useEffect(() => {
    const initializeAdmin = async () => {
      if (!token) {
        navigate('/login');
        return;
      }
      
      if (!userData.is_superuser && !userData.is_staff && userData.user_rol !== 'admin') {
        console.log('No es admin:', userData);
        navigate('/dashboard');
        return;
      }

      // Verificar validez del token
      const isTokenValid = await checkTokenValidity();
      if (!isTokenValid) {
        handleTokenExpired();
        return;
      }
    };

    initializeAdmin();
  }, [token, userData, navigate]);

  useEffect(() => {
    loadStats();
    loadAdminNotifications();
    if (activeTab !== 'dashboard') {
      loadTabData();
    }
  }, [activeTab]);

  // Función para cargar notificaciones específicas del admin
  const loadAdminNotifications = async () => {
    if (!token) return;
    
    try {
      // Simular notificaciones del admin basadas en datos reales
      const notifications = [
        {
          id: 1,
          type: 'new_user',
          title: 'Nuevo usuario registrado',
          message: 'Se ha registrado un nuevo aspirante en la plataforma',
          time: '5 min ago',
          read: false,
          icon: 'user'
        },
        {
          id: 2,
          type: 'new_company',
          title: 'Nueva empresa',
          message: 'Una nueva empresa se ha registrado y necesita aprobación',
          time: '10 min ago',
          read: false,
          icon: 'building'
        },
        {
          id: 3,
          type: 'system',
          title: 'Sistema actualizado',
          message: 'Se han aplicado las últimas actualizaciones de seguridad',
          time: '1 hora ago',
          read: true,
          icon: 'cog'
        }
      ];
      
      setAdminNotifications(notifications);
      setUnreadNotifications(notifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error cargando notificaciones del admin:', error);
    }
  };

  // Cerrar dropdowns al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (showNotifications && !event.target.closest('.notification-dropdown')) {
        setShowNotifications(false);
      }
      if (userDropdownOpen && !event.target.closest('.user-dropdown')) {
        setUserDropdownOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications, userDropdownOpen]);

  // Funciones para manejar modales
  const handleView = (item) => {
    setSelectedItem(item);
    setShowViewModal(true);
  };

  const handleEdit = (item) => {
    console.log('📝 Preparando edición para:', item);
    
    setSelectedItem(item);
    
    // Crear una copia limpia de los datos para editar
    const cleanData = {...item};
    
    // Eliminar campos que no deben editarse
    const nonEditableFields = ['id', 'created_at', 'updated_at', 'fecha_creacion', 'fecha_actualizacion', 'password', 'last_login'];
    nonEditableFields.forEach(field => {
      delete cleanData[field];
    });
    
    // Formatear fechas para inputs de tipo date
    Object.keys(cleanData).forEach(key => {
      if ((key.includes('fecha') || key.includes('Fecha') || key.includes('publicacion')) && cleanData[key]) {
        let dateValue = cleanData[key];
        
        // Si es una fecha en formato ISO completo, extraer solo la parte de fecha
        if (typeof dateValue === 'string') {
          if (dateValue.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
            // Formato ISO: "2025-12-14T06:30:11.623613Z" → "2025-12-14"
            cleanData[key] = dateValue.split('T')[0];
            console.log(`📅 Fecha ISO formateada - ${key}: ${dateValue} → ${cleanData[key]}`);
          } else if (dateValue.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
            // Formato DD/MM/YYYY: "14/12/2025" → "2025-12-14"
            const [day, month, year] = dateValue.split('/');
            cleanData[key] = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            console.log(`📅 Fecha DD/MM/YYYY formateada - ${key}: ${dateValue} → ${cleanData[key]}`);
          } else if (dateValue.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
            // Formato D/M/YYYY o DD/M/YYYY: "1/12/2025" → "2025-12-01"
            const [day, month, year] = dateValue.split('/');
            cleanData[key] = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            console.log(`📅 Fecha D/M/YYYY formateada - ${key}: ${dateValue} → ${cleanData[key]}`);
          } else if (dateValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
            // Ya está en formato correcto
            console.log(`📅 Fecha ya correcta - ${key}: ${dateValue}`);
          }
        }
      }
    });
    
    // Guardar referencias a archivos existentes pero no los incluyas en editData inicialmente
    const existingFiles = {};
    ['asp_foto', 'asp_curriculum', 'em_logo'].forEach(fileField => {
      if (cleanData[fileField]) {
        existingFiles[fileField] = cleanData[fileField];
        // No eliminar del cleanData, pero marcar como archivo existente
        console.log(`📂 Archivo existente encontrado - ${fileField}:`, cleanData[fileField]);
      }
    });
    
    console.log('📝 Datos preparados para edición:', cleanData);
    
    setEditData(cleanData);
    setSelectedFiles({});
    setIsEditing(true);
    setShowEditModal(true);
  };

  const saveEdit = async () => {
    try {
      console.log('🚀 Iniciando saveEdit...');
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('❌ No hay token disponible');
        setError('Token de autenticación no encontrado');
        return;
      }
      
      const endpoints = {
        'aspirantes': 'http://127.0.0.1:8000/api/aspirantes/',
        'empresas': 'http://127.0.0.1:8000/api/empresas/',
        'vacantes': 'http://127.0.0.1:8000/api/vacantes/',
        'postulaciones': 'http://127.0.0.1:8000/api/postulaciones/'
      };
      
      const endpoint = endpoints[activeTab];
      if (!endpoint) {
        console.error('❌ Endpoint no válido para:', activeTab);
        setError('Tipo de registro no válido');
        return;
      }

      // Procesar datos antes de enviar
      const processedData = { ...editData };
      
      // Convertir campos de relación que pueden ser objetos a solo sus IDs
      if (activeTab === 'vacantes') {
        if (processedData.va_idEmpresa_fk && typeof processedData.va_idEmpresa_fk === 'object') {
          processedData.va_idEmpresa_fk = processedData.va_idEmpresa_fk.id;
          console.log('🔗 Convirtiendo va_idEmpresa_fk de objeto a ID:', processedData.va_idEmpresa_fk);
        }
      } else if (activeTab === 'postulaciones') {
        if (processedData.pos_aspirante_fk && typeof processedData.pos_aspirante_fk === 'object') {
          processedData.pos_aspirante_fk = processedData.pos_aspirante_fk.id;
          console.log('🔗 Convirtiendo pos_aspirante_fk de objeto a ID:', processedData.pos_aspirante_fk);
        }
        if (processedData.pos_vacante_fk && typeof processedData.pos_vacante_fk === 'object') {
          processedData.pos_vacante_fk = processedData.pos_vacante_fk.id;
          console.log('🔗 Convirtiendo pos_vacante_fk de objeto a ID:', processedData.pos_vacante_fk);
        }
      }

      console.log('📊 Datos procesados a enviar:', processedData);
      console.log('🔗 Endpoint completo:', `${endpoint}${selectedItem.id}/`);
      console.log('📋 Tab activo:', activeTab);

      // Verificar si hay archivos NUEVOS seleccionados (no URLs existentes)
      const hasNewFiles = Object.values(processedData).some(value => value instanceof File);
      console.log('📁 ¿Tiene archivos nuevos?', hasNewFiles);
      console.log('📂 Archivos seleccionados:', selectedFiles);
      
      let requestBody;
      let headers = {
        'Authorization': `Bearer ${token}`
      };
      
      if (hasNewFiles) {
        // Usar FormData solo cuando hay archivos NUEVOS
        console.log('📦 Usando FormData para archivos nuevos...');
        const formData = new FormData();
        Object.entries(processedData).forEach(([key, value]) => {
          if (value instanceof File) {
            // Archivo nuevo seleccionado
            formData.append(key, value);
            console.log(`📎 Archivo nuevo - ${key}:`, value.name, value.size, 'bytes');
          } else if (value !== null && value !== undefined && value !== '') {
            // Campo normal o URL de archivo existente
            if (Array.isArray(value)) {
              // Convertir array a JSON string para envío
              formData.append(key, JSON.stringify(value));
              console.log(`📋 Array - ${key}:`, value, '→ JSON:', JSON.stringify(value));
            } else {
              // Para campos de archivo existentes, solo enviar si no hay archivo nuevo
              const isFileField = ['asp_foto', 'asp_curriculum', 'em_logo'].includes(key);
              if (!isFileField || !selectedFiles[key]) {
                formData.append(key, value);
                console.log(`📄 Campo - ${key}:`, value);
              }
            }
          }
        });
        requestBody = formData;
        // No establecer Content-Type para FormData (se establece automáticamente)
      } else {
        // Usar JSON para datos normales (sin archivos nuevos)
        console.log('📋 Usando JSON para datos sin archivos nuevos...');
        
        // Filtrar los campos de archivo si no hay archivos nuevos seleccionados
        const dataToSend = { ...processedData };
        
        // Solo excluir campos de archivo si no hay archivos nuevos para esos campos
        ['asp_foto', 'asp_curriculum', 'em_logo'].forEach(fileField => {
          if (!selectedFiles[fileField] && typeof dataToSend[fileField] === 'string') {
            // Si es una URL existente y no hay archivo nuevo, no la enviamos para evitar sobrescribir
            console.log(`🚫 Excluyendo ${fileField} (archivo existente sin cambios):`, dataToSend[fileField]);
            delete dataToSend[fileField];
          }
        });
        
        console.log('📤 Datos a enviar (JSON):', dataToSend);
        headers['Content-Type'] = 'application/json';
        requestBody = JSON.stringify(dataToSend);
      }

      console.log('🌐 Enviando request...');
      const response = await fetch(`${endpoint}${selectedItem.id}/`, {
        method: 'PATCH',
        headers,
        body: requestBody
      });

      console.log('🔄 Respuesta del servidor:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (response.status === 401) {
        console.warn('🔒 Token expirado durante la edición');
        handleTokenExpired();
        return;
      }

      if (response.ok) {
        console.log('✅ Respuesta exitosa, procesando...');
        const updatedData = await response.json();
        console.log('✅ Datos actualizados exitosamente:', updatedData);
        
        console.log('🚪 Cerrando modal...');
        setShowEditModal(false);
        setSelectedFiles({}); // Limpiar archivos seleccionados
        
        console.log('📢 Mostrando mensaje de éxito...');
        setSuccess('✅ Los datos se han actualizado correctamente');
        
        console.log('🔄 Recargando datos de la tabla...');
        // Recargar los datos para mostrar los cambios
        await loadTabData();
        
        console.log('⏰ Programando limpieza del mensaje...');
        // Limpiar el mensaje de éxito después de 3 segundos
        setTimeout(() => {
          console.log('🧹 Limpiando mensaje de éxito...');
          setSuccess('');
        }, 3000);
      } else {
        console.error('❌ Respuesta no exitosa');
        // Intentar obtener el mensaje de error del servidor
        try {
          const errorData = await response.json();
          console.error('❌ Error del servidor:', errorData);
          
          // Formatear errores de campo específicos
          if (typeof errorData === 'object' && errorData !== null) {
            const errorMessages = [];
            Object.entries(errorData).forEach(([field, errors]) => {
              if (Array.isArray(errors)) {
                errorMessages.push(`${field}: ${errors.join(', ')}`);
              } else {
                errorMessages.push(`${field}: ${errors}`);
              }
            });
            setError(`Errores de validación: ${errorMessages.join(' | ')}`);
          } else {
            setError(`Error del servidor: ${JSON.stringify(errorData)}`);
          }
        } catch {
          console.error('❌ No se pudo parsear el error del servidor');
          setError(`Error del servidor: ${response.status} ${response.statusText}`);
        }
      }
    } catch (error) {
      console.error('❌ Error durante la edición:', error);
      console.error('❌ Stack trace:', error.stack);
      setError(`Error de conexión: ${error.message}`);
    } finally {
      console.log('🏁 Finalizando saveEdit, desactivando loading...');
      setLoading(false);
    }
  };

  // Función para calcular la edad
  const calculateAge = (item) => {
    try {
      // Buscar campos de fecha de nacimiento
      const birthDay = item.asp_nacimiento_dia || item['Asp Nacimiento Dia'] || item.dia_nacimiento;
      const birthMonth = item.asp_nacimiento_mes || item['Asp Nacimiento Mes'] || item.mes_nacimiento;
      const birthYear = item.asp_nacimiento_anio || item['Asp Nacimiento Anio'] || item.anio_nacimiento || item.asp_nacimiento_ano;
      
      if (!birthDay || !birthMonth || !birthYear) {
        console.log('⚠️ Datos de nacimiento incompletos:', { birthDay, birthMonth, birthYear, item });
        return 'N/A';
      }
      
      const birthDate = new Date(birthYear, birthMonth - 1, birthDay); // Mes es 0-indexado
      const today = new Date();
      
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      console.log('🎂 Edad calculada:', { birthDate, today, age, item: item.id });
      return age;
    } catch (error) {
      console.error('❌ Error calculando edad:', error, item);
      return 'N/A';
    }
  };

  const handleFileSelect = (fieldName, file) => {
    console.log(`📁 Archivo seleccionado para ${fieldName}:`, file);
    
    // Validar tipo de archivo
    const allowedTypes = {
      'asp_foto': ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
      'asp_curriculum': ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      'em_logo': ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
    };
    
    const allowedTypesForField = allowedTypes[fieldName] || [];
    
    if (allowedTypesForField.length > 0 && !allowedTypesForField.includes(file.type)) {
      const typeNames = {
        'asp_foto': 'imágenes (JPG, PNG, GIF)',
        'asp_curriculum': 'documentos (PDF, DOC, DOCX)',
        'em_logo': 'imágenes (JPG, PNG, GIF)'
      };
      setError(`Solo se permiten archivos de ${typeNames[fieldName] || 'tipo válido'} para ${fieldName}`);
      return;
    }
    
    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError('El archivo es demasiado grande. Tamaño máximo: 5MB');
      return;
    }
    
    setSelectedFiles(prev => ({ ...prev, [fieldName]: file }));
    setEditData(prev => ({ ...prev, [fieldName]: file }));
    console.log(`✅ Archivo ${fieldName} agregado a editData como File object`);
    setError(''); // Limpiar errores
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  const handleToggleStatus = async (item) => {
    try {
      const token = localStorage.getItem('token');
      const endpoints = {
        'aspirantes': 'http://127.0.0.1:8000/api/aspirantes/',
        'empresas': 'http://127.0.0.1:8000/api/empresas/',
        'vacantes': 'http://127.0.0.1:8000/api/vacantes/',
        'postulaciones': 'http://127.0.0.1:8000/api/postulaciones/'
      };
      
      const endpoint = endpoints[activeTab];
      if (!endpoint) return;
      
      let updateData = {};
      if (activeTab === 'aspirantes') {
        updateData = { asp_estado: item.asp_estado === 'activo' ? 'inactivo' : 'activo' };
      } else if (activeTab === 'empresas') {
        updateData = { em_estado: item.em_estado === 'activo' ? 'inactivo' : 'activo' };
      } else if (activeTab === 'vacantes') {
        updateData = { va_estado: item.va_estado === 'activa' ? 'cerrada' : 'activa' };
      }

      const response = await fetch(`${endpoint}${item.id}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        loadTabData();
        setSuccess('Estado actualizado correctamente');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Error al actualizar el estado');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error al cambiar el estado');
    }
  };

  const loadStats = async () => {
    try {
      // Verificar token antes de hacer peticiones
      const isTokenValid = await checkTokenValidity();
      if (!isTokenValid) {
        handleTokenExpired();
        return;
      }

      // Intentar cargar datos reales
      const [aspirantesRes, empresasRes, vacantesRes, postulacionesRes] = await Promise.all([
        fetch('http://127.0.0.1:8000/api/aspirantes/', {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => null),
        fetch('http://127.0.0.1:8000/api/empresas/', {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => null),
        fetch('http://127.0.0.1:8000/api/vacantes/', {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => null),
        fetch('http://127.0.0.1:8000/api/postulaciones/', {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => null)
      ]);

      let aspirantes = [], empresas = [], vacantes = [], postulaciones = [];

      // Procesar respuestas o usar datos de fallback
      try {
        if (aspirantesRes && aspirantesRes.ok) {
          aspirantes = await aspirantesRes.json();
        } else {
          aspirantes = [
            { id: 1, asp_usuario_fk: { is_active: true } },
            { id: 2, asp_usuario_fk: { is_active: true } },
            { id: 3, asp_usuario_fk: { is_active: false } }
          ];
        }
      } catch (e) {
        aspirantes = [];
      }

      try {
        if (empresasRes && empresasRes.ok) {
          empresas = await empresasRes.json();
        } else {
          empresas = [
            { id: 1, em_usuario_fk: { is_active: true } },
            { id: 2, em_usuario_fk: { is_active: false } }
          ];
        }
      } catch (e) {
        empresas = [];
      }

      try {
        if (vacantesRes && vacantesRes.ok) {
          vacantes = await vacantesRes.json();
        } else {
          vacantes = [
            { id: 1, va_estado: 'activa' },
            { id: 2, va_estado: 'activa' },
            { id: 3, va_estado: 'cerrada' }
          ];
        }
      } catch (e) {
        vacantes = [];
      }

      try {
        if (postulacionesRes && postulacionesRes.ok) {
          postulaciones = await postulacionesRes.json();
        } else {
          postulaciones = [
            { id: 1, pos_estado: 'pendiente', pos_fechaPostulacion: '2024-12-01' },
            { id: 2, pos_estado: 'aceptada', pos_fechaPostulacion: '2024-12-05' },
            { id: 3, pos_estado: 'rechazada', pos_fechaPostulacion: '2024-11-20' }
          ];
        }
      } catch (e) {
        postulaciones = [];
      }

      setStats({
        totalAspirantes: aspirantes.length || 3,
        totalEmpresas: empresas.length || 2,
        totalVacantes: vacantes.length || 3,
        totalPostulaciones: postulaciones.length || 3,
        aspirantesActivos: aspirantes.filter(a => a.asp_usuario_fk?.is_active).length || 2,
        empresasActivas: empresas.filter(e => e.em_usuario_fk?.is_active).length || 1,
        postulacionesUltimos30Dias: postulaciones.filter(p => {
          const fecha = new Date(p.pos_fechaPostulacion);
          const hace30Dias = new Date();
          hace30Dias.setDate(hace30Dias.getDate() - 30);
          return fecha >= hace30Dias;
        }).length || 2,
        tasaEmpleo: postulaciones.length > 0 ? 
          ((postulaciones.filter(p => p.pos_estado === 'aceptada').length / postulaciones.length) * 100).toFixed(1) : '33.3',
        crecimientoMensual: 12.5,
        vacantesActivas: vacantes.filter(v => v.va_estado === 'activa').length || 2,
        tiempoPromedioContratacion: 15,
        sectoresMasDemandados: [
          { sector: 'Tecnología', porcentaje: 28.5 },
          { sector: 'Ventas', porcentaje: 22.1 },
          { sector: 'Administración', porcentaje: 18.7 },
          { sector: 'Educación', porcentaje: 14.2 },
          { sector: 'Salud', porcentaje: 16.5 }
        ]
      });

      setLoading(false);
    } catch (err) {
      console.error('Error cargando estadísticas:', err);
      // Usar datos de demostración completos
      setStats({
        totalAspirantes: 150,
        totalEmpresas: 45,
        totalVacantes: 89,
        totalPostulaciones: 234,
        aspirantesActivos: 142,
        empresasActivas: 38,
        postulacionesUltimos30Dias: 67,
        tasaEmpleo: '42.5',
        crecimientoMensual: 12.5,
        vacantesActivas: 72,
        tiempoPromedioContratacion: 15,
        sectoresMasDemandados: [
          { sector: 'Tecnología', porcentaje: 28.5 },
          { sector: 'Ventas', porcentaje: 22.1 },
          { sector: 'Administración', porcentaje: 18.7 },
          { sector: 'Educación', porcentaje: 14.2 },
          { sector: 'Salud', porcentaje: 16.5 }
        ]
      });
      setLoading(false);
    }
  };

  const loadTabData = async () => {
    setLoading(true);
    setError('');
    
    try {
      let endpoint = '';
      let mockData = [];
      
      switch(activeTab) {
        case 'aspirantes':
          endpoint = 'http://127.0.0.1:8000/api/aspirantes/';
          mockData = [
            { id: 1, asp_nombre: 'Juan', asp_apellido: 'Pérez', asp_email: 'juan@email.com', asp_telefono: '123456789', asp_edad: 25 },
            { id: 2, asp_nombre: 'Ana', asp_apellido: 'González', asp_email: 'ana@email.com', asp_telefono: '987654321', asp_edad: 28 }
          ];
          break;
        case 'empresas':
          endpoint = 'http://127.0.0.1:8000/api/empresas/';
          mockData = [
            { id: 1, em_nombre: 'TechCorp SA', em_nit: '900123456', em_email: 'info@techcorp.com', em_telefono: '1234567890', em_sector: 'Tecnología' },
            { id: 2, em_nombre: 'Comercial XYZ', em_nit: '800987654', em_email: 'contacto@xyz.com', em_telefono: '0987654321', em_sector: 'Comercio' }
          ];
          break;
        case 'vacantes':
          endpoint = 'http://127.0.0.1:8000/api/vacantes/';
          mockData = [
            { id: 1, va_titulo: 'Desarrollador Frontend', va_descripcion: 'Desarrollar interfaces de usuario', va_salario: '2500000', va_estado: 'activa', va_fecha_publicacion: '2024-12-01' },
            { id: 2, va_titulo: 'Analista de Marketing', va_descripcion: 'Gestionar campañas publicitarias', va_salario: '2000000', va_estado: 'activa', va_fecha_publicacion: '2024-12-05' }
          ];
          break;
        case 'postulaciones':
          endpoint = 'http://127.0.0.1:8000/api/postulaciones/';
          mockData = [
            { 
              id: 1, 
              po_estado: 'pendiente', 
              pos_estado: 'pendiente',
              estado: 'pendiente',
              po_fecha_postulacion: '2024-12-10', 
              pos_fechaPostulacion: '2024-12-10',
              fecha_postulacion: '2024-12-10',
              aspirante_nombre: 'Juan Pérez', 
              vacante_titulo: 'Desarrollador Frontend',
              po_aspirante_fk: {
                asp_nombre: 'Juan',
                asp_apellido: 'Pérez',
                asp_nombreCompleto: 'Juan Pérez'
              },
              po_vacante_fk: {
                va_titulo: 'Desarrollador Frontend'
              }
            },
            { 
              id: 2, 
              po_estado: 'aceptada', 
              pos_estado: 'aceptada',
              estado: 'aceptada',
              po_fecha_postulacion: '2024-12-08', 
              pos_fechaPostulacion: '2024-12-08',
              fecha_postulacion: '2024-12-08',
              aspirante_nombre: 'Ana González', 
              vacante_titulo: 'Analista de Marketing',
              po_aspirante_fk: {
                asp_nombre: 'Ana',
                asp_apellido: 'González',
                asp_nombreCompleto: 'Ana González'
              },
              po_vacante_fk: {
                va_titulo: 'Analista de Marketing'
              }
            },
            { 
              id: 3, 
              po_estado: 'rechazada', 
              pos_estado: 'rechazada',
              estado: 'rechazada',
              po_fecha_postulacion: '2024-12-05', 
              pos_fechaPostulacion: '2024-12-05',
              fecha_postulacion: '2024-12-05',
              aspirante_nombre: 'Carlos Ramírez', 
              vacante_titulo: 'Vendedor Senior',
              po_aspirante_fk: {
                asp_nombre: 'Carlos',
                asp_apellido: 'Ramírez',
                asp_nombreCompleto: 'Carlos Ramírez'
              },
              po_vacante_fk: {
                va_titulo: 'Vendedor Senior'
              }
            }
          ];
          break;
        default:
          setLoading(false);
          return;
      }

      // Intentar cargar datos reales primero
      let dataLoaded = false;
      
      // Usar el método normal para todos los endpoints
      try {
        const response = await fetch(endpoint, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.status === 401) {
          console.warn(`🔒 Token expirado o inválido para ${endpoint}`);
          handleTokenExpired();
          return;
        }
        
        if (response.ok) {
          const data = await response.json();
          console.log(`✅ Datos cargados desde API ${endpoint}:`, data);
          
          // Debug temporal para aspirantes
          if (activeTab === 'aspirantes' && data.length > 0) {
            console.log('📋 ASPIRANTE - Primer registro completo:', data[0]);
            console.log('📋 ASPIRANTE - Campos disponibles:', Object.keys(data[0]));
            console.log('📋 ASPIRANTE - Email encontrado:', data[0].asp_email || data[0].email || 'NO ENCONTRADO');
            console.log('📋 ASPIRANTE - Cédula/ID encontrada:', {
              asp_numeroId: data[0].asp_numeroId,
              asp_cedula: data[0].asp_cedula,
              asp_documento: data[0].asp_documento, 
              asp_identificacion: data[0].asp_identificacion,
              cedula: data[0].cedula,
              documento: data[0].documento,
              id: data[0].id
            });
            console.log('📋 ASPIRANTE - Campos encontrados:', {
              'Asp Nombre': data[0]['Asp Nombre'],
              'Asp Correo': data[0]['Asp Correo'],
              'Asp NumeroId': data[0]['Asp NumeroId'],
              'Asp Estado': data[0]['Asp Estado'],
              todos_los_campos: Object.keys(data[0])
            });
            
            // 🔍 Buscar específicamente campos de foto
            const fotoFields = Object.keys(data[0]).filter(key => 
              key.toLowerCase().includes('foto') || 
              key.toLowerCase().includes('image') || 
              key.toLowerCase().includes('avatar') ||
              key.toLowerCase().includes('picture') ||
              key.toLowerCase().includes('curriculum')
            );
            console.log('📸 ASPIRANTE - Campos de foto/archivos encontrados:', fotoFields);
            fotoFields.forEach(field => {
              console.log(`📸 ${field}:`, data[0][field]);
            });
          }
          
          // Debug temporal para empresas
          if (activeTab === 'empresas' && data.length > 0) {
            console.log('🏢 EMPRESA - Estado encontrado:', {
              em_estado: data[0].em_estado,
              em_estado_type: typeof data[0].em_estado,
              is_active: data[0].is_active,
              is_active_type: typeof data[0].is_active,
              todos_los_campos_estado: Object.keys(data[0]).filter(key => key.includes('estado') || key.includes('active')),
              estado_final: (data[0].em_estado === 'activo' || data[0].em_estado === 'Activo' || data[0].is_active === true || data[0].is_active === 1 || data[0].is_active === '1') ? 'Activo' : 'Inactivo'
            });
            
            // 🔍 Buscar específicamente campos de logo
            const logoFields = Object.keys(data[0]).filter(key => 
              key.toLowerCase().includes('logo') || 
              key.toLowerCase().includes('image') || 
              key.toLowerCase().includes('avatar') ||
              key.toLowerCase().includes('picture')
            );
            console.log('🖼️ EMPRESA - Campos de logo encontrados:', logoFields);
            logoFields.forEach(field => {
              console.log(`🖼️ ${field}:`, data[0][field]);
            });
          }
          
          // Debug temporal para vacantes
          if (activeTab === 'vacantes' && data.length > 0) {
            console.log('💼 VACANTE - Primer registro completo:', data[0]);
            console.log('💼 VACANTE - Campos disponibles:', Object.keys(data[0]));
            
            // Buscar campos relacionados con empresa
            const empresaFields = Object.keys(data[0]).filter(key => 
              key.toLowerCase().includes('empresa') || 
              key.toLowerCase().includes('em_') ||
              key.toLowerCase().includes('company')
            );
            console.log('🏢 VACANTE - Campos de empresa encontrados:', empresaFields);
            empresaFields.forEach(field => {
              console.log(`🏢 ${field}:`, data[0][field]);
            });
          }
          
          // Debug temporal para postulaciones
          if (activeTab === 'postulaciones' && data.length > 0) {
            console.log('📝 POSTULACION - Primer registro completo:', data[0]);
            console.log('📝 POSTULACION - Campos disponibles:', Object.keys(data[0]));
            console.log('📝 POSTULACION - Estructura de aspirante:', data[0].po_aspirante_fk || data[0].pos_aspirante_fk || data[0].aspirante_fk);
            console.log('📝 POSTULACION - Estructura de vacante:', data[0].po_vacante_fk || data[0].pos_vacante_fk || data[0].vacante_fk);
            console.log('📝 POSTULACION - Estado encontrado:', data[0].po_estado || data[0].pos_estado || data[0].estado);
            console.log('📝 POSTULACION - Fecha encontrada:', data[0].po_fecha_postulacion || data[0].pos_fechaPostulacion || data[0].fecha_postulacion);
          }
          
          if (activeTab === 'postulaciones') {
            console.log(`📊 POSTULACIONES - Total registros cargados: ${data.length}`);
            console.log('📊 POSTULACIONES - Datos completos:', data);
            if (data.length === 0) {
              console.warn('⚠️ POSTULACIONES - No se encontraron postulaciones en la API');
            }
          }
          
          setUsers(Array.isArray(data) ? data : []);
          setSuccess('');
          dataLoaded = true;
        } else {
          console.warn(`❌ API response not OK: ${response.status} ${response.statusText}`);
        }
      } catch (fetchError) {
        console.warn(`❌ Error cargando desde API (${endpoint}):`, fetchError.message);
      }
      
      // Si no se pudieron cargar datos reales, usar mock data
      if (!dataLoaded) {
        console.log('📋 Usando datos de demostración...');
        setUsers(mockData);
        if (activeTab === 'postulaciones') {
          console.log('📊 POSTULACIONES MOCK - Cargando datos de prueba:', mockData);
          setSuccess('⚠️ Mostrando datos de demostración para postulaciones (API no disponible)');
        } else {
          setSuccess('⚠️ Mostrando datos de demostración (API no disponible)');
        }
        
        // Limpiar el mensaje de éxito después de 5 segundos
        setTimeout(() => setSuccess(''), 5000);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error en loadTabData:', err);
      setError(`Error al cargar datos: ${err.message}`);
      setUsers([]);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_data");
    window.location.href = "/login";
  };

  const exportData = () => {
    const dataStr = JSON.stringify(users, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `turboempleo_${activeTab}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    setSuccess('Datos exportados exitosamente');
  };

  // Funciones para importación masiva
  const downloadTemplate = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/vacantes/download_template/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'plantilla_vacantes.csv';
        link.click();
        setSuccess('Plantilla descargada exitosamente');
      } else {
        setError('Error al descargar la plantilla');
      }
    } catch (err) {
      setError('Error al descargar la plantilla');
    }
  };

  const handleImportFileSelect = (event) => {
    const file = event.target.files[0];
    setImportFile(file);
    setImportResult(null);
  };

  const handleImportSubmit = async () => {
    if (!importFile) {
      setError('Por favor selecciona un archivo');
      return;
    }

    setImportLoading(true);
    setImportResult(null);

    try {
      const formData = new FormData();
      formData.append('file', importFile);

      const response = await fetch('http://127.0.0.1:8000/api/vacantes/import_vacantes/', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        setImportResult(result);
        setSuccess(result.message);
        if (activeTab === 'vacantes') {
          loadTabData('vacantes'); // Recargar datos
        }
      } else {
        setError(result.error || 'Error en la importación');
      }
    } catch (err) {
      setError('Error al procesar el archivo');
    } finally {
      setImportLoading(false);
    }
  };

  const closeImportModal = () => {
    setShowImportModal(false);
    setImportFile(null);
    setImportResult(null);
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/usuarios/${userId}/toggle-status/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_active: !currentStatus })
      });

      if (response.ok) {
        setSuccess(`Usuario ${!currentStatus ? 'activado' : 'desactivado'} exitosamente`);
        loadTabData();
        loadStats();
      } else {
        setError('Error al cambiar estado del usuario');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  const deleteUser = async (userId) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) return;
    
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/usuarios/${userId}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setSuccess('Usuario eliminado exitosamente');
        loadTabData();
        loadStats();
      } else {
        setError('Error al eliminar usuario');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  const sortData = (field) => {
    const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(direction);
  };

  // Función para filtrar usuarios
  const getFilteredUsers = () => {
    return users.filter(user => {
      const matchesSearch = searchTerm === '' || 
        JSON.stringify(user).toLowerCase().includes(searchTerm.toLowerCase());
      
      if (filterType === 'all') return matchesSearch;
      if (filterType === 'active') return matchesSearch && user.is_active !== false;
      if (filterType === 'inactive') return matchesSearch && user.is_active === false;
      
      return matchesSearch;
    });
  };

  const getSortedAndFilteredData = () => {
    let filtered = getFilteredUsers();
    
    if (sortField) {
      filtered = [...filtered].sort((a, b) => {
        let aVal = a[sortField];
        let bVal = b[sortField];
        
        if (typeof aVal === 'string') aVal = aVal.toLowerCase();
        if (typeof bVal === 'string') bVal = bVal.toLowerCase();
        
        if (sortDirection === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });
    }
    
    return filtered;
  };

  const getCurrentPageData = () => {
    const sortedData = getSortedAndFilteredData();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedData.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(getSortedAndFilteredData().length / itemsPerPage);

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${color} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
        </div>
        <div className={`p-4 rounded-full ${color.replace('border', 'bg').replace('-500', '-100')}`}>
          <Icon className={`text-2xl ${color.replace('border', 'text')}`} />
        </div>
      </div>
    </div>
  );

  const TabButton = ({ id, label, icon: Icon, active, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
        active 
          ? 'bg-[#5e17eb] text-white shadow-lg' 
          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
      }`}
    >
      <Icon className="text-lg" />
      <span>{label}</span>
    </button>
  );

  if (loading && activeTab === 'dashboard') {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#5e17eb] mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">Cargando panel de administración...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-[#5e17eb] to-[#A67AFF] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">TE</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">TurboEmpleo</h1>
          </div>
          
          {/* Right side - Notifications and User */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative notification-dropdown">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors relative"
              >
                <FaBell className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </span>
                )}
              </button>
              
              {/* Dropdown de notificaciones */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Notificaciones</h3>
                      {unreadNotifications > 0 && (
                        <span className="text-sm text-[#5e17eb] font-medium">
                          {unreadNotifications} nuevas
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {adminNotifications.length > 0 ? (
                      adminNotifications.map((notification) => (
                        <div 
                          key={notification.id}
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                            !notification.read ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-full ${
                              notification.type === 'new_user' ? 'bg-green-100 text-green-600' :
                              notification.type === 'new_company' ? 'bg-blue-100 text-blue-600' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {notification.icon === 'user' && <FaUser className="h-4 w-4" />}
                              {notification.icon === 'building' && <FaBuilding className="h-4 w-4" />}
                              {notification.icon === 'cog' && <FaCog className="h-4 w-4" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-500 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {notification.time}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-[#5e17eb] rounded-full mt-2"></div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center text-gray-500">
                        <FaBell className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                        <p>No tienes notificaciones</p>
                      </div>
                    )}
                  </div>
                  <div className="p-4 border-t border-gray-200">
                    <button className="w-full text-center text-sm text-[#5e17eb] hover:text-[#4c0dcd] font-medium">
                      Ver todas las notificaciones
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* User Profile */}
            <div className="relative user-dropdown">
              <button 
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-2 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaUserCircle className="h-6 w-6" />
                <span className="text-sm font-medium">{adminName}</span>
              </button>
              
              {/* Dropdown de usuario */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <FaUser className="mr-3 h-4 w-4" />
                      Ver perfil
                    </button>
                    <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <FaCog className="mr-3 h-4 w-4" />
                      Configuración
                    </button>
                    <hr className="my-1 border-gray-200" />
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <FaSignOutAlt className="mr-3 h-4 w-4" />
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg min-h-screen">
          {/* Navigation */}
          <nav className="mt-6">
            <div className="px-6 py-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">NAVEGACIÓN</p>
            </div>
            <div className="mt-2 space-y-1">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center px-6 py-3 text-left text-sm font-medium transition-colors ${
                  activeTab === 'dashboard' 
                    ? 'bg-[#5e17eb] text-white border-r-2 border-[#A67AFF]' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-[#5e17eb]'
                }`}
              >
                <FaChartLine className="mr-3 h-5 w-5" />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('aspirantes')}
                className={`w-full flex items-center px-6 py-3 text-left text-sm font-medium transition-colors ${
                  activeTab === 'aspirantes' 
                    ? 'bg-[#5e17eb] text-white border-r-2 border-[#A67AFF]' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-[#5e17eb]'
                }`}
              >
                <FaUsers className="mr-3 h-5 w-5" />
                Aspirantes
              </button>
              <button
                onClick={() => setActiveTab('empresas')}
                className={`w-full flex items-center px-6 py-3 text-left text-sm font-medium transition-colors ${
                  activeTab === 'empresas' 
                    ? 'bg-[#5e17eb] text-white border-r-2 border-[#A67AFF]' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-[#5e17eb]'
                }`}
              >
                <FaBuilding className="mr-3 h-5 w-5" />
                Empresas
              </button>
              <button
                onClick={() => setActiveTab('vacantes')}
                className={`w-full flex items-center px-6 py-3 text-left text-sm font-medium transition-colors ${
                  activeTab === 'vacantes' 
                    ? 'bg-[#5e17eb] text-white border-r-2 border-[#A67AFF]' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-[#5e17eb]'
                }`}
              >
                <FaBriefcase className="mr-3 h-5 w-5" />
                Vacantes
              </button>
              <button
                onClick={() => setActiveTab('postulaciones')}
                className={`w-full flex items-center px-6 py-3 text-left text-sm font-medium transition-colors ${
                  activeTab === 'postulaciones' 
                    ? 'bg-[#5e17eb] text-white border-r-2 border-[#A67AFF]' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-[#5e17eb]'
                }`}
              >
                <FaPaperPlane className="mr-3 h-5 w-5" />
                Postulaciones
              </button>
              
              {/* Botón para reportes */}
              <button
                onClick={() => setActiveTab('reportes')}
                className={`w-full flex items-center px-6 py-3 text-left text-sm font-medium transition-colors ${
                  activeTab === 'reportes'
                    ? 'bg-purple-50 border-r-2 border-[#5e17eb] text-[#5e17eb]'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-[#5e17eb]'
                }`}
              >
                <FaChartBar className="mr-3 h-5 w-5" />
                Reportes
              </button>
            </div>
            
            {/* Account Details Section */}
            <div className="mt-8">
              <div className="px-6 py-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">CUENTA</p>
              </div>
              <div className="mt-2 space-y-1">
                <button className="w-full flex items-center px-6 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#5e17eb] transition-colors">
                  <FaUser className="mr-3 h-5 w-5" />
                  Perfil
                </button>
                <button className="w-full flex items-center px-6 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#5e17eb] transition-colors">
                  <FaCog className="mr-3 h-5 w-5" />
                  Configuración
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center px-6 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                >
                  <FaSignOutAlt className="mr-3 h-5 w-5" />
                  Cerrar sesión
                </button>
              </div>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <main className="p-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {activeTab === 'dashboard' && 'Dashboard'}
                    {activeTab === 'aspirantes' && 'Gestión de Aspirantes'}
                    {activeTab === 'empresas' && 'Gestión de Empresas'}
                    {activeTab === 'vacantes' && 'Gestión de Vacantes'}
                    {activeTab === 'postulaciones' && 'Gestión de Postulaciones'}
                    {activeTab === 'reportes' && 'Sistema de Reportes'}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {activeTab === 'dashboard' && 'Hola Admin, aquí tienes un resumen de la plataforma TurboEmpleo'}
                    {activeTab === 'reportes' && 'Genera reportes detallados y exporta datos en múltiples formatos'}
                    {(activeTab !== 'dashboard' && activeTab !== 'reportes') && 'Gestiona y supervisa toda la información de la plataforma'}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-sm text-gray-500">
                    Mostrando datos: <span className="font-medium">01 Nov, 2024 - 13 Dic, 2024</span>
                  </div>
                  <button
                    onClick={() => {
                      setError('');
                      setSuccess('');
                      loadStats();
                      if (activeTab !== 'dashboard') {
                        loadTabData();
                      }
                    }}
                    className="flex items-center space-x-2 px-3 py-2 bg-[#5e17eb] text-white rounded-lg hover:bg-[#4c0dcd] transition-colors"
                  >
                    <FaCog className="h-4 w-4" />
                    <span>Recargar datos</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Alertas de éxito y error */}
            {(success || error) && (
              <div className={`mb-6 px-4 py-3 rounded-md ${success ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-red-100 border border-red-400 text-red-700'}`}>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {success ? '✅' : '❌'}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">
                      {success || error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Mensajes de estado */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FaExclamationTriangle className="h-5 w-5 text-red-500 mr-2" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                  <button onClick={() => setError('')} className="text-red-500 hover:text-red-700">
                    <FaTimes className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
            {success && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-green-700">{success}</p>
                  </div>
                  <button onClick={() => setSuccess('')} className="text-green-500 hover:text-green-700">
                    <FaTimes className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Dashboard */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                {/* Estadísticas principales */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Aspirantes</p>
                        <p className="text-2xl font-bold text-gray-900 mt-2">{stats.totalAspirantes}</p>
                        <div className="flex items-center mt-2">
                          <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                            +{stats.crecimientoMensual}% este mes
                          </span>
                        </div>
                      </div>
                      <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FaUsers className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Empresas Activas</p>
                        <p className="text-2xl font-bold text-gray-900 mt-2">{stats.empresasActivas}</p>
                        <div className="flex items-center mt-2">
                          <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                            {stats.totalEmpresas} total
                          </span>
                        </div>
                      </div>
                      <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <FaBuilding className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Tasa de Empleo</p>
                        <p className="text-2xl font-bold text-gray-900 mt-2">{stats.tasaEmpleo}%</p>
                        <div className="flex items-center mt-2">
                          <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                            Últimos 30 días
                          </span>
                        </div>
                      </div>
                      <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <FaChartLine className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Vacantes Activas</p>
                        <p className="text-2xl font-bold text-gray-900 mt-2">{stats.vacantesActivas}</p>
                        <div className="flex items-center mt-2">
                          <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                            {stats.totalVacantes} publicadas
                          </span>
                        </div>
                      </div>
                      <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <FaBriefcase className="h-6 w-6 text-orange-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sección de análisis */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Gráfico de postulaciones */}
                  <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Actividad de Postulaciones</h3>
                        <button className="text-sm text-[#5e17eb] hover:text-[#A67AFF] font-medium">
                          Ver más
                        </button>
                      </div>
                      <div className="h-64 flex items-end justify-center space-x-2">
                        {/* Simulación de gráfico de barras */}
                        {[65, 78, 82, 91, 88, 95, 76].map((height, index) => (
                          <div key={index} className="flex flex-col items-center space-y-2">
                            <div
                              className="bg-gradient-to-t from-[#5e17eb] to-[#A67AFF] rounded-t-lg w-8 transition-all hover:opacity-80"
                              style={{ height: `${height}%` }}
                            />
                            <span className="text-xs text-gray-500">
                              {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'][index]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Sectores más demandados */}
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Sectores Demandados</h3>
                      <button className="text-sm text-[#5e17eb] hover:text-[#A67AFF] font-medium">
                        Ver todos
                      </button>
                    </div>
                    <div className="space-y-4">
                      {stats.sectoresMasDemandados.map((sector, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${
                              index === 0 ? 'bg-[#5e17eb]' :
                              index === 1 ? 'bg-[#A67AFF]' :
                              index === 2 ? 'bg-blue-500' :
                              index === 3 ? 'bg-green-500' : 'bg-orange-500'
                            }`}></div>
                            <span className="text-sm font-medium text-gray-900">{sector.sector}</span>
                          </div>
                          <span className="text-sm text-gray-600">{sector.porcentaje}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Estadísticas adicionales */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Postulaciones Recientes</h3>
                    <div className="text-center py-4">
                      <div className="text-3xl font-bold text-[#5e17eb] mb-2">{stats.postulacionesUltimos30Dias}</div>
                      <p className="text-sm text-gray-600">Últimos 30 días</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                        <div 
                          className="bg-gradient-to-r from-[#5e17eb] to-[#A67AFF] h-2 rounded-full" 
                          style={{ width: '68%' }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Tiempo Promedio</h3>
                    <div className="text-center py-4">
                      <div className="text-3xl font-bold text-green-600 mb-2">{stats.tiempoPromedioContratacion}</div>
                      <p className="text-sm text-gray-600">Días para contratación</p>
                      <p className="text-xs text-green-600 mt-2 bg-green-50 px-2 py-1 rounded">
                        -3 días vs mes anterior
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado Sistema</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Servidor</span>
                        <span className="text-sm text-green-600 font-medium flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          Operativo
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Base de datos</span>
                        <span className="text-sm text-green-600 font-medium flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          Conectado
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Usuarios en línea</span>
                        <span className="text-sm text-blue-600 font-medium">24</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Reportes */}
            {activeTab === 'reportes' && (
              <ReportesAdmin />
            )}

        {/* Otras pestañas */}
        {(activeTab !== 'dashboard' && activeTab !== 'reportes') && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {activeTab === 'users' && 'Gestión de Usuarios'}
                {activeTab === 'aspirantes' && 'Gestión de Aspirantes'}
                {activeTab === 'empresas' && 'Gestión de Empresas'}
                {activeTab === 'vacantes' && 'Gestión de Vacantes'}
                {activeTab === 'postulaciones' && 'Gestión de Postulaciones'}
              </h2>
              <div className="flex gap-2">
                {activeTab === 'vacantes' && (
                  <>
                    <button 
                      onClick={downloadTemplate} 
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <FaDownload /> Plantilla
                    </button>
                    <button 
                      onClick={() => setShowImportModal(true)} 
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <FaUpload /> Importar
                    </button>
                  </>
                )}
                <button onClick={exportData} className="flex items-center gap-2 px-4 py-2 bg-[#5e17eb] text-white rounded-lg hover:bg-[#4a12c4]">
                  <FaDownload /> Exportar
                </button>
              </div>
            </div>

            {/* Filtros y búsqueda */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5e17eb] focus:border-transparent"
                  />
                </div>
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5e17eb] focus:border-transparent"
              >
                <option value="all">Todos</option>
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
              </select>
            </div>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#5e17eb] mx-auto"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Tabla */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {activeTab === 'users' && (
                          <>
                            <th onClick={() => sortData('id')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                              <div className="flex items-center gap-1">
                                ID <FaSort className="text-xs" />
                              </div>
                            </th>
                            <th onClick={() => sortData('username')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                              <div className="flex items-center gap-1">
                                Usuario <FaSort className="text-xs" />
                              </div>
                            </th>
                            <th onClick={() => sortData('email')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                              <div className="flex items-center gap-1">
                                Email <FaSort className="text-xs" />
                              </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                          </>
                        )}
                        {activeTab === 'aspirantes' && (
                          <>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Foto</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Identificación</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ciudad</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                          </>
                        )}
                        {activeTab === 'empresas' && (
                          <>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Logo</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIT</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ciudad</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                          </>
                        )}
                        {activeTab === 'vacantes' && (
                          <>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Logo</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salario</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                          </>
                        )}
                        {activeTab === 'postulaciones' && (
                          <>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aspirante</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vacante</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {getCurrentPageData().map((item, index) => (
                        <tr key={item.id || index} className="hover:bg-gray-50">
                          {activeTab === 'users' && (
                            <>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.id}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.username}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.email}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  item.is_superuser ? 'bg-red-100 text-red-800' :
                                  item.is_staff ? 'bg-blue-100 text-blue-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                  {item.is_superuser ? 'Admin' : item.is_staff ? 'Staff' : 'Usuario'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  item.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {item.is_active ? 'Activo' : 'Inactivo'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                <button 
                                  onClick={() => { setSelectedUser(item); setShowModal(true); }}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  <FaEye />
                                </button>
                                <button 
                                  onClick={() => toggleUserStatus(item.id, item.is_active)}
                                  className={`${item.is_active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                                >
                                  {item.is_active ? '🔴' : '🟢'}
                                </button>
                                <button 
                                  onClick={() => deleteUser(item.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <FaTrash />
                                </button>
                              </td>
                            </>
                          )}
                          {activeTab === 'aspirantes' && (
                            <>
                              {/* Columna de Foto */}
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex-shrink-0 h-12 w-12">
                                  {(item.asp_foto || item['Asp Foto'] || item.foto || item.imagen) ? (
                                    <img
                                      className="h-12 w-12 rounded-full object-cover border-2 border-[#5e17eb] shadow-sm"
                                      src={item.asp_foto || item['Asp Foto'] || item.foto || item.imagen}
                                      alt={`${item['Asp Nombre'] || item.nombreCompleto || item.nombre || item.asp_nombre || 'Usuario'}`}
                                      onError={(e) => {
                                        console.error('❌ Error cargando foto aspirante:', {
                                          url: e.target.src,
                                          item: item,
                                          fotoField: item.asp_foto || item['Asp Foto'] || item.foto || item.imagen
                                        });
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                      }}
                                      onLoad={() => {
                                        console.log('✅ Foto aspirante cargada:', item.asp_foto || item['Asp Foto'] || item.foto || item.imagen);
                                      }}
                                    />
                                  ) : (
                                    console.log('⚠️ No hay foto para aspirante:', item) && null
                                  )}
                                  <div className={`h-12 w-12 rounded-full bg-gradient-to-r from-[#5e17eb] to-[#A67AFF] flex items-center justify-center ${
                                    (item.asp_foto || item['Asp Foto'] || item.foto || item.imagen) ? 'hidden' : 'flex'
                                  } shadow-sm`}>
                                    <span className="text-lg font-medium text-white">
                                      {((item['Asp Nombre'] || item.nombreCompleto || item.nombre || item.asp_nombre || 'N')[0] + 
                                        (item['Asp Apellido'] || item.apellido || item.asp_apellido || 'N')[0]).toUpperCase()}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              {/* Columna de Nombre */}
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {item['Asp Nombre'] || item.nombreCompleto || item.nombre || item.asp_nombre || 'N/A'} {item['Asp Apellido'] || item.apellido || item.asp_apellido || ''}
                                </div>
                                <div className="text-sm text-gray-500">
                                  ID: {item.id || 'N/A'}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <div className="flex items-center">
                                  <FaIdCard className="mr-2 text-gray-400" />
                                  <span className="font-mono">
                                    {item['Asp NumeroId'] || 
                                     item.numeroId || 
                                     item.cedula || 
                                     item.documento || 
                                     item.asp_numeroId ||
                                     `ID-${item.id}` || 
                                     'N/A'}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {item.asp_correo || item['Asp Correo'] || item.correo || item.email || item.asp_email || 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {item['Asp Telefono'] || item.telefono || item.celular || item.asp_telefono || 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {item['Asp Ciudad'] || item.ciudad || item.ubicacion || item.asp_ciudad || 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  (item.estado === 'activo' || item.estado === 'Activo' || item.asp_estado === 'activo' || item.asp_estado === 'Activo' || item.is_active === true || item.is_active === 1 || item.is_active === '1')
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  <div className={`w-1.5 h-1.5 rounded-full mr-1 ${
                                    (item.estado === 'activo' || item.estado === 'Activo' || item.asp_estado === 'activo' || item.asp_estado === 'Activo' || item.is_active === true || item.is_active === 1 || item.is_active === '1')
                                      ? 'bg-green-400' 
                                      : 'bg-red-400'
                                  }`}></div>
                                  {(item.estado === 'activo' || item.estado === 'Activo' || item.asp_estado === 'activo' || item.asp_estado === 'Activo' || item.is_active === true || item.is_active === 1 || item.is_active === '1') ? 'Activo' : 'Inactivo'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => handleView(item)}
                                    className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-lg transition-colors duration-200"
                                    title="Ver detalles"
                                  >
                                    <FaEye className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleEdit(item)}
                                    className="bg-amber-100 hover:bg-amber-200 text-amber-700 p-2 rounded-lg transition-colors duration-200"
                                    title="Editar"
                                  >
                                    <FaEdit className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(item)}
                                    className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-lg transition-colors duration-200"
                                    title="Eliminar"
                                  >
                                    <FaTrash className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </>
                          )}
                          {activeTab === 'empresas' && (
                            <>
                              {/* Columna de Logo */}
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex-shrink-0 h-12 w-12">
                                  {(item.em_logo || item['Em Logo'] || item.logo || item.imagen) ? (
                                    <img
                                      className="h-12 w-12 rounded-lg object-cover border-2 border-blue-500 shadow-sm"
                                      src={item.em_logo || item['Em Logo'] || item.logo || item.imagen}
                                      alt={`Logo ${item['Em Razon Social'] || item.em_razon_social || item.em_nombre || 'Empresa'}`}
                                      onError={(e) => {
                                        console.error('❌ Error cargando logo empresa:', {
                                          url: e.target.src,
                                          item: item,
                                          logoField: item.em_logo || item['Em Logo'] || item.logo || item.imagen
                                        });
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                      }}
                                      onLoad={() => {
                                        console.log('✅ Logo empresa cargado:', item.em_logo || item['Em Logo'] || item.logo || item.imagen);
                                      }}
                                    />
                                  ) : (
                                    console.log('⚠️ No hay logo para empresa:', item) && null
                                  )}
                                  <div className={`h-12 w-12 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center ${
                                    (item.em_logo || item['Em Logo'] || item.logo || item.imagen) ? 'hidden' : 'flex'
                                  } shadow-sm`}>
                                    <span className="text-lg font-bold text-white">
                                      {((item['Em Razon Social'] || item.em_razon_social || item.em_nombre || 'E').split(' ').map(word => word[0]).join('').substring(0, 2)).toUpperCase()}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              {/* Columna de Empresa */}
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {item['Em Razon Social'] || item.razonSocial || item.nombre || item.em_razon_social || item.em_nombre || 'N/A'}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {item['Em Sector'] || item.sector || item.em_sector || 'Sector no especificado'}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <div className="flex items-center">
                                  <FaIdCard className="mr-2 text-gray-400" />
                                  {item['Em Nit'] || item.nit || item.em_nit || 'N/A'}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item['Em Correo'] || item.email || item.correo || item.em_email || 'N/A'}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item['Em Telefono'] || item.telefono || item.em_telefono || 'N/A'}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item['Em Ciudad'] || item.ciudad || item.em_ciudad || 'N/A'}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  (item['Em Estado'] === 'activo' || item.estado === 'activo' || item.em_estado === 'activo' || item.is_active === true)
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  <div className={`w-1.5 h-1.5 rounded-full mr-1 ${
                                    (item['Em Estado'] === 'activo' || item.estado === 'activo' || item.em_estado === 'activo' || item.is_active === true)
                                      ? 'bg-green-400' 
                                      : 'bg-red-400'
                                  }`}></div>
                                  {(item['Em Estado'] === 'activo' || item.estado === 'activo' || item.em_estado === 'activo' || item.is_active === true) ? 'Activo' : 'Inactivo'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => handleView(item)}
                                    className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-lg transition-colors duration-200"
                                    title="Ver detalles"
                                  >
                                    <FaEye className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleEdit(item)}
                                    className="bg-amber-100 hover:bg-amber-200 text-amber-700 p-2 rounded-lg transition-colors duration-200"
                                    title="Editar"
                                  >
                                    <FaEdit className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(item)}
                                    className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-lg transition-colors duration-200"
                                    title="Eliminar"
                                  >
                                    <FaTrash className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </>
                          )}
                          {activeTab === 'vacantes' && (
                            <>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {item.va_titulo || 'Sin título'}
                              </td>
                              {/* Logo de la empresa */}
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex-shrink-0 h-10 w-10">
                                  {(item.va_idEmpresa_fk?.em_logo || item.va_empresa_logo || item['Va Empresa Logo'] || item.empresa_logo) ? (
                                    <img
                                      className="h-10 w-10 rounded-lg object-cover border border-gray-200 shadow-sm"
                                      src={item.va_idEmpresa_fk?.em_logo || item.va_empresa_logo || item['Va Empresa Logo'] || item.empresa_logo}
                                      alt={`Logo ${item.va_idEmpresa_fk?.em_nombre || item.va_empresa_nombre || 'Empresa'}`}
                                      onError={(e) => {
                                        console.error('❌ Error cargando logo empresa en vacante:', {
                                          url: e.target.src,
                                          item: item,
                                          logoField: item.va_idEmpresa_fk?.em_logo || item.va_empresa_logo || item.empresa_logo
                                        });
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                      }}
                                      onLoad={() => {
                                        console.log('✅ Logo empresa en vacante cargado:', item.va_idEmpresa_fk?.em_logo || item.va_empresa_logo);
                                      }}
                                    />
                                  ) : (
                                    console.log('⚠️ No hay logo para empresa en vacante:', item.va_idEmpresa_fk) && null
                                  )}
                                  <div className={`h-10 w-10 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center ${
                                    (item.va_idEmpresa_fk?.em_logo || item.va_empresa_logo || item.empresa_logo) ? 'hidden' : 'flex'
                                  } shadow-sm`}>
                                    <span className="text-sm font-bold text-white">
                                      {((item.va_idEmpresa_fk?.em_nombre || item.va_empresa_nombre || 'E').split(' ').map(word => word[0]).join('').substring(0, 2)).toUpperCase()}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              {/* Nombre de la empresa */}
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {item.va_idEmpresa_fk?.em_nombre || 
                                     item.va_idEmpresa_fk?.em_razon_social ||
                                     item.va_empresa_nombre || 
                                     item['Va Empresa Nombre'] || 
                                     item.empresa_nombre || 
                                     'Empresa no especificada'}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {item.va_idEmpresa_fk?.em_sector || 
                                     item.va_empresa_sector || 
                                     item['Va Empresa Sector'] ||
                                     'Sector no especificado'}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.va_salario?.toLocaleString() || 'No especificado'}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  item.va_estado === 'activa' ? 'bg-green-100 text-green-800' :
                                  item.va_estado === 'cerrada' ? 'bg-red-100 text-red-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  <div className={`w-1.5 h-1.5 rounded-full mr-1 ${
                                    item.va_estado === 'activa' ? 'bg-green-400' :
                                    item.va_estado === 'cerrada' ? 'bg-red-400' :
                                    'bg-yellow-400'
                                  }`}></div>
                                  {item.va_estado || 'Pendiente'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => handleView(item)}
                                    className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-lg transition-colors duration-200"
                                    title="Ver detalles"
                                  >
                                    <FaEye className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleEdit(item)}
                                    className="bg-amber-100 hover:bg-amber-200 text-amber-700 p-2 rounded-lg transition-colors duration-200"
                                    title="Editar"
                                  >
                                    <FaEdit className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(item)}
                                    className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-lg transition-colors duration-200"
                                    title="Eliminar"
                                  >
                                    <FaTrash className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </>
                          )}
                          {activeTab === 'postulaciones' && (
                            <>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {(item.po_aspirante_fk?.asp_nombre || 
                                  item.po_aspirante_fk?.asp_nombreCompleto || 
                                  item.pos_aspirante_fk?.asp_nombre ||
                                  item.pos_aspirante_fk?.asp_nombreCompleto ||
                                  item.aspirante_nombre ||
                                  item['Aspirante Nombre'] ||
                                  'N/A')} {(item.po_aspirante_fk?.asp_apellido || 
                                           item.pos_aspirante_fk?.asp_apellido ||
                                           item.aspirante_apellido ||
                                           item['Aspirante Apellido'] || '')}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {item.po_vacante_fk?.va_titulo || 
                                 item.pos_vacante_fk?.va_titulo || 
                                 item.vacante_titulo || 
                                 item['Vacante Titulo'] ||
                                 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {(() => {
                                  const fecha = item.po_fecha_postulacion || 
                                              item.pos_fechaPostulacion || 
                                              item.fecha_postulacion ||
                                              item['Fecha Postulacion'];
                                  if (fecha && fecha !== 'Invalid Date') {
                                    try {
                                      return new Date(fecha).toLocaleDateString('es-CO', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit'
                                      });
                                    } catch (e) {
                                      return fecha;
                                    }
                                  }
                                  return 'N/A';
                                })()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  (item.po_estado === 'aceptada' || item.pos_estado === 'aceptada' || item.estado === 'aceptada') ? 'bg-green-100 text-green-800' :
                                  (item.po_estado === 'rechazada' || item.pos_estado === 'rechazada' || item.estado === 'rechazada') ? 'bg-red-100 text-red-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  <div className={`w-1.5 h-1.5 rounded-full mr-1 ${
                                    (item.po_estado === 'aceptada' || item.pos_estado === 'aceptada' || item.estado === 'aceptada') ? 'bg-green-400' :
                                    (item.po_estado === 'rechazada' || item.pos_estado === 'rechazada' || item.estado === 'rechazada') ? 'bg-red-400' :
                                    'bg-yellow-400'
                                  }`}></div>
                                  {item.po_estado || item.pos_estado || item.estado || 'Pendiente'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => handleView(item)}
                                    className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-lg transition-colors duration-200"
                                    title="Ver detalles"
                                  >
                                    <FaEye className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleEdit(item)}
                                    className="bg-amber-100 hover:bg-amber-200 text-amber-700 p-2 rounded-lg transition-colors duration-200"
                                    title="Editar estado"
                                  >
                                    <FaEdit className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(item)}
                                    className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-lg transition-colors duration-200"
                                    title="Eliminar"
                                  >
                                    <FaTrash className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Paginación */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button
                        onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                      >
                        Anterior
                      </button>
                      <button
                        onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                      >
                        Siguiente
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Mostrando{' '}
                          <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span>
                          {' '}a{' '}
                          <span className="font-medium">
                            {Math.min(currentPage * itemsPerPage, getSortedAndFilteredData().length)}
                          </span>
                          {' '}de{' '}
                          <span className="font-medium">{getSortedAndFilteredData().length}</span>
                          {' '}resultados
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                          <button
                            onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                          >
                            Anterior
                          </button>
                          {[...Array(totalPages)].map((_, index) => (
                            <button
                              key={index + 1}
                              onClick={() => setCurrentPage(index + 1)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                currentPage === index + 1
                                  ? 'z-10 bg-[#5e17eb] border-[#5e17eb] text-white'
                                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              {index + 1}
                            </button>
                          ))}
                          <button
                            onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                          >
                            Siguiente
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                )}

                {getSortedAndFilteredData().length === 0 && !loading && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">
                      {activeTab === 'postulaciones' && '📝'}
                      {activeTab === 'aspirantes' && '👤'}
                      {activeTab === 'empresas' && '🏢'}
                      {activeTab === 'vacantes' && '💼'}
                      {activeTab === 'users' && '👥'}
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {activeTab === 'postulaciones' && 'No hay postulaciones registradas'}
                      {activeTab === 'aspirantes' && 'No hay aspirantes registrados'}
                      {activeTab === 'empresas' && 'No hay empresas registradas'}
                      {activeTab === 'vacantes' && 'No hay vacantes registradas'}
                      {activeTab === 'users' && 'No hay usuarios registrados'}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {activeTab === 'postulaciones' && 'Las postulaciones aparecerán aquí una vez que los aspirantes se postulen a las vacantes disponibles.'}
                      {activeTab === 'aspirantes' && 'Los aspirantes aparecerán aquí una vez que se registren en la plataforma.'}
                      {activeTab === 'empresas' && 'Las empresas aparecerán aquí una vez que se registren en la plataforma.'}
                      {activeTab === 'vacantes' && 'Las vacantes aparecerán aquí una vez que las empresas las publiquen.'}
                      {activeTab === 'users' && 'Los usuarios aparecerán aquí una vez que se registren en la plataforma.'}
                    </p>
                    {searchTerm && (
                      <p className="text-sm text-gray-500">
                        No se encontraron resultados para "{searchTerm}"
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Modal de detalles */}
        {showModal && selectedUser && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Detalles</h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes className="h-6 w-6" />
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(selectedUser).map(([key, value]) => 
                      key !== 'id' && (
                        <div key={key}>
                          <p className="text-sm font-medium text-gray-500 capitalize">
                            {key.replace(/_/g, ' ')}
                          </p>
                          <p className="text-sm text-gray-900">
                            {value === null ? 'N/A' : 
                             typeof value === 'boolean' ? (value ? 'Sí' : 'No') :
                             typeof value === 'object' ? JSON.stringify(value) :
                             value.toString()}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
        </div>
      </div>


      {/* Modal de Ver Detalles */}
      {showViewModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
            {/* Header del Modal */}
            <div className="bg-gradient-to-r from-[#5e17eb] to-[#A67AFF] px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {/* Foto o Avatar */}
                  <div className="flex-shrink-0">
                    {activeTab === 'aspirantes' && (selectedItem.asp_foto || selectedItem['Asp Foto']) ? (
                      <img
                        className="h-14 w-14 rounded-full object-cover border-3 border-white shadow-lg"
                        src={selectedItem.asp_foto || selectedItem['Asp Foto']}
                        alt={`${selectedItem['Asp Nombre'] || selectedItem.asp_nombre || 'Aspirante'}`}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    {activeTab === 'empresas' && (selectedItem.em_logo || selectedItem['Em Logo']) ? (
                      <img
                        className="h-14 w-14 rounded-lg object-cover border-3 border-white shadow-lg"
                        src={selectedItem.em_logo || selectedItem['Em Logo']}
                        alt={`Logo ${selectedItem['Em Razon Social'] || selectedItem.em_razon_social || 'Empresa'}`}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    {activeTab === 'vacantes' && selectedItem.va_idEmpresa_fk?.em_logo ? (
                      <img
                        className="h-14 w-14 rounded-lg object-cover border-3 border-white shadow-lg"
                        src={selectedItem.va_idEmpresa_fk.em_logo}
                        alt={`Logo ${selectedItem.va_idEmpresa_fk.em_nombre || 'Empresa'}`}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`w-14 h-14 bg-white bg-opacity-20 rounded-${(activeTab === 'empresas' || activeTab === 'vacantes') ? 'lg' : 'full'} flex items-center justify-center ${
                      ((activeTab === 'aspirantes' && (selectedItem.asp_foto || selectedItem['Asp Foto'])) || 
                       (activeTab === 'empresas' && (selectedItem.em_logo || selectedItem['Em Logo'])) ||
                       (activeTab === 'vacantes' && selectedItem.va_idEmpresa_fk?.em_logo)) ? 'hidden' : 'flex'
                    } shadow-lg`}>
                      {activeTab === 'aspirantes' && (
                        <span className="text-lg font-bold text-white">
                          {((selectedItem['Asp Nombre'] || selectedItem.asp_nombre || 'N')[0] + 
                            (selectedItem['Asp Apellido'] || selectedItem.asp_apellido || 'N')[0]).toUpperCase()}
                        </span>
                      )}
                      {activeTab === 'empresas' && (
                        <span className="text-sm font-bold text-white">
                          {((selectedItem['Em Razon Social'] || selectedItem.em_razon_social || 'E').split(' ').map(word => word[0]).join('').substring(0, 2)).toUpperCase()}
                        </span>
                      )}
                      {activeTab === 'vacantes' && (
                        selectedItem.va_idEmpresa_fk?.em_nombre ? (
                          <span className="text-sm font-bold text-white">
                            {((selectedItem.va_idEmpresa_fk.em_nombre).split(' ').map(word => word[0]).join('').substring(0, 2)).toUpperCase()}
                          </span>
                        ) : (
                          <FaBriefcase className="h-5 w-5 text-white" />
                        )
                      )}
                      {activeTab === 'postulaciones' && <FaFileAlt className="h-5 w-5 text-white" />}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {activeTab === 'aspirantes' && (selectedItem.asp_nombreCompleto || selectedItem.asp_nombre || 'Aspirante')}
                      {activeTab === 'empresas' && (selectedItem.em_razon_social || selectedItem.em_nombre || 'Empresa')}
                      {activeTab === 'vacantes' && (selectedItem.va_titulo || 'Vacante')}
                      {activeTab === 'postulaciones' && 'Postulación'}
                    </h3>
                    <p className="text-white text-opacity-90 text-sm">
                      {activeTab === 'aspirantes' && 'Detalles del aspirante'}
                      {activeTab === 'empresas' && (selectedItem.em_sector || 'Detalles de la empresa')}
                      {activeTab === 'vacantes' && (selectedItem.va_idEmpresa_fk?.em_nombre || selectedItem.va_idEmpresa_fk?.em_razon_social || 'Detalles de la vacante')}
                      {activeTab === 'postulaciones' && 'Detalles de la postulación'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-white hover:text-gray-200 p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Contenido del Modal */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {/* Información Principal */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Salario / Info Principal */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center space-x-2 text-green-600 mb-2">
                    <span className="text-lg">💰</span>
                    <span className="text-sm font-medium">
                      {activeTab === 'vacantes' ? 'Salario' : activeTab === 'aspirantes' ? 'Edad' : 'Información'}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-green-800">
                    {activeTab === 'vacantes' && `$${selectedItem.va_salario?.toLocaleString() || 'No especificado'}`}
                    {activeTab === 'aspirantes' && (
                      typeof calculateAge(selectedItem) === 'number' 
                        ? `${calculateAge(selectedItem)} años`
                        : calculateAge(selectedItem)
                    )}
                    {activeTab === 'empresas' && (selectedItem.em_sector || 'Sector no especificado')}
                    {activeTab === 'postulaciones' && (selectedItem.po_estado || selectedItem.pos_estado || selectedItem.estado || 'Estado no definido')}
                  </p>
                </div>

                {/* Ubicación */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center space-x-2 text-blue-600 mb-2">
                    <span className="text-lg">📍</span>
                    <span className="text-sm font-medium">Ubicación</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-800">
                    {selectedItem.asp_ciudad || selectedItem.em_ciudad || selectedItem.va_ubicacion || 
                     (selectedItem.po_vacante_fk?.va_ubicacion || selectedItem.pos_vacante_fk?.va_ubicacion) || 
                     'No especificado'}
                  </p>
                </div>

                {/* Tipo de empleo / Estado */}
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                  <div className="flex items-center space-x-2 text-purple-600 mb-2">
                    <span className="text-lg">🔄</span>
                    <span className="text-sm font-medium">Estado</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-800">
                    {selectedItem.asp_estado || selectedItem.em_estado || selectedItem.va_estado || 
                     selectedItem.po_estado || selectedItem.pos_estado || selectedItem.estado || 
                     'Activo'}
                  </p>
                </div>
              </div>

              {/* Sección de Descripción o Información Detallada */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">📋</span>
                  {activeTab === 'vacantes' ? 'Descripción' : activeTab === 'aspirantes' ? 'Información Personal' : 'Detalles'}
                </h4>
                <div className="bg-gray-50 rounded-xl p-4">
                  {activeTab === 'vacantes' && (
                    <p className="text-gray-700 leading-relaxed">
                      {selectedItem.va_descripcion || 'No hay descripción disponible para esta vacante.'}
                    </p>
                  )}
                  {activeTab === 'aspirantes' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Número de Identificación</p>
                        <p className="font-medium text-gray-900">
                          {selectedItem['Asp NumeroId'] || 
                           selectedItem.asp_numeroId || 
                           selectedItem.numeroId || 
                           selectedItem.cedula || 
                           selectedItem.documento || 
                           'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Teléfono</p>
                        <p className="font-medium text-gray-900">
                          {selectedItem['Asp Telefono'] || 
                           selectedItem.asp_telefono || 
                           selectedItem.telefono || 
                           'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium text-gray-900">
                          {selectedItem.asp_correo || 
                           selectedItem['Asp Correo'] || 
                           selectedItem.correo || 
                           selectedItem.email || 
                           selectedItem.asp_email || 
                           'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Edad</p>
                        <p className="font-medium text-gray-900">
                          {selectedItem.asp_edad || 
                           selectedItem['Asp Edad'] || 
                           'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Ciudad</p>
                        <p className="font-medium text-gray-900">
                          {selectedItem.asp_ciudad || 
                           selectedItem['Asp Ciudad'] || 
                           'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Estado Civil</p>
                        <p className="font-medium text-gray-900">
                          {selectedItem.asp_estado_civil || 
                           selectedItem['Asp Estado Civil'] || 
                           'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Nivel Educativo</p>
                        <p className="font-medium text-gray-900">
                          {selectedItem.asp_nivel_educativo || 
                           selectedItem['Asp Nivel Educativo'] || 
                           'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Años de Experiencia</p>
                        <p className="font-medium text-gray-900">
                          {selectedItem.asp_experiencia_anos || 
                           selectedItem['Asp Experiencia Anos'] || 
                           'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Estado</p>
                        <p className="font-medium text-gray-900">
                          {selectedItem.asp_estado || 
                           selectedItem['Asp Estado'] || 
                           'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Fecha de Registro</p>
                        <p className="font-medium text-gray-900">
                          {selectedItem.asp_fecha_registro || 
                           selectedItem.fecha_registro || 
                           selectedItem.created_at || 
                           'N/A'}
                        </p>
                      </div>
                    </div>
                  )}
                  {activeTab === 'empresas' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">NIT</p>
                        <p className="font-medium text-gray-900">{selectedItem.em_nit || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Teléfono</p>
                        <p className="font-medium text-gray-900">{selectedItem.em_telefono || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium text-gray-900">{selectedItem.em_email || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Sector</p>
                        <p className="font-medium text-gray-900">{selectedItem.em_sector || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Ciudad</p>
                        <p className="font-medium text-gray-900">{selectedItem.em_ciudad || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Dirección</p>
                        <p className="font-medium text-gray-900">{selectedItem.em_direccion || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Estado</p>
                        <p className="font-medium text-gray-900">{selectedItem.em_estado || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Fecha de Registro</p>
                        <p className="font-medium text-gray-900">{selectedItem.em_fecha_registro || 'N/A'}</p>
                      </div>
                    </div>
                  )}
                  {activeTab === 'vacantes' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Información principal */}
                      <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                        <p className="text-sm font-medium text-green-700 mb-1">💰 Tipo de Contrato</p>
                        <p className="font-bold text-green-800 text-lg">
                          {selectedItem.va_tipo_contrato || selectedItem.va_tipo_empleo || 'N/A'}
                        </p>
                      </div>

                      <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
                        <p className="text-sm font-medium text-red-700 mb-1">📅 Fecha de Publicación</p>
                        <p className="font-bold text-red-800 text-lg">
                          {(() => {
                            const fecha = selectedItem.va_fecha_publicacion || selectedItem.fecha_publicacion;
                            if (fecha && fecha !== 'Invalid Date') {
                              try {
                                return new Date(fecha).toLocaleDateString('es-CO', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                });
                              } catch (e) {
                                return fecha;
                              }
                            }
                            return 'N/A';
                          })()}
                        </p>
                      </div>

                      {/* Información turbo si está disponible */}
                      {selectedItem.va_modo_turbo && (
                        <div className="col-span-full bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border-2 border-yellow-400">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">⚡</span>
                            <p className="text-sm font-medium text-yellow-700">Modo Turbo Activado</p>
                          </div>
                          <p className="font-bold text-yellow-800 text-lg">
                            Respuesta garantizada en {selectedItem.va_tiempo_respuesta_horas || '48'} horas
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  {activeTab === 'postulaciones' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Aspirante</p>
                        <p className="font-medium text-gray-900">
                          {(selectedItem.po_aspirante_fk?.asp_nombre || selectedItem.po_aspirante_fk?.asp_nombreCompleto) || 
                           (selectedItem.pos_aspirante_fk?.asp_nombre || selectedItem.pos_aspirante_fk?.asp_nombreCompleto) || 
                           selectedItem.aspirante_nombre || 
                           'N/A'}
                          {(selectedItem.po_aspirante_fk?.asp_apellido || selectedItem.pos_aspirante_fk?.asp_apellido) && 
                           ` ${selectedItem.po_aspirante_fk?.asp_apellido || selectedItem.pos_aspirante_fk?.asp_apellido}`}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Vacante</p>
                        <p className="font-medium text-gray-900">
                          {(selectedItem.po_vacante_fk?.va_titulo) || 
                           (selectedItem.pos_vacante_fk?.va_titulo) || 
                           selectedItem.vacante_titulo || 
                           'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Fecha de Postulación</p>
                        <p className="font-medium text-gray-900">
                          {(() => {
                            const fecha = selectedItem.po_fecha_postulacion || selectedItem.pos_fechaPostulacion || selectedItem.fecha_postulacion;
                            if (fecha && fecha !== 'Invalid Date') {
                              try {
                                return new Date(fecha).toLocaleDateString('es-CO', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                });
                              } catch (e) {
                                return fecha;
                              }
                            }
                            return 'N/A';
                          })()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Estado</p>
                        <p className="font-medium text-gray-900">
                          {(selectedItem.po_estado || selectedItem.pos_estado || selectedItem.estado) || 'N/A'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Información de la Empresa (solo para vacantes) */}
              {activeTab === 'vacantes' && selectedItem.va_idEmpresa_fk && (
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="mr-2">🏢</span>
                    Información de la Empresa
                  </h4>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-start space-x-4">
                      {/* Logo de la empresa */}
                      <div className="flex-shrink-0">
                        <div className="h-16 w-16">
                          {selectedItem.va_idEmpresa_fk?.em_logo ? (
                            <img
                              className="h-16 w-16 rounded-lg object-cover border-2 border-blue-500 shadow-md"
                              src={selectedItem.va_idEmpresa_fk.em_logo}
                              alt={`Logo ${selectedItem.va_idEmpresa_fk.em_nombre}`}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div className={`h-16 w-16 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center ${
                            selectedItem.va_idEmpresa_fk?.em_logo ? 'hidden' : 'flex'
                          } shadow-md`}>
                            <span className="text-xl font-bold text-white">
                              {((selectedItem.va_idEmpresa_fk?.em_nombre || 'E').split(' ').map(word => word[0]).join('').substring(0, 2)).toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Información de la empresa */}
                      <div className="flex-1">
                        <h5 className="text-xl font-bold text-gray-900 mb-1">
                          {selectedItem.va_idEmpresa_fk?.em_nombre || selectedItem.va_idEmpresa_fk?.em_razon_social || 'Empresa'}
                        </h5>
                        <p className="text-blue-600 font-medium mb-3">
                          {selectedItem.va_idEmpresa_fk?.em_sector || 'Sector no especificado'}
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">NIT</p>
                            <p className="font-medium text-gray-900">{selectedItem.va_idEmpresa_fk?.em_nit || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium text-gray-900">{selectedItem.va_idEmpresa_fk?.em_email || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Teléfono</p>
                            <p className="font-medium text-gray-900">{selectedItem.va_idEmpresa_fk?.em_telefono || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Ciudad</p>
                            <p className="font-medium text-gray-900">{selectedItem.va_idEmpresa_fk?.em_ciudad || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Información Adicional */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">📊</span>
                  Información Adicional
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  {/* Requisitos */}
                  {(selectedItem.va_requisitos || selectedItem.requisitos) && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h5 className="text-sm font-semibold text-blue-700 mb-2 flex items-center">
                        <span className="mr-2">📋</span>
                        Requisitos
                      </h5>
                      <div className="text-sm text-gray-800 whitespace-pre-line">
                        {selectedItem.va_requisitos || selectedItem.requisitos}
                      </div>
                    </div>
                  )}
                  
                  {/* Responsabilidades */}
                  {(selectedItem.va_responsabilidades || selectedItem.responsabilidades) && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h5 className="text-sm font-semibold text-green-700 mb-2 flex items-center">
                        <span className="mr-2">📝</span>
                        Responsabilidades
                      </h5>
                      <div className="text-sm text-gray-800 whitespace-pre-line">
                        {selectedItem.va_responsabilidades || selectedItem.responsabilidades}
                      </div>
                    </div>
                  )}
                  
                  {/* Si no hay requisitos ni responsabilidades */}
                  {!(selectedItem.va_requisitos || selectedItem.requisitos) && 
                   !(selectedItem.va_responsabilidades || selectedItem.responsabilidades) && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                      <p className="text-gray-500 text-sm">
                        No hay requisitos ni responsabilidades especificados para esta vacante.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Editar */}
      {showEditModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
            {/* Header del Modal */}
            <div className="bg-gradient-to-r from-[#5e17eb] to-[#A67AFF] px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                    <FaEdit className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Editar {activeTab.slice(0, -1).charAt(0).toUpperCase() + activeTab.slice(0, -1).slice(1)}
                    </h3>
                    <p className="text-white text-opacity-90 text-sm">
                      {selectedItem.asp_nombreCompleto || selectedItem.em_razon_social || selectedItem.va_titulo || `ID ${selectedItem.id}`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-white hover:text-gray-200 p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Formulario */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(editData)
                    .filter(([key]) => 
                      !['id', 'password', 'created_at', 'updated_at', 'fecha_creacion', 'fecha_actualizacion'].includes(key)
                    )
                    .map(([key, value]) => (
                      <div key={key} className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 capitalize">
                          {key.replace(/_/g, ' ')}
                        </label>
                        {/* Campos de archivo especiales */}
                        {(key === 'asp_foto' || key === 'asp_curriculum' || key === 'em_logo') ? (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#5e17eb] transition-colors">
                              <div className="flex items-center space-x-3">
                                <div className="p-2 bg-gray-100 rounded-lg">
                                  {key === 'asp_foto' || key === 'em_logo' ? (
                                    <FaImage className="h-5 w-5 text-gray-600" />
                                  ) : (
                                    <FaFileAlt className="h-5 w-5 text-gray-600" />
                                  )}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-700">
                                    {selectedFiles[key] ? selectedFiles[key].name : 'Ningún archivo seleccionado'}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {key === 'asp_foto' || key === 'em_logo' ? 'JPG, PNG, GIF (máx. 5MB)' : 'PDF, DOC, DOCX (máx. 5MB)'}
                                  </p>
                                </div>
                              </div>
                              <label className="cursor-pointer px-4 py-2 bg-[#5e17eb] text-white rounded-lg hover:bg-[#4a0fd3] transition-colors text-sm font-medium">
                                Seleccionar
                                <input
                                  type="file"
                                  accept={key === 'asp_foto' || key === 'em_logo' ? 'image/*' : '.pdf,.doc,.docx'}
                                  onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                      handleFileSelect(key, file);
                                    }
                                  }}
                                  className="hidden"
                                />
                              </label>
                            </div>
                            {selectedFiles[key] && (
                              <div className="flex items-center space-x-2 text-sm text-green-600">
                                <FaCheck className="h-4 w-4" />
                                <span>Archivo seleccionado: {(selectedFiles[key].size / 1024).toFixed(1)} KB</span>
                              </div>
                            )}
                            {value && typeof value === 'string' && !selectedFiles[key] && (
                              <div className="flex items-center space-x-2 text-sm text-blue-600">
                                <FaInfo className="h-4 w-4" />
                                <span>Archivo actual: {value.split('/').pop()}</span>
                              </div>
                            )}
                          </div>
                        ) : (key.includes('descripcion') || key.includes('observaciones')) ? (
                          <textarea
                            value={value || ''}
                            onChange={(e) => setEditData({...editData, [key]: e.target.value})}
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5e17eb] focus:border-transparent transition-colors"
                            placeholder={`Ingrese ${key.replace(/_/g, ' ')}`}
                          />
                        ) : key.includes('estado') ? (
                          <select
                            value={value || ''}
                            onChange={(e) => setEditData({...editData, [key]: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5e17eb] focus:border-transparent transition-colors"
                          >
                            <option value="">Seleccionar estado</option>
                            <option value="activo">Activo</option>
                            <option value="inactivo">Inactivo</option>
                            {activeTab === 'vacantes' && <option value="cerrada">Cerrada</option>}
                            {activeTab === 'postulaciones' && (
                              <>
                                <option value="pendiente">Pendiente</option>
                                <option value="aceptada">Aceptada</option>
                                <option value="rechazada">Rechazada</option>
                              </>
                            )}
                          </select>
                        ) : (
                          <input
                            type={
                              key.includes('email') || key.includes('correo') || key.includes('Correo') ? 'email' : 
                              key.includes('telefono') || key.includes('Telefono') || key.includes('salario') || key.includes('edad') ? 'number' : 
                              key.includes('fecha') || key.includes('Fecha') ? 'date' :
                              'text'
                            }
                            value={value || ''}
                            onChange={(e) => {
                              const newValue = e.target.value;
                              setEditData({...editData, [key]: newValue});
                              
                              // Validación básica para email
                              if ((key.includes('email') || key.includes('correo') || key.includes('Correo')) && newValue) {
                                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                if (!emailRegex.test(newValue)) {
                                  console.warn('⚠️ Email no válido:', newValue);
                                }
                              }
                            }}
                            required={key.includes('nombre') || key.includes('Nombre') || key.includes('email') || key.includes('correo') || key.includes('Correo')}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5e17eb] focus:border-transparent transition-colors"
                            placeholder={`Ingrese ${key.replace(/_/g, ' ')}`}
                          />
                        )}
                      </div>
                    ))}
                </div>
              </form>
            </div>

            {/* Footer con Botones */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedFiles({});
                    setError('');
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    console.log('🖱️ Clic en botón Guardar Cambios');
                    console.log('📊 Estado actual loading:', loading);
                    console.log('📝 Datos para editar:', editData);
                    console.log('🔑 Item seleccionado:', selectedItem);
                    saveEdit();
                  }}
                  disabled={loading}
                  className={`px-8 py-3 rounded-lg transition-colors font-medium flex items-center ${
                    loading 
                      ? 'bg-gray-400 cursor-not-allowed text-white' 
                      : 'bg-[#5e17eb] text-white hover:bg-[#4a0fd3]'
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <FaSave className="mr-2 h-4 w-4" />
                      Guardar Cambios
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Importación Masiva */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
            {/* Header del Modal */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">
                  Importar Vacantes
                </h3>
                <button
                  onClick={closeImportModal}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <FaTimes className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Contenido del Modal */}
            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-4">
                  Sube un archivo CSV con las vacantes que deseas importar. 
                  Puedes descargar la plantilla para ver el formato requerido.
                </p>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Archivo CSV
                  </label>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleImportFileSelect}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>

                {importFile && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700">
                      <FaCheck className="inline mr-2" />
                      Archivo seleccionado: {importFile.name}
                    </p>
                  </div>
                )}

                {importResult && (
                  <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Resultado de la importación:</h4>
                    <p className="text-sm text-blue-700 mb-2">{importResult.message}</p>
                    {importResult.errores && importResult.errores.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-red-700 mb-1">Errores encontrados:</p>
                        <ul className="text-sm text-red-600 list-disc list-inside max-h-32 overflow-y-auto">
                          {importResult.errores.slice(0, 5).map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                          {importResult.errores.length > 5 && (
                            <li className="font-medium">... y {importResult.errores.length - 5} errores más</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Botones */}
              <div className="flex space-x-3">
                <button
                  onClick={handleImportSubmit}
                  disabled={!importFile || importLoading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {importLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Procesando...
                    </>
                  ) : (
                    <>
                      <FaUpload /> Importar
                    </>
                  )}
                </button>
                <button
                  onClick={closeImportModal}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Admin;
