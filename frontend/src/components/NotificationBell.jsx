import React, { useState, useEffect, useRef } from 'react';
import { FaBell, FaCheck, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function NotificationBell() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    // Cerrar dropdown al hacer clic fuera
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Cargar notificaciones y contador
    const fetchNotifications = async () => {
        if (!token) return;
        
        try {
            // Obtener conteo de no leídas
            const countRes = await fetch('http://127.0.0.1:8000/api/notificaciones/no_leidas_count/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const countData = await countRes.json();
            setUnreadCount(countData.count || 0);

            // Obtener últimas 5 notificaciones no leídas
            const notifRes = await fetch('http://127.0.0.1:8000/api/notificaciones/?not_estado=No leída', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const notifData = await notifRes.json();
            setNotifications(Array.isArray(notifData) ? notifData.slice(0, 5) : []);
        } catch (error) {
            console.error('Error al cargar notificaciones:', error);
        }
    };

    // Cargar notificaciones al montar y cada 60 segundos (optimizado)
    useEffect(() => {
        if (!token) return;
        
        fetchNotifications();
        const interval = setInterval(() => {
            // Solo actualizar si el componente está visible
            if (document.visibilityState === 'visible') {
                fetchNotifications();
            }
        }, 60000); // Actualizar cada 60s en lugar de 30s
        
        return () => clearInterval(interval);
    }, [token]);

    // Optimizar: solo cargar cuando se abre el dropdown y han pasado >10s
    const handleToggleDropdown = () => {
        setShowDropdown(!showDropdown);
        if (!showDropdown) {
            const now = Date.now();
            const lastFetch = localStorage.getItem('lastNotificationFetch');
            if (!lastFetch || now - parseInt(lastFetch) > 10000) {
                fetchNotifications();
                localStorage.setItem('lastNotificationFetch', now.toString());
            }
        }
    };

    const handleMarkAsRead = async (notificationId) => {
        if (!token) return;
        
        try {
            await fetch(`http://127.0.0.1:8000/api/notificaciones/${notificationId}/marcar_leida/`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }
            });
            // Actualizar lista local
            setNotifications(notifications.filter(n => n.id !== notificationId));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error al marcar como leída:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        if (!token) return;
        setLoading(true);
        
        try {
            await fetch('http://127.0.0.1:8000/api/notificaciones/marcar_todas_leidas/', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications([]);
            setUnreadCount(0);
        } catch (error) {
            console.error('Error al marcar todas como leídas:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewAll = () => {
        setShowDropdown(false);
        navigate('/notificaciones');
    };

    const formatFecha = (fecha) => {
        const ahora = new Date();
        const notifFecha = new Date(fecha);
        const diffMs = ahora - notifFecha;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Ahora';
        if (diffMins < 60) return `Hace ${diffMins} min`;
        if (diffHours < 24) return `Hace ${diffHours}h`;
        return `Hace ${diffDays}d`;
    };

    if (!token) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Botón de campana */}
            <button
                onClick={handleToggleDropdown}
                className="relative p-2 text-gray-700 hover:text-[#5e17eb] transition-colors duration-200"
                aria-label="Notificaciones"
            >
                <FaBell className="text-2xl" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown de notificaciones */}
            {showDropdown && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[500px] overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-white">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-[#5e17eb]">
                                Notificaciones
                                {unreadCount > 0 && (
                                    <span className="ml-2 text-sm font-normal text-gray-600">
                                        ({unreadCount} nueva{unreadCount !== 1 ? 's' : ''})
                                    </span>
                                )}
                            </h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllAsRead}
                                    disabled={loading}
                                    className="text-xs text-[#5e17eb] hover:text-[#A67AFF] font-semibold flex items-center gap-1"
                                >
                                    <FaCheck /> Marcar todas
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Lista de notificaciones */}
                    <div className="overflow-y-auto flex-1">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                <FaBell className="text-4xl mx-auto mb-3 text-gray-300" />
                                <p>No tienes notificaciones nuevas</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {notifications.map((notif) => (
                                    <div
                                        key={notif.id}
                                        className="p-4 hover:bg-purple-50 transition-colors duration-150 relative group"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-800 leading-relaxed">
                                                    {notif.not_contenido}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {formatFecha(notif.not_fecha)}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleMarkAsRead(notif.id)}
                                                className="text-gray-400 hover:text-[#5e17eb] transition-colors opacity-0 group-hover:opacity-100"
                                                title="Marcar como leída"
                                            >
                                                <FaTimes />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="p-3 border-t border-gray-200 bg-gray-50">
                            <button
                                onClick={handleViewAll}
                                className="w-full text-center text-sm text-[#5e17eb] hover:text-[#A67AFF] font-semibold py-2 hover:bg-purple-50 rounded transition-colors"
                            >
                                Ver todas las notificaciones
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default NotificationBell;
