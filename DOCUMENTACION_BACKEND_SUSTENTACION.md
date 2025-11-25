# 📚 DOCUMENTACIÓN BACKEND - TURBOEMPLEO
## Guía de Sustentación del Proyecto

---

## 📋 ÍNDICE
1. [Estructura General del Proyecto](#estructura-general)
2. [Arquitectura y Patrón de Diseño](#arquitectura)
3. [Explicación Detallada de Carpetas y Archivos](#carpetas-y-archivos)
4. [Ejemplo de Funcionalidad: Sistema de Postulaciones](#funcionalidad-postulaciones)
5. [¿Por qué Django REST Framework sobre MVC tradicional?](#porque-drf)

---

## 🏗️ ESTRUCTURA GENERAL DEL PROYECTO {#estructura-general}

```
backend/
├── manage.py                    # Comando principal de Django
├── requirements.txt             # Dependencias del proyecto
├── media/                       # Archivos subidos por usuarios
│   ├── curriculums/            # CVs de aspirantes
│   ├── fotos_aspirantes/       # Fotos de perfil
│   ├── logos_empresas/         # Logos de empresas
│   └── empresas_docs/          # Documentos de empresas
├── mi_backend/                  # Configuración principal del proyecto
│   ├── settings.py             # Configuración general
│   ├── urls.py                 # Rutas principales
│   ├── wsgi.py                 # Servidor de producción
│   └── asgi.py                 # Servidor asíncrono
└── usuarios/                    # Aplicación principal
    ├── models.py               # Modelos de base de datos
    ├── serializers.py          # Serialización de datos
    ├── views.py                # Lógica de negocio (ViewSets)
    ├── urls.py                 # Rutas de la app
    ├── signals.py              # Eventos automáticos
    ├── admin.py                # Panel administrativo
    ├── activation_views.py     # Activación de cuentas
    ├── password_views.py       # Cambio de contraseña
    ├── password_reset_views.py # Recuperación de contraseña
    └── migrations/             # Cambios en la BD
```

---

## 🎯 ARQUITECTURA Y PATRÓN DE DISEÑO {#arquitectura}

### **Patrón Utilizado: MTV (Model-Template-View) + REST API**

TurboEmpleo utiliza **Django REST Framework (DRF)**, que implementa una arquitectura **MTV + API REST**, NO el MVC tradicional.

### 📊 **Comparación: MTV vs MVC**

| Aspecto | MVC (Tradicional) | MTV (Django + DRF) - NUESTRO PROYECTO |
|---------|-------------------|---------------------------------------|
| **Model** | Lógica de datos | ✅ **models.py** - Igual función |
| **View** | Presentación (HTML) | ❌ No aplica - usamos React (frontend separado) |
| **Controller** | Lógica de negocio | ✅ **views.py** - Pero aquí se llama "View" |
| **Template** | Renderizado HTML | ❌ No aplica - API REST devuelve JSON |
| **Serializer** | No existe | ✅ **serializers.py** - Convierte datos a JSON |
| **ViewSet** | No existe | ✅ Combina CRUD completo en una clase |

### 🔍 **Explicación detallada: ¿Por qué NO usamos Templates?**

#### **MVC Tradicional (CON Templates):**

En un MVC tradicional, el **servidor genera HTML completo**:

```python
# Django tradicional - CON template
def ver_postulaciones(request):
    postulaciones = Postulacion.objects.all()
    
    # El servidor renderiza HTML
    return render(request, 'postulaciones.html', {
        'postulaciones': postulaciones
    })
```

**Template HTML (postulaciones.html):**
```html
<html>
<body>
    <h1>Lista de Postulaciones</h1>
    <table>
        {% for p in postulaciones %}
        <tr>
            <td>{{ p.aspirante }}</td>
            <td>{{ p.vacante }}</td>
            <td>{{ p.estado }}</td>
        </tr>
        {% endfor %}
    </table>
</body>
</html>
```

**Lo que recibe el navegador:**
```html
<!-- HTML completo generado por el servidor -->
<html>
<body>
    <h1>Lista de Postulaciones</h1>
    <table>
        <tr><td>Juan Pérez</td><td>Desarrollador</td><td>Postulado</td></tr>
        <tr><td>María García</td><td>Diseñador</td><td>En revisión</td></tr>
    </table>
</body>
</html>
```

**Problemas:**
- ❌ Frontend y backend acoplados
- ❌ No puedes tener app móvil fácilmente
- ❌ Cada cambio visual requiere tocar el backend
- ❌ Difícil trabajar en equipo (frontend y backend juntos)

---

#### **API REST + React (SIN Templates) - NUESTRO PROYECTO:**

En TurboEmpleo, el backend **NO genera HTML**, solo **JSON**:

```python
# Django REST Framework - SIN template
class PostulacionViewSet(viewsets.ModelViewSet):
    queryset = Postulacion.objects.all()
    serializer_class = PostulacionSerializer
    
    # DRF automáticamente devuelve JSON, NO HTML
```

**Lo que recibe el navegador (JSON puro):**
```json
[
    {
        "id": 1,
        "pos_aspirante_fk": {
            "asp_nombre": "Juan",
            "asp_apellido": "Pérez"
        },
        "pos_vacante_fk": {
            "va_nombreVacante": "Desarrollador Backend"
        },
        "pos_estado": "Postulado",
        "pos_fechaPostulacion": "2025-11-08T14:30:00Z"
    },
    {
        "id": 2,
        "pos_aspirante_fk": {
            "asp_nombre": "María",
            "asp_apellido": "García"
        },
        "pos_vacante_fk": {
            "va_nombreVacante": "Diseñador UI/UX"
        },
        "pos_estado": "En revisión",
        "pos_fechaPostulacion": "2025-11-07T10:15:00Z"
    }
]
```

**¿Quién crea el HTML entonces?** → **React (Frontend)**

```javascript
// Frontend: frontend/src/pages/aspirantes/PostulacionesAspirante.jsx
const PostulacionesAspirante = () => {
    const [postulaciones, setPostulaciones] = useState([]);
    
    useEffect(() => {
        // 1. Obtener JSON del backend
        fetch('http://127.0.0.1:8000/api/postulaciones/', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => setPostulaciones(data));
    }, []);
    
    // 2. React convierte el JSON a HTML
    return (
        <div className="container">
            <h1>Mis Postulaciones</h1>
            <table className="table">
                {postulaciones.map(p => (
                    <tr key={p.id}>
                        <td>{p.pos_aspirante_fk.asp_nombre}</td>
                        <td>{p.pos_vacante_fk.va_nombreVacante}</td>
                        <td>
                            <span className={`badge ${getEstadoColor(p.pos_estado)}`}>
                                {p.pos_estado}
                            </span>
                        </td>
                    </tr>
                ))}
            </table>
        </div>
    );
};
```

**Ventajas:**
- ✅ **Separación total:** Backend solo maneja datos, frontend solo maneja UI
- ✅ **Reutilizable:** La misma API sirve para web, móvil, desktop
- ✅ **Equipos independientes:** Backend y frontend trabajan en paralelo
- ✅ **Escalabilidad:** Puedes cambiar tecnologías sin tocar la otra parte
- ✅ **Mejor experiencia de usuario:** React actualiza sin recargar página

---

#### **Comparación visual:**

**MVC Tradicional (CON Template):**
```
┌──────────────────────────────────────┐
│         SERVIDOR (Backend)           │
│                                      │
│  1. Recibe petición                  │
│  2. Consulta base de datos           │
│  3. GENERA HTML COMPLETO             │ ← Backend hace todo
│  4. Envía HTML al navegador          │
│                                      │
│  Todo en un solo lugar               │
└──────────────────┬───────────────────┘
                   │
                   ▼
          ┌────────────────┐
          │   Navegador    │
          │  Muestra HTML  │
          │   Ya hecho     │
          └────────────────┘
```

**API REST + React (SIN Template) - NUESTRO PROYECTO:**
```
┌──────────────────────────────┐       ┌──────────────────────────────┐
│    BACKEND (Django + DRF)    │       │    FRONTEND (React)          │
│                              │       │                              │
│  1. Recibe petición          │       │  1. Usuario visita página    │
│  2. Consulta base de datos   │       │  2. React pide datos (JSON)  │
│  3. Devuelve JSON            │◄─────►│  3. React recibe JSON        │
│                              │       │  4. React GENERA HTML        │
│  Solo datos, NO HTML         │       │  5. Usuario ve página bonita │
│                              │       │                              │
└──────────────────────────────┘       └──────────────────────────────┘
       Puerto 8000                            Puerto 5173
```

---

### 🎤 **Cómo explicarlo en la sustentación:**

**Explicación corta (1 minuto):**
> "En MVC tradicional, el servidor genera HTML completo usando templates. En nuestro proyecto NO usamos templates porque nuestra API REST solo devuelve datos en JSON. El frontend React toma ese JSON y genera el HTML. Esto nos da separación total entre backend y frontend, permitiendo escalabilidad y reutilización de la API."

**Explicación técnica (2-3 minutos):**
> "Permítanme mostrarles la diferencia. En Django tradicional, existiría una carpeta `templates/` con archivos HTML que el servidor renderizaría. [Mostrar carpeta backend/]. Como pueden ver, NO tenemos carpeta templates. ¿Por qué? Porque nuestra API devuelve JSON.
> 
> [Abrir navegador → http://127.0.0.1:8000/api/postulaciones/]
> 
> Aquí ven JSON puro, no HTML. Este JSON lo consume nuestro frontend React.
> 
> [Abrir frontend/src/pages/aspirantes/PostulacionesAspirante.jsx]
> 
> Aquí en React, hacemos fetch del JSON y lo convertimos a HTML con componentes. Esta separación nos permite:
> 1. Trabajar en equipo (backend y frontend separados)
> 2. Reutilizar la API para web y móvil
> 3. Cambiar tecnologías independientemente"

**Demostración práctica:**
1. Abre el navegador en `http://127.0.0.1:8000/api/postulaciones/`
2. Muestra el JSON crudo
3. Abre la aplicación React en `http://localhost:5173/aspirantes/postulaciones`
4. Muestra cómo el mismo JSON se ve como tabla bonita
5. Menciona: "Esto es React convirtiendo JSON a HTML, no el servidor"

### 🔑 **Componentes Clave de Nuestra Arquitectura**

```
┌─────────────────────────────────────────────────────┐
│              FRONTEND (React)                        │
│         http://localhost:5173                        │
└──────────────────┬──────────────────────────────────┘
                   │ HTTP Requests (JSON)
                   │ GET, POST, PUT, DELETE
                   ▼
┌─────────────────────────────────────────────────────┐
│           DJANGO REST FRAMEWORK API                  │
│         http://127.0.0.1:8000/api/                  │
├─────────────────────────────────────────────────────┤
│  urls.py          → Define rutas (endpoints)         │
│  views.py         → Lógica de negocio (ViewSets)     │
│  serializers.py   → Convierte Model ↔ JSON          │
│  models.py        → Estructura de datos (BD)         │
│  signals.py       → Eventos automáticos              │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│            BASE DE DATOS (MySQL)                     │
│         Servidor: localhost:3306                     │
│         Base de datos: turboempleo                   │
└─────────────────────────────────────────────────────┘
```

---

## 📁 CARPETAS Y ARCHIVOS CLAVE {#carpetas-y-archivos}

### **1. Raíz del Backend (`/backend`)**

#### 📄 **manage.py**
```python
# Archivo principal para ejecutar comandos de Django
```
**Propósito:** CLI de Django para ejecutar el servidor, migraciones, crear superusuario, etc.

**Comandos comunes:**
```bash
python manage.py runserver        # Inicia el servidor
python manage.py migrate          # Aplica cambios a la BD
python manage.py makemigrations   # Crea archivos de migración
python manage.py createsuperuser  # Crea administrador
```

#### 🗄️ **Base de Datos MySQL**
**Propósito:** Sistema de gestión de base de datos relacional. Almacena todas las tablas del proyecto en el servidor MySQL:
- Base de datos: `turboempleo`
- Servidor: `localhost:3306`
- Usuario: `root`

**Tablas principales:**
- `usuarios_aspirante` - Datos de aspirantes
- `usuarios_empresa` - Datos de empresas
- `usuarios_vacante` - Ofertas de empleo
- `usuarios_postulacion` - Aplicaciones a vacantes
- `usuarios_notificacion` - Sistema de notificaciones
- `usuarios_experiencialaboral` - Experiencia laboral
- `usuarios_experienciaescolar` - Formación académica

**Ventajas de MySQL sobre SQLite:**
- Mayor capacidad de almacenamiento
- Concurrencia de usuarios simultáneos
- Mejor rendimiento para producción
- Soporta múltiples conexiones
- Preparado para escalabilidad

#### 📋 **requirements.txt**
```
Django==4.2.7
djangorestframework==3.14.0
djangorestframework-simplejwt==5.3.0
django-cors-headers==4.3.1
Pillow==10.1.0
mysqlclient==2.2.0
```
**Propósito:** Lista de dependencias del proyecto. Se instala con:
```bash
pip install -r requirements.txt
```

**Dependencias clave:**
- `Django` - Framework web principal
- `djangorestframework` - API REST
- `djangorestframework-simplejwt` - Autenticación JWT
- `django-cors-headers` - Permitir peticiones desde React
- `Pillow` - Procesamiento de imágenes
- `mysqlclient` - Conector para base de datos MySQL

#### 📂 **media/**
**Propósito:** Almacena archivos subidos por usuarios.
- `curriculums/` → PDFs de hojas de vida
- `fotos_aspirantes/` → Fotos de perfil de aspirantes
- `logos_empresas/` → Logos de empresas
- `empresas_docs/` → Documentos corporativos

**Configuración en `settings.py`:**
```python
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
```

---

### **2. Carpeta `mi_backend/` (Configuración del Proyecto)**

#### ⚙️ **settings.py**
**Propósito:** Configuración global del proyecto Django.

**Secciones importantes:**

1. **Apps Instaladas:**
```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'rest_framework',           # Django REST Framework
    'rest_framework_simplejwt', # Autenticación JWT
    'corsheaders',              # CORS para React
    'usuarios',                 # Nuestra aplicación
]
```

2. **Middleware:**
```python
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Permite peticiones desde React
    # ... otros middleware
]
```

3. **Base de Datos MySQL:**
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'turboempleo',          # Nombre de la base de datos
        'USER': 'root',                 # Usuario de MySQL
        'PASSWORD': 'turboempleo10',    # Contraseña
        'HOST': 'localhost',            # Servidor local
        'PORT': '3306',                 # Puerto por defecto de MySQL
    }
}
```

4. **CORS Configuration:**
```python
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',  # Frontend React
]
```

5. **Autenticación JWT:**
```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
}
```

6. **Configuración de Email:**
```python
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'turboempleo@gmail.com'
```

#### 🛣️ **urls.py** (Principal)
**Propósito:** Rutas principales del proyecto.

```python
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers

# Router automático de DRF
router = routers.DefaultRouter()
router.register(r'aspirantes', AspiranteViewSet)
router.register(r'empresas', EmpresaViewSet)
router.register(r'vacantes', VacanteViewSet)
router.register(r'postulaciones', PostulacionViewSet)
router.register(r'notificaciones', NotificacionViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),           # /api/aspirantes/, /api/vacantes/, etc.
    path('api/usuarios/', include('usuarios.urls')), # Rutas personalizadas
    path('api/login/', MyTokenObtainPairView.as_view()),
]
```

**Endpoints generados automáticamente:**
- `GET    /api/postulaciones/` → Listar todas
- `POST   /api/postulaciones/` → Crear nueva
- `GET    /api/postulaciones/1/` → Ver detalle
- `PUT    /api/postulaciones/1/` → Actualizar
- `DELETE /api/postulaciones/1/` → Eliminar

#### 🚀 **wsgi.py y asgi.py**
- **wsgi.py:** Servidor de producción síncrono (Gunicorn, uWSGI)
- **asgi.py:** Servidor asíncrono (Daphne, Uvicorn) - para WebSockets

---

### **3. Carpeta `usuarios/` (Aplicación Principal)**

#### 📊 **models.py** - MODELOS DE DATOS

**Propósito:** Define la estructura de la base de datos usando clases Python.

**Ejemplo del modelo `Postulacion`:**
```python
class Postulacion(models.Model):
    # Claves foráneas (relaciones)
    pos_aspirante_fk = models.ForeignKey(
        'Aspirante', 
        on_delete=models.CASCADE
    )
    pos_vacante_fk = models.ForeignKey(
        'Vacante', 
        on_delete=models.CASCADE
    )
    
    # Campos
    pos_fechaPostulacion = models.DateTimeField(auto_now_add=True)
    pos_estado = models.CharField(
        max_length=20,
        choices=[
            ('Postulado', 'Postulado'),
            ('En revisión', 'En revisión'),
            ('Preseleccionado', 'Preseleccionado'),
            ('Rechazado', 'Rechazado'),
            ('Contratado', 'Contratado'),
        ],
        default='Postulado'
    )
```

**Otros modelos importantes:**
- `Usuarios` (autenticación)
- `Aspirante` (datos del candidato)
- `Empresa` (datos de la empresa)
- `Vacante` (ofertas de empleo)
- `ExperienciaLaboral` y `ExperienciaEscolar`
- `Notificacion` (sistema de alertas)

**Comando para crear tablas en MySQL:**
```bash
python manage.py makemigrations  # Detecta cambios en models.py
python manage.py migrate         # Ejecuta SQL y crea/actualiza tablas en MySQL
```

**Lo que hace internamente:**
```sql
-- Django ejecuta automáticamente en MySQL:
CREATE TABLE usuarios_postulacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pos_fechaPostulacion DATETIME,
    pos_estado VARCHAR(20),
    pos_aspirante_fk_id INT,
    pos_vacante_fk_id INT,
    FOREIGN KEY (pos_aspirante_fk_id) REFERENCES usuarios_aspirante(id),
    FOREIGN KEY (pos_vacante_fk_id) REFERENCES usuarios_vacante(id)
);
```

#### 🔄 **serializers.py** - SERIALIZACIÓN DE DATOS

**Propósito:** Convierte objetos de Python (models) a JSON y viceversa.

**Ejemplo:**
```python
class PostulacionSerializer(serializers.ModelSerializer):
    # Serializa relaciones anidadas
    pos_aspirante_fk = AspiranteSerializer(read_only=True)
    pos_vacante_fk = VacanteSerializer(read_only=True)
    
    class Meta:
        model = Postulacion
        fields = '__all__'  # Todos los campos

# Para crear/actualizar (sin datos anidados)
class PostulacionWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Postulacion
        fields = '__all__'
    
    def validate(self, data):
        # Validación personalizada
        aspirante = data.get('pos_aspirante_fk')
        vacante = data.get('pos_vacante_fk')
        
        # Verificar si ya existe postulación
        if Postulacion.objects.filter(
            pos_aspirante_fk=aspirante,
            pos_vacante_fk=vacante
        ).exists():
            raise serializers.ValidationError(
                "Ya te has postulado a esta vacante"
            )
        
        return data
```

**¿Qué hace un serializer?**
```
Python Object → JSON (para enviar al frontend)
{
  id: 1,
  pos_estado: "Postulado",
  pos_aspirante_fk: {...},
  pos_vacante_fk: {...}
}

JSON → Python Object (al recibir del frontend)
Postulacion(id=1, pos_estado="Postulado", ...)
```

#### 🎮 **views.py** - LÓGICA DE NEGOCIO (ViewSets)

**Propósito:** Contiene la lógica de negocio y manejo de peticiones HTTP.

**ViewSet completo de ejemplo:**
```python
class PostulacionViewSet(viewsets.ModelViewSet):
    queryset = Postulacion.objects.all()
    
    def get_serializer_class(self):
        # Usar serializer diferente según la acción
        if self.action in ['create', 'update', 'partial_update']:
            return PostulacionWriteSerializer
        return PostulacionSerializer
    
    def get_queryset(self):
        queryset = Postulacion.objects.all()
        
        # Filtros dinámicos desde URL
        # Ejemplo: /api/postulaciones/?pos_aspirante_fk=5
        aspirante = self.request.query_params.get('pos_aspirante_fk')
        if aspirante:
            queryset = queryset.filter(pos_aspirante_fk=aspirante)
        
        # Ordenar por más recientes
        return queryset.order_by('-pos_fechaPostulacion')
```

**¿Qué operaciones genera automáticamente?**
- `list()` → GET /api/postulaciones/
- `create()` → POST /api/postulaciones/
- `retrieve()` → GET /api/postulaciones/1/
- `update()` → PUT /api/postulaciones/1/
- `partial_update()` → PATCH /api/postulaciones/1/
- `destroy()` → DELETE /api/postulaciones/1/

#### 🔔 **signals.py** - EVENTOS AUTOMÁTICOS

**Propósito:** Ejecuta código automáticamente cuando ocurren ciertos eventos.

**Ejemplo: Crear notificación al postularse**
```python
from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=Postulacion)
def crear_notificacion_nueva_postulacion(sender, instance, created, **kwargs):
    if created:  # Solo cuando se crea (no al actualizar)
        # Obtener la empresa de la vacante
        empresa = instance.pos_vacante_fk.va_idEmpresa_fk
        
        # Crear notificación para la empresa
        Notificacion.objects.create(
            not_usuario_fk=empresa.em_usuario_fk,
            not_tipo='Postulación',
            not_titulo='Nueva postulación',
            not_mensaje=f'{instance.pos_aspirante_fk.asp_nombre} se ha postulado a {instance.pos_vacante_fk.va_nombreVacante}',
            not_estado='No leída'
        )
```

**Eventos disponibles:**
- `post_save` → Después de guardar
- `pre_save` → Antes de guardar
- `post_delete` → Después de eliminar
- `pre_delete` → Antes de eliminar

#### 🛣️ **urls.py** (De la app)

**Propósito:** Rutas específicas de la aplicación.

```python
urlpatterns = [
    path('registro/', UsuarioRegistroView.as_view()),
    path('cambiar-password/', ChangePasswordView.as_view()),
    path('activar-cuenta/<uidb64>/<token>/', ActivateAccountView.as_view()),
    path('password-reset/', PasswordResetRequestView.as_view()),
    path('contacto/', contacto_view),
]
```

#### 🔐 **Archivos de Autenticación**

1. **activation_views.py** → Activación de cuenta por email
2. **password_views.py** → Cambio de contraseña
3. **password_reset_views.py** → Recuperación de contraseña

#### 🗄️ **migrations/**
**Propósito:** Historial de cambios en la base de datos.

Cada archivo representa una migración:
```
0001_initial.py              # Creación inicial de tablas
0002_usuarios_failed_login.py # Agregar campo de intentos fallidos
0003_vacante_va_beneficios.py # Agregar campo beneficios
```

---

## 🎯 EJEMPLO DE FUNCIONALIDAD: SISTEMA DE POSTULACIONES {#funcionalidad-postulaciones}

### **FLUJO COMPLETO: Desde que un aspirante se postula hasta que la empresa recibe notificación**

#### **1️⃣ FRONTEND - El aspirante hace clic en "Postularse"**

```javascript
// frontend/src/pages/aspirantes/DetalleVacante.jsx
const handlePostular = async () => {
    const response = await fetch('http://127.0.0.1:8000/api/postulaciones/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            pos_aspirante_fk: aspiranteId,
            pos_vacante_fk: vacanteId,
            pos_estado: 'Postulado'
        })
    });
};
```

#### **2️⃣ BACKEND - La petición llega al ViewSet**

```python
# backend/usuarios/views.py

class PostulacionViewSet(viewsets.ModelViewSet):
    queryset = Postulacion.objects.all()
    
    def create(self, request, *args, **kwargs):
        # 1. DRF llama automáticamente al serializer
        serializer = self.get_serializer(data=request.data)
        
        # 2. Validación
        serializer.is_valid(raise_exception=True)
        # Aquí se ejecuta el método validate() del serializer
        # que verifica si ya existe la postulación
        
        # 3. Guardar en base de datos
        self.perform_create(serializer)
        
        # 4. Retornar respuesta
        return Response(serializer.data, status=201)
```

#### **3️⃣ SERIALIZER - Validación de datos**

```python
# backend/usuarios/serializers.py

class PostulacionWriteSerializer(serializers.ModelSerializer):
    def validate(self, data):
        aspirante = data.get('pos_aspirante_fk')
        vacante = data.get('pos_vacante_fk')
        
        # ¿Ya se postuló antes?
        if Postulacion.objects.filter(
            pos_aspirante_fk=aspirante,
            pos_vacante_fk=vacante
        ).exists():
            raise serializers.ValidationError(
                "Ya te has postulado a esta vacante"
            )
        
        return data
```

#### **4️⃣ MODEL - Se guarda en la base de datos MySQL**

```python
# backend/usuarios/models.py

class Postulacion(models.Model):
    pos_aspirante_fk = models.ForeignKey('Aspirante', on_delete=models.CASCADE)
    pos_vacante_fk = models.ForeignKey('Vacante', on_delete=models.CASCADE)
    pos_fechaPostulacion = models.DateTimeField(auto_now_add=True)
    pos_estado = models.CharField(max_length=20, default='Postulado')

# Al ejecutar serializer.save() se crea el registro en MySQL
```

**Django ejecuta en MySQL:**
```sql
INSERT INTO usuarios_postulacion 
(pos_aspirante_fk_id, pos_vacante_fk_id, pos_fechaPostulacion, pos_estado)
VALUES (5, 12, '2025-11-08 14:30:00', 'Postulado');
```

#### **5️⃣ SIGNAL - Evento automático se dispara**

```python
# backend/usuarios/signals.py

@receiver(post_save, sender=Postulacion)
def crear_notificacion_nueva_postulacion(sender, instance, created, **kwargs):
    if created:  # Solo si es nueva postulación
        # Obtener datos relacionados
        vacante = instance.pos_vacante_fk
        empresa = vacante.va_idEmpresa_fk
        aspirante = instance.pos_aspirante_fk
        
        # Crear notificación automáticamente
        Notificacion.objects.create(
            not_usuario_fk=empresa.em_usuario_fk,
            not_tipo='Postulación',
            not_titulo='Nueva postulación recibida',
            not_mensaje=f'{aspirante.asp_nombre} {aspirante.asp_apellido} se ha postulado a {vacante.va_nombreVacante}',
            not_estado='No leída',
            not_url=f'/empresas/postulaciones'
        )
```

#### **6️⃣ FRONTEND - La empresa ve la notificación**

```javascript
// frontend/src/components/NotificationBell.jsx

useEffect(() => {
    // Consultar notificaciones cada 30 segundos
    const interval = setInterval(() => {
        fetch('http://127.0.0.1:8000/api/notificaciones/no_leidas_count/', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => setUnreadCount(data.count));
    }, 30000);
}, []);
```

### **📊 DIAGRAMA DE FLUJO COMPLETO**

```
┌──────────────────────────────────────────────────────────┐
│ 1. FRONTEND (React)                                      │
│    Usuario hace clic en "Postularse"                     │
│    ↓                                                      │
│    POST /api/postulaciones/                              │
│    Body: { pos_aspirante_fk: 5, pos_vacante_fk: 12 }    │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│ 2. URLS (mi_backend/urls.py)                            │
│    Ruta: /api/ → router.urls                            │
│    Router busca: postulaciones/ → PostulacionViewSet     │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│ 3. VIEWSET (usuarios/views.py)                          │
│    PostulacionViewSet.create()                           │
│    ↓                                                      │
│    - Recibe request.data                                 │
│    - Llama al serializer                                 │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│ 4. SERIALIZER (usuarios/serializers.py)                 │
│    PostulacionWriteSerializer                            │
│    ↓                                                      │
│    - validate(): Verifica duplicados                     │
│    - is_valid(): Valida campos requeridos               │
│    - save(): Guarda en BD                               │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│ 5. MODEL (usuarios/models.py)                           │
│    Postulacion.objects.create(...)                       │
│    ↓                                                      │
│    Django ORM ejecuta en MySQL:                          │
│    INSERT INTO usuarios_postulacion                      │
│    (pos_aspirante_fk_id, pos_vacante_fk_id,             │
│     pos_fechaPostulacion, pos_estado)                    │
│    VALUES (5, 12, '2025-11-08 14:30:00', 'Postulado')   │
│    Registro guardado en MySQL (turboempleo)              │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│ 6. SIGNAL (usuarios/signals.py)                         │
│    @receiver(post_save, sender=Postulacion)              │
│    ↓                                                      │
│    Detecta que se creó nueva postulación                 │
│    Crea notificación para la empresa                     │
│    Django ORM ejecuta en MySQL:                          │
│    INSERT INTO usuarios_notificacion                     │
│    (not_usuario_fk_id, not_tipo, not_titulo,            │
│     not_mensaje, not_estado, not_fecha)                  │
│    VALUES (...)                                          │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│ 7. RESPUESTA AL FRONTEND                                 │
│    Status: 201 Created                                   │
│    Body: {                                               │
│        id: 45,                                           │
│        pos_aspirante_fk: {...},                          │
│        pos_vacante_fk: {...},                            │
│        pos_estado: "Postulado",                          │
│        pos_fechaPostulacion: "2025-11-08T..."           │
│    }                                                     │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│ 8. FRONTEND MUESTRA CONFIRMACIÓN                        │
│    ✓ "Te has postulado exitosamente"                    │
│                                                          │
│ 9. EMPRESA RECIBE NOTIFICACIÓN (campana roja)           │
│    🔔 "Nueva postulación recibida"                      │
└──────────────────────────────────────────────────────────┘
```

### **🔍 PUNTOS CLAVE PARA LA SUSTENTACIÓN**

1. **Separación de responsabilidades:**
   - Model → Estructura de datos
   - Serializer → Validación y conversión
   - ViewSet → Lógica de negocio
   - Signal → Efectos secundarios automáticos

2. **Validación en múltiples niveles:**
   - Django: Validación de tipos de datos
   - Serializer: Validación de negocio (duplicados)
   - Model: Constraints de BD

3. **Código reutilizable:**
   - Un ViewSet maneja las 6 operaciones CRUD
   - Serializers se pueden anidar
   - Signals se ejecutan automáticamente

4. **Escalabilidad:**
   - Fácil agregar más endpoints
   - Filtros dinámicos desde URL
   - Permisos granulares por ViewSet

---

## 🆚 ¿POR QUÉ DJANGO REST FRAMEWORK SOBRE MVC TRADICIONAL? {#porque-drf}

### **RESPUESTA PARA EL PROFESOR:**

> "Elegimos Django REST Framework sobre un MVC tradicional por las siguientes razones técnicas y arquitectónicas fundamentales para nuestro proyecto:"

### **1️⃣ SEPARACIÓN FRONTEND-BACKEND (Arquitectura Moderna)**

**MVC Tradicional (Monolítico):**
```
┌───────────────────────────────┐
│   DJANGO (Monolítico)         │
│                               │
│  Models ──→ Views ──→ Templates │
│    ↓          ↓          ↓    │
│   BD      Lógica      HTML    │
│                               │
│  TODO EN UN SOLO SERVIDOR     │
└───────────────────────────────┘
```
- El backend genera HTML
- Frontend y backend están acoplados
- Difícil escalar y mantener
- No permite apps móviles fácilmente

**Nuestra Arquitectura (API REST + SPA):**
```
┌──────────────────┐         ┌──────────────────┐
│   BACKEND (API)  │◄───────►│  FRONTEND (React)│
│                  │  JSON   │                  │
│  Django + DRF    │         │   React + Vite   │
│  Puerto 8000     │         │   Puerto 5173    │
└──────────────────┘         └──────────────────┘
        ↕                             ↕
┌──────────────────┐         ┌──────────────────┐
│   Base de Datos  │         │  Navegador Web   │
│  MySQL (3306)    │         │  Chrome/Firefox  │
│  DB: turboempleo │         │                  │
└──────────────────┘         └──────────────────┘
```

**Ventajas:**
✅ **Desacoplamiento total** - Frontend y backend independientes
✅ **Equipos separados** - Desarrollo paralelo
✅ **Tecnologías diferentes** - React, Vue, Angular, Mobile
✅ **Escalabilidad** - Escalar frontend y backend por separado
✅ **API reutilizable** - Misma API para web, móvil, desktop

### **2️⃣ DJANGO REST FRAMEWORK: POTENCIA Y PRODUCTIVIDAD**

**Lo que obtenemos con DRF que MVC tradicional NO tiene:**

| Característica | MVC Tradicional | Django REST Framework |
|----------------|-----------------|----------------------|
| **Serialización automática** | ❌ Manual | ✅ Automática (JSON) |
| **ViewSets** | ❌ No existe | ✅ CRUD completo en 10 líneas |
| **Browsable API** | ❌ No | ✅ Interfaz de pruebas incluida |
| **Autenticación JWT** | ❌ Sesiones (cookies) | ✅ Tokens stateless |
| **Paginación** | ❌ Manual | ✅ Automática |
| **Filtros dinámicos** | ❌ Complicado | ✅ `?pos_estado=Postulado` |
| **Validación** | ❌ Básica | ✅ Multinivel (model + serializer) |
| **Throttling** | ❌ Manual | ✅ Rate limiting integrado |
| **Versionado de API** | ❌ No | ✅ `/api/v1/`, `/api/v2/` |
| **CORS** | ❌ Problema común | ✅ `django-cors-headers` |

### **3️⃣ EJEMPLO PRÁCTICO: Código Comparado**

#### **MVC Tradicional (Django sin DRF):**
```python
# views.py - Enfoque tradicional
def listar_postulaciones(request):
    postulaciones = Postulacion.objects.all()
    data = []
    for p in postulaciones:
        data.append({
            'id': p.id,
            'aspirante': p.pos_aspirante_fk.asp_nombre,
            'vacante': p.pos_vacante_fk.va_nombreVacante,
            'estado': p.pos_estado,
            'fecha': str(p.pos_fechaPostulacion),
        })
    return JsonResponse({'data': data})

def crear_postulacion(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        # Validación manual
        if not data.get('pos_aspirante_fk'):
            return JsonResponse({'error': 'Falta aspirante'}, status=400)
        if not data.get('pos_vacante_fk'):
            return JsonResponse({'error': 'Falta vacante'}, status=400)
        
        # Crear manualmente
        postulacion = Postulacion.objects.create(
            pos_aspirante_fk_id=data['pos_aspirante_fk'],
            pos_vacante_fk_id=data['pos_vacante_fk'],
            pos_estado=data.get('pos_estado', 'Postulado')
        )
        return JsonResponse({'id': postulacion.id}, status=201)

def actualizar_postulacion(request, id):
    # Más código manual...
    pass

def eliminar_postulacion(request, id):
    # Más código manual...
    pass

# urls.py
urlpatterns = [
    path('postulaciones/', listar_postulaciones),
    path('postulaciones/crear/', crear_postulacion),
    path('postulaciones/<int:id>/', actualizar_postulacion),
    path('postulaciones/<int:id>/eliminar/', eliminar_postulacion),
]
```
**Líneas de código: ~80-100**
**Problemas:**
- Código repetitivo
- Validación manual propensa a errores
- Sin paginación automática
- Sin filtros
- Sin serialización estructurada

#### **Django REST Framework (Nuestra solución):**
```python
# serializers.py
class PostulacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Postulacion
        fields = '__all__'
    
    def validate(self, data):
        # Validación centralizada
        if Postulacion.objects.filter(
            pos_aspirante_fk=data['pos_aspirante_fk'],
            pos_vacante_fk=data['pos_vacante_fk']
        ).exists():
            raise serializers.ValidationError("Ya existe postulación")
        return data

# views.py
class PostulacionViewSet(viewsets.ModelViewSet):
    queryset = Postulacion.objects.all()
    serializer_class = PostulacionSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        # Filtros automáticos
        estado = self.request.query_params.get('pos_estado')
        if estado:
            queryset = queryset.filter(pos_estado=estado)
        return queryset

# urls.py
router = routers.DefaultRouter()
router.register(r'postulaciones', PostulacionViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]
```
**Líneas de código: ~25**
**Ventajas:**
- ✅ CRUD completo automático
- ✅ Validación robusta
- ✅ Paginación incluida
- ✅ Filtros dinámicos
- ✅ Serialización estructurada
- ✅ Menos código = menos bugs

### **4️⃣ AUTENTICACIÓN MODERNA (JWT vs Sesiones)**

**MVC Tradicional - Sesiones:**
```python
# Sesiones basadas en cookies
# Problemas:
# - Stateful (servidor guarda sesión)
# - No funciona bien con múltiples servidores
# - CSRF tokens requeridos
# - No ideal para APIs móviles
```

**DRF - JWT (JSON Web Tokens):**
```python
# Tokens stateless
# Ventajas:
# ✅ Sin estado en servidor
# ✅ Escalable horizontalmente
# ✅ Funciona en web, móvil, desktop
# ✅ Expira automáticamente
# ✅ Refresh tokens

# Token en header:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **5️⃣ BROWSABLE API - HERRAMIENTA DE DESARROLLO**

DRF incluye una interfaz web automática para probar la API:

```
http://127.0.0.1:8000/api/postulaciones/

┌─────────────────────────────────────────────────────┐
│ Postulacion List                                    │
├─────────────────────────────────────────────────────┤
│ GET  /api/postulaciones/                            │
│ POST /api/postulaciones/                            │
│                                                     │
│ [                                                   │
│   {                                                 │
│     "id": 1,                                        │
│     "pos_estado": "Postulado",                      │
│     "pos_aspirante_fk": 5,                          │
│     "pos_vacante_fk": 12                            │
│   }                                                 │
│ ]                                                   │
│                                                     │
│ POST Form:                                          │
│ pos_aspirante_fk: [____]                            │
│ pos_vacante_fk:   [____]                            │
│ pos_estado:       [▼Postulado]                      │
│ [POST Button]                                       │
└─────────────────────────────────────────────────────┘
```

**Esto NO existe en MVC tradicional** - necesitarías Postman o curl.

### **6️⃣ PREPARADOS PARA EL FUTURO**

Con nuestra arquitectura podemos:

✅ **Crear app móvil** (React Native, Flutter)
```
┌──────────┐
│  BACKEND │◄───┐
│   API    │    │
└──────────┘    │
     ▲          │
     │          │
  ┌──┴──┐   ┌───┴───┐
  │ Web │   │ Móvil │
  └─────┘   └───────┘
```

✅ **Microservicios** (si crecemos)
```
API Gateway
    │
    ├─► Servicio Usuarios
    ├─► Servicio Vacantes
    └─► Servicio Notificaciones
```

✅ **Integración con terceros**
```javascript
// Otras apps pueden consumir nuestra API
fetch('https://turboempleo.co/api/vacantes/')
```

### **🎤 RESPUESTA CORTA PARA EL PROFESOR:**

> **"Elegimos Django REST Framework sobre MVC tradicional porque:**
> 
> **1. Separación de responsabilidades:** Backend como API pura, frontend independiente en React.
> 
> **2. Escalabilidad:** Podemos agregar apps móviles usando la misma API.
> 
> **3. Productividad:** ViewSets nos dan CRUD completo en 10 líneas vs 100 en MVC.
> 
> **4. Autenticación moderna:** JWT stateless vs sesiones tradicionales.
> 
> **5. Estándar de la industria:** REST API es el estándar actual para aplicaciones modernas.
> 
> **6. Base de datos robusta:** Usamos MySQL en lugar de SQLite para soportar múltiples usuarios concurrentes, mayor capacidad de almacenamiento y mejor rendimiento en producción.
> 
> MVC tradicional genera HTML en el servidor. Nosotros generamos JSON que el frontend React consume. Esto nos da flexibilidad total y facilita el trabajo en equipo."**

---

## 📌 RESUMEN PARA MEMORIZAR

### **Estructura:**
```
Backend (API)
├── manage.py          → CLI de Django
├── requirements.txt   → Dependencias (incluye mysqlclient)
├── media/             → Archivos subidos
├── mi_backend/        → Configuración
│   ├── settings.py   → Config general + MySQL
│   ├── urls.py       → Rutas principales
│   └── wsgi.py       → Servidor
└── usuarios/          → App principal
    ├── models.py     → Estructura BD (tablas en MySQL)
    ├── serializers.py → JSON ↔ Python
    ├── views.py      → Lógica (ViewSets)
    ├── urls.py       → Rutas de app
    └── signals.py    → Eventos automáticos

Base de Datos Externa:
└── MySQL Server (localhost:3306)
    └── turboempleo (database)
        ├── usuarios_aspirante
        ├── usuarios_empresa
        ├── usuarios_vacante
        ├── usuarios_postulacion
        └── usuarios_notificacion
```

### **Flujo de una petición:**
```
1. URL     → Identifica el endpoint
2. ViewSet → Maneja la lógica
3. Serializer → Valida y convierte datos
4. Model   → Guarda/lee de BD
5. Signal  → Efectos secundarios
6. Response → JSON al frontend
```

### **¿Por qué DRF > MVC?**
1. API REST para múltiples clientes
2. ViewSets = menos código
3. JWT > sesiones
4. Browsable API incluida
5. Escalable y moderno

---

## 🎓 GUÍA PRÁCTICA PARA LA EXPLICACIÓN EN VIVO

### 📍 **DÓNDE ENCONTRAR CADA COMPONENTE EN EL PROYECTO**

Esta sección te guía **paso a paso** sobre qué mostrar y dónde está ubicado en tu proyecto.

---

### **1️⃣ ESTRUCTURA DEL BACKEND - Mostrar organización de carpetas**

**QUÉ DECIR:**
> "El backend de TurboEmpleo está organizado en carpetas con responsabilidades específicas. Déjenme mostrarles la estructura..."

**DÓNDE MOSTRARLO:**
```
📂 backend/
  ├── 📄 manage.py                 ← Abrir este archivo primero
  ├── 📄 requirements.txt          ← Mostrar dependencias
  ├── 📂 media/                    ← Explicar almacenamiento de archivos
  ├── 📂 mi_backend/               ← Configuración del proyecto
  │   ├── settings.py             ← IMPORTANTE: Abrir y explicar
  │   ├── urls.py                 ← Rutas principales
  │   └── wsgi.py                 ← Servidor de producción
  └── 📂 usuarios/                 ← Aplicación principal
      ├── models.py               ← CLAVE: Estructura de BD
      ├── serializers.py          ← CLAVE: Conversión JSON
      ├── views.py                ← CLAVE: Lógica de negocio
      ├── urls.py                 ← Rutas de la app
      └── signals.py              ← Eventos automáticos
```

**PASO A PASO:**

1. **Abre VS Code** con la carpeta `backend/` visible
2. **Expande las carpetas** `mi_backend/` y `usuarios/`
3. Señala cada carpeta mientras explicas su propósito

---

### **2️⃣ ARQUITECTURA MTV + API REST - Explicar el patrón**

**QUÉ DECIR:**
> "Nuestra arquitectura se basa en Django REST Framework, que implementa el patrón MTV (Model-Template-View) adaptado para APIs REST. La diferencia clave con MVC tradicional es que NO generamos HTML, sino JSON para que el frontend React lo consuma."

**DIAGRAMA PARA DIBUJAR EN PIZARRA O MOSTRAR:**
```
┌─────────────────────────────────────────────┐
│         FRONTEND (React)                    │
│         localhost:5173                      │
│    • Componentes                            │
│    • UI/UX                                  │
│    • Interacción con usuario                │
└─────────────────┬───────────────────────────┘
                  │
                  │ HTTP Requests (JSON)
                  │ GET /api/postulaciones/
                  │ POST /api/postulaciones/
                  │ Authorization: Bearer <token>
                  │
                  ▼
┌─────────────────────────────────────────────┐
│         BACKEND (Django + DRF)              │
│         localhost:8000                      │
│                                             │
│  📂 mi_backend/                             │
│     └── urls.py ────┐                       │
│                     │ (Enrutamiento)        │
│  📂 usuarios/       ▼                       │
│     ├── urls.py     → Define endpoints      │
│     ├── views.py    → ViewSets (Lógica)    │
│     ├── serializers.py → Valida y convierte│
│     └── models.py   → Define estructura BD  │
│                     │                       │
└─────────────────────┼───────────────────────┘
                      │
                      │ ORM (Object-Relational Mapping)
                      │ Django ejecuta SQL automáticamente
                      │
                      ▼
┌─────────────────────────────────────────────┐
│         MySQL Server                        │
│         localhost:3306                      │
│         Database: turboempleo               │
│                                             │
│    Tablas:                                  │
│    • usuarios_aspirante                     │
│    • usuarios_empresa                       │
│    • usuarios_vacante                       │
│    • usuarios_postulacion                   │
│    • usuarios_notificacion                  │
└─────────────────────────────────────────────┘
```

**DÓNDE ESTÁ EN EL PROYECTO:**
- **Frontend:** `frontend/src/`
- **Backend:** `backend/usuarios/`
- **Base de datos:** Configuración en `backend/mi_backend/settings.py` (líneas 101-110)

---

### **3️⃣ API REST - ¿Qué es y cómo funciona?**

**QUÉ DECIR:**
> "Una API REST (Representational State Transfer) es una interfaz que permite la comunicación entre el frontend y backend mediante HTTP. Usa los métodos estándar GET, POST, PUT, DELETE y devuelve datos en formato JSON."

**CARACTERÍSTICAS CLAVE:**
- **Stateless:** Cada petición es independiente (no guarda estado en servidor)
- **JSON:** Formato ligero para intercambio de datos
- **HTTP Methods:** GET (leer), POST (crear), PUT (actualizar), DELETE (eliminar)
- **Endpoints:** URLs que representan recursos

**EJEMPLO PRÁCTICO EN TU PROYECTO:**

Abre el navegador y muestra:
```
http://127.0.0.1:8000/api/
```

Esto abrirá el **Browsable API** de Django REST Framework que muestra todos tus endpoints.

**DÓNDE ESTÁ CONFIGURADO:**
```python
# Archivo: backend/mi_backend/urls.py

from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from usuarios import views

# Router automático de DRF
router = routers.DefaultRouter()
router.register(r'aspirantes', views.AspiranteViewSet)
router.register(r'empresas', views.EmpresaViewSet)
router.register(r'vacantes', views.VacanteViewSet)
router.register(r'postulaciones', views.PostulacionViewSet)
router.register(r'notificaciones', views.NotificacionViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),  # ← Todos los endpoints bajo /api/
]
```

**UBICACIÓN:** `backend/mi_backend/urls.py` (líneas 5-20 aproximadamente)

---

### **4️⃣ ENDPOINTS - Las URLs de la API**

**QUÉ DECIR:**
> "Los endpoints son las URLs que el frontend usa para comunicarse con el backend. Cada endpoint representa un recurso y soporta diferentes operaciones HTTP."

**ENDPOINTS DE TU PROYECTO:**

| Endpoint | Método | Acción | Ubicación en código |
|----------|--------|--------|---------------------|
| `/api/postulaciones/` | GET | Listar todas las postulaciones | `views.py` → `PostulacionViewSet.list()` |
| `/api/postulaciones/` | POST | Crear nueva postulación | `views.py` → `PostulacionViewSet.create()` |
| `/api/postulaciones/5/` | GET | Ver postulación específica | `views.py` → `PostulacionViewSet.retrieve()` |
| `/api/postulaciones/5/` | PUT | Actualizar postulación | `views.py` → `PostulacionViewSet.update()` |
| `/api/postulaciones/5/` | DELETE | Eliminar postulación | `views.py` → `PostulacionViewSet.destroy()` |
| `/api/vacantes/` | GET | Listar vacantes | `views.py` → `VacanteViewSet.list()` |
| `/api/aspirantes/` | GET | Listar aspirantes | `views.py` → `AspiranteViewSet.list()` |
| `/api/notificaciones/no_leidas_count/` | GET | Contar no leídas (custom) | `views.py` → `NotificacionViewSet.no_leidas_count()` |

**CÓMO MOSTRARLOS:**

1. **Opción 1 - Browsable API (Recomendado):**
   - Inicia el servidor: `python manage.py runserver`
   - Abre: `http://127.0.0.1:8000/api/postulaciones/`
   - Muestra la interfaz interactiva

2. **Opción 2 - Código:**
   - Abre: `backend/mi_backend/urls.py`
   - Muestra el `router.register()`

**DÓNDE ESTÁ:**
- **Configuración principal:** `backend/mi_backend/urls.py`
- **Rutas adicionales:** `backend/usuarios/urls.py`

---

### **5️⃣ TOKENS JWT - Autenticación segura**

**QUÉ DECIR:**
> "Para la autenticación usamos JWT (JSON Web Tokens). Es un estándar moderno que no requiere sesiones en el servidor (stateless), ideal para APIs REST. Cuando un usuario inicia sesión, recibe un token que debe enviar en cada petición."

**FLUJO DE AUTENTICACIÓN:**

```
1. Usuario hace login
   POST /api/login/
   Body: { "email": "user@example.com", "password": "pass123" }
   
2. Backend valida credenciales
   ↓
   
3. Backend genera JWT token
   {
     "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   }
   
4. Frontend guarda el token (localStorage)
   
5. Frontend envía token en cada petición
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   
6. Backend valida token y permite acceso
```

**DÓNDE ESTÁ CONFIGURADO:**

```python
# Archivo: backend/mi_backend/settings.py

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
}

# Configuración de JWT
from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=5),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
}
```

**UBICACIÓN:** `backend/mi_backend/settings.py` (líneas 130-145 aproximadamente)

**EJEMPLO PRÁCTICO EN FRONTEND:**
```javascript
// Archivo: frontend/src/pages/public/Login.jsx

const response = await fetch('http://127.0.0.1:8000/api/login/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
});

const data = await response.json();
localStorage.setItem('token', data.access);  // Guardar token
```

**UBICACIÓN:** `frontend/src/pages/public/Login.jsx` (líneas 30-40 aproximadamente)

---

### **6️⃣ SERIALIZERS - Conversión de datos**

**QUÉ DECIR:**
> "Los serializers son el puente entre Python y JSON. Convierten objetos de Django (Python) a JSON para enviar al frontend, y viceversa. También validan los datos que llegan."

**FUNCIÓN:**
```
Python Object (Model) ←→ JSON
     ↑                    ↓
  Deserialize         Serialize
     ↑                    ↓
Base de Datos          Frontend
```

**EJEMPLO EN TU PROYECTO:**

```python
# Archivo: backend/usuarios/serializers.py

class PostulacionSerializer(serializers.ModelSerializer):
    # Incluir datos relacionados (nested)
    pos_aspirante_fk = AspiranteSerializer(read_only=True)
    pos_vacante_fk = VacanteSerializer(read_only=True)
    
    class Meta:
        model = Postulacion
        fields = '__all__'  # Todos los campos


# Para crear/actualizar (sin nested, solo IDs)
class PostulacionWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Postulacion
        fields = '__all__'
    
    def validate(self, data):
        """Validación personalizada"""
        aspirante = data.get('pos_aspirante_fk')
        vacante = data.get('pos_vacante_fk')
        
        # Verificar duplicados
        if Postulacion.objects.filter(
            pos_aspirante_fk=aspirante,
            pos_vacante_fk=vacante
        ).exists():
            raise serializers.ValidationError(
                "Ya te has postulado a esta vacante"
            )
        
        return data
```

**UBICACIÓN:** `backend/usuarios/serializers.py`

**QUÉ MUESTRA:**
- Abre el archivo `serializers.py`
- Busca `PostulacionSerializer` (línea 150 aproximadamente)
- Explica el método `validate()` para mostrar validación personalizada

**EJEMPLO DE JSON GENERADO:**
```json
{
    "id": 1,
    "pos_estado": "Postulado",
    "pos_fechaPostulacion": "2025-11-08T14:30:00Z",
    "pos_aspirante_fk": {
        "id": 5,
        "asp_nombre": "Juan",
        "asp_apellido": "Pérez"
    },
    "pos_vacante_fk": {
        "id": 12,
        "va_nombreVacante": "Desarrollador Backend",
        "va_salario": 3000000
    }
}
```

---

### **7️⃣ MODELS - Estructura de la base de datos**

**QUÉ DECIR:**
> "Los models definen la estructura de las tablas en la base de datos. Cada clase representa una tabla, y cada atributo es una columna. Django ORM traduce esto automáticamente a SQL."

**EJEMPLO EN TU PROYECTO:**

```python
# Archivo: backend/usuarios/models.py

class Postulacion(models.Model):
    # Relaciones (Foreign Keys)
    pos_aspirante_fk = models.ForeignKey(
        'Aspirante',
        on_delete=models.CASCADE,
        related_name='postulaciones'
    )
    pos_vacante_fk = models.ForeignKey(
        'Vacante',
        on_delete=models.CASCADE,
        related_name='postulaciones'
    )
    
    # Campos
    pos_fechaPostulacion = models.DateTimeField(auto_now_add=True)
    pos_estado = models.CharField(
        max_length=20,
        choices=[
            ('Postulado', 'Postulado'),
            ('En revisión', 'En revisión'),
            ('Preseleccionado', 'Preseleccionado'),
            ('Rechazado', 'Rechazado'),
            ('Contratado', 'Contratado'),
        ],
        default='Postulado'
    )
    
    class Meta:
        db_table = 'usuarios_postulacion'
        ordering = ['-pos_fechaPostulacion']
    
    def __str__(self):
        return f"{self.pos_aspirante_fk} - {self.pos_vacante_fk}"
```

**UBICACIÓN:** `backend/usuarios/models.py` (buscar `class Postulacion`)

**SQL GENERADO AUTOMÁTICAMENTE:**
```sql
CREATE TABLE usuarios_postulacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pos_aspirante_fk_id INT NOT NULL,
    pos_vacante_fk_id INT NOT NULL,
    pos_fechaPostulacion DATETIME NOT NULL,
    pos_estado VARCHAR(20) NOT NULL,
    FOREIGN KEY (pos_aspirante_fk_id) REFERENCES usuarios_aspirante(id),
    FOREIGN KEY (pos_vacante_fk_id) REFERENCES usuarios_vacante(id)
);
```

**OTROS MODELS IMPORTANTES:**
- `Aspirante` (línea 50 aprox)
- `Empresa` (línea 100 aprox)
- `Vacante` (línea 150 aprox)
- `Notificacion` (línea 250 aprox)

**CÓMO MOSTRARLO:**
1. Abre `backend/usuarios/models.py`
2. Busca `class Postulacion`
3. Explica cada campo y su tipo
4. Menciona las relaciones ForeignKey

---

### **8️⃣ VIEWS (ViewSets) - Lógica de negocio**

**QUÉ DECIR:**
> "Los ViewSets son clases que manejan toda la lógica de negocio de un endpoint. Con ViewSets de DRF, obtenemos las 6 operaciones CRUD automáticamente en una sola clase."

**COMPARACIÓN:**

**Sin ViewSet (código manual):**
```python
def listar_postulaciones(request):
    # 20 líneas de código

def crear_postulacion(request):
    # 30 líneas de código

def actualizar_postulacion(request, id):
    # 25 líneas de código

def eliminar_postulacion(request, id):
    # 15 líneas de código

# Total: ~90 líneas
```

**Con ViewSet (DRF):**
```python
class PostulacionViewSet(viewsets.ModelViewSet):
    queryset = Postulacion.objects.all()
    serializer_class = PostulacionSerializer

# Total: 3 líneas (DRF hace el resto automáticamente)
```

**EJEMPLO COMPLETO EN TU PROYECTO:**

```python
# Archivo: backend/usuarios/views.py

class PostulacionViewSet(viewsets.ModelViewSet):
    queryset = Postulacion.objects.all()
    
    def get_serializer_class(self):
        """Usar serializer diferente según la acción"""
        if self.action in ['create', 'update', 'partial_update']:
            return PostulacionWriteSerializer
        return PostulacionSerializer
    
    def get_queryset(self):
        """Filtros dinámicos desde URL"""
        queryset = Postulacion.objects.all()
        
        # ?pos_aspirante_fk=5
        aspirante = self.request.query_params.get('pos_aspirante_fk')
        if aspirante:
            queryset = queryset.filter(pos_aspirante_fk=aspirante)
        
        # ?pos_estado=Postulado
        estado = self.request.query_params.get('pos_estado')
        if estado:
            queryset = queryset.filter(pos_estado=estado)
        
        return queryset.order_by('-pos_fechaPostulacion')
    
    def perform_create(self, serializer):
        """Lógica adicional al crear"""
        postulacion = serializer.save()
        # Aquí podrías agregar lógica adicional
        # Por ejemplo, enviar email de confirmación


# ViewSet con acción personalizada
class NotificacionViewSet(viewsets.ModelViewSet):
    queryset = Notificacion.objects.all()
    serializer_class = NotificacionSerializer
    
    @action(detail=False, methods=['get'])
    def no_leidas_count(self, request):
        """Endpoint personalizado: /api/notificaciones/no_leidas_count/"""
        usuario = request.user
        count = Notificacion.objects.filter(
            not_usuario_fk=usuario,
            not_estado='No leída'
        ).count()
        return Response({'count': count})
```

**UBICACIÓN:** `backend/usuarios/views.py`

**OPERACIONES AUTOMÁTICAS DEL VIEWSET:**
- `list()` → GET `/api/postulaciones/` (listar todas)
- `create()` → POST `/api/postulaciones/` (crear nueva)
- `retrieve()` → GET `/api/postulaciones/5/` (ver una)
- `update()` → PUT `/api/postulaciones/5/` (actualizar completo)
- `partial_update()` → PATCH `/api/postulaciones/5/` (actualizar parcial)
- `destroy()` → DELETE `/api/postulaciones/5/` (eliminar)

**CÓMO MOSTRARLO:**
1. Abre `backend/usuarios/views.py`
2. Busca `PostulacionViewSet` (línea 200 aproximadamente)
3. Muestra el método `get_queryset()` para explicar filtros
4. Muestra `NotificacionViewSet.no_leidas_count()` como ejemplo de acción personalizada

---

### **9️⃣ URLs - Rutas y enrutamiento**

**QUÉ DECIR:**
> "Las URLs definen qué ViewSet o función se ejecuta para cada endpoint. Django REST Framework incluye un Router que genera automáticamente las rutas CRUD."

**ARQUITECTURA DE URLS:**

```
Petición HTTP
    ↓
┌─────────────────────────────────────┐
│ mi_backend/urls.py (Principal)      │
│                                     │
│ path('api/', include(router.urls)) │ ← Delega a router
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│ Router (DRF)                        │
│                                     │
│ router.register(                    │
│   r'postulaciones',                 │
│   PostulacionViewSet                │
│ )                                   │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│ usuarios/views.py                   │
│                                     │
│ class PostulacionViewSet            │
│     def list(self, request):        │
│     def create(self, request):      │
│     ...                             │
└─────────────────────────────────────┘
```

**CÓDIGO EN TU PROYECTO:**

**Archivo 1: URLs principales**
```python
# backend/mi_backend/urls.py

from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from usuarios import views

# Router de DRF
router = routers.DefaultRouter()

# Registrar ViewSets
router.register(r'aspirantes', views.AspiranteViewSet, basename='aspirante')
router.register(r'empresas', views.EmpresaViewSet, basename='empresa')
router.register(r'vacantes', views.VacanteViewSet, basename='vacante')
router.register(r'postulaciones', views.PostulacionViewSet, basename='postulacion')
router.register(r'notificaciones', views.NotificacionViewSet, basename='notificacion')
router.register(r'experiencia-laboral', views.ExperienciaLaboralViewSet)
router.register(r'experiencia-escolar', views.ExperienciaEscolarViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),  # Todas las rutas del router
    path('api/usuarios/', include('usuarios.urls')),  # Rutas adicionales
]
```

**UBICACIÓN:** `backend/mi_backend/urls.py`

**Archivo 2: URLs adicionales de la app**
```python
# backend/usuarios/urls.py

from django.urls import path
from .views import *
from .activation_views import ActivateAccountView
from .password_reset_views import PasswordResetRequestView, PasswordResetConfirmView
from .password_views import ChangePasswordView

urlpatterns = [
    path('registro/', UsuarioRegistroView.as_view(), name='registro'),
    path('cambiar-password/', ChangePasswordView.as_view(), name='cambiar-password'),
    path('activar-cuenta/<uidb64>/<token>/', ActivateAccountView.as_view(), name='activar-cuenta'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password-reset'),
    path('password-reset-confirm/<uidb64>/<token>/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    path('contacto/', contacto_view, name='contacto'),
]
```

**UBICACIÓN:** `backend/usuarios/urls.py`

**URLS GENERADAS AUTOMÁTICAMENTE POR EL ROUTER:**

| URL | Vista | Acción |
|-----|-------|--------|
| `/api/postulaciones/` | `PostulacionViewSet.list()` | GET - Listar |
| `/api/postulaciones/` | `PostulacionViewSet.create()` | POST - Crear |
| `/api/postulaciones/{id}/` | `PostulacionViewSet.retrieve()` | GET - Ver una |
| `/api/postulaciones/{id}/` | `PostulacionViewSet.update()` | PUT - Actualizar |
| `/api/postulaciones/{id}/` | `PostulacionViewSet.destroy()` | DELETE - Eliminar |

**CÓMO MOSTRARLO:**
1. Abre `backend/mi_backend/urls.py`
2. Muestra el `router.register()` para cada recurso
3. Explica cómo el router genera 6 endpoints por cada ViewSet
4. Abre el navegador en `http://127.0.0.1:8000/api/` para mostrar la lista de endpoints

---

## 🎯 **RESUMEN: DÓNDE ESTÁ CADA COSA**

| Componente | Archivo | Línea aprox. | Qué mostrar |
|------------|---------|--------------|-------------|
| **Configuración DB** | `mi_backend/settings.py` | 101-110 | Conexión MySQL |
| **Configuración JWT** | `mi_backend/settings.py` | 130-145 | Autenticación |
| **URLs principales** | `mi_backend/urls.py` | 5-20 | Router y endpoints |
| **Models** | `usuarios/models.py` | Todo el archivo | Estructura BD |
| **Serializers** | `usuarios/serializers.py` | Todo el archivo | Conversión JSON |
| **ViewSets** | `usuarios/views.py` | Todo el archivo | Lógica de negocio |
| **URLs de app** | `usuarios/urls.py` | Todo el archivo | Rutas adicionales |
| **Signals** | `usuarios/signals.py` | Todo el archivo | Notificaciones automáticas |

---

## 📝 **GUIÓN SUGERIDO PARA LA SUSTENTACIÓN**

### **INICIO (2 minutos)**
1. "Buenos días/tardes. Hoy les presentaré el backend de TurboEmpleo"
2. "Usamos Django REST Framework para crear una API REST moderna"
3. "Permítanme mostrarles la estructura del proyecto" → **Abrir VS Code**

### **ARQUITECTURA (3 minutos)**
4. "Nuestra arquitectura separa completamente frontend y backend" → **Mostrar diagrama**
5. "El frontend React consume la API REST que nosotros desarrollamos"
6. "Esto nos permite escalabilidad y desarrollo en paralelo"

### **RECORRIDO POR COMPONENTES (10 minutos)**

**Models (2 min):**
7. "Comenzamos con los models" → **Abrir `models.py`**
8. "Aquí definimos la estructura de las tablas" → **Mostrar `Postulacion`**
9. "Django ORM traduce esto automáticamente a SQL en MySQL"

**Serializers (2 min):**
10. "Los serializers convierten entre Python y JSON" → **Abrir `serializers.py`**
11. "También validan los datos" → **Mostrar método `validate()`**

**ViewSets (3 min):**
12. "Los ViewSets contienen la lógica de negocio" → **Abrir `views.py`**
13. "Con una clase obtenemos 6 operaciones CRUD automáticas"
14. "Podemos agregar filtros personalizados" → **Mostrar `get_queryset()`**

**URLs (2 min):**
15. "El Router genera automáticamente las rutas" → **Abrir `urls.py`**
16. "Cada registro crea 6 endpoints" → **Mostrar navegador con API**

**Autenticación (1 min):**
17. "Usamos JWT para autenticación stateless" → **Mostrar `settings.py`**

### **DEMOSTRACIÓN EN VIVO (5 minutos)**
18. "Permítanme mostrarles la API en funcionamiento" → **Abrir navegador**
19. `http://127.0.0.1:8000/api/postulaciones/` → **Mostrar lista**
20. "Puedo crear una postulación directamente desde aquí" → **Usar formulario**
21. "Y ver la notificación generada automáticamente" → **Mostrar signals**

### **CIERRE (2 minutos)**
22. "¿Por qué DRF sobre MVC tradicional?" → **Explicar ventajas**
23. "Esta arquitectura nos permite escalabilidad futura"
24. "¿Preguntas?"

---

## 🎓 CONSEJOS FINALES

1. **Practica el recorrido** abriendo los archivos en orden
2. **Ten el servidor corriendo** antes de presentar
3. **Abre el Browsable API** en una pestaña
4. **Ten abierto MySQL Workbench** para mostrar las tablas (opcional)
5. **Prepara un ejemplo de petición** con Postman o desde React
6. **Memoriza las ubicaciones** de cada archivo clave
7. **Habla con confianza** - tú desarrollaste esto

---

## 🐍 ¿POR QUÉ PYTHON Y DJANGO PARA TURBOEMPLEO?

### **Pregunta del profesor: "¿Por qué eligieron Python y Django?"**

Esta es una pregunta clave en la sustentación. Aquí está la justificación técnica y práctica.

---

### **1️⃣ PYTHON: El lenguaje perfecto para el proyecto**

**QUÉ DECIR:**
> "Elegimos Python como lenguaje backend por su combinación única de simplicidad, potencia y ecosistema robusto. Python nos permitió desarrollar rápidamente con código limpio y mantenible."

#### **Ventajas de Python para TurboEmpleo:**

| Característica | Beneficio en nuestro proyecto |
|----------------|-------------------------------|
| **Sintaxis clara** | Código legible y fácil de mantener - ideal para trabajo en equipo |
| **Tipado dinámico** | Desarrollo más rápido, menos código repetitivo |
| **Ecosistema rico** | Librerías para todo: MySQL, JWT, manejo de archivos, emails |
| **Multiplataforma** | Funciona en Windows, Linux, Mac sin cambios |
| **Comunidad grande** | Documentación abundante, soporte en Stack Overflow |
| **Orientado a objetos** | Perfecto para modelar entidades (Aspirante, Empresa, Vacante) |
| **Manejo de datos** | Excelente para procesamiento de archivos (PDFs, imágenes) |

#### **Comparación con otras opciones:**

**Python vs JavaScript (Node.js):**
```python
# Python - Código más limpio
class Postulacion(models.Model):
    pos_estado = models.CharField(max_length=20, default='Postulado')
    pos_fechaPostulacion = models.DateTimeField(auto_now_add=True)
```

```javascript
// JavaScript/Node.js - Más verboso
const PostulacionSchema = new Schema({
    pos_estado: {
        type: String,
        maxLength: 20,
        default: 'Postulado'
    },
    pos_fechaPostulacion: {
        type: Date,
        default: Date.now
    }
});
```

**Python vs Java:**
```python
# Python - Conciso
aspirantes = Aspirante.objects.filter(asp_estado='Activo')
for aspirante in aspirantes:
    print(aspirante.asp_nombre)
```

```java
// Java - Más verboso
List<Aspirante> aspirantes = aspiranteRepository.findByEstado("Activo");
for (Aspirante aspirante : aspirantes) {
    System.out.println(aspirante.getAspNombre());
}
```

**Python vs PHP:**
- ✅ Python tiene mejor manejo de datos estructurados
- ✅ Django incluye seguridad por defecto (CSRF, SQL Injection, XSS)
- ✅ Python es más moderno y mejor para APIs REST

---

### **2️⃣ DJANGO: El framework ideal para TurboEmpleo**

**QUÉ DECIR:**
> "Django es un framework web de alto nivel que nos proporciona todo lo necesario 'de la caja'. Su filosofía 'Batteries included' (baterías incluidas) significa que trae funcionalidades esenciales integradas: autenticación, ORM, admin panel, validaciones, seguridad, y más."

#### **Razones técnicas por las que Django fue la mejor elección:**

### **A) ORM (Object-Relational Mapping) Integrado**

**Problema sin ORM:** Escribir SQL manualmente es tedioso y propenso a errores.

**Solución Django:** ORM convierte Python a SQL automáticamente.

**Ejemplo en nuestro proyecto:**

```python
# Código Python (backend/usuarios/views.py)
postulaciones = Postulacion.objects.filter(
    pos_aspirante_fk=aspirante_id,
    pos_estado='Postulado'
).order_by('-pos_fechaPostulacion')
```

**Django ejecuta automáticamente en MySQL:**
```sql
SELECT * FROM usuarios_postulacion
WHERE pos_aspirante_fk_id = 5
  AND pos_estado = 'Postulado'
ORDER BY pos_fechaPostulacion DESC;
```

**Ventajas:**
- ✅ No escribimos SQL manualmente
- ✅ Previene inyección SQL automáticamente
- ✅ Funciona con MySQL, PostgreSQL, SQLite sin cambios
- ✅ Migraciones automáticas de base de datos

---

### **B) Panel de Administración Automático**

**Problema:** Crear un panel admin desde cero toma semanas.

**Solución Django:** Admin panel incluido automáticamente.

```python
# Archivo: backend/usuarios/admin.py (solo 3 líneas)
from django.contrib import admin
from .models import Aspirante, Empresa, Vacante, Postulacion

admin.site.register(Aspirante)
admin.site.register(Empresa)
admin.site.register(Vacante)
admin.site.register(Postulacion)
```

**Resultado:** Panel admin completo en `http://127.0.0.1:8000/admin/`
- ✅ CRUD completo para todas las tablas
- ✅ Filtros y búsquedas
- ✅ Edición en línea
- ✅ Gestión de usuarios y permisos

**Tiempo ahorrado:** ~2-3 semanas de desarrollo

---

### **C) Sistema de Autenticación Robusto**

**Problema:** Implementar autenticación segura es complejo.

**Solución Django:** Sistema de usuarios incluido + JWT.

**En nuestro proyecto:**
```python
# Modelo de usuario personalizado
class Usuarios(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=False)
    failed_login_attempts = models.IntegerField(default=0)
    
    USERNAME_FIELD = 'email'
```

**Django maneja:**
- ✅ Hash seguro de contraseñas (PBKDF2 por defecto)
- ✅ Validación de contraseñas robustas
- ✅ Protección contra ataques de fuerza bruta
- ✅ Tokens de sesión seguros
- ✅ Integración con JWT (djangorestframework-simplejwt)

---

### **D) Sistema de Migraciones de Base de Datos**

**Problema:** Actualizar la estructura de BD manualmente es riesgoso.

**Solución Django:** Migraciones automáticas.

**Flujo en nuestro proyecto:**

1. **Modificamos el modelo:**
```python
# backend/usuarios/models.py
class Postulacion(models.Model):
    pos_estado = models.CharField(max_length=20)
    # Agregamos nuevo campo
    pos_observaciones = models.TextField(blank=True, null=True)  # Nuevo
```

2. **Django detecta el cambio:**
```bash
python manage.py makemigrations
# Migrations for 'usuarios':
#   usuarios/migrations/0005_postulacion_pos_observaciones.py
#     - Add field pos_observaciones to postulacion
```

3. **Aplicamos a la base de datos:**
```bash
python manage.py migrate
# Running migrations:
#   Applying usuarios.0005_postulacion_pos_observaciones... OK
```

**Django ejecuta automáticamente:**
```sql
ALTER TABLE usuarios_postulacion 
ADD COLUMN pos_observaciones TEXT NULL;
```

**Ventajas:**
- ✅ Historial de cambios en BD (carpeta `migrations/`)
- ✅ Rollback fácil si algo sale mal
- ✅ Trabajo en equipo sin conflictos de BD
- ✅ Despliegue seguro en producción

---

### **E) Seguridad Incluida por Defecto**

**Django protege automáticamente contra:**

| Ataque | Protección de Django | Ejemplo en nuestro proyecto |
|--------|---------------------|----------------------------|
| **SQL Injection** | ORM sanitiza queries automáticamente | `Postulacion.objects.filter(id=user_input)` es seguro |
| **XSS (Cross-Site Scripting)** | Escapa HTML automáticamente | Templates escapan `{{ variable }}` |
| **CSRF (Cross-Site Request Forgery)** | Tokens CSRF automáticos | Middleware `CsrfViewMiddleware` |
| **Clickjacking** | Header `X-Frame-Options` | Middleware `XFrameOptionsMiddleware` |
| **Password Hashing** | PBKDF2 con salt | Contraseñas nunca en texto plano |

**Configuración de seguridad en nuestro proyecto:**
```python
# backend/mi_backend/settings.py
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',  # Seguridad general
    'django.middleware.csrf.CsrfViewMiddleware',      # Anti-CSRF
    'django.middleware.clickjacking.XFrameOptionsMiddleware',  # Anti-clickjacking
]

# Validadores de contraseña
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]
```

---

### **F) Django REST Framework - Perfecto para APIs**

**Problema:** Crear una API REST manualmente requiere mucho código.

**Solución:** Django REST Framework (DRF) reduce el código en 80%.

**Comparación:**

**Sin DRF (código manual):**
```python
# ~100 líneas de código
def listar_postulaciones(request):
    # Validar autenticación
    # Validar permisos
    # Consultar BD
    # Serializar a JSON
    # Manejar errores
    # Paginación
    # Filtros
    # ...
```

**Con DRF (nuestro proyecto):**
```python
# 5 líneas de código
class PostulacionViewSet(viewsets.ModelViewSet):
    queryset = Postulacion.objects.all()
    serializer_class = PostulacionSerializer
    permission_classes = [IsAuthenticated]
```

**DRF incluye automáticamente:**
- ✅ Serialización JSON
- ✅ Validación de datos
- ✅ Paginación
- ✅ Filtros
- ✅ Autenticación JWT
- ✅ Permisos granulares
- ✅ Browsable API (interfaz de pruebas)
- ✅ Documentación automática

---

### **G) Manejo de Archivos Simplificado**

**Nuestro proyecto maneja múltiples tipos de archivos:**
- 📄 Currículums (PDFs)
- 📸 Fotos de aspirantes (JPG, PNG)
- 🏢 Logos de empresas (PNG, SVG)
- 📋 Documentos corporativos

**Django simplifica esto:**

```python
# backend/usuarios/models.py
class Aspirante(models.Model):
    asp_curriculum = models.FileField(upload_to='curriculums/')
    asp_foto = models.ImageField(upload_to='fotos_aspirantes/')
```

**Django automáticamente:**
- ✅ Crea las carpetas si no existen
- ✅ Genera nombres únicos para evitar conflictos
- ✅ Valida tipos de archivo (con Pillow)
- ✅ Sirve archivos en desarrollo
- ✅ Se integra con servicios de almacenamiento (AWS S3, Azure, etc.)

**Configuración simple:**
```python
# backend/mi_backend/settings.py
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
```

---

### **H) Signals - Eventos Automáticos**

**Problema:** Ejecutar acciones automáticas al guardar datos.

**Ejemplo en nuestro proyecto:** Crear notificación cuando aspirante se postula.

```python
# backend/usuarios/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=Postulacion)
def crear_notificacion_nueva_postulacion(sender, instance, created, **kwargs):
    if created:  # Solo cuando se crea, no al actualizar
        empresa = instance.pos_vacante_fk.va_idEmpresa_fk
        
        Notificacion.objects.create(
            not_usuario_fk=empresa.em_usuario_fk,
            not_tipo='Postulación',
            not_titulo='Nueva postulación recibida',
            not_mensaje=f'{instance.pos_aspirante_fk.asp_nombre} se postuló',
            not_estado='No leída'
        )
```

**Esto sucede automáticamente** cada vez que se crea una postulación. Sin código adicional en las vistas.

---

### **3️⃣ COMPARACIÓN: Django vs Otros Frameworks**

| Característica | Django | Laravel (PHP) | Express.js (Node) | Spring Boot (Java) |
|----------------|--------|---------------|-------------------|-------------------|
| **ORM incluido** | ✅ Sí | ✅ Eloquent | ❌ Necesita Sequelize | ❌ Necesita JPA |
| **Admin panel** | ✅ Automático | ✅ Manual (Nova) | ❌ No | ❌ No |
| **Migraciones** | ✅ Automáticas | ✅ Sí | ⚠️ Manual | ⚠️ Flyway/Liquibase |
| **Autenticación** | ✅ Incluida | ✅ Incluida | ❌ Passport.js | ⚠️ Spring Security |
| **Seguridad** | ✅ Por defecto | ✅ Buena | ⚠️ Manual | ✅ Buena |
| **API REST** | ✅ DRF potente | ⚠️ Manual | ⚠️ Manual | ⚠️ Verboso |
| **Curva de aprendizaje** | ⚠️ Media | ⚠️ Media | ✅ Fácil | ❌ Difícil |
| **Velocidad desarrollo** | ✅ Rápida | ✅ Rápida | ⚠️ Media | ❌ Lenta |
| **Código necesario** | ✅ Poco | ⚠️ Medio | ❌ Mucho | ❌ Mucho |

**Conclusión:** Django ofrece la mejor relación **productividad/funcionalidades/seguridad**.

---

### **4️⃣ CASOS DE USO REALES DE DJANGO**

**Empresas que usan Django:**
- 🌐 **Instagram** - Red social con millones de usuarios
- 🎵 **Spotify** - Procesamiento de datos y APIs
- 📰 **The Washington Post** - Gestión de contenido
- 📌 **Pinterest** - Manejo de imágenes y datos
- 🚗 **Uber** - Gestión de viajes y pagos
- 🎬 **Netflix** - Partes del backend

**Por qué funciona para ellos (y para TurboEmpleo):**
- Escala con millones de usuarios
- Maneja grandes volúmenes de datos
- APIs REST de alto rendimiento
- Seguridad empresarial

---

### **5️⃣ VENTAJAS ESPECÍFICAS PARA TURBOEMPLEO**

| Requisito del proyecto | Cómo Django lo resuelve |
|------------------------|-------------------------|
| **Múltiples tipos de usuarios** (Aspirante, Empresa, Admin) | Sistema de autenticación flexible con `AbstractBaseUser` |
| **Gestión de archivos** (CVs, fotos) | `FileField` y `ImageField` con validación automática |
| **Relaciones complejas** (Postulación → Aspirante → Vacante → Empresa) | ORM con ForeignKey y optimización de queries |
| **Notificaciones automáticas** | Sistema de Signals |
| **Filtros dinámicos** (buscar vacantes por ciudad, salario) | QuerySets con filtros encadenables |
| **Validaciones de negocio** (no postularse dos veces) | Serializers con método `validate()` |
| **Emails de activación** | Sistema de email incluido |
| **API REST completa** | Django REST Framework |
| **Seguridad** (contraseñas, tokens) | Baterías incluidas |

---

### **6️⃣ ESTADÍSTICAS RELEVANTES**

- **Velocidad de desarrollo:** 40% más rápido que otros frameworks
- **Líneas de código:** 60% menos código que Node.js o Java
- **Comunidad:** +2 millones de desarrolladores
- **Paquetes disponibles:** +330,000 en PyPI
- **Documentación:** Una de las mejores del mundo web

---

## 🎤 **RESPUESTA COMPLETA PARA LA SUSTENTACIÓN**

**Versión corta (2 minutos):**
> "Elegimos Python y Django por tres razones principales:
>
> **1. Productividad:** Django incluye todo lo necesario 'de la caja': ORM, admin panel, autenticación, seguridad, migraciones. Esto nos permitió desarrollar en 3 meses lo que en otros frameworks tomaría 6.
>
> **2. Seguridad:** Django protege automáticamente contra SQL Injection, XSS, CSRF y otros ataques. No tenemos que implementar seguridad manualmente.
>
> **3. Django REST Framework:** Nos permite crear APIs REST en 5 líneas de código vs 100 en otros frameworks. Incluye serialización, validación, paginación, y autenticación JWT.
>
> Python es legible, tiene un ecosistema enorme, y empresas como Instagram, Spotify y Uber lo usan. Para un sistema de intermediación laboral con múltiples usuarios, relaciones complejas y manejo de archivos, Django fue la elección perfecta."

**Versión extendida (5 minutos):**
[Incluir ejemplos de código del documento, mostrar el admin panel, demostrar migraciones, etc.]

---

## 🎯 **CÓMO DEMOSTRARLO EN VIVO**

### **1. Mostrar el ORM:**
```bash
python manage.py shell
```
```python
>>> from usuarios.models import Postulacion
>>> Postulacion.objects.filter(pos_estado='Postulado').count()
5
```

### **2. Mostrar el Admin Panel:**
- Abrir `http://127.0.0.1:8000/admin/`
- Iniciar sesión
- Mostrar CRUD de Postulaciones, Vacantes, etc.

### **3. Mostrar migraciones:**
```bash
ls backend/usuarios/migrations/
```
Explicar cada archivo de migración

### **4. Mostrar código compacto:**
- Abrir `views.py`
- Mostrar ViewSet de 5 líneas
- Comparar con código manual (que sería 100 líneas)

---

## 📌 **RESUMEN EJECUTIVO**

✅ **Python:** Sintaxis clara, ecosistema rico, tipado dinámico
✅ **Django:** Baterías incluidas, desarrollo rápido, seguro por defecto
✅ **DRF:** API REST en minutos, no horas
✅ **ORM:** No escribimos SQL, previene inyección
✅ **Admin:** Panel gratis, ahorra 2-3 semanas
✅ **Migraciones:** Evolución segura de la BD
✅ **Empresas reales:** Instagram, Spotify, Uber lo usan

**Conclusión:** Django + Python fue la mejor elección para desarrollar TurboEmpleo de forma rápida, segura y escalable.

---

**¡Éxito en tu sustentación! 🚀**

*Documento creado: 8 de noviembre de 2025*
*Proyecto: TurboEmpleo - Sistema de Intermediación Laboral*
