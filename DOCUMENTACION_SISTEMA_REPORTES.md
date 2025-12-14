# 📊 Sistema de Reportes - TurboEmpleo

## 📋 Índice
- [Descripción General](#descripción-general)
- [Funcionalidades](#funcionalidades)
- [Arquitectura Técnica](#arquitectura-técnica)
- [Tipos de Reportes](#tipos-de-reportes)
- [Formatos de Exportación](#formatos-de-exportación)
- [Interfaz de Usuario](#interfaz-de-usuario)
- [API Endpoints](#api-endpoints)
- [Filtros y Parámetros](#filtros-y-parámetros)
- [Casos de Uso](#casos-de-uso)
- [Configuración y Dependencias](#configuración-y-dependencias)

---

## 🎯 Descripción General

El **Sistema de Reportes** de TurboEmpleo es una funcionalidad integral que permite a los administradores generar, visualizar y exportar informes detallados sobre la actividad de la plataforma. Este sistema proporciona insights valiosos sobre postulaciones, vacantes, usuarios y métricas de rendimiento.

### Características Principales
- ✅ **Reportes paramétricos** con filtros avanzados
- ✅ **Múltiples formatos** de exportación (CSV, Excel, PDF)
- ✅ **Dashboard estadístico** en tiempo real
- ✅ **Interfaz integrada** en el panel administrativo
- ✅ **Diseño profesional** con identidad corporativa
- ✅ **API RESTful** para integración externa

---

## 🚀 Funcionalidades

### 1. **Dashboard de Estadísticas**
- Resumen ejecutivo con métricas clave
- Contadores en tiempo real de:
  - Total de postulaciones (incluye modo turbo)
  - Vacantes activas y publicadas
  - Nuevos usuarios registrados
  - Distribución por estados y empresas

### 2. **Generación de Reportes**
- **Reportes de Postulaciones**: Estados, fechas, empresas, modo turbo
- **Reportes de Vacantes**: Actividad, empresas, tipos de empleo
- **Reportes de Usuarios**: Aspirantes y empresas con estadísticas detalladas

### 3. **Sistema de Filtros**
- Filtros por rango de fechas
- Filtros por estado (activo, pendiente, etc.)
- Filtros por empresa específica
- Filtros por tipo de usuario

### 4. **Exportación Multi-formato**
- **CSV**: Para análisis en hojas de cálculo
- **Excel (.xlsx)**: Con formato profesional y estilos
- **PDF**: Diseño corporativo con logo y colores TurboEmpleo

---

## 🏗️ Arquitectura Técnica

### Backend (Django + DRF)
```
usuarios/views.py
├── ReportesViewSet
│   ├── postulaciones()      # GET /api/reportes/postulaciones/
│   ├── vacantes()           # GET /api/reportes/vacantes/
│   ├── usuarios()           # GET /api/reportes/usuarios/
│   └── dashboard_stats()    # GET /api/reportes/dashboard_stats/
├── _export_csv()            # Exportación CSV
├── _export_excel()          # Exportación Excel con estilos
└── _export_pdf()            # Exportación PDF corporativa
```

### Frontend (React)
```
src/pages/admin/
├── ReportesAdmin.jsx        # Componente principal
│   ├── DashboardStats       # Visualización estadísticas
│   ├── FiltrosSection       # Controles de filtrado
│   ├── ReportButtons        # Botones de generación
│   └── ResultadosTabla      # Visualización de datos
└── Admin.jsx                # Integración en panel admin
```

### Base de Datos
- **Postulacion**: Datos de aplicaciones a vacantes
- **Vacante**: Ofertas laborales publicadas
- **Empresa**: Información de empleadores
- **Aspirante**: Datos de candidatos
- **Filtros dinámicos**: Consultas optimizadas con ORM Django

---

## 📊 Tipos de Reportes

### 1. **Reporte de Postulaciones**
**Endpoint**: `GET /api/reportes/postulaciones/`

**Información incluida**:
- ID de postulación
- Fecha y hora de postulación
- Estado actual (Pendiente, Aceptada, Rechazada)
- Nombre completo del aspirante
- Empresa y vacante asociada
- Indicador de modo turbo

**Filtros disponibles**:
- Rango de fechas
- Estado específico
- Empresa específica
- Solo postulaciones turbo

### 2. **Reporte de Vacantes**
**Endpoint**: `GET /api/reportes/vacantes/`

**Información incluida**:
- ID y título de la vacante
- Empresa publicadora
- Fecha de publicación
- Estado (Activa/Inactiva)
- Ubicación y salario
- Tipo de empleo
- Modo turbo activado

**Estadísticas agregadas**:
- Distribución por estado
- Distribución por empresa
- Promedio de salarios

### 3. **Reporte de Usuarios**
**Endpoint**: `GET /api/reportes/usuarios/`

**Secciones separadas**:

#### **Aspirantes**:
- Información personal (nombre, email, ciudad)
- Fecha de registro
- Número de postulaciones realizadas
- Créditos turbo disponibles
- Ocupación actual

#### **Empresas**:
- Datos corporativos (nombre, NIT, sector)
- Información de contacto
- Número de vacantes publicadas
- Score turbo calculado
- Fecha de registro

---

## 📁 Formatos de Exportación

### 1. **CSV (Comma Separated Values)**
```csv
id,fecha,estado,aspirante,empresa,vacante,es_turbo
1,2025-12-13 20:36,Pendiente,Miguel Lopez,Vecol,Desarrollador Frontend,true
```
- **Uso**: Análisis en Excel, importación a otros sistemas
- **Características**: Encoding UTF-8, delimitadores estándar

### 2. **Excel (.xlsx)**
```excel
[Header con estilo]
| ID | Fecha | Estado | Aspirante | Empresa |
|----|--------|--------|-----------|---------|
| 1  | 13/12  | Pend.  | Miguel L. | Vecol   |
```
- **Características**:
  - Headers con fondo azul y texto blanco
  - Ajuste automático de columnas
  - Formateo de celdas
  - Hoja nombrada según tipo de reporte

### 3. **PDF Corporativo**
```
┌─────────────────────────────────────┐
│     [LOGO]  TURBOEMPLEO     [SPACE] │ ← Header morado
├─────────────────────────────────────┤
│        Reporte de Postulaciones     │ ← Título
│    📅 Generado el DD/MM/YYYY        │ ← Info
│ ─────────────────────────────────── │ ← Línea decorativa
│ 📊 Resumen: 2 registros             │ ← Resumen
│                                     │
│ [TABLA CON DATOS FORMATEADOS]       │ ← Tabla principal
│                                     │
│ TurboEmpleo - www.turboempleo.com   │ ← Footer
└─────────────────────────────────────┘
```

**Características del PDF**:
- Colores corporativos (#5e17eb, #d6c6f9)
- Tipografía Helvetica para legibilidad
- Espacio reservado para logo
- Filas alternadas para fácil lectura
- Límite de 50 registros por legibilidad
- Formateo automático de fechas y booleanos

---

## 🎨 Interfaz de Usuario

### Dashboard Principal
```
┌─────────────────────────────────────────────────────────┐
│ 📊 Sistema de Reportes                                  │
├─────────────────────────────────────────────────────────┤
│ [Dashboard] [Generar Reportes]                          │
├─────────────────────────────────────────────────────────┤
│  📈 Estadísticas Generales                             │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐        │
│ │📧 Posts │ │💼 Vacant│ │👤 Aspir │ │🏢 Empres│        │
│ │   124   │ │   45    │ │   23    │ │   8     │        │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘        │
└─────────────────────────────────────────────────────────┘
```

### Sección de Filtros
```
┌─────────────────────────────────────────────────────────┐
│ 🔍 Filtros de Reporte                                   │
├─────────────────────────────────────────────────────────┤
│ [Fecha Inicio] [Fecha Fin] [Estado▼] [Empresa] [Tipo▼] │
│ [Limpiar Filtros]                                       │
└─────────────────────────────────────────────────────────┘
```

### Botones de Generación
```
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ 📧 Postulaciones│ │ 💼 Vacantes     │ │ 👥 Usuarios     │
├─────────────────┤ ├─────────────────┤ ├─────────────────┤
│ [👁️ Ver Reporte]│ │ [👁️ Ver Reporte]│ │ [👁️ Ver Reporte]│
│ [📄 CSV]        │ │ [📄 CSV]        │ │ [📄 CSV]        │
│ [📊 Excel]      │ │ [📊 Excel]      │ │ [📊 Excel]      │
│ [📋 PDF]        │ │ [📋 PDF]        │ │ [📋 PDF]        │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

---

## 🔗 API Endpoints

### Base URL
```
http://127.0.0.1:8000/api/reportes/
```

### 1. Dashboard Stats
```http
GET /api/reportes/dashboard_stats/
Authorization: Bearer <token>

Response:
{
  "periodo": {
    "inicio": "2025-11-14",
    "fin": "2025-12-14"
  },
  "postulaciones": {
    "total": 124,
    "turbo": 45,
    "por_estado": [...]
  },
  "vacantes": {
    "total": 67,
    "activas": 45,
    "turbo": 23
  }
}
```

### 2. Reporte de Postulaciones
```http
GET /api/reportes/postulaciones/
Authorization: Bearer <token>
Query Parameters:
- fecha_inicio: 2025-12-01
- fecha_fin: 2025-12-14
- estado: Pendiente
- empresa_id: 1
- formato: json|csv|excel|pdf

Response (JSON):
{
  "resumen": {
    "total_postulaciones": 2,
    "filtros_aplicados": {...}
  },
  "estadisticas": {
    "por_estado": [...],
    "por_empresa": [...]
  },
  "datos": [...]
}
```

### 3. Reporte de Vacantes
```http
GET /api/reportes/vacantes/
Authorization: Bearer <token>
Query Parameters:
- fecha_inicio: 2025-12-01
- fecha_fin: 2025-12-14
- estado: Activa
- empresa_id: 1
- formato: json|csv|excel|pdf
```

### 4. Reporte de Usuarios
```http
GET /api/reportes/usuarios/
Authorization: Bearer <token>
Query Parameters:
- fecha_inicio: 2025-12-01
- fecha_fin: 2025-12-14
- tipo: aspirante|empresa
- formato: json|csv|excel|pdf
```

---

## 🔍 Filtros y Parámetros

### Filtros Comunes
| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `fecha_inicio` | date | Fecha inicial del rango | 2025-12-01 |
| `fecha_fin` | date | Fecha final del rango | 2025-12-14 |
| `formato` | string | Formato de exportación | csv, excel, pdf |

### Filtros por Reporte
| Reporte | Parámetros Adicionales |
|---------|------------------------|
| Postulaciones | `estado`, `empresa_id`, `aspirante_id` |
| Vacantes | `estado`, `empresa_id`, `tipo_empleo` |
| Usuarios | `tipo` (aspirante/empresa) |

### Estados Disponibles
- **Postulaciones**: Pendiente, Aceptada, Rechazada
- **Vacantes**: Activa, Inactiva, Cerrada
- **Usuarios**: Activo, Inactivo

---

## 💼 Casos de Uso

### 1. **Análisis de Rendimiento Mensual**
```
Objetivo: Evaluar actividad del último mes
Pasos:
1. Acceder a Dashboard → ver métricas generales
2. Generar reporte de postulaciones con filtro de 30 días
3. Exportar a Excel para análisis detallado
4. Revisar distribución por estados y empresas
```

### 2. **Auditoría de Empresa Específica**
```
Objetivo: Revisar actividad de una empresa
Pasos:
1. Aplicar filtro empresa_id = X
2. Generar reportes de vacantes y postulaciones
3. Exportar PDF para presentación ejecutiva
4. Analizar tendencias y patrones
```

### 3. **Reporte Ejecutivo para Dirección**
```
Objetivo: Presentar resultados a stakeholders
Pasos:
1. Generar dashboard stats del trimestre
2. Exportar reportes en PDF (diseño profesional)
3. Combinar métricas de todas las categorías
4. Presentar insights y recomendaciones
```

### 4. **Análisis de Modo Turbo**
```
Objetivo: Evaluar efectividad del modo turbo
Pasos:
1. Filtrar solo postulaciones con es_turbo=true
2. Comparar tasas de respuesta vs normales
3. Analizar empresas con mejor score turbo
4. Generar recomendaciones de mejora
```

---

## ⚙️ Configuración y Dependencias

### Backend Dependencies
```python
# requirements.txt
django>=5.2.5
djangorestframework
djangorestframework-simplejwt
openpyxl>=3.1.5          # Para Excel
reportlab>=4.4.6         # Para PDF
django-cors-headers
```

### Imports Requeridos
```python
# views.py
from openpyxl import Workbook
from openpyxl.styles import Font, Alignment, PatternFill
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle
from reportlab.lib import colors
```

### Frontend Dependencies
```json
{
  "react": "^18.x",
  "react-icons": "^4.x"
}
```

### Configuración de URLs
```python
# urls.py
router.register(r'reportes', ReportesViewSet, basename='reportes')
```

### Variables de Entorno
```env
# settings.py
DEBUG = True  # Para desarrollo
CORS_ALLOW_ALL_ORIGINS = True  # Para desarrollo local
```

---

## 🔐 Seguridad y Permisos

### Autenticación
- Requiere token JWT válido
- Solo usuarios administradores
- Validación de roles en cada endpoint

### Limitaciones
- Máximo 100 registros en vista web
- Máximo 50 registros en PDF
- Excel y CSV sin límites (optimizado)

### Validaciones
```python
permission_classes = [IsAuthenticated]
# Validación adicional de rol admin en la vista
```

---

## 📈 Métricas y Performance

### Optimizaciones Implementadas
- `select_related()` para evitar N+1 queries
- Filtros eficientes con ORM Django
- Paginación en frontend para grandes datasets
- Límites en PDF para mantener legibilidad

### Monitoreo
- Logs de generación de reportes
- Tracking de formatos más utilizados
- Métricas de tiempo de respuesta

---

## 🚀 Futuras Mejoras

### Funcionalidades Planeadas
- [ ] **Reportes programados** (envío automático por email)
- [ ] **Gráficos interactivos** con Chart.js
- [ ] **Filtros avanzados** (múltiples empresas, rangos de salario)
- [ ] **Cache de reportes** para mejor performance
- [ ] **Exportación a Google Sheets**
- [ ] **Templates personalizados** de PDF
- [ ] **Reportes comparativos** (período vs período)

### Integraciones Posibles
- API de Google Analytics para métricas web
- Integración con sistemas ERP empresariales
- Webhooks para notificaciones automáticas
- Integración con BI tools (PowerBI, Tableau)

---

## 🆘 Soporte y Troubleshooting

### Problemas Comunes

**1. Error en exportación PDF**
```
Causa: Falta reportlab en requirements
Solución: pip install reportlab>=4.4.6
```

**2. Datos no aparecen en reporte**
```
Causa: Filtros muy restrictivos
Solución: Verificar rangos de fechas y estados
```

**3. Excel no abre correctamente**
```
Causa: Encoding o formato incorrecto
Solución: Verificar openpyxl version y UTF-8
```

### Logs de Debug
```python
# Activar en desarrollo
import logging
logger = logging.getLogger(__name__)
logger.debug(f"Generando reporte: {tipoReporte}")
```

---

## 👥 Contacto y Mantenimiento

**Desarrollador**: Equipo TurboEmpleo  
**Última actualización**: Diciembre 2025  
**Versión**: 1.0.0  

Para soporte técnico o mejoras, contactar al equipo de desarrollo.

---

*Este documento forma parte de la documentación técnica del proyecto TurboEmpleo y debe mantenerse actualizado con cada modificación al sistema de reportes.*