from django.core.management.base import BaseCommand
from usuarios.models import Rol, Usuarios, Aspirante, Empresa, Vacante, Postulacion
from django.contrib.auth.hashers import make_password
import json

class Command(BaseCommand):
    help = 'Crea datos de prueba para el proyecto TurboEmpleo'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Creando datos de prueba...'))
        
        # 1. Crear roles
        roles_data = [
            {'id': 1, 'rol_nombre': 'Aspirante'},
            {'id': 2, 'rol_nombre': 'Empresa'}, 
            {'id': 3, 'rol_nombre': 'Admin'},
        ]
        
        for rol_data in roles_data:
            rol, created = Rol.objects.get_or_create(
                id=rol_data['id'],
                defaults={'rol_nombre': rol_data['rol_nombre']}
            )
            if created:
                self.stdout.write(f'Rol creado: {rol.rol_nombre}')
        
        # 2. Crear usuarios de prueba
        usuarios_data = [
            {
                'user_nombre': 'aspirante_test',
                'email': 'aspirante@test.com',
                'password': 'test123',
                'rol_id': 1
            },
            {
                'user_nombre': 'empresa_test',
                'email': 'empresa@test.com', 
                'password': 'test123',
                'rol_id': 2
            },
            {
                'user_nombre': 'admin_test',
                'email': 'admin@test.com',
                'password': 'admin123',
                'rol_id': 3
            }
        ]
        
        for user_data in usuarios_data:
            user, created = Usuarios.objects.get_or_create(
                user_nombre=user_data['user_nombre'],
                defaults={
                    'email': user_data['email'],
                    'password': make_password(user_data['password']),
                    'user_rol_fk_id': user_data['rol_id'],
                    'is_active': True
                }
            )
            if created:
                self.stdout.write(f'Usuario creado: {user.user_nombre}')
        
        # 3. Crear aspirante de prueba
        aspirante_user = Usuarios.objects.get(user_nombre='aspirante_test')
        aspirante, created = Aspirante.objects.get_or_create(
            asp_usuario_fk=aspirante_user,
            defaults={
                'asp_nombre': 'Juan Carlos',
                'asp_apellido': 'Pérez García',
                'asp_correo': 'aspirante@test.com',
                'asp_telefono': '3001234567',
                'asp_departamento': 'Cundinamarca',
                'asp_ciudad': 'Bogotá',
                'asp_ocupacion': 'Desarrollador',
                'asp_descripcion': 'Desarrollador con experiencia en Python y Django',
                'asp_creditos_turbo_disponibles': 3
            }
        )
        if created:
            self.stdout.write(f'Aspirante creado: {aspirante.asp_nombre} {aspirante.asp_apellido}')
        
        # 4. Crear empresa de prueba
        empresa_user = Usuarios.objects.get(user_nombre='empresa_test')
        empresa, created = Empresa.objects.get_or_create(
            em_usuario_fk=empresa_user,
            defaults={
                'em_nombre': 'TechCorp S.A.S',
                'em_nit': '123456789-0',
                'em_email': 'empresa@test.com',
                'em_telefono': '6012345678',
                'em_departamento': 'Cundinamarca',
                'em_ciudad': 'Bogotá',
                'em_sector': 'Tecnología',
                'em_contacto': 'María González',
                'em_descripcion': 'Empresa líder en desarrollo de software',
                'em_sitioWeb': 'https://techcorp.com',
                'em_tamano': 'Mediana (50-200 empleados)'
            }
        )
        if created:
            self.stdout.write(f'Empresa creada: {empresa.em_nombre}')
        
        # 5. Crear vacante de prueba
        vacante, created = Vacante.objects.get_or_create(
            va_titulo='Desarrollador Backend Django',
            va_idEmpresa_fk=empresa,
            defaults={
                'va_requisitos': 'Experiencia en Python, Django, MySQL. Conocimiento en APIs REST.',
                'va_salario': 3500000.00,
                'va_ubicacion': 'Bogotá, Colombia',
                'va_descripcion': 'Buscamos desarrollador backend con experiencia en Django para unirse a nuestro equipo',
                'va_tipo_empleo': 'Tiempo completo',
                'va_responsabilidades': 'Desarrollar APIs REST, mantener código, trabajar en equipo',
                'va_beneficios': 'Salario competitivo, trabajo remoto, capacitaciones',
                'va_habilidades': 'Python, Django, MySQL, Git, APIs REST',
                'va_estado': 'Activa'
            }
        )
        if created:
            self.stdout.write(f'Vacante creada: {vacante.va_titulo}')
        
        self.stdout.write(
            self.style.SUCCESS('¡Datos de prueba creados exitosamente!')
        )
        self.stdout.write('Usuarios de prueba:')
        self.stdout.write('- Aspirante: aspirante_test / test123')
        self.stdout.write('- Empresa: empresa_test / test123') 
        self.stdout.write('- Admin: admin_test / admin123')