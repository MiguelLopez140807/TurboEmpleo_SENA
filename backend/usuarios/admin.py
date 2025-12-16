from django.contrib import admin
from .models import Aspirante, Empresa
from .models import AuditoriaUsuario

# Register your models here.
admin.site.register(Aspirante)
admin.site.register(Empresa)

@admin.register(AuditoriaUsuario)
class AuditoriaUsuarioAdmin(admin.ModelAdmin):
	list_display = ("usuario_afectado", "usuario_accion", "accion", "fecha", "detalle")
	search_fields = ("usuario_afectado__username", "usuario_accion__username", "accion", "detalle")
	list_filter = ("accion", "fecha")