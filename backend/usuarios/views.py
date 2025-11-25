from .models import Postulacion, Notificacion
from .serializers import PostulacionSerializer, NotificacionSerializer
# ViewSet para Postulacion
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
class PostulacionViewSet(viewsets.ModelViewSet):
    queryset = Postulacion.objects.all()

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            from .serializers import PostulacionWriteSerializer
            return PostulacionWriteSerializer
        return PostulacionSerializer
    
    def get_queryset(self):
        queryset = Postulacion.objects.all()
        
        # Filtrar por aspirante
        aspirante = self.request.query_params.get('pos_aspirante_fk', None)
        if aspirante is not None:
            queryset = queryset.filter(pos_aspirante_fk=aspirante)
        
        # Filtrar por vacante
        vacante = self.request.query_params.get('pos_vacante_fk', None)
        if vacante is not None:
            queryset = queryset.filter(pos_vacante_fk=vacante)
        
        # Filtrar por estado
        estado = self.request.query_params.get('pos_estado', None)
        if estado is not None:
            queryset = queryset.filter(pos_estado=estado)
        
        # Ordenar por fecha de postulación (más recientes primero)
        queryset = queryset.order_by('-pos_fechaPostulacion')
        
        return queryset
    
    # ⚡ ENDPOINTS MODO TURBO
    @action(detail=False, methods=['get'])
    def turbo(self, request):
        """
        Endpoint: GET /api/postulaciones/turbo/
        Devuelve solo postulaciones en modo turbo
        """
        postulaciones_turbo = self.queryset.filter(pos_es_turbo=True)
        
        # Filtrar por aspirante si se especifica
        aspirante = request.query_params.get('aspirante', None)
        if aspirante:
            postulaciones_turbo = postulaciones_turbo.filter(pos_aspirante_fk=aspirante)
        
        serializer = self.get_serializer(postulaciones_turbo, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def turbo_pendientes(self, request):
        """
        Endpoint: GET /api/postulaciones/turbo_pendientes/?empresa=<id>
        Devuelve postulaciones turbo pendientes de respuesta para una empresa
        """
        from django.utils import timezone
        
        empresa = request.query_params.get('empresa', None)
        if not empresa:
            return Response(
                {'error': 'Parámetro empresa es requerido'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        postulaciones_pendientes = self.queryset.filter(
            pos_es_turbo=True,
            pos_estado='Pendiente',
            pos_vacante_fk__va_idEmpresa_fk=empresa,
            pos_fecha_limite_respuesta__gt=timezone.now()
        ).order_by('pos_fecha_limite_respuesta')
        
        serializer = self.get_serializer(postulaciones_pendientes, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def responder_turbo(self, request, pk=None):
        """
        Endpoint: POST /api/postulaciones/<id>/responder_turbo/
        Marca una postulación turbo como respondida y actualiza el score de la empresa
        Body: { "nuevo_estado": "Aceptada" | "Rechazada" }
        """
        from django.utils import timezone
        
        postulacion = self.get_object()
        
        if not postulacion.pos_es_turbo:
            return Response(
                {'error': 'Esta postulación no es turbo'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        nuevo_estado = request.data.get('nuevo_estado')
        if nuevo_estado not in ['Aceptada', 'Rechazada']:
            return Response(
                {'error': 'Estado debe ser Aceptada o Rechazada'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Actualizar estado
        postulacion.pos_estado = nuevo_estado
        
        # Verificar si respondió a tiempo
        ahora = timezone.now()
        if ahora <= postulacion.pos_fecha_limite_respuesta:
            postulacion.pos_respondida_a_tiempo = True
        
        postulacion.save()
        
        serializer = self.get_serializer(postulacion)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def activar_turbo_aspirante(self, request, pk=None):
        """
        Endpoint: POST /api/postulaciones/<id>/activar_turbo_aspirante/
        Permite al aspirante activar modo turbo en una postulación existente
        """
        from django.utils import timezone
        from datetime import timedelta
        
        postulacion = self.get_object()
        aspirante = postulacion.pos_aspirante_fk
        vacante = postulacion.pos_vacante_fk
        
        # Validaciones
        if postulacion.pos_es_turbo:
            return Response(
                {'error': 'Esta postulación ya está en modo turbo'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if postulacion.pos_estado != 'Pendiente':
            return Response(
                {'error': 'Solo puedes activar turbo en postulaciones pendientes'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if aspirante.asp_creditos_turbo_disponibles <= 0:
            return Response(
                {'error': f'No tienes créditos turbo disponibles. Créditos restantes: {aspirante.asp_creditos_turbo_disponibles}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Activar modo turbo
        postulacion.pos_es_turbo = True
        postulacion.pos_turbo_solicitado_por_aspirante = True
        postulacion.pos_creditos_turbo_usados = 1
        
        # Determinar horas de respuesta
        if vacante.va_modo_turbo:
            horas_limite = vacante.va_tiempo_respuesta_horas
        else:
            horas_limite = 48  # Default para turbo del aspirante
        
        # Establecer fecha límite
        postulacion.pos_fecha_limite_respuesta = timezone.now() + timedelta(hours=horas_limite)
        postulacion.save()
        
        # Descontar crédito del aspirante
        aspirante.asp_creditos_turbo_disponibles -= 1
        aspirante.asp_creditos_turbo_usados += 1
        aspirante.save()
        
        # Incrementar contador de empresa
        empresa = vacante.va_idEmpresa_fk
        empresa.em_total_postulaciones_turbo += 1
        empresa.save()
        
        # Crear notificación para el aspirante
        from .models import Notificacion
        usuario_aspirante = aspirante.asp_usuario_fk
        Notificacion.objects.create(
            not_usuario_fk=usuario_aspirante,
            not_contenido=f"⚡ Modo Turbo activado para '{vacante.va_titulo}'. Respuesta prioritaria en {horas_limite} horas. Créditos restantes: {aspirante.asp_creditos_turbo_disponibles}",
            not_estado='No leída'
        )
        
        # Crear notificación para la empresa
        usuario_empresa = empresa.em_usuario_fk
        Notificacion.objects.create(
            not_usuario_fk=usuario_empresa,
            not_contenido=f"⚡ {aspirante.asp_nombre} {aspirante.asp_apellido} solicita respuesta TURBO para '{vacante.va_titulo}'",
            not_estado='No leída'
        )
        
        serializer = self.get_serializer(postulacion)
        return Response({
            'message': 'Modo turbo activado exitosamente',
            'creditos_restantes': aspirante.asp_creditos_turbo_disponibles,
            'postulacion': serializer.data
        })
from .models import ExperienciaLaboral, ExperienciaEscolar
from rest_framework import viewsets
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UsuarioSerializer, AspiranteSerializer, EmpresaSerializer, VacanteSerializer, UsuarioRegistroSerializer, ExperienciaLaboralSerializer, ExperienciaEscolarSerializer
# ViewSet para ExperienciaLaboral
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

class ExperienciaLaboralViewSet(viewsets.ModelViewSet):
    queryset = ExperienciaLaboral.objects.all()
    serializer_class = ExperienciaLaboralSerializer
    permission_classes = [IsAuthenticated]

# ViewSet para ExperienciaEscolar
class ExperienciaEscolarViewSet(viewsets.ModelViewSet):
    queryset = ExperienciaEscolar.objects.all()
    serializer_class = ExperienciaEscolarSerializer
    permission_classes = [IsAuthenticated]
from .models import Usuarios, Aspirante, Empresa, Vacante

from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer
class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuarios.objects.all()
    serializer_class = UsuarioSerializer

from rest_framework import filters

class AspiranteViewSet(viewsets.ModelViewSet):
    queryset = Aspirante.objects.all()
    serializer_class = AspiranteSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['asp_usuario_fk__user_nombre']

class EmpresaViewSet(viewsets.ModelViewSet):
    queryset = Empresa.objects.all()
    serializer_class = EmpresaSerializer
    
    # ⚡ ENDPOINTS MODO TURBO
    @action(detail=False, methods=['get'])
    def ranking_turbo(self, request):
        """
        Endpoint: GET /api/empresas/ranking_turbo/
        Devuelve ranking de empresas por score turbo (mejores primero)
        """
        empresas_con_turbo = self.queryset.filter(
            em_total_postulaciones_turbo__gt=0
        ).order_by('-em_score_turbo', '-em_respuestas_a_tiempo')
        
        serializer = self.get_serializer(empresas_con_turbo, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def estadisticas_turbo(self, request, pk=None):
        """
        Endpoint: GET /api/empresas/<id>/estadisticas_turbo/
        Devuelve estadísticas detalladas de modo turbo para una empresa
        """
        empresa = self.get_object()
        
        tasa_respuesta = 0
        if empresa.em_total_postulaciones_turbo > 0:
            tasa_respuesta = (empresa.em_respuestas_a_tiempo / empresa.em_total_postulaciones_turbo) * 100
        
        estadisticas = {
            'em_score_turbo': empresa.em_score_turbo,
            'em_score_turbo_calculado': empresa.calcular_score_turbo(),
            'em_total_postulaciones_turbo': empresa.em_total_postulaciones_turbo,
            'em_respuestas_a_tiempo': empresa.em_respuestas_a_tiempo,
            'respuestas_tarde': empresa.em_total_postulaciones_turbo - empresa.em_respuestas_a_tiempo,
            'tasa_respuesta_porcentaje': round(tasa_respuesta, 1),
            'vacantes_turbo_activas': Vacante.objects.filter(
                va_idEmpresa_fk=empresa,
                va_modo_turbo=True,
                va_estado='Activa'
            ).count()
        }
        
        return Response(estadisticas)


class VacanteViewSet(viewsets.ModelViewSet):
    queryset = Vacante.objects.all()
    serializer_class = VacanteSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['va_titulo', 'va_descripcion', 'va_requisitos']
    
    def get_serializer_class(self):
        # Usar VacanteWriteSerializer para crear/actualizar
        if self.action in ['create', 'update', 'partial_update']:
            from .serializers import VacanteWriteSerializer
            return VacanteWriteSerializer
        # Usar VacanteSerializer para listar/obtener (con datos de empresa)
        return VacanteSerializer
    
    def get_queryset(self):
        queryset = Vacante.objects.all()
        
        # Filtrar por empresa
        empresa = self.request.query_params.get('empresa', None)
        if empresa is not None:
            queryset = queryset.filter(va_idEmpresa_fk=empresa)
        
        # Filtrar por ubicación
        ubicacion = self.request.query_params.get('ubicacion', None)
        if ubicacion is not None:
            queryset = queryset.filter(va_ubicacion__icontains=ubicacion)
        
        # Filtrar por tipo de empleo
        tipo_empleo = self.request.query_params.get('tipo_empleo', None)
        if tipo_empleo is not None:
            queryset = queryset.filter(va_tipo_empleo=tipo_empleo)
        
        # Filtrar por estado (activa/inactiva)
        estado = self.request.query_params.get('estado', None)
        if estado is not None:
            queryset = queryset.filter(va_estado=estado)
        
        # Ordenar por fecha de publicación (más recientes primero)
        queryset = queryset.order_by('-va_fecha_publicacion')
        
        return queryset
    
    # ⚡ ENDPOINTS MODO TURBO
    @action(detail=False, methods=['get'])
    def turbo(self, request):
        """
        Endpoint: GET /api/vacantes/turbo/
        Devuelve solo vacantes con modo turbo activado
        """
        vacantes_turbo = self.queryset.filter(va_modo_turbo=True, va_estado='Activa')
        serializer = self.get_serializer(vacantes_turbo, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def turbo_recomendadas(self, request):
        """
        Endpoint: GET /api/vacantes/turbo_recomendadas/
        Devuelve vacantes turbo de empresas con mejor score
        """
        from django.db.models import F
        
        vacantes_turbo = self.queryset.filter(
            va_modo_turbo=True, 
            va_estado='Activa'
        ).select_related('va_idEmpresa_fk').order_by(
            '-va_idEmpresa_fk__em_score_turbo',
            '-va_fecha_publicacion'
        )
        
        serializer = self.get_serializer(vacantes_turbo, many=True)
        return Response(serializer.data)

class DetalleVacanteViewSet(viewsets.ModelViewSet):
    pass  # Eliminado Detalle_Vacante




class UsuarioRegistroView(APIView):
    def post(self, request):
        serializer = UsuarioRegistroSerializer(data=request.data)
        if serializer.is_valid():
            usuario = serializer.save()
            return Response(
                {"message": "Usuario registrado exitosamente"},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

# ViewSet para Notificaciones
class NotificacionViewSet(viewsets.ModelViewSet):
    queryset = Notificacion.objects.all()
    serializer_class = NotificacionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filtrar notificaciones del usuario actual"""
        user = self.request.user
        queryset = Notificacion.objects.filter(not_usuario_fk=user).order_by('-not_fecha')
        
        # Filtrar por estado (leída/no leída)
        estado = self.request.query_params.get('not_estado', None)
        if estado is not None:
            queryset = queryset.filter(not_estado=estado)
        
        return queryset
    
    @action(detail=True, methods=['post'])
    def marcar_leida(self, request, pk=None):
        """Marcar una notificación como leída"""
        notificacion = self.get_object()
        notificacion.not_estado = 'Leída'
        notificacion.save()
        serializer = self.get_serializer(notificacion)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def marcar_todas_leidas(self, request):
        """Marcar todas las notificaciones del usuario como leídas"""
        user = request.user
        Notificacion.objects.filter(not_usuario_fk=user, not_estado='No leída').update(not_estado='Leída')
        return Response({'message': 'Todas las notificaciones han sido marcadas como leídas'})
    
    @action(detail=False, methods=['get'])
    def no_leidas_count(self, request):
        """Obtener el conteo de notificaciones no leídas"""
        user = request.user
        count = Notificacion.objects.filter(not_usuario_fk=user, not_estado='No leída').count()
        return Response({'count': count})


# Vista para el formulario de contacto
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.core.mail import send_mail
from django.conf import settings

@api_view(['POST'])
@permission_classes([AllowAny])
def contacto_view(request):
    """
    Vista para procesar el formulario de contacto.
    Envía un email con los datos del formulario.
    """
    try:
        nombre = request.data.get('nombre', '')
        email = request.data.get('email', '')
        asunto = request.data.get('asunto', '')
        mensaje = request.data.get('mensaje', '')
        
        # Validar que todos los campos estén presentes
        if not all([nombre, email, asunto, mensaje]):
            return Response(
                {'error': 'Todos los campos son requeridos'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Construir el mensaje del email
        mensaje_email = f"""
Nuevo mensaje de contacto de TurboEmpleo:

Nombre: {nombre}
Email: {email}
Asunto: {asunto}

Mensaje:
{mensaje}
"""
        
        # En desarrollo, imprimir en consola
        print('='*60)
        print('NUEVO MENSAJE DE CONTACTO')
        print('='*60)
        print(mensaje_email)
        print('='*60)
        
        # Intentar enviar email (opcional en desarrollo)
        try:
            # Configurar el email solo si está configurado en settings
            if hasattr(settings, 'EMAIL_HOST') and settings.EMAIL_HOST:
                send_mail(
                    subject=f'Contacto TurboEmpleo: {asunto}',
                    message=mensaje_email,
                    from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@turboempleo.co'),
                    recipient_list=[getattr(settings, 'CONTACT_EMAIL', 'contacto@turboempleo.co')],
                    fail_silently=True,
                )
        except Exception as email_error:
            # Si falla el email, solo lo registramos pero no fallar la petición
            print(f"Advertencia: No se pudo enviar email: {str(email_error)}")
        
        return Response(
            {'message': 'Mensaje enviado con éxito'},
            status=status.HTTP_200_OK
        )
            
    except Exception as e:
        print(f"Error en contacto_view: {str(e)}")
        return Response(
            {'error': 'Error al procesar el mensaje'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )