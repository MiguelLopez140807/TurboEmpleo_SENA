import React from 'react';

/**
 * Badge visual para indicar que una vacante/postulación tiene Modo Turbo activado
 * @param {number} horasRespuesta - Tiempo comprometido de respuesta (24, 48 o 72 horas)
 * @param {string} size - Tamaño del badge: 'sm', 'md', 'lg'
 * @param {string} tipo - Tipo de turbo: 'vacante', 'aspirante', 'premium'
 */
const BadgeTurbo = ({ horasRespuesta, size = 'md', tipo = 'vacante' }) => {
    const sizeClasses = {
        sm: 'text-xs px-3 py-1.5',
        md: 'text-sm px-4 py-2',
        lg: 'text-base px-5 py-2.5'
    };

    const iconSizes = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base'
    };

    // Estilos según el tipo de turbo
    const tipoStyles = {
        vacante: 'bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900',
        aspirante: 'bg-gradient-to-r from-blue-400 to-cyan-400 text-white',
        premium: 'bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white'
    };

    // Texto según el tipo
    const tipoTexto = {
        vacante: `Turbo ${horasRespuesta}h`,
        aspirante: `⚡ Solicité Turbo`,
        premium: `⚡⚡ PREMIUM ${horasRespuesta}h`
    };

    return (
        <span className={`inline-flex items-center gap-2 ${tipoStyles[tipo]} font-bold rounded-full shadow-lg ${sizeClasses[size]} animate-pulse whitespace-nowrap`}>
            <span className={iconSizes[size]}>⚡</span>
            <span className="tracking-wider">{tipoTexto[tipo]}</span>
        </span>
    );
}

export default BadgeTurbo;
