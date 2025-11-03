
from rest_framework import serializers
from .models import Empresa, Vacante, Postulacion, ExperienciaLaboral, ExperienciaEscolar, Rol, Usuarios, Aspirante
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# Serializador anidado para Empresa
class EmpresaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Empresa
        fields = '__all__'

# Serializador anidado para Vacante (para lectura)
class VacanteSerializer(serializers.ModelSerializer):
    va_idEmpresa_fk = EmpresaSerializer(read_only=True)
    class Meta:
        model = Vacante
        fields = '__all__'

# Serializador para escritura de Vacante (para crear/actualizar)
class VacanteWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vacante
        fields = '__all__'


# Serializer para Aspirante (mover arriba para evitar error de referencia)
class AspiranteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aspirante
        fields = '__all__'

# Serializer para Postulacion

# Serializer para escritura (POST/PUT)
class PostulacionWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Postulacion
        fields = '__all__'
    
    def validate(self, data):
        # Validar que el aspirante no se haya postulado ya a la misma vacante
        aspirante = data.get('pos_aspirante_fk')
        vacante = data.get('pos_vacante_fk')
        
        if Postulacion.objects.filter(pos_aspirante_fk=aspirante, pos_vacante_fk=vacante).exists():
            raise serializers.ValidationError({
                'detail': 'Ya te has postulado a esta vacante anteriormente.'
            })
        
        return data

# Serializer para lectura (GET), con datos anidados
class PostulacionSerializer(serializers.ModelSerializer):
    pos_vacante_fk = VacanteSerializer(read_only=True)
    pos_aspirante_fk = AspiranteSerializer(read_only=True)
    class Meta:
        model = Postulacion
        fields = '__all__'

# Serializer para ExperienciaLaboral
class ExperienciaLaboralSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExperienciaLaboral
        fields = '__all__'

# Serializer para ExperienciaEscolar
class ExperienciaEscolarSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExperienciaEscolar
        fields = '__all__'

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'user_nombre'

    def validate(self, attrs):
        from django.utils import timezone
        from .models import Usuarios, Aspirante, Empresa
        from .serializers import AspiranteSerializer, EmpresaSerializer

        user_nombre = attrs.get('user_nombre')
        password = attrs.get('password')
        try:
            user = Usuarios.objects.get(user_nombre=user_nombre)
        except Usuarios.DoesNotExist:
            return super().validate(attrs)

        # Verificar si está bloqueado
        if user.login_blocked_until and user.login_blocked_until > timezone.now():
            raise serializers.ValidationError({'detail': f'Usuario bloqueado temporalmente. Intenta de nuevo después de {user.login_blocked_until.strftime("%H:%M:%S")}'})

        # Validar credenciales
        try:
            data = super().validate(attrs)
        except serializers.ValidationError:
            user.failed_login_attempts += 1
            user.last_failed_login = timezone.now()
            if user.failed_login_attempts >= 5:
                from datetime import timedelta
                user.login_blocked_until = timezone.now() + timedelta(minutes=5)
                user.failed_login_attempts = 0
            user.save()
            raise

        # Si login exitoso, resetear contador
        user.failed_login_attempts = 0
        user.login_blocked_until = None
        user.save()

        # Buscar datos de aspirante o empresa
        user_data = None
        try:
            # Buscar aspirante por asp_usuario_fk
            from .models import Aspirante, Empresa
            from .serializers import AspiranteSerializer, EmpresaSerializer
            aspirante = Aspirante.objects.filter(asp_usuario_fk=user).first()
            if aspirante:
                user_data = AspiranteSerializer(aspirante).data
            else:
                empresa = Empresa.objects.filter(em_usuario_fk=user).first()
                if empresa:
                    user_data = EmpresaSerializer(empresa).data
        except Exception:
            user_data = None

        data['user'] = user_data
        return data

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuarios
        fields = ['id', 'user_nombre', 'user_rol_fk', 'is_active', 'is_staff']
        # También puedes usar 'fields = "__all__"' para incluir todos los campos

class AspiranteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aspirante
        fields = '__all__'

class EmpresaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Empresa
        fields = '__all__'


class UsuarioRegistroSerializer(serializers.Serializer):
    def validate(self, data):
        user_nombre = data.get('user_nombre')
        user_rol = data.get('user_rol', '').lower()
        asp_correo = data.get('asp_correo')
        em_email = data.get('em_email')
        em_nit = data.get('em_nit')
        
        # Validar nombre de usuario único
        if Usuarios.objects.filter(user_nombre=user_nombre).exists():
            raise serializers.ValidationError({
                'user_nombre': 'El nombre de usuario ya está en uso.'
            })
        
        # Validar correo único según el tipo de usuario
        if user_rol == 'aspirante' and asp_correo:
            from .models import Aspirante
            if Aspirante.objects.filter(asp_correo=asp_correo).exists():
                raise serializers.ValidationError({
                    'asp_correo': 'Este correo electrónico ya está registrado.'
                })
        
        if user_rol == 'empresa':
            from .models import Empresa
            
            # Validar correo único
            if em_email and Empresa.objects.filter(em_email=em_email).exists():
                raise serializers.ValidationError({
                    'em_email': 'Este correo electrónico ya está registrado.'
                })
            
            # Validar NIT único
            if em_nit and Empresa.objects.filter(em_nit=em_nit).exists():
                raise serializers.ValidationError({
                    'em_nit': 'El NIT ya está registrado.'
                })
        
        return data
    user_nombre = serializers.CharField(max_length=100)
    user_contraseña = serializers.CharField(write_only=True)
    user_rol = serializers.CharField(max_length=50) # 'Aspirante' o 'Empresa'
    # Campos adicionales para Aspirante
    asp_nombre = serializers.CharField(max_length=100, required=False)
    asp_apellido = serializers.CharField(max_length=100, required=False)
    asp_correo = serializers.EmailField(required=False)
    asp_telefono = serializers.CharField(max_length=20, required=False)
    asp_departamento = serializers.CharField(max_length=100, required=False)
    asp_ciudad = serializers.CharField(max_length=100, required=False)
    asp_ocupacion = serializers.CharField(max_length=100, required=False)
    asp_nacimiento_dia = serializers.IntegerField(required=False)
    asp_nacimiento_mes = serializers.IntegerField(required=False)
    asp_nacimiento_anio = serializers.IntegerField(required=False)
    asp_tipoId = serializers.CharField(max_length=10, required=False)
    asp_numeroId = serializers.CharField(max_length=30, required=False)
    asp_cargo = serializers.CharField(max_length=100, required=False)
    asp_descripcion = serializers.CharField(required=False)
    asp_idiomas = serializers.JSONField(required=False)
    asp_curriculum = serializers.FileField(required=False)
    asp_foto = serializers.ImageField(required=False)

    # Campos adicionales para Empresa
    em_nombre = serializers.CharField(max_length=150, required=False)
    em_nit = serializers.CharField(max_length=50, required=False)
    em_email = serializers.EmailField(required=False)
    em_telefono = serializers.CharField(max_length=20, required=False)
    em_departamento = serializers.CharField(max_length=100, required=False)
    em_ciudad = serializers.CharField(max_length=100, required=False)
    em_sector = serializers.CharField(max_length=100, required=False)
    em_contacto = serializers.CharField(max_length=100, required=False)
    em_password = serializers.CharField(max_length=128, required=False)
    em_descripcion = serializers.CharField(required=False)
    em_sitioWeb = serializers.URLField(required=False)
    em_tamano = serializers.CharField(max_length=50, required=False)
    em_direccion = serializers.CharField(max_length=255, required=False)
    em_idiomas = serializers.JSONField(required=False)
    em_curriculum = serializers.FileField(required=False)
    em_logo = serializers.ImageField(required=False)

    def create(self, validated_data):
        from django.core.mail import send_mail
        from django.conf import settings
        from django.utils.http import urlsafe_base64_encode
        from django.utils.encoding import force_bytes
        from django.contrib.auth.tokens import default_token_generator
        user_rol = validated_data.pop('user_rol')
        user_nombre = validated_data.pop('user_nombre')
        user_contraseña = validated_data.pop('user_contraseña')
        request = self.context.get('request')
        rol_obj, created = Rol.objects.get_or_create(rol_nombre=user_rol)

        # Obtener email según el tipo de usuario
        email = None
        if user_rol.lower() == 'aspirante':
            email = validated_data.get('asp_correo')
        elif user_rol.lower() == 'empresa':
            email = validated_data.get('em_email')

        # Usuario inactivo hasta confirmar correo
        usuario = Usuarios.objects.create_user(
            user_nombre=user_nombre,
            password=user_contraseña,
            user_rol_fk=rol_obj,
            is_active=False,
            email=email
        )

        if user_rol.lower() == 'aspirante':
            aspirante_data = {
                'asp_usuario_fk': usuario,
                'asp_nombre': validated_data.get('asp_nombre'),
                'asp_apellido': validated_data.get('asp_apellido'),
                'asp_correo': email,
                'asp_telefono': validated_data.get('asp_telefono'),
                'asp_departamento': validated_data.get('asp_departamento'),
                'asp_ciudad': validated_data.get('asp_ciudad'),
                'asp_ocupacion': validated_data.get('asp_ocupacion'),
                'asp_nacimiento_dia': validated_data.get('asp_nacimiento_dia'),
                'asp_nacimiento_mes': validated_data.get('asp_nacimiento_mes'),
                'asp_nacimiento_anio': validated_data.get('asp_nacimiento_anio'),
                'asp_tipoId': validated_data.get('asp_tipoId'),
                'asp_numeroId': validated_data.get('asp_numeroId'),
                'asp_cargo': validated_data.get('asp_cargo'),
                'asp_descripcion': validated_data.get('asp_descripcion'),
                'asp_idiomas': validated_data.get('asp_idiomas'),
            }
            if request and hasattr(request, 'FILES'):
                if request.FILES.get('asp_curriculum'):
                    aspirante_data['asp_curriculum'] = request.FILES.get('asp_curriculum')
                if request.FILES.get('asp_foto'):
                    aspirante_data['asp_foto'] = request.FILES.get('asp_foto')
            else:
                aspirante_data['asp_curriculum'] = validated_data.get('asp_curriculum')
                aspirante_data['asp_foto'] = validated_data.get('asp_foto')
            Aspirante.objects.create(**aspirante_data)
        elif user_rol.lower() == 'empresa':
            empresa_data = {
                'em_usuario_fk': usuario,
                'em_nombre': validated_data.get('em_nombre'),
                'em_nit': validated_data.get('em_nit'),
                'em_email': email,
                'em_telefono': validated_data.get('em_telefono'),
                'em_departamento': validated_data.get('em_departamento'),
                'em_ciudad': validated_data.get('em_ciudad'),
                'em_sector': validated_data.get('em_sector'),
                'em_contacto': validated_data.get('em_contacto'),
                'em_password': validated_data.get('em_password'),
                'em_descripcion': validated_data.get('em_descripcion'),
                'em_sitioWeb': validated_data.get('em_sitioWeb'),
                'em_tamano': validated_data.get('em_tamano'),
                'em_direccion': validated_data.get('em_direccion'),
                'em_idiomas': validated_data.get('em_idiomas'),
            }
            if request and hasattr(request, 'FILES'):
                if request.FILES.get('em_curriculum'):
                    empresa_data['em_curriculum'] = request.FILES.get('em_curriculum')
                if request.FILES.get('em_logo'):
                    empresa_data['em_logo'] = request.FILES.get('em_logo')
            else:
                empresa_data['em_curriculum'] = validated_data.get('em_curriculum')
                empresa_data['em_logo'] = validated_data.get('em_logo')
            Empresa.objects.create(**empresa_data)
        # Enviar correo de activación
        if usuario.email:
            uid = urlsafe_base64_encode(force_bytes(usuario.pk))
            token = default_token_generator.make_token(usuario)
            activation_link = f"{settings.FRONTEND_URL}/activar-cuenta/{uid}/{token}/"
            send_mail(
                'Activa tu cuenta en TurboEmpleo',
                f'Hola {user_nombre},\n\nPor favor activa tu cuenta haciendo clic en el siguiente enlace:\n{activation_link}\n\nEste enlace expirará en unas horas.\n',
                settings.DEFAULT_FROM_EMAIL,
                [usuario.email],
                fail_silently=False,
            )
        return usuario