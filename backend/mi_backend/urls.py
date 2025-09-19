from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from usuarios.views import (
    UsuarioViewSet, AspiranteViewSet, EmpresaViewSet,
    VacanteViewSet, UsuarioRegistroView, MyTokenObtainPairView,
    ExperienciaLaboralViewSet, ExperienciaEscolarViewSet,
    PostulacionViewSet
)

# Crea un enrutador (router)
router = routers.DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)
router.register(r'aspirantes', AspiranteViewSet)
router.register(r'empresas', EmpresaViewSet)

# Agrega estas líneas

router.register(r'vacantes', VacanteViewSet)
router.register(r'experiencia_laboral', ExperienciaLaboralViewSet)
router.register(r'experiencia_escolar', ExperienciaEscolarViewSet)
router.register(r'postulaciones', PostulacionViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/registro/', UsuarioRegistroView.as_view(), name='registro'),
    path('api/usuarios/', include('usuarios.urls')),
    path('api/', include(router.urls)),
    path('api/login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
]

# Servir archivos media en desarrollo
from django.conf import settings
from django.conf.urls.static import static
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)