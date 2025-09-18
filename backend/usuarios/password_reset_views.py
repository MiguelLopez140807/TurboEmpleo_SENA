from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings
from .models import Usuarios

class PasswordResetRequestView(APIView):
    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Debes proporcionar un correo electrónico.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            usuario = Usuarios.objects.get(email=email)
        except Usuarios.DoesNotExist:
            # No revelar si el email existe o no
            return Response({'message': 'Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.'}, status=status.HTTP_200_OK)
        uid = urlsafe_base64_encode(force_bytes(usuario.pk))
        token = default_token_generator.make_token(usuario)
        reset_link = f"{settings.FRONTEND_URL}/restablecer-contraseña/{uid}/{token}/"
        send_mail(
            'Restablece tu contraseña en TurboEmpleo',
            f'Hola,\n\nPara restablecer tu contraseña haz clic en el siguiente enlace:\n{reset_link}\n\nSi no solicitaste este cambio, ignora este correo.\n',
            settings.DEFAULT_FROM_EMAIL,
            [usuario.email],
            fail_silently=False,
        )
        return Response({'message': 'Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.'}, status=status.HTTP_200_OK)

class PasswordResetConfirmView(APIView):
    def post(self, request, uidb64, token):
        password = request.data.get('password')
        if not password:
            return Response({'error': 'Debes proporcionar una nueva contraseña.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            usuario = Usuarios.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, Usuarios.DoesNotExist):
            return Response({'error': 'Enlace inválido.'}, status=status.HTTP_400_BAD_REQUEST)
        if not default_token_generator.check_token(usuario, token):
            return Response({'error': 'El enlace ha expirado o es inválido.'}, status=status.HTTP_400_BAD_REQUEST)
        usuario.set_password(password)
        usuario.save()
        return Response({'message': 'Contraseña restablecida correctamente.'}, status=status.HTTP_200_OK)
