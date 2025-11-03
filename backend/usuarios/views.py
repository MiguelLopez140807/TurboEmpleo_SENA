from .models import Postulacion
from .serializers import PostulacionSerializer
# ViewSet para Postulacion
from rest_framework import viewsets
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