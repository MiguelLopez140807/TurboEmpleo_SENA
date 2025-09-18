from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str
from django.contrib.auth.tokens import default_token_generator
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Usuarios

class ActivateAccountView(APIView):
    def get(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = Usuarios.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, Usuarios.DoesNotExist):
            user = None
        if user is not None and default_token_generator.check_token(user, token):
            user.is_active = True
            user.save()
            return Response({'detail': 'Cuenta activada correctamente.'}, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'El enlace no es válido o ha expirado.'}, status=status.HTTP_400_BAD_REQUEST)
