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
from .models import ExperienciaLaboral, ExperienciaEscolar
from rest_framework import viewsets
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UsuarioSerializer, AspiranteSerializer, EmpresaSerializer, VacanteSerializer, UsuarioRegistroSerializer, ExperienciaLaboralSerializer, ExperienciaEscolarSerializer
# ViewSet para ExperienciaLaboral
from rest_framework import viewsets

class ExperienciaLaboralViewSet(viewsets.ModelViewSet):
    queryset = ExperienciaLaboral.objects.all()
    serializer_class = ExperienciaLaboralSerializer

# ViewSet para ExperienciaEscolar
class ExperienciaEscolarViewSet(viewsets.ModelViewSet):
    queryset = ExperienciaEscolar.objects.all()
    serializer_class = ExperienciaEscolarSerializer
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