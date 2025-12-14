
from rest_framework import serializers
from .models import Empresa, Vacante, Postulacion, ExperienciaLaboral, ExperienciaEscolar, Rol, Usuarios, Aspirante, Notificacion
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# Serializador para Usuarios
class UsuariosSerializer(serializers.ModelSerializer):
    # Campo legible para fecha de registro
    fecha_registro_formato = serializers.SerializerMethodField()
    ultimo_acceso_formato = serializers.SerializerMethodField()
    
    class Meta:
        model = Usuarios
        fields = ['id', 'user_nombre', 'email', 'is_active', 'is_staff', 
                 'date_joined', 'last_login', 'failed_login_attempts',
                 'fecha_registro_formato', 'ultimo_acceso_formato']
        extra_kwargs = {
            'password': {'write_only': True}
        }
    
    def get_fecha_registro_formato(self, obj):
        """Devuelve fecha de registro en formato legible"""
        if obj.date_joined:
            return obj.date_joined.strftime('%d/%m/%Y %H:%M:%S')
        return None
    
    def get_ultimo_acceso_formato(self, obj):
        """Devuelve último acceso en formato legible"""
        if obj.last_login:
            return obj.last_login.strftime('%d/%m/%Y %H:%M:%S')
        return None

# Serializador anidado para Empresa
class EmpresaSerializer(serializers.ModelSerializer):
    # ⚡ Campo calculado para mostrar el score actualizado
    em_score_turbo_calculado = serializers.SerializerMethodField()
    # Incluir fecha de registro del usuario relacionado
    usuario_fecha_registro = serializers.SerializerMethodField()
    # Estado de la empresa basado en el usuario
    em_estado = serializers.SerializerMethodField()
    # Estado activo/inactivo del usuario
    is_active = serializers.SerializerMethodField()
    
    class Meta:
        model = Empresa
        fields = '__all__'
        extra_fields = ['em_estado', 'is_active']
    
    def get_em_score_turbo_calculado(self, obj):
        """Devuelve el score turbo calculado en tiempo real"""
        return obj.calcular_score_turbo()
    
    def get_usuario_fecha_registro(self, obj):
        """Devuelve la fecha de registro del usuario asociado"""
        return obj.em_usuario_fk.date_joined if obj.em_usuario_fk else None
    
    def get_em_estado(self, obj):
        """Devuelve el estado basado en is_active del usuario"""
        return 'activo' if (obj.em_usuario_fk and obj.em_usuario_fk.is_active) else 'inactivo'
    
    def get_is_active(self, obj):
        """Devuelve el estado is_active del usuario"""
        return obj.em_usuario_fk.is_active if obj.em_usuario_fk else False
    
    def to_internal_value(self, data):
        """Procesar datos antes de la validación"""
        # Crear una copia mutable de los datos
        if hasattr(data, 'copy'):
            data = data.copy()
        else:
            data = dict(data)
        
        # Remover campos que no deberían actualizarse si son URLs string
        for field in ['em_curriculum', 'em_logo']:
            if field in data and isinstance(data[field], str) and data[field].startswith('http'):
                del data[field]
        
        # Remover campos de solo lectura
        data.pop('em_score_turbo_calculado', None)
        data.pop('usuario_fecha_registro', None)
        
        return super().to_internal_value(data)

# Serializador anidado para Vacante (para lectura)
class VacanteSerializer(serializers.ModelSerializer):
    va_idEmpresa_fk = EmpresaSerializer(read_only=True)
    # Formatear fecha de publicación para mejor legibilidad
    va_fecha_publicacion_formato = serializers.SerializerMethodField()
    
    class Meta:
        model = Vacante
        fields = '__all__'
    
    def get_va_fecha_publicacion_formato(self, obj):
        """Devuelve fecha de publicación en formato legible"""
        if obj.va_fecha_publicacion:
            return obj.va_fecha_publicacion.strftime('%d/%m/%Y %H:%M:%S')
        return None

# Serializador para escritura de Vacante (para crear/actualizar)
class VacanteWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vacante
        fields = '__all__'
    
    def validate_va_tiempo_respuesta_horas(self, value):
        """Valida que el tiempo de respuesta sea 24, 48 o 72 horas"""
        if value not in [24, 48, 72]:
            raise serializers.ValidationError(
                'El tiempo de respuesta debe ser 24, 48 o 72 horas.'
            )
        return value


# Serializer para Aspirante (mover arriba para evitar error de referencia)
class AspiranteSerializer(serializers.ModelSerializer):
    # ⚡ Campos calculados para turbo
    creditos_turbo_disponibles = serializers.SerializerMethodField()
    # Campo de fecha de registro legible
    fecha_registro_formato = serializers.SerializerMethodField()
    
    class Meta:
        model = Aspirante
        fields = '__all__'
    
    def get_creditos_turbo_disponibles(self, obj):
        """Devuelve créditos turbo disponibles del aspirante"""
        return obj.asp_creditos_turbo_disponibles
    
    def get_fecha_registro_formato(self, obj):
        """Devuelve fecha de registro en formato legible"""
        if obj.asp_fecha_registro:
            return obj.asp_fecha_registro.strftime('%d/%m/%Y %H:%M:%S')
        return None

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
            raise serializers.ValidationError("Ya te has postulado a esta vacante anteriormente. No puedes postularte dos veces a la misma oferta laboral.")
        
        return data
    
    def create(self, validated_data):
        try:
            return super().create(validated_data)
        except Exception as e:
            # Capturar el error de unique_together de la base de datos
            if 'unique' in str(e).lower() and 'pos_aspirante_fk' in str(e) and 'pos_vacante_fk' in str(e):
                raise serializers.ValidationError("Ya te has postulado a esta vacante anteriormente. No puedes postularte dos veces a la misma oferta laboral.")
            raise e

# Serializer para lectura (GET), con datos anidados
class PostulacionSerializer(serializers.ModelSerializer):
    pos_vacante_fk = VacanteSerializer(read_only=True)
    pos_aspirante_fk = AspiranteSerializer(read_only=True)
    # ⚡ Campos calculados para Modo Turbo
    tiempo_restante_horas = serializers.SerializerMethodField()
    esta_vencida = serializers.SerializerMethodField()
    tipo_turbo = serializers.SerializerMethodField()
    
    class Meta:
        model = Postulacion
        fields = '__all__'
    
    def get_tiempo_restante_horas(self, obj):
        """Calcula las horas restantes para que la empresa responda"""
        if not obj.pos_es_turbo or not obj.pos_fecha_limite_respuesta:
            return None
        
        from django.utils import timezone
        ahora = timezone.now()
        
        if ahora > obj.pos_fecha_limite_respuesta:
            return 0  # Ya venció
        
        diferencia = obj.pos_fecha_limite_respuesta - ahora
        horas_restantes = diferencia.total_seconds() / 3600
        return round(horas_restantes, 1)
    
    def get_esta_vencida(self, obj):
        """Indica si la postulación turbo ya venció"""
        if not obj.pos_es_turbo or not obj.pos_fecha_limite_respuesta:
            return False
        
        from django.utils import timezone
        return timezone.now() > obj.pos_fecha_limite_respuesta
    
    def get_tipo_turbo(self, obj):
        """
        Devuelve el tipo de turbo:
        - 'vacante': Solo la vacante es turbo
        - 'aspirante': Solo el aspirante solicitó turbo
        - 'premium': Ambos activaron turbo
        - None: No es turbo
        """
        if not obj.pos_es_turbo:
            return None
        
        vacante_turbo = obj.pos_vacante_fk.va_modo_turbo
        aspirante_turbo = obj.pos_turbo_solicitado_por_aspirante
        
        if vacante_turbo and aspirante_turbo:
            return 'premium'
        elif vacante_turbo:
            return 'vacante'
        elif aspirante_turbo:
            return 'aspirante'
        
        return None

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

# Serializer para Notificacion
class NotificacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notificacion
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
                else:
                    # Si no es ni aspirante ni empresa, devolver datos básicos del usuario
                    user_data = {
                        'id': user.id,
                        'user_nombre': user.user_nombre,
                        'email': user.email,
                        'is_superuser': user.is_superuser,
                        'is_staff': user.is_staff,
                        'is_active': user.is_active,
                        'user_rol': 'admin' if user.is_superuser or user.is_staff else 'usuario'
                    }
        except Exception:
            # En caso de error, devolver datos básicos del usuario
            user_data = {
                'id': user.id,
                'user_nombre': user.user_nombre,
                'email': user.email,
                'is_superuser': user.is_superuser,
                'is_staff': user.is_staff,
                'is_active': user.is_active,
                'user_rol': 'admin' if user.is_superuser or user.is_staff else 'usuario'
            }

        data['user'] = user_data
        return data

class UsuarioSerializer(serializers.ModelSerializer):
    user_rol_fk = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = Usuarios
        fields = ['id', 'user_nombre', 'email', 'user_rol_fk', 'is_active', 'is_staff', 'is_superuser', 'date_joined', 'last_login', 'failed_login_attempts']

class AspiranteSerializer(serializers.ModelSerializer):
    # Incluir fecha de registro del usuario relacionado
    usuario_fecha_registro = serializers.SerializerMethodField()
    
    class Meta:
        model = Aspirante
        fields = '__all__'
    
    def get_usuario_fecha_registro(self, obj):
        """Devuelve la fecha de registro del usuario asociado"""
        return obj.asp_usuario_fk.date_joined if obj.asp_usuario_fk else None

# Nota: EmpresaSerializer ya está definido arriba con campos turbo


class UsuarioRegistroSerializer(serializers.Serializer):
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

    def validate(self, data):
        """Validaciones completas para prevenir duplicidad"""
        user_nombre = data.get('user_nombre')
        user_rol = data.get('user_rol', '').lower()
        
        # Validar nombre de usuario único
        if Usuarios.objects.filter(user_nombre=user_nombre).exists():
            raise serializers.ValidationError({
                'user_nombre': 'El nombre de usuario ya está en uso.'
            })
        
        # Validaciones para aspirantes
        if user_rol == 'aspirante':
            asp_correo = data.get('asp_correo')
            asp_numeroId = data.get('asp_numeroId')
            
            # Validar duplicidad de correo en aspirantes
            if asp_correo and Aspirante.objects.filter(asp_correo=asp_correo).exists():
                raise serializers.ValidationError({
                    'asp_correo': 'Ya existe un aspirante registrado con este correo electrónico.'
                })
            
            # Validar duplicidad de documento en aspirantes
            if asp_numeroId and Aspirante.objects.filter(asp_numeroId=asp_numeroId).exists():
                raise serializers.ValidationError({
                    'asp_numeroId': 'Ya existe un aspirante registrado con este número de documento.'
                })
        
        # Validaciones para empresas
        elif user_rol == 'empresa':
            em_email = data.get('em_email')
            em_nit = data.get('em_nit')
            
            # Validar duplicidad de email en empresas
            if em_email and Empresa.objects.filter(em_email=em_email).exists():
                raise serializers.ValidationError({
                    'em_email': 'Ya existe una empresa registrada con este correo electrónico.'
                })
            
            # Validar duplicidad de NIT
            if em_nit and Empresa.objects.filter(em_nit=em_nit).exists():
                raise serializers.ValidationError({
                    'em_nit': 'Ya existe una empresa registrada con este NIT.'
                })
        
        return data

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