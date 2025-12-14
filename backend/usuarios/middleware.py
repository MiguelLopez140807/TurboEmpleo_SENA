from django.http import JsonResponse
from django.utils.deprecation import MiddlewareMixin
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from jwt import decode as jwt_decode
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class SecurityMiddleware(MiddlewareMixin):
    """
    Middleware de seguridad para validar tokens y proteger rutas sensibles
    """
    
    PROTECTED_PATHS = [
        '/api/usuarios/',
        '/api/aspirantes/',
        '/api/empresas/',
        '/api/vacantes/',
        '/api/postulaciones/',
        '/api/notificaciones/',
        '/api/experiencia_laboral/',
        '/api/experiencia_escolar/',
        '/admin/',
    ]
    
    EXEMPT_PATHS = [
        '/api/registro/',
        '/api/login/',
        '/api/token/',
        '/api/usuarios/contacto/',
        '/api/usuarios/password-reset/',
        '/api/usuarios/activar-cuenta/',
        '/media/',
        '/static/',
    ]
    
    def process_request(self, request):
        """
        Procesar cada request para validar autenticación en rutas protegidas
        """
        path = request.path
        
        # Saltar validación para rutas exentas
        if any(path.startswith(exempt_path) for exempt_path in self.EXEMPT_PATHS):
            return None
        
        # Validar autenticación para rutas protegidas
        if any(path.startswith(protected_path) for protected_path in self.PROTECTED_PATHS):
            return self._validate_authentication(request)
        
        return None
    
    def _validate_authentication(self, request):
        """
        Validar token de autenticación
        """
        # Obtener token del header Authorization
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        
        if not auth_header or not auth_header.startswith('Bearer '):
            return JsonResponse(
                {'error': 'Token de autenticación requerido'},
                status=401
            )
        
        token = auth_header.split(' ')[1]
        
        try:
            # Validar token con SimpleJWT
            UntypedToken(token)
            
            # Decodificar token para obtener información del usuario
            decoded_token = jwt_decode(
                token,
                options={"verify_signature": False}
            )
            
            # Agregar información del usuario al request
            request.user_id = decoded_token.get('user_id')
            request.token_data = decoded_token
            
            return None
            
        except (InvalidToken, TokenError) as e:
            logger.warning(f"Token inválido en {request.path}: {str(e)}")
            return JsonResponse(
                {'error': 'Token inválido o expirado'},
                status=401
            )
        except Exception as e:
            logger.error(f"Error validando token en {request.path}: {str(e)}")
            return JsonResponse(
                {'error': 'Error de autenticación'},
                status=401
            )
    
    def process_response(self, request, response):
        """
        Agregar headers de seguridad a todas las respuestas
        """
        # Headers de seguridad
        response['X-Content-Type-Options'] = 'nosniff'
        response['X-Frame-Options'] = 'DENY'
        response['X-XSS-Protection'] = '1; mode=block'
        response['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        
        # Solo en producción
        if not settings.DEBUG:
            response['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
        
        return response