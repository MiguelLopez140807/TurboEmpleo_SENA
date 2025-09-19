from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

# Modelos del diagrama
class Rol(models.Model):
    rol_nombre = models.CharField(max_length=50)

    def __str__(self):
        return self.rol_nombre

class Aspirante(models.Model):
    # Campos del aspirante
    asp_nombre = models.CharField(max_length=100)
    asp_apellido = models.CharField(max_length=100)
    asp_correo = models.EmailField(unique=True)
    asp_telefono = models.CharField(max_length=20, blank=True, null=True)
    asp_departamento = models.CharField(max_length=100, blank=True, null=True)
    asp_ciudad = models.CharField(max_length=100, blank=True, null=True)
    asp_ocupacion = models.CharField(max_length=100, blank=True, null=True)
    asp_nacimiento_dia = models.IntegerField(blank=True, null=True)
    asp_nacimiento_mes = models.IntegerField(blank=True, null=True)
    asp_nacimiento_anio = models.IntegerField(blank=True, null=True)
    asp_tipoId = models.CharField(max_length=10, blank=True, null=True)
    asp_numeroId = models.CharField(max_length=30, blank=True, null=True)
    asp_cargo = models.CharField(max_length=100, blank=True, null=True)
    asp_descripcion = models.TextField(blank=True, null=True)
    asp_idiomas = models.JSONField(blank=True, null=True)
    asp_estado = models.CharField(max_length=50, blank=True, null=True)
    asp_curriculum = models.FileField(upload_to='curriculums/', blank=True, null=True)
    asp_foto = models.ImageField(upload_to='fotos_aspirantes/', blank=True, null=True)
    # Enlaces de clave foránea a un usuario
    asp_usuario_fk = models.ForeignKey('Usuarios', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.asp_nombre} {self.asp_apellido}"

class Empresa(models.Model):
    # Campos de la empresa
    em_nombre = models.CharField(max_length=150)
    em_nit = models.CharField(max_length=50, blank=True, null=True)
    em_email = models.EmailField(blank=True, null=True)
    em_telefono = models.CharField(max_length=20, blank=True, null=True)
    em_departamento = models.CharField(max_length=100, blank=True, null=True)
    em_ciudad = models.CharField(max_length=100, blank=True, null=True)
    em_sector = models.CharField(max_length=100, blank=True, null=True)
    em_contacto = models.CharField(max_length=100, blank=True, null=True)
    em_password = models.CharField(max_length=128, blank=True, null=True)
    em_descripcion = models.TextField(blank=True, null=True)
    em_sitioWeb = models.URLField(blank=True, null=True)
    em_tamano = models.CharField(max_length=50, blank=True, null=True)
    em_direccion = models.CharField(max_length=255, blank=True, null=True)
    em_idiomas = models.JSONField(blank=True, null=True)
    em_curriculum = models.FileField(upload_to='empresas_docs/', blank=True, null=True)
    em_logo = models.ImageField(upload_to='logos_empresas/', blank=True, null=True)
    em_usuario_fk = models.ForeignKey('Usuarios', on_delete=models.CASCADE)

    def __str__(self):
        return self.em_nombre

# Modelo de Usuario personalizado para Django
class MyUserManager(BaseUserManager):
    def create_user(self, user_nombre, password=None, user_rol_fk=None, is_staff=False, is_superuser=False, **extra_fields):
        if not user_nombre:
            raise ValueError('El usuario debe tener un nombre de usuario')
        user = self.model(
            user_nombre=user_nombre,
            user_rol_fk=user_rol_fk,
            is_staff=is_staff,
            is_superuser=is_superuser,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, user_nombre, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(user_nombre, password, **extra_fields)

class Usuarios(AbstractBaseUser, PermissionsMixin):
    user_nombre = models.CharField(max_length=100, unique=True)
    user_rol_fk = models.ForeignKey(Rol, on_delete=models.CASCADE, null=True)
    email = models.EmailField(unique=True, null=True, blank=True) # <-- Nuevo campo
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    # Campos para bloqueo temporal de login
    failed_login_attempts = models.IntegerField(default=0)
    last_failed_login = models.DateTimeField(null=True, blank=True)
    login_blocked_until = models.DateTimeField(null=True, blank=True)
    
    USERNAME_FIELD = 'user_nombre'
    REQUIRED_FIELDS = []

    objects = MyUserManager()

    # Agrega estos campos para resolver el conflicto de nombres
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='usuarios_app_set',
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='usuarios_app_permissions_set',
        blank=True,
        help_text='Specific permissions for this user.',
    )

    def __str__(self):
        return self.user_nombre

    

# ... (código anterior)

class Vacante(models.Model):
    va_titulo = models.CharField(max_length=200)
    va_requisitos = models.TextField()
    va_salario = models.DecimalField(max_digits=10, decimal_places=2)
    va_ubicacion = models.CharField(max_length=100)
    va_descripcion = models.TextField()
    va_tipo_empleo = models.CharField(max_length=50, blank=True, null=True)
    va_responsabilidades = models.TextField(blank=True, null=True)
    va_beneficios = models.TextField(blank=True, null=True)
    va_habilidades = models.TextField(blank=True, null=True)
    va_estado = models.CharField(max_length=20)
    va_idEmpresa_fk = models.ForeignKey(Empresa, on_delete=models.CASCADE)
    va_fecha_publicacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.va_titulo


# --- Nuevos modelos ---
class Postulacion(models.Model):
    pos_estado = models.CharField(max_length=50)
    pos_fechaPostulacion = models.DateTimeField(auto_now_add=True)
    pos_aspirante_fk = models.ForeignKey(Aspirante, on_delete=models.CASCADE)
    pos_vacante_fk = models.ForeignKey(Vacante, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.pos_aspirante_fk} a {self.pos_vacante_fk} ({self.pos_estado})"

class ExperienciaLaboral(models.Model):
    exla_nombreEmpresa = models.CharField(max_length=100)
    exla_cargo = models.CharField(max_length=100)
    exla_fechaInicio = models.DateField()
    exla_fechaFin = models.DateField(blank=True, null=True)
    exla_salario = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    exla_funcion = models.CharField(max_length=255, blank=True, null=True)
    exla_descripcion = models.TextField(blank=True, null=True)
    exla_aspirante_fk = models.ForeignKey(Aspirante, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.exla_nombreEmpresa} - {self.exla_cargo}"

class ExperienciaEscolar(models.Model):
    exes_nombreInstitucion = models.CharField(max_length=100)
    exes_titulo = models.CharField(max_length=100)
    exes_fechaInicio = models.DateField()
    exes_fechaFin = models.DateField(blank=True, null=True)
    exes_description = models.TextField(blank=True, null=True)
    exes_nivelEducativo = models.CharField(max_length=100, blank=True, null=True)
    exes_aspirante_fk = models.ForeignKey(Aspirante, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.exes_nombreInstitucion} - {self.exes_titulo}"

class Chat(models.Model):
    chat_vacante_fk = models.ForeignKey(Vacante, on_delete=models.CASCADE)
    chat_aspirante_fk = models.ForeignKey(Aspirante, on_delete=models.CASCADE)
    chat_empleador_fk = models.ForeignKey(Empresa, on_delete=models.CASCADE)
    chat_fechaCreacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Chat Vacante {self.chat_vacante_fk} - Aspirante {self.chat_aspirante_fk}"

class Mensaje(models.Model):
    men_chat_fk = models.ForeignKey(Chat, on_delete=models.CASCADE)
    men_usuario_fk = models.ForeignKey(Usuarios, on_delete=models.CASCADE)
    men_contenido = models.TextField()
    men_fecha = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Mensaje de {self.men_usuario_fk} en {self.men_chat_fk}"

class Notificacion(models.Model):
    not_usuario_fk = models.ForeignKey(Usuarios, on_delete=models.CASCADE)
    not_contenido = models.CharField(max_length=255)
    not_fecha = models.DateTimeField(auto_now_add=True)
    not_estado = models.CharField(max_length=50)

    def __str__(self):
        return f"Notificación para {self.not_usuario_fk}"

class Denuncia(models.Model):
    usuario_reportado = models.ForeignKey(Usuarios, on_delete=models.CASCADE, related_name='denuncias_recibidas')
    usuario_denunciante = models.ForeignKey(Usuarios, on_delete=models.CASCADE, related_name='denuncias_realizadas')
    razon = models.TextField()
    estado = models.CharField(max_length=20, choices=[('pendiente', 'Pendiente'), ('resuelta', 'Resuelta')])
    resultado = models.TextField(blank=True, null=True)
    fecha = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Denuncia de {self.usuario_denunciante} a {self.usuario_reportado}"