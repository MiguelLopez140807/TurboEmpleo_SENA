# 📚 **DOCUMENTACIÓN DE ENDPOINTS - TurboEmpleo API**

## 🌐 **Base URL**
```
http://127.0.0.1:8000/api/
```

---

## 🔍 **Cómo se generan los endpoints**

Los endpoints de TurboEmpleo se generan automáticamente usando **Django REST Framework Router**:

### **Ubicación en código:**
```python
# Archivo: backend/mi_backend/urls.py

from rest_framework import routers
from usuarios.views import (
    UsuarioViewSet, AspiranteViewSet, EmpresaViewSet,
    VacanteViewSet, PostulacionViewSet, NotificacionViewSet,
    ExperienciaLaboralViewSet, ExperienciaEscolarViewSet
)

# El router genera automáticamente todos los endpoints
router = routers.DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)           # /api/usuarios/
router.register(r'aspirantes', AspiranteViewSet)       # /api/aspirantes/  
router.register(r'empresas', EmpresaViewSet)           # /api/empresas/
router.register(r'vacantes', VacanteViewSet)           # /api/vacantes/
router.register(r'postulaciones', PostulacionViewSet) # /api/postulaciones/
router.register(r'notificaciones', NotificacionViewSet) # /api/notificaciones/
router.register(r'experiencia_laboral', ExperienciaLaboralViewSet)
router.register(r'experiencia_escolar', ExperienciaEscolarViewSet)

urlpatterns = [
    path('api/', include(router.urls)),  # ← AQUÍ se incluyen todos los endpoints
    # ... otros paths manuales
]
```

---

## 📋 **ENDPOINTS AUTOMÁTICOS (Generados por Router)**

Cada `router.register()` crea automáticamente estos 6 endpoints:

### **Patrón estándar:**
```
GET    /api/{recurso}/              # Listar todos
POST   /api/{recurso}/              # Crear nuevo
GET    /api/{recurso}/{id}/         # Obtener uno específico
PUT    /api/{recurso}/{id}/         # Actualizar completo
PATCH  /api/{recurso}/{id}/         # Actualizar parcial
DELETE /api/{recurso}/{id}/         # Eliminar
```

---

## 👥 **1. USUARIOS**

### **Base:** `/api/usuarios/`
- **ViewSet:** `UsuarioViewSet` en `backend/usuarios/views.py`
- **Modelo:** `Usuarios` en `backend/usuarios/models.py`

```http
GET    /api/usuarios/           # Listar usuarios
POST   /api/usuarios/           # Crear usuario
GET    /api/usuarios/5/         # Ver usuario ID 5
PUT    /api/usuarios/5/         # Actualizar usuario ID 5
DELETE /api/usuarios/5/         # Eliminar usuario ID 5
```

---

## 👤 **2. ASPIRANTES**

### **Base:** `/api/aspirantes/`
- **ViewSet:** `AspiranteViewSet` en `backend/usuarios/views.py`
- **Modelo:** `Aspirante` en `backend/usuarios/models.py`

```http
GET    /api/aspirantes/         # Listar aspirantes
POST   /api/aspirantes/         # Crear aspirante
GET    /api/aspirantes/1/       # Ver aspirante ID 1
PUT    /api/aspirantes/1/       # Actualizar aspirante
PATCH  /api/aspirantes/1/       # Actualización parcial
DELETE /api/aspirantes/1/       # Eliminar aspirante
```

**Filtros disponibles:**
- `?asp_usuario_fk=5` - Filtrar por usuario
- `?asp_ciudad=Bogotá` - Filtrar por ciudad

---

## 🏢 **3. EMPRESAS**

### **Base:** `/api/empresas/`
- **ViewSet:** `EmpresaViewSet` en `backend/usuarios/views.py` 
- **Modelo:** `Empresa` en `backend/usuarios/models.py`

```http
GET    /api/empresas/           # Listar empresas
POST   /api/empresas/           # Crear empresa
GET    /api/empresas/2/         # Ver empresa ID 2
PUT    /api/empresas/2/         # Actualizar empresa
DELETE /api/empresas/2/         # Eliminar empresa
```

---

## 💼 **4. VACANTES**

### **Base:** `/api/vacantes/`
- **ViewSet:** `VacanteViewSet` en `backend/usuarios/views.py`
- **Modelo:** `Vacante` en `backend/usuarios/models.py`

```http
GET    /api/vacantes/           # Listar vacantes
POST   /api/vacantes/           # Crear vacante
GET    /api/vacantes/3/         # Ver vacante ID 3
PUT    /api/vacantes/3/         # Actualizar vacante
DELETE /api/vacantes/3/         # Eliminar vacante
```

**Filtros especiales:**
- `?estado=Activa` - Solo vacantes activas
- `?va_idEmpresa_fk=2` - Vacantes de empresa específica

---

## 📤 **5. POSTULACIONES**

### **Base:** `/api/postulaciones/`
- **ViewSet:** `PostulacionViewSet` en `backend/usuarios/views.py`
- **Modelo:** `Postulacion` en `backend/usuarios/models.py`

```http
GET    /api/postulaciones/      # Listar postulaciones
POST   /api/postulaciones/      # Crear postulación
GET    /api/postulaciones/4/    # Ver postulación ID 4
PUT    /api/postulaciones/4/    # Actualizar postulación
DELETE /api/postulaciones/4/    # Eliminar postulación
```

**Filtros específicos:**
- `?pos_aspirante_fk=1` - Postulaciones de aspirante
- `?pos_vacante_fk=3` - Postulaciones a vacante
- `?pos_estado=Pendiente` - Por estado

### **⚡ Endpoints TURBO adicionales:**
```http
GET    /api/postulaciones/turbo/                    # Solo postulaciones turbo
GET    /api/postulaciones/turbo_pendientes/?empresa=2  # Turbo pendientes
POST   /api/postulaciones/4/responder_turbo/        # Responder postulación turbo
```

---

## 🔔 **6. NOTIFICACIONES**

### **Base:** `/api/notificaciones/`
- **ViewSet:** `NotificacionViewSet` en `backend/usuarios/views.py`
- **Modelo:** `Notificacion` en `backend/usuarios/models.py`

```http
GET    /api/notificaciones/     # Listar notificaciones
POST   /api/notificaciones/     # Crear notificación
GET    /api/notificaciones/5/   # Ver notificación ID 5
DELETE /api/notificaciones/5/   # Eliminar notificación
```

### **Endpoints personalizados:**
```http
GET    /api/notificaciones/no_leidas_count/        # Contador no leídas
POST   /api/notificaciones/5/marcar_leida/         # Marcar como leída
POST   /api/notificaciones/marcar_todas_leidas/    # Marcar todas leídas
```

**Filtros:**
- `?not_estado=No leída` - Solo no leídas
- `?not_usuario_fk=3` - De usuario específico

---

## 💼 **7. EXPERIENCIA LABORAL**

### **Base:** `/api/experiencia_laboral/`
- **ViewSet:** `ExperienciaLaboralViewSet` 
- **Modelo:** `ExperienciaLaboral`

```http
GET    /api/experiencia_laboral/     # Listar experiencias
POST   /api/experiencia_laboral/     # Crear experiencia
GET    /api/experiencia_laboral/6/   # Ver experiencia ID 6
PUT    /api/experiencia_laboral/6/   # Actualizar experiencia
DELETE /api/experiencia_laboral/6/   # Eliminar experiencia
```

---

## 🎓 **8. EXPERIENCIA ESCOLAR**

### **Base:** `/api/experiencia_escolar/`
- **ViewSet:** `ExperienciaEscolarViewSet`
- **Modelo:** `ExperienciaEscolar`

```http
GET    /api/experiencia_escolar/     # Listar educación
POST   /api/experiencia_escolar/     # Crear educación
GET    /api/experiencia_escolar/7/   # Ver educación ID 7
PUT    /api/experiencia_escolar/7/   # Actualizar educación
DELETE /api/experiencia_escolar/7/   # Eliminar educación
```

---

## 🔐 **ENDPOINTS MANUALES (No generados por router)**

### **Autenticación:**
```http
POST   /api/login/              # Iniciar sesión (JWT)
POST   /api/token/              # Obtener token
POST   /api/token/refresh/      # Renovar token
POST   /api/registro/           # Registro de usuarios
```

### **Gestión de contraseñas:**
```http
POST   /api/usuarios/password/reset/     # Solicitar reset
POST   /api/usuarios/password/change/    # Cambiar contraseña
POST   /api/usuarios/password/confirm/   # Confirmar reset
DELETE /api/usuarios/delete_account/     # Eliminar cuenta
```

### **Activación de cuenta:**
```http
GET    /api/usuarios/activate/<token>/   # Activar cuenta
POST   /api/usuarios/resend_activation/  # Reenviar activación
```

---

## 🧪 **CÓMO PROBAR LOS ENDPOINTS**

### **1. Obtener un token:**
```bash
curl -X POST http://127.0.0.1:8000/api/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "user_nombre": "tu_usuario",
    "password": "tu_password"
  }'
```

### **2. Usar el token:**
```bash
curl -X GET http://127.0.0.1:8000/api/aspirantes/ \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

### **3. Navegador (Django REST API):**
Visita: `http://127.0.0.1:8000/api/` para ver la interfaz web interactiva

---

## ⚠️ **NOTAS IMPORTANTES**

1. **Todos los endpoints requieren autenticación** excepto login y registro
2. **Los filtros se pasan como query parameters:** `?campo=valor`
3. **Las relaciones se manejan por ID:** `pos_aspirante_fk=1`
4. **Los archivos se envían como FormData** en requests POST/PUT
5. **Los endpoints de router son automáticos** - no están en urls.py manualmente

---

## 🔧 **UBICACIONES EN EL CÓDIGO**

| Componente | Archivo | Responsabilidad |
|------------|---------|-----------------|
| **Router** | `backend/mi_backend/urls.py` | Genera endpoints automáticos |
| **ViewSets** | `backend/usuarios/views.py` | Lógica de cada endpoint |
| **Modelos** | `backend/usuarios/models.py` | Estructura de datos |
| **Serializers** | `backend/usuarios/serializers.py` | Conversión JSON ↔ Model |
| **URLs manuales** | `backend/usuarios/urls.py` | Endpoints personalizados |

Esta es la estructura completa de tu API REST TurboEmpleo! 🚀