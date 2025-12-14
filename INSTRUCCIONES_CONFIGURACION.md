# 🚀 TurboEmpleo - Configuración Inicial

## 📋 Instrucciones para Configurar el Proyecto

### 1. **Clonar el Repositorio**
```bash
git clone https://github.com/MiguelLopez140807/TurboEmpleo_SENA.git
cd TurboEmpleo_SENA
```

### 2. **Configurar Backend (Django)**
```bash
cd backend
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
```

### 3. **Cargar Datos Iniciales** 🎯
```bash
python manage.py shell < cargar_datos_iniciales.py
```

### 4. **Configurar Frontend (React)**
```bash
cd ../frontend
npm install
```

### 5. **Iniciar Servidores**

**Terminal 1 - Backend:**
```bash
cd backend
python manage.py runserver
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 6. **Acceder a la Aplicación**
- **Frontend**: http://localhost:5173
- **Backend API**: http://127.0.0.1:8000/api/
- **Admin Django**: http://127.0.0.1:8000/admin/

---

## 🔐 Credenciales de Prueba

### **Administrador**
- Usuario: `admin`
- Contraseña: `admin123`

### **Empresas**
- Usuario: `emp_vecol` / Contraseña: `empresa123`
- Usuario: `emp_bancolombia` / Contraseña: `empresa123`
- Usuario: `emp_rappi` / Contraseña: `empresa123`

### **Aspirantes**
- Usuario: `asp_miguel_lopez` / Contraseña: `aspirante123`
- Usuario: `asp_valeria_pinzon` / Contraseña: `aspirante123`
- Usuario: `asp_carlos_rodriguez` / Contraseña: `aspirante123`
- Usuario: `asp_sofia_martinez` / Contraseña: `aspirante123`

---

## 📊 Datos Pre-cargados

### **Empresas (3)**
1. **Vecol** - Sector Energía (Score Turbo: 95.5)
2. **Bancolombia** - Sector Financiero (Score Turbo: 88.0)
3. **Rappi** - Sector Tecnología (Score Turbo: 92.3)

### **Vacantes (5)**
- Desarrollador Front-End Senior (React) - Vecol ⚡
- Analista de Riesgos Financieros - Bancolombia
- UX/UI Designer - Rappi ⚡
- Data Scientist - Rappi ⚡
- Project Manager IT - Bancolombia (Inactiva)

### **Aspirantes (4)**
- Miguel Angel Lopez - Desarrollador Frontend (5 créditos turbo)
- Valeria Pinzon - Diseñadora UX/UI (3 créditos turbo)
- Carlos Rodriguez - Analista de Datos (8 créditos turbo)
- Sofia Martinez - Project Manager (2 créditos turbo)

### **Postulaciones (6)**
- Miguel → React Developer (Pendiente, Turbo)
- Valeria → UX/UI Designer (Pendiente, Turbo)
- Valeria → React Developer (Pendiente, Turbo)
- Carlos → Data Scientist (Aceptada)
- Sofia → Project Manager (Rechazada)
- Miguel → Analista Riesgos (Pendiente)

---

## ⚡ Funcionalidades Implementadas

### **Sistema de Reportes** 📊
- Dashboard con estadísticas en tiempo real
- Reportes de postulaciones, vacantes y usuarios
- Exportación en CSV, Excel y PDF con diseño profesional
- Filtros paramétricos por fechas, estados y empresas

### **Carga Masiva** 📁
- Importación de vacantes desde archivos CSV
- Validaciones y manejo de errores
- Template de descarga para formato correcto

### **Modo Turbo** ⚡
- Sistema de créditos para postulaciones prioritarias
- Score de empresas basado en tiempo de respuesta
- Filtros y reportes específicos para modo turbo

### **Autenticación y Roles** 🔐
- JWT para autenticación
- Roles diferenciados: Admin, Empresa, Aspirante
- Protección de rutas por roles

---

## 🛠️ Tecnologías Utilizadas

### **Backend**
- Django 5.2.5
- Django REST Framework
- JWT Authentication
- MySQL Database
- openpyxl (Excel)
- reportlab (PDF)

### **Frontend**
- React 18
- Vite
- TailwindCSS
- React Router
- React Icons

---

## 📂 Estructura del Proyecto

```
TurboEmpleo_SENA/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── cargar_datos_iniciales.py  ← Script de datos
│   ├── mi_backend/
│   └── usuarios/
├── frontend/
│   ├── package.json
│   ├── src/
│   ├── pages/
│   └── components/
├── DOCUMENTACION_SISTEMA_REPORTES.md
└── README.md
```

---

## 🐛 Troubleshooting

### **Problema: Error de migraciones**
```bash
python manage.py makemigrations --empty usuarios
python manage.py migrate
```

### **Problema: Puerto ocupado**
```bash
# Backend en puerto 8001
python manage.py runserver 8001

# Frontend en puerto 5174
npm run dev -- --port 5174
```

### **Problema: Datos no aparecen**
```bash
# Re-ejecutar carga de datos
python manage.py shell < cargar_datos_iniciales.py
```

---

## 📞 Contacto

Para dudas o problemas, contactar al equipo de desarrollo.

---

**¡Listo para usar! 🎉**