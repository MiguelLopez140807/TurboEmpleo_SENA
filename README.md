# 🚀 TurboEmpleo

<div align="center">

![TurboEmpleo Logo](frontend/src/assets/img/Logo/turboempleo.png)

**Plataforma web moderna para la gestión de vacantes y postulaciones laborales**

[![React](https://img.shields.io/badge/React-19.1.1-61DAFB?logo=react)](https://react.dev/)
[![Django](https://img.shields.io/badge/Django-5.1.3-092E20?logo=django)](https://www.djangoproject.com/)
[![Vite](https://img.shields.io/badge/Vite-6.0.5-646CFF?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4.17-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

[Características](#-características) • [Instalación](#-instalación-completa) • [Estructura](#-estructura-del-proyecto) • [Funcionalidades](#-funcionalidades-principales) • [Tecnologías](#-tecnologías-utilizadas)

</div>

---

## 📋 Descripción del Proyecto

TurboEmpleo es una plataforma integral de gestión de empleo que conecta empresas con aspirantes de manera eficiente. El sistema permite a las empresas publicar vacantes, gestionar postulaciones y visualizar perfiles completos de candidatos, mientras que los aspirantes pueden buscar oportunidades, postularse con un solo clic y dar seguimiento a sus aplicaciones.

### 🎯 Propósito
Facilitar el proceso de reclutamiento y búsqueda de empleo mediante una interfaz moderna, intuitiva y eficiente, optimizando el tiempo tanto de empleadores como de candidatos.

---

## ✨ Características

### Para Empresas 🏢
- ✅ Publicación y gestión completa de vacantes
- ✅ Panel de postulaciones recibidas con filtros avanzados
- ✅ Vista detallada del perfil completo de aspirantes
- ✅ Gestión de estados de postulaciones (Pendiente, En Revisión, Entrevista, Aceptada, Rechazada)
- ✅ Descarga de currículums en PDF
- ✅ Edición y eliminación de vacantes
- ✅ Dashboard con estadísticas

### Para Aspirantes 👤
- ✅ Búsqueda de vacantes con filtros por ubicación, tipo de empleo y sector
- ✅ Postulación rápida con validación de CV
- ✅ Historial completo de postulaciones con estados
- ✅ Perfil profesional editable
- ✅ Vista detallada de vacantes
- ✅ Dashboard personalizado
- ✅ Gestión de experiencia laboral y académica

### Características Generales 🌟
- 🔐 Autenticación segura con JWT
- 🎨 Diseño moderno y responsive con Tailwind CSS
- 🔄 Validaciones en tiempo real
- 📧 Recuperación de contraseña por correo
- 🔒 Bloqueo temporal por intentos fallidos de login
- 📱 Interfaz adaptable a dispositivos móviles
- 🎭 Sistema de roles (Aspirante, Empresa, Admin)

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 19.1.1** - Biblioteca principal de UI
- **Vite 6.0.5** - Bundler y dev server
- **React Router 7.1.1** - Enrutamiento
- **TailwindCSS 3.4.17** - Framework de estilos
- **React Icons 5.5.0** - Biblioteca de iconos
- **Axios** (opcional) - Cliente HTTP

### Backend
- **Django 5.1.3** - Framework web principal
- **Django REST Framework** - API REST
- **Simple JWT** - Autenticación con tokens JWT
- **Django CORS Headers** - Manejo de CORS
- **Pillow** - Procesamiento de imágenes
- **Python 3.10+** - Lenguaje de programación

### Base de Datos
- **SQLite** (desarrollo) - Base de datos local
- **MySQL** (producción) - Base de datos relacional

---

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Python 3.10 o superior** - [Descargar Python](https://www.python.org/downloads/)
- **Node.js 18 o superior** - [Descargar Node.js](https://nodejs.org/)
- **Git** - [Descargar Git](https://git-scm.com/)
- **MySQL** (opcional, para producción) - [Descargar MySQL](https://dev.mysql.com/downloads/)
- **Editor de código** - Se recomienda [VS Code](https://code.visualstudio.com/)

### Verificar instalaciones
```bash
python --version  # Debe ser 3.10 o superior
node --version    # Debe ser 18 o superior
npm --version     # Debe estar instalado con Node.js
git --version     # Debe estar instalado
```

---

## 🚀 Instalación Completa

### 1️⃣ Clonar el Repositorio

```bash
# Clonar el proyecto
git clone https://github.com/MiguelLopez1408/TURBOEMPLEO_PROYECTO.git

# Navegar al directorio del proyecto
cd TURBOEMPLEO_PROYECTO_Millos
```

### 2️⃣ Configuración del Backend (Django)

#### Paso 1: Crear y activar entorno virtual

**En Windows (PowerShell):**
```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate
```

**En Windows (CMD):**
```cmd
cd backend
python -m venv venv
venv\Scripts\activate.bat
```

**En Linux/Mac:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
```

#### Paso 2: Instalar dependencias

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

**Dependencias principales instaladas:**
- Django==5.1.3
- djangorestframework
- djangorestframework-simplejwt
- django-cors-headers
- Pillow
- mysqlclient (si usas MySQL)

#### Paso 3: Configurar la base de datos

**Opción A: SQLite (Desarrollo - Ya configurado)**

El proyecto usa SQLite por defecto. No requiere configuración adicional.

**Opción B: MySQL (Producción)**

1. Crear la base de datos en MySQL:
```sql
CREATE DATABASE turboempleo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Editar `backend/mi_backend/settings.py`:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'turboempleo',
        'USER': 'tu_usuario',
        'PASSWORD': 'tu_contraseña',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
```

#### Paso 4: Ejecutar migraciones

```bash
# Crear archivos de migración
python manage.py makemigrations

# Aplicar migraciones a la base de datos
python manage.py migrate
```

#### Paso 5: Crear superusuario (Admin)

```bash
python manage.py createsuperuser
```

Ingresa los datos solicitados:
- Nombre de usuario
- Correo electrónico
- Contraseña (mínimo 8 caracteres)

#### Paso 6: Crear directorios para archivos media

```bash
# Windows (PowerShell)
New-Item -ItemType Directory -Path media/curriculums -Force
New-Item -ItemType Directory -Path media/fotos_aspirantes -Force
New-Item -ItemType Directory -Path media/logos_empresas -Force
New-Item -ItemType Directory -Path media/empresas_docs -Force

# Linux/Mac
mkdir -p media/curriculums media/fotos_aspirantes media/logos_empresas media/empresas_docs
```

#### Paso 7: Iniciar el servidor de desarrollo

```bash
python manage.py runserver
```

El backend estará disponible en: **http://127.0.0.1:8000**

**URLs importantes del backend:**
- API REST: http://127.0.0.1:8000/api/
- Admin Panel: http://127.0.0.1:8000/admin/
- Login: http://127.0.0.1:8000/api/login/
- Registro: http://127.0.0.1:8000/api/registro/

### 3️⃣ Configuración del Frontend (React + Vite)

**Abre una nueva terminal** (mantén el backend ejecutándose)

#### Paso 1: Navegar a la carpeta frontend

```bash
cd frontend
```

#### Paso 2: Instalar dependencias de Node.js

```bash
npm install
```

**Dependencias principales instaladas:**
- react@19.1.1
- react-dom@19.1.1
- react-router-dom@7.1.1
- tailwindcss@3.4.17
- react-icons@5.5.0
- vite@6.0.5

#### Paso 3: Iniciar servidor de desarrollo

```bash
npm run dev
```

El frontend estará disponible en: **http://localhost:5173**

#### Paso 4: Acceder a la aplicación

Abre tu navegador y visita: **http://localhost:5173**

---

## 📁 Estructura del Proyecto

```
TURBOEMPLEO_PROYECTO_Millos/
│
├── backend/                          # Backend Django
│   ├── mi_backend/                   # Configuración principal del proyecto
│   │   ├── __init__.py
│   │   ├── settings.py               # Configuración de Django
│   │   ├── urls.py                   # URLs principales del proyecto
│   │   ├── wsgi.py                   # Configuración WSGI
│   │   └── asgi.py                   # Configuración ASGI
│   │
│   ├── usuarios/                     # App principal de usuarios y funcionalidades
│   │   ├── models.py                 # Modelos: Usuarios, Aspirante, Empresa, Vacante, Postulacion, etc.
│   │   ├── views.py                  # ViewSets y vistas de API
│   │   ├── serializers.py            # Serializers para API REST
│   │   ├── urls.py                   # URLs de la app usuarios
│   │   ├── admin.py                  # Configuración del panel admin
│   │   ├── activation_views.py       # Vistas para activación de cuenta
│   │   ├── password_reset_views.py   # Vistas para reseteo de contraseña
│   │   ├── password_views.py         # Vistas para cambio de contraseña
│   │   └── migrations/               # Migraciones de base de datos
│   │
│   ├── media/                        # Archivos subidos por usuarios
│   │   ├── curriculums/              # PDFs de currículums
│   │   ├── fotos_aspirantes/         # Fotos de perfil de aspirantes
│   │   ├── logos_empresas/           # Logos de empresas
│   │   └── empresas_docs/            # Documentos de presentación de empresas
│   │
│   ├── manage.py                     # Script de gestión de Django
│   ├── requirements.txt              # Dependencias de Python
│   └── db.sqlite3                    # Base de datos SQLite (desarrollo)
│
├── frontend/                         # Frontend React + Vite
│   ├── src/
│   │   ├── main.jsx                  # Punto de entrada de React
│   │   ├── App.jsx                   # Componente principal con rutas
│   │   ├── index.css                 # Estilos globales y Tailwind
│   │   │
│   │   ├── components/               # Componentes reutilizables
│   │   │   ├── navbar.jsx            # Barra de navegación
│   │   │   ├── footer.jsx            # Pie de página
│   │   │   ├── layout.jsx            # Layout general
│   │   │   └── loginLayout.jsx       # Layout para login
│   │   │
│   │   ├── pages/                    # Páginas de la aplicación
│   │   │   │
│   │   │   ├── public/               # Páginas públicas (sin autenticación)
│   │   │   │   ├── LandingPage.jsx           # Página de inicio
│   │   │   │   ├── Login.jsx                 # Página de login
│   │   │   │   ├── Register.jsx              # Selector de tipo de registro
│   │   │   │   ├── RegisterAspirante.jsx     # Formulario de registro aspirante
│   │   │   │   ├── RegisterEmpresa.jsx       # Formulario de registro empresa
│   │   │   │   ├── RecuperarPassword.jsx     # Solicitud de recuperación
│   │   │   │   ├── RestablecerPassword.jsx   # Cambio de contraseña
│   │   │   │   ├── ActivarCuenta.jsx         # Activación de cuenta
│   │   │   │   ├── PoliticaDatos.jsx         # Política de datos
│   │   │   │   └── PoliticaPrivacidad.jsx    # Política de privacidad
│   │   │   │
│   │   │   ├── aspirantes/           # Páginas del aspirante (protegidas)
│   │   │   │   ├── DashboardAspirante.jsx         # Dashboard principal
│   │   │   │   ├── PerfilAspirante.jsx            # Perfil y configuración
│   │   │   │   ├── CompletarPerfilAspirante.jsx   # Completar perfil inicial
│   │   │   │   ├── VacantesDisponibles.jsx        # Búsqueda de vacantes
│   │   │   │   ├── DetalleVacante.jsx             # Detalle de una vacante
│   │   │   │   ├── PostulacionesAspirante.jsx     # Historial de postulaciones
│   │   │   │   └── DetallePostulacion.jsx         # Detalle de postulación
│   │   │   │
│   │   │   ├── empresas/             # Páginas de empresa (protegidas)
│   │   │   │   ├── DashboardEmpresa.jsx              # Dashboard principal
│   │   │   │   ├── PerfilEmpresa.jsx                 # Perfil y configuración
│   │   │   │   ├── VacantesEmpresa.jsx               # Lista de vacantes publicadas
│   │   │   │   ├── FormVacanteEmpresa.jsx            # Crear nueva vacante
│   │   │   │   ├── EditarVacanteEmpresa.jsx          # Editar vacante existente
│   │   │   │   └── PostulacionesRecibidasEmpresa.jsx # Gestión de postulaciones
│   │   │   │
│   │   │   ├── admin/                # Páginas del administrador
│   │   │   │   └── Admin.jsx         # Panel de administración
│   │   │   │
│   │   │   └── DashboardRedirect.jsx # Redirección según rol de usuario
│   │   │
│   │   └── assets/                   # Recursos estáticos
│   │       └── img/                  # Imágenes
│   │           ├── Logo/             # Logos de la aplicación
│   │           └── LandingPage/      # Imágenes de landing page
│   │
│   ├── public/                       # Archivos públicos estáticos
│   ├── index.html                    # HTML principal
│   ├── package.json                  # Dependencias de Node.js
│   ├── vite.config.js                # Configuración de Vite
│   ├── tailwind.config.js            # Configuración de Tailwind
│   ├── postcss.config.js             # Configuración de PostCSS
│   └── eslint.config.js              # Configuración de ESLint
│
├── test/                             # Pruebas automatizadas Selenium
│   ├── Pruebas Automaticas TurboEmpleo # 1.side
│   ├── Pruebas Automaticas TurboEmpleo # 2.side
│   ├── Pruebas Automaticas TurboEmpleo # 3.side
│   ├── Pruebas Automaticas TurboEmpleo # 4.side
│   └── Pruebas Automaticas TurboEmpleo # 5.side
│
├── turboempleo_.sql                  # Backup de base de datos actual
├── turboempleo_antiguo.sql           # Backup de base de datos antigua
└── README.md                         # Este archivo
```

---

## 🎯 Funcionalidades Principales

### 🔐 Autenticación y Seguridad

**Ubicación:** `backend/usuarios/views.py`, `frontend/src/pages/public/`

#### Características:
- Login con JWT (JSON Web Tokens)
- Registro diferenciado para Aspirantes y Empresas
- Recuperación de contraseña por correo electrónico
- Activación de cuenta vía email
- Bloqueo temporal tras 5 intentos fallidos de login (5 minutos)
- Cambio de contraseña desde el perfil
- Cierre de sesión con limpieza de tokens

#### Archivos clave:
- `usuarios/serializers.py` - MyTokenObtainPairSerializer (validación y bloqueo)
- `usuarios/views.py` - RegistroAPIView, PasswordResetView
- `frontend/src/pages/public/Login.jsx`
- `frontend/src/pages/public/Register.jsx`
- `frontend/src/pages/public/RecuperarPassword.jsx`

---

### 👤 Gestión de Aspirantes

**Ubicación:** `frontend/src/pages/aspirantes/`

#### Funcionalidades:

**1. Dashboard (`DashboardAspirante.jsx`)**
- Resumen de postulaciones (total, pendientes, aceptadas)
- Accesos rápidos a funcionalidades principales
- Vista de estado del perfil

**2. Perfil (`PerfilAspirante.jsx`)**
- Datos personales editables
- Foto de perfil
- Currículum en PDF
- Experiencia laboral
- Formación académica
- Idiomas
- Configuración de cuenta (cambio de contraseña, eliminación de cuenta)

**3. Búsqueda de Vacantes (`VacantesDisponibles.jsx`)**
- Filtros por:
  - Ubicación
  - Tipo de empleo
  - Búsqueda por texto
- Paginación
- Vista de card con información resumida

**4. Detalle de Vacante (`DetalleVacante.jsx`)**
- Información completa de la vacante
- Datos de la empresa
- Botón de postulación con validación de CV
- Validación de postulación duplicada

**5. Historial de Postulaciones (`PostulacionesAspirante.jsx`)**
- Lista de todas las postulaciones
- Estados: Pendiente, En Revisión, Entrevista Programada, Aceptada, Rechazada
- Fecha de postulación
- Link a detalle de postulación

**6. Detalle de Postulación (`DetallePostulacion.jsx`)**
- Información completa de la vacante
- Estado actual de la postulación
- Datos de la empresa

#### Archivos del backend:
- `usuarios/models.py` - Modelo Aspirante
- `usuarios/serializers.py` - AspiranteSerializer
- `usuarios/views.py` - AspiranteViewSet

---

### 🏢 Gestión de Empresas

**Ubicación:** `frontend/src/pages/empresas/`

#### Funcionalidades:

**1. Dashboard (`DashboardEmpresa.jsx`)**
- Total de vacantes publicadas
- Total de postulaciones recibidas
- Accesos rápidos a gestión de vacantes

**2. Perfil (`PerfilEmpresa.jsx`)**
- Datos de la empresa editables
- Logo de empresa
- Documento de presentación
- Configuración de cuenta

**3. Gestión de Vacantes (`VacantesEmpresa.jsx`)**
- Lista de vacantes publicadas
- Botones de acción: Ver, Editar, Eliminar
- Estados: Activa/Inactiva
- Modal con información completa de vacante
- Estadísticas por vacante

**4. Crear Vacante (`FormVacanteEmpresa.jsx`)**
- Formulario completo:
  - Título
  - Salario
  - Ubicación
  - Tipo de empleo
  - Descripción
  - Requisitos
  - Responsabilidades
  - Beneficios
  - Habilidades requeridas
- Validaciones en frontend

**5. Editar Vacante (`EditarVacanteEmpresa.jsx`)**
- Precarga de datos existentes
- Actualización de campos
- Validación de cambios

**6. Postulaciones Recibidas (`PostulacionesRecibidasEmpresa.jsx`)** ⭐
- **Vista agrupada por vacante** o lista completa
- **Filtros avanzados:**
  - Por vacante específica
  - Por estado de postulación
  - Búsqueda por nombre de aspirante
  - Rango de fechas
  - Ordenamiento (reciente, antiguo, nombre)
- **Gestión de estados:**
  - Pendiente → En Revisión / Entrevista / Rechazada
  - En Revisión → Entrevista / Rechazada
  - Entrevista → Aceptada / Rechazada
- **Vista de perfil completo del aspirante** (Modal):
  - Información de contacto
  - Perfil profesional
  - Ocupación deseada
  - Idiomas
  - Información personal
  - Descarga de CV
- Descarga de currículums
- Contador de resultados

#### Archivos del backend:
- `usuarios/models.py` - Modelos Empresa y Vacante
- `usuarios/serializers.py` - EmpresaSerializer, VacanteSerializer, VacanteWriteSerializer
- `usuarios/views.py` - EmpresaViewSet, VacanteViewSet

---

### 📝 Sistema de Postulaciones

**Ubicación:** `backend/usuarios/models.py` (Modelo Postulacion), `frontend/src/pages/`

#### Características:
- Postulación con un clic
- Validación de CV obligatorio
- Prevención de postulaciones duplicadas
- Estados de postulación:
  - **Pendiente**: Postulación recién enviada
  - **En Revisión**: Empresa está revisando
  - **Entrevista Programada**: Aspirante pasó a entrevista
  - **Aceptada**: Aspirante fue seleccionado
  - **Rechazada**: Postulación rechazada
- Seguimiento en tiempo real
- Historial completo

#### Archivos clave:
- `usuarios/models.py` - Modelo Postulacion
- `usuarios/serializers.py` - PostulacionSerializer, PostulacionWriteSerializer
- `usuarios/views.py` - PostulacionViewSet
- `frontend/src/pages/aspirantes/VacantesDisponibles.jsx` - Postulación
- `frontend/src/pages/empresas/PostulacionesRecibidasEmpresa.jsx` - Gestión

---

## 🎨 Paleta de Colores

El proyecto utiliza una paleta consistente basada en morado:

```css
--primary-purple: #5e17eb     /* Morado principal */
--secondary-purple: #A67AFF   /* Morado claro */
--purple-light: #f6f3ff       /* Fondo morado muy claro */
--purple-lighter: #e9e4fa     /* Fondo morado claro */
--accent-yellow: #ffde59      /* Amarillo de acento */
```

---

## 📡 Endpoints de la API

### Autenticación
```
POST   /api/login/                    # Login con JWT
POST   /api/registro/                 # Registro de usuario
POST   /api/token/refresh/            # Refresh token
POST   /api/password-reset/           # Solicitar reset de contraseña
POST   /api/password-reset-confirm/   # Confirmar reset de contraseña
POST   /api/activate/<uidb64>/<token>/ # Activar cuenta
```

### Usuarios
```
GET    /api/usuarios/                 # Listar usuarios
GET    /api/usuarios/<id>/            # Obtener usuario
PUT    /api/usuarios/<id>/            # Actualizar usuario
DELETE /api/usuarios/<id>/            # Eliminar usuario
```

### Aspirantes
```
GET    /api/aspirantes/               # Listar aspirantes
GET    /api/aspirantes/<id>/          # Obtener aspirante
POST   /api/aspirantes/               # Crear aspirante
PUT    /api/aspirantes/<id>/          # Actualizar aspirante
DELETE /api/aspirantes/<id>/          # Eliminar aspirante
```

### Empresas
```
GET    /api/empresas/                 # Listar empresas
GET    /api/empresas/<id>/            # Obtener empresa
POST   /api/empresas/                 # Crear empresa
PUT    /api/empresas/<id>/            # Actualizar empresa
DELETE /api/empresas/<id>/            # Eliminar empresa
```

### Vacantes
```
GET    /api/vacantes/                 # Listar vacantes
GET    /api/vacantes/<id>/            # Obtener vacante
POST   /api/vacantes/                 # Crear vacante
PUT    /api/vacantes/<id>/            # Actualizar vacante
DELETE /api/vacantes/<id>/            # Eliminar vacante

# Filtros disponibles:
# ?empresa=<id>          - Filtrar por empresa
# ?ubicacion=<ciudad>    - Filtrar por ubicación
# ?tipo_empleo=<tipo>    - Filtrar por tipo de empleo
# ?estado=<estado>       - Filtrar por estado (Activa/Inactiva)
# ?search=<texto>        - Búsqueda en título, descripción y requisitos
```

### Postulaciones
```
GET    /api/postulaciones/            # Listar postulaciones
GET    /api/postulaciones/<id>/       # Obtener postulación
POST   /api/postulaciones/            # Crear postulación
PATCH  /api/postulaciones/<id>/       # Actualizar estado
DELETE /api/postulaciones/<id>/       # Eliminar postulación

# Filtros disponibles:
# ?pos_estado=<estado>   - Filtrar por estado
```

### Experiencia Laboral
```
GET    /api/experiencia-laboral/      # Listar experiencias
POST   /api/experiencia-laboral/      # Crear experiencia
PUT    /api/experiencia-laboral/<id>/ # Actualizar experiencia
DELETE /api/experiencia-laboral/<id>/ # Eliminar experiencia
```

### Experiencia Escolar
```
GET    /api/experiencia-escolar/      # Listar formación
POST   /api/experiencia-escolar/      # Crear formación
PUT    /api/experiencia-escolar/<id>/ # Actualizar formación
DELETE /api/experiencia-escolar/<id>/ # Eliminar formación
```

---

## 🔧 Comandos Útiles

### Backend (Django)

```bash
# Activar entorno virtual
# Windows:
.\venv\Scripts\Activate
# Linux/Mac:
source venv/bin/activate

# Crear nuevas migraciones
python manage.py makemigrations

# Aplicar migraciones
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser

# Ejecutar servidor de desarrollo
python manage.py runserver

# Ejecutar en un puerto específico
python manage.py runserver 8080

# Abrir shell de Django
python manage.py shell

# Crear app nueva
python manage.py startapp nombre_app

# Recolectar archivos estáticos
python manage.py collectstatic

# Ver migraciones aplicadas
python manage.py showmigrations

# Hacer backup de la base de datos
python manage.py dumpdata > backup.json

# Restaurar backup
python manage.py loaddata backup.json
```

### Frontend (React + Vite)

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Previsualizar build de producción
npm run preview

# Limpiar caché
npm run clean

# Actualizar dependencias
npm update

# Verificar dependencias obsoletas
npm outdated

# Instalar una dependencia específica
npm install nombre-paquete

# Desinstalar una dependencia
npm uninstall nombre-paquete
```

---

## 🐛 Solución de Problemas Comunes

### Error: "No module named 'usuarios'"
```bash
# Asegúrate de estar en la carpeta backend
cd backend
python manage.py makemigrations
python manage.py migrate
```

### Error: "Port 8000 is already in use"
```bash
# Windows:
netstat -ano | findstr :8000
taskkill /PID <número_pid> /F

# Linux/Mac:
lsof -ti:8000 | xargs kill -9
```

### Error: "CORS policy" en el navegador
Verifica que en `backend/mi_backend/settings.py` esté configurado:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
```

### Error: "Module not found" en React
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Error al subir archivos grandes
En `backend/mi_backend/settings.py`:
```python
# Aumentar límite de tamaño de archivos
DATA_UPLOAD_MAX_MEMORY_SIZE = 10485760  # 10 MB
FILE_UPLOAD_MAX_MEMORY_SIZE = 10485760  # 10 MB
```

### Base de datos bloqueada (SQLite)
```bash
# Cerrar todos los procesos que usan la BD
# Eliminar archivo de BD y recrear
cd backend
rm db.sqlite3
python manage.py migrate
python manage.py createsuperuser
```

---

## 🚀 Despliegue en Producción

### Preparar Backend

1. **Configurar variables de entorno:**
```python
# backend/mi_backend/settings.py
import os
from pathlib import Path

SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key-here')
DEBUG = False
ALLOWED_HOSTS = ['tudominio.com', 'www.tudominio.com']
```

2. **Configurar base de datos MySQL:**
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.environ.get('DB_NAME'),
        'USER': os.environ.get('DB_USER'),
        'PASSWORD': os.environ.get('DB_PASSWORD'),
        'HOST': os.environ.get('DB_HOST'),
        'PORT': '3306',
    }
}
```

3. **Recolectar archivos estáticos:**
```bash
python manage.py collectstatic --noinput
```

### Preparar Frontend

1. **Actualizar URLs de API:**
```javascript
// Cambiar todas las URLs de http://127.0.0.1:8000
// por la URL de producción
const API_URL = 'https://api.tudominio.com';
```

2. **Construir para producción:**
```bash
npm run build
```

### Servidores Recomendados
- **Backend:** Gunicorn + Nginx
- **Frontend:** Netlify, Vercel, o servidor estático con Nginx
- **Base de datos:** MySQL en servidor dedicado o AWS RDS
- **Archivos media:** AWS S3 o servidor con almacenamiento suficiente

---

## 📊 Modelos de Base de Datos

### Usuarios
- `id` (PK)
- `user_nombre` (unique)
- `user_contraseña`
- `user_rol_fk` (FK → Rol)
- `is_active`
- `is_staff`
- `failed_login_attempts`
- `login_blocked_until`

### Aspirante
- `id` (PK)
- `asp_usuario_fk` (FK → Usuarios)
- `asp_nombre`
- `asp_apellido`
- `asp_correo` (unique)
- `asp_telefono`
- `asp_ciudad`
- `asp_departamento`
- `asp_ocupacion`
- `asp_nacimiento_dia/mes/anio`
- `asp_tipoId`
- `asp_numeroId`
- `asp_foto`
- `asp_curriculum`
- `asp_idiomas` (JSON)
- `asp_cargo`
- `asp_descripcion`

### Empresa
- `id` (PK)
- `em_usuario_fk` (FK → Usuarios)
- `em_nombre`
- `em_nit` (unique)
- `em_email` (unique)
- `em_telefono`
- `em_ciudad`
- `em_departamento`
- `em_sector`
- `em_contacto`
- `em_descripcion`
- `em_sitioWeb`
- `em_tamano`
- `em_direccion`
- `em_logo`
- `em_curriculum`
- `em_idiomas` (JSON)

### Vacante
- `id` (PK)
- `va_idEmpresa_fk` (FK → Empresa)
- `va_titulo`
- `va_descripcion`
- `va_requisitos`
- `va_responsabilidades`
- `va_salario`
- `va_ubicacion`
- `va_tipo_empleo`
- `va_beneficios`
- `va_habilidades`
- `va_estado`
- `va_fecha_publicacion`

### Postulacion
- `id` (PK)
- `pos_aspirante_fk` (FK → Aspirante)
- `pos_vacante_fk` (FK → Vacante)
- `pos_fecha_postulacion`
- `pos_estado`

### Rol
- `id` (PK)
- `rol_nombre` (Aspirante, Empresa, Admin)

### ExperienciaLaboral
- `id` (PK)
- `exp_aspirante_fk` (FK → Aspirante)
- `exp_empresa`
- `exp_cargo`
- `exp_descripcion`
- `exp_fecha_inicio`
- `exp_fecha_fin`

### ExperienciaEscolar
- `id` (PK)
- `exp_aspirante_fk` (FK → Aspirante)
- `exp_institucion`
- `exp_titulo`
- `exp_descripcion`
- `exp_fecha_inicio`
- `exp_fecha_fin`

---

## 📝 Variables de Entorno Recomendadas

Crear archivo `.env` en `backend/`:

```env
SECRET_KEY=tu-clave-secreta-super-segura-aqui
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Base de datos
DB_ENGINE=django.db.backends.mysql
DB_NAME=turboempleo
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_HOST=localhost
DB_PORT=3306

# Email (para recuperación de contraseña)
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=tu_email@gmail.com
EMAIL_HOST_PASSWORD=tu_contraseña_app

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

---


README: Aplicación del Personal Software Process (PSP)

Proyecto: TurboEmpleo (Plataforma de Conexión Laboral)

Este documento aplica los principios del Personal Software Process (PSP) para analizar y mejorar el desempeño individual en el desarrollo del proyecto TurboEmpleo. Se utiliza la data histórica (LOC, tiempo y defectos) para generar un Plan Personal de Mejora (PPIP).

1. Información General del PSP

Campo

Valor

Nombre del Desarrollador

Miguel López (Ficha 3147252)

Fecha de Evaluación

12 de Noviembre de 2025

Proyecto Evaluado

TurboEmpleo (Plataforma de Conexión Laboral)

Lenguaje / Herramienta

Python/Django, React, Tailwind CSS

Centro

CGMLTI - SENA

2. Resumen de Métricas Cuantitativas (Data del Proyecto)

Métrica

Estimado

Real

Desviación (%)

Observaciones

Tamaño Total (KLOC)

10 KLOC

12 KLOC

+20.0%

Se añadieron funcionalidades al módulo de chat (Scope Creep).

Tiempo Invertido (horas)

960 horas

955 horas

-0.52%

Alta precisión en la estimación del esfuerzo.

Productividad (LOC/hora)

10.4 LOC/h

12.5 LOC/h

N/A

Buena productividad para la complejidad del proyecto.

Defectos Totales

N/A

40

N/A

Defectos encontrados en Pruebas y Post-Codificación.

Densidad de Defectos

N/A

3.33 defectos / KLOC

N/A

Meta de calidad a reducir en el próximo ciclo.

3. Análisis de Desempeño y Diagnóstico

3.1. Fortalezas del Proceso Personal

Estimación Precisa: El esfuerzo fue estimado con una desviación mínima (-0.52%), demostrando solidez en la fase de planificación.

Calidad en la Detección: Uso efectivo de Pruebas Automatizadas (Selenium/Locust) para detectar defectos complejos (concurrencia, carga).

Automatización: La implementación de CI/CD aceleró el despliegue y redujo los errores en la entrega final.

Enfoque UX: Uso de Figma para refinar la interfaz y experiencia de usuario antes de codificar.

3.2. Debilidades Clave y Lecciones Aprendidas

Lección Aprendida

Análisis de la Debilidad

Fase de Impacto

Lección 1: Gestión de Versiones de Código

La baja frecuencia de commits (semanal) fue una práctica de alto riesgo que generó conflictos de merge complejos, desperdiciando tiempo en la integración.

Codificación / Integración

Lección 2: Prevención de Defectos

La ausencia de una Revisión de Código formal por un par técnico y el escaso énfasis en Pruebas Unitarias del backend (Django) fueron las causas principales de los 40 defectos encontrados en QA.

Codificación / Pruebas

Lección 3: Formalización del Diseño

La falta de un Diagrama UML o Modelo Entidad-Relación formal en la planificación dificultó la validación temprana de la estructura de datos, impactando negativamente en la codificación del backend.

Planificación / Diseño

4. Plan Personal de Mejora del Proceso (PPIP)

El objetivo es reducir la Densidad de Defectos de 3.33 a menos de 2.0 defectos/KLOC y mejorar la disciplina de gestión de versiones.

Área de Mejora

Acción Específica

Objetivo

Métrica de Seguimiento

Gestión de Versiones

Establecer y cumplir el estándar de 1-3 commits diarios con mensajes claros y atómicos.

Reducir el tiempo perdido en conflictos de merge.

Promedio de commits por día laborable.

Calidad del Código

Implementar la Revisión de Código obligatoria (Pull Request) de un par técnico antes de cualquier merge.

Reducir la Densidad de Defectos a < 2.0 defectos/KLOC.

Densidad de Defectos (defectos / KLOC).

Diseño y Planificación

Incluir la creación de un Diagrama UML de Clases y Modelo Entidad-Relación para el backend antes de comenzar la codificación.

Asegurar que el 100% de los requisitos de datos sean validados en la fase de diseño.

Porcentaje de requisitos de datos validados en diseño.

Pruebas

Aumentar la cobertura de Pruebas Unitarias para la lógica de negocio del backend (Django).

Elevar la Cobertura de Pruebas Unitarias a un mínimo del 80% de la lógica de negocio.

Cobertura de Pruebas Unitarias (%) (medida por herramienta).

5. Conclusión PSP

El proyecto TurboEmpleo, evaluado bajo el marco PSP, fue una experiencia de alto aprendizaje. Demostré una capacidad excepcional para estimar el esfuerzo, pero la calidad inicial del código se vio comprometida por debilidades en la gestión de versiones y la ausencia de revisión por pares. La principal conclusión es que la velocidad no debe sacrificar la disciplina. En futuros proyectos, aplicaré la lección de la disciplina diaria de commits y haré de la revisión de código un paso no negociable para asegurar que la Densidad de Defectos caiga por debajo de 2.0, consolidando un proceso de desarrollo más maduro y de mayor calidad.

## 👥 Contribuir al Proyecto

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto es de código cerrado y es propiedad de Miguel Lopez y Marcela.

---

## 📞 Contacto y Soporte

- **Autor Principal:** Miguel Lopez
- **Colaborador:** Marcela
- **Repositorio:** [https://github.com/MiguelLopez1408/TURBOEMPLEO_PROYECTO](https://github.com/MiguelLopez1408/TURBOEMPLEO_PROYECTO)
- **Email:** [Contactar](mailto:miguel.lopez@example.com)

---

## 🙏 Agradecimientos

- React Team por React 19
- Django Team por Django 5
- TailwindCSS por el framework de estilos
- Vite por el build tool increíblemente rápido
- La comunidad de desarrolladores open source

---

<div align="center">

**⭐ Si te gusta este proyecto, dale una estrella en GitHub! ⭐**

Hecho por Miguel Lopez 

© 2025 TurboEmpleo. Todos los derechos reservados.

</div>
