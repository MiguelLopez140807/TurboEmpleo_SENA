# Script para cargar datos iniciales de TurboEmpleo
# Ejecutar con: python manage.py shell < cargar_datos_iniciales.py

from django.contrib.auth.models import User
from usuarios.models import Empresa, Aspirante, Vacante, Postulacion
from datetime import datetime, date
import os

print("🚀 Iniciando carga de datos iniciales de TurboEmpleo...")

# === USUARIOS BASE ===
# Admin
admin_user, created = User.objects.get_or_create(
    username='admin',
    defaults={
        'email': 'admin@turboempleo.com',
        'is_staff': True,
        'is_superuser': True,
        'first_name': 'Administrador',
        'last_name': 'TurboEmpleo'
    }
)
if created:
    admin_user.set_password('admin123')
    admin_user.save()
    print("✅ Usuario admin creado")

# === EMPRESAS ===
empresas_data = [
    {
        'em_nombre': 'Vecol',
        'em_email': 'contacto@vecol.com.co',
        'em_nit': '800123456-7',
        'em_telefono': '3101234567',
        'em_direccion': 'Carrera 7 # 45-12, Bogotá',
        'em_ciudad': 'Bogotá',
        'em_sector': 'Energía',
        'em_descripcion': 'Empresa líder en distribución de combustibles en Colombia',
        'em_score_turbo': 95.5,
        'em_total_postulaciones_turbo': 15,
        'em_respuestas_a_tiempo': 14
    },
    {
        'em_nombre': 'Bancolombia',
        'em_email': 'rrhh@bancolombia.com.co',
        'em_nit': '890903938-8',
        'em_telefono': '3209876543',
        'em_direccion': 'Calle 50 # 51-20, Medellín',
        'em_ciudad': 'Medellín',
        'em_sector': 'Financiero',
        'em_descripcion': 'Banco líder en servicios financieros',
        'em_score_turbo': 88.0,
        'em_total_postulaciones_turbo': 12,
        'em_respuestas_a_tiempo': 10
    },
    {
        'em_nombre': 'Rappi',
        'em_email': 'jobs@rappi.com',
        'em_nit': '900654321-1',
        'em_telefono': '3157654321',
        'em_direccion': 'Carrera 11A # 98-50, Bogotá',
        'em_ciudad': 'Bogotá',
        'em_sector': 'Tecnología',
        'em_descripcion': 'Plataforma de delivery y servicios on-demand',
        'em_score_turbo': 92.3,
        'em_total_postulaciones_turbo': 20,
        'em_respuestas_a_tiempo': 18
    }
]

empresas = []
for emp_data in empresas_data:
    # Crear usuario para la empresa
    user_emp, created = User.objects.get_or_create(
        username=f"emp_{emp_data['em_nombre'].lower().replace(' ', '_')}",
        defaults={
            'email': emp_data['em_email'],
            'first_name': emp_data['em_nombre'],
            'last_name': 'Empresa'
        }
    )
    if created:
        user_emp.set_password('empresa123')
        user_emp.save()
    
    # Crear empresa
    empresa, created = Empresa.objects.get_or_create(
        em_nit=emp_data['em_nit'],
        defaults={**emp_data, 'em_usuario_fk': user_emp}
    )
    empresas.append(empresa)
    if created:
        print(f"✅ Empresa {empresa.em_nombre} creada")

# === ASPIRANTES ===
aspirantes_data = [
    {
        'asp_nombre': 'Miguel Angel',
        'asp_apellido': 'Lopez Leon',
        'asp_correo': 'miguel.lopez@email.com',
        'asp_telefono': '3101234567',
        'asp_ciudad': 'Bogotá',
        'asp_ocupacion': 'Desarrollador Frontend',
        'asp_experiencia': 'Senior - 5 años de experiencia en React y JavaScript',
        'asp_creditos_turbo_disponibles': 5
    },
    {
        'asp_nombre': 'Valeria',
        'asp_apellido': 'Pinzon',
        'asp_correo': 'valeria.pinzon@email.com',
        'asp_telefono': '3209876543',
        'asp_ciudad': 'Medellín',
        'asp_ocupacion': 'Diseñadora UX/UI',
        'asp_experiencia': 'Mid - 3 años en diseño de experiencias digitales',
        'asp_creditos_turbo_disponibles': 3
    },
    {
        'asp_nombre': 'Carlos',
        'asp_apellido': 'Rodriguez',
        'asp_correo': 'carlos.rodriguez@email.com',
        'asp_telefono': '3157654321',
        'asp_ciudad': 'Cali',
        'asp_ocupacion': 'Analista de Datos',
        'asp_experiencia': 'Junior - 2 años en análisis de datos con Python',
        'asp_creditos_turbo_disponibles': 8
    },
    {
        'asp_nombre': 'Sofia',
        'asp_apellido': 'Martinez',
        'asp_correo': 'sofia.martinez@email.com',
        'asp_telefono': '3185432109',
        'asp_ciudad': 'Barranquilla',
        'asp_ocupacion': 'Project Manager',
        'asp_experiencia': 'Senior - 7 años gestionando proyectos de tecnología',
        'asp_creditos_turbo_disponibles': 2
    }
]

aspirantes = []
for asp_data in aspirantes_data:
    # Crear usuario para el aspirante
    user_asp, created = User.objects.get_or_create(
        username=f"asp_{asp_data['asp_nombre'].lower()}_{asp_data['asp_apellido'].lower()}",
        defaults={
            'email': asp_data['asp_correo'],
            'first_name': asp_data['asp_nombre'],
            'last_name': asp_data['asp_apellido']
        }
    )
    if created:
        user_asp.set_password('aspirante123')
        user_asp.save()
    
    # Crear aspirante
    aspirante, created = Aspirante.objects.get_or_create(
        asp_correo=asp_data['asp_correo'],
        defaults={**asp_data, 'asp_usuario_fk': user_asp}
    )
    aspirantes.append(aspirante)
    if created:
        print(f"✅ Aspirante {aspirante.asp_nombre} {aspirante.asp_apellido} creado")

# === VACANTES ===
vacantes_data = [
    {
        'va_titulo': 'Desarrollador Front-End Senior (React)',
        'va_descripcion': 'Buscamos desarrollador React con experiencia en proyectos enterprise',
        'va_ubicacion': 'Bogotá',
        'va_salario': 8500000,
        'va_requisitos': 'React, JavaScript ES6+, Git, metodologías ágiles',
        'va_tipo_empleo': 'Tiempo completo',
        'va_estado': 'Activa',
        'va_modo_turbo': True,
        'va_habilidades': 'React, JavaScript, CSS3, Git',
        'va_beneficios': 'Seguro médico, capacitaciones, trabajo remoto',
        'va_idEmpresa_fk': empresas[0]  # Vecol
    },
    {
        'va_titulo': 'Analista de Riesgos Financieros',
        'va_descripcion': 'Analista para evaluación de riesgos crediticios en productos bancarios',
        'va_ubicacion': 'Medellín',
        'va_salario': 6500000,
        'va_requisitos': 'Ingeniería financiera, Excel avanzado, conocimientos en SQL',
        'va_tipo_empleo': 'Tiempo completo',
        'va_estado': 'Activa',
        'va_modo_turbo': False,
        'va_habilidades': 'Excel, SQL, Análisis financiero',
        'va_beneficios': 'Seguro médico, bonos por desempeño',
        'va_idEmpresa_fk': empresas[1]  # Bancolombia
    },
    {
        'va_titulo': 'UX/UI Designer',
        'va_descripcion': 'Diseñador de experiencias para aplicaciones móviles',
        'va_ubicacion': 'Bogotá',
        'va_salario': 5500000,
        'va_requisitos': 'Figma, Adobe XD, prototipado, design thinking',
        'va_tipo_empleo': 'Tiempo completo',
        'va_estado': 'Activa',
        'va_modo_turbo': True,
        'va_habilidades': 'Figma, Adobe XD, Prototipado',
        'va_beneficios': 'Trabajo híbrido, cursos de capacitación',
        'va_idEmpresa_fk': empresas[2]  # Rappi
    },
    {
        'va_titulo': 'Data Scientist',
        'va_descripcion': 'Científico de datos para análisis predictivos',
        'va_ubicacion': 'Remoto',
        'va_salario': 9200000,
        'va_requisitos': 'Python, machine learning, estadística, SQL',
        'va_tipo_empleo': 'Tiempo completo',
        'va_estado': 'Activa',
        'va_modo_turbo': True,
        'va_habilidades': 'Python, Machine Learning, SQL',
        'va_beneficios': 'Trabajo 100% remoto, equipos de alta gama',
        'va_idEmpresa_fk': empresas[2]  # Rappi
    },
    {
        'va_titulo': 'Project Manager IT',
        'va_descripcion': 'Gestor de proyectos para área de tecnología',
        'va_ubicacion': 'Medellín',
        'va_salario': 7800000,
        'va_requisitos': 'PMP, Scrum Master, metodologías ágiles',
        'va_tipo_empleo': 'Tiempo completo',
        'va_estado': 'Inactiva',
        'va_modo_turbo': False,
        'va_habilidades': 'PMP, Scrum, Jira',
        'va_beneficios': 'Certificaciones pagadas por la empresa',
        'va_idEmpresa_fk': empresas[1]  # Bancolombia
    }
]

vacantes = []
for vac_data in vacantes_data:
    vacante, created = Vacante.objects.get_or_create(
        va_titulo=vac_data['va_titulo'],
        va_idEmpresa_fk=vac_data['va_idEmpresa_fk'],
        defaults=vac_data
    )
    vacantes.append(vacante)
    if created:
        print(f"✅ Vacante {vacante.va_titulo} creada para {vacante.va_idEmpresa_fk.em_nombre}")

# === POSTULACIONES ===
postulaciones_data = [
    {
        'pos_aspirante_fk': aspirantes[0],  # Miguel
        'pos_vacante_fk': vacantes[0],      # React Developer - Vecol
        'pos_estado': 'Pendiente',
        'pos_es_turbo': True
    },
    {
        'pos_aspirante_fk': aspirantes[1],  # Valeria
        'pos_vacante_fk': vacantes[2],      # UX/UI Designer - Rappi
        'pos_estado': 'Pendiente',
        'pos_es_turbo': True
    },
    {
        'pos_aspirante_fk': aspirantes[1],  # Valeria
        'pos_vacante_fk': vacantes[0],      # React Developer - Vecol
        'pos_estado': 'Pendiente',
        'pos_es_turbo': True
    },
    {
        'pos_aspirante_fk': aspirantes[2],  # Carlos
        'pos_vacante_fk': vacantes[3],      # Data Scientist - Rappi
        'pos_estado': 'Aceptada',
        'pos_es_turbo': False
    },
    {
        'pos_aspirante_fk': aspirantes[3],  # Sofia
        'pos_vacante_fk': vacantes[4],      # Project Manager - Bancolombia
        'pos_estado': 'Rechazada',
        'pos_es_turbo': False
    },
    {
        'pos_aspirante_fk': aspirantes[0],  # Miguel
        'pos_vacante_fk': vacantes[1],      # Analista Riesgos - Bancolombia
        'pos_estado': 'Pendiente',
        'pos_es_turbo': False
    }
]

for post_data in postulaciones_data:
    try:
        postulacion, created = Postulacion.objects.get_or_create(
            pos_aspirante_fk=post_data['pos_aspirante_fk'],
            pos_vacante_fk=post_data['pos_vacante_fk'],
            defaults=post_data
        )
        if created:
            print(f"✅ Postulación de {postulacion.pos_aspirante_fk.asp_nombre} a {postulacion.pos_vacante_fk.va_titulo}")
    except Exception as e:
        print(f"❌ Error creando postulación: {e}")

print(f"""
🎉 ¡Datos iniciales cargados exitosamente!

📊 Resumen:
• {len(empresas)} empresas creadas
• {len(aspirantes)} aspirantes creados  
• {len(vacantes)} vacantes creadas
• {Postulacion.objects.count()} postulaciones creadas

🔐 Credenciales de prueba:
• Admin: admin / admin123
• Empresas: emp_[nombre] / empresa123
• Aspirantes: asp_[nombre]_[apellido] / aspirante123

✅ Tu compañero podrá usar estos datos ejecutando:
   python manage.py shell < cargar_datos_iniciales.py
""")