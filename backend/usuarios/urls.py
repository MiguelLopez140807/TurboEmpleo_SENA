from django.urls import path
from .views import UsuarioRegistroView
from .password_views import ChangePasswordView, DeleteAccountView
from .activation_views import ActivateAccountView
from .password_reset_views import PasswordResetRequestView, PasswordResetConfirmView

urlpatterns = [
    path('registro/', UsuarioRegistroView.as_view(), name='registro_usuario'),
    path('cambiar-password/', ChangePasswordView.as_view(), name='cambiar_password'),
    path('eliminar-cuenta/', DeleteAccountView.as_view(), name='eliminar_cuenta'),
    path('activar-cuenta/<uidb64>/<token>/', ActivateAccountView.as_view(), name='activar_cuenta'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('password-reset-confirm/<uidb64>/<token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
]