from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from .models import Postulacion, Notificacion, Aspirante, Empresa

@receiver(post_save, sender=Postulacion)
def crear_notificacion_nueva_postulacion(sender, instance, created, **kwargs):
    """
    Crea una notificación para el empleador cuando un aspirante se postula a una vacante.
    HU10 - Notificaciones de Postulación
    """
    if created:
        # Obtener la empresa de la vacante
        vacante = instance.pos_vacante_fk
        empresa = vacante.va_idEmpresa_fk
        usuario_empresa = empresa.em_usuario_fk
        
        # Obtener el nombre del aspirante
        aspirante = instance.pos_aspirante_fk
        nombre_aspirante = f"{aspirante.asp_nombre} {aspirante.asp_apellido}"
        
        # Crear notificación para el empleador
        Notificacion.objects.create(
            not_usuario_fk=usuario_empresa,
            not_contenido=f"Nueva postulación de {nombre_aspirante} para la vacante '{vacante.va_titulo}'",
            not_estado='No leída'
        )

@receiver(pre_save, sender=Postulacion)
def notificar_cambio_estado_postulacion(sender, instance, **kwargs):
    """
    Crea una notificación para el aspirante cuando cambia el estado de su postulación.
    HU11 - Notificaciones de Estado
    """
    # Solo si la postulación ya existe (actualización)
    if instance.pk:
        try:
            # Obtener el estado anterior
            postulacion_anterior = Postulacion.objects.get(pk=instance.pk)
            estado_anterior = postulacion_anterior.pos_estado
            estado_nuevo = instance.pos_estado
            
            # Si el estado cambió, crear notificación
            if estado_anterior != estado_nuevo:
                aspirante = instance.pos_aspirante_fk
                usuario_aspirante = aspirante.asp_usuario_fk
                vacante = instance.pos_vacante_fk
                empresa = vacante.va_idEmpresa_fk
                
                # Mensaje según el nuevo estado
                mensajes_estado = {
                    'Pendiente': f"Tu postulación a '{vacante.va_titulo}' está pendiente de revisión.",
                    'En revisión': f"Tu postulación a '{vacante.va_titulo}' está siendo revisada por {empresa.em_nombre}.",
                    'En Revisión': f"Tu postulación a '{vacante.va_titulo}' está siendo revisada por {empresa.em_nombre}.",
                    'Entrevista programada': f"¡Felicidades! {empresa.em_nombre} ha programado una entrevista para la vacante '{vacante.va_titulo}'.",
                    'Entrevista Programada': f"¡Felicidades! {empresa.em_nombre} ha programado una entrevista para la vacante '{vacante.va_titulo}'.",
                    'Aceptada': f"¡Felicitaciones! Tu postulación a '{vacante.va_titulo}' ha sido aceptada por {empresa.em_nombre}.",
                    'Rechazada': f"Tu postulación a '{vacante.va_titulo}' no ha sido seleccionada en esta ocasión."
                }
                
                mensaje = mensajes_estado.get(estado_nuevo, f"El estado de tu postulación a '{vacante.va_titulo}' ha cambiado a: {estado_nuevo}")
                
                # Crear notificación para el aspirante
                Notificacion.objects.create(
                    not_usuario_fk=usuario_aspirante,
                    not_contenido=mensaje,
                    not_estado='No leída'
                )
        except Postulacion.DoesNotExist:
            pass


# ⚡ SIGNALS MODO TURBO
@receiver(post_save, sender=Postulacion)
def configurar_postulacion_turbo(sender, instance, created, **kwargs):
    """
    Cuando se crea una postulación:
    1. Si la vacante es Turbo → activa turbo automáticamente
    2. Si el aspirante solicita turbo → activa turbo y descuenta crédito
    """
    if created:
        vacante = instance.pos_vacante_fk
        aspirante = instance.pos_aspirante_fk
        
        # Si la vacante está en modo turbo O el aspirante solicitó turbo
        activar_turbo = vacante.va_modo_turbo or instance.pos_turbo_solicitado_por_aspirante
        
        if activar_turbo:
            from datetime import timedelta
            from django.utils import timezone
            
            # Marcar la postulación como turbo
            instance.pos_es_turbo = True
            
            # Determinar horas de respuesta
            if vacante.va_modo_turbo:
                # Si la vacante es turbo, usar su tiempo definido
                horas_limite = vacante.va_tiempo_respuesta_horas
            else:
                # Si solo el aspirante activó turbo, usar 48h por defecto
                horas_limite = 48
            
            # Calcular fecha límite de respuesta
            instance.pos_fecha_limite_respuesta = timezone.now() + timedelta(hours=horas_limite)
            
            # Incrementar contador de la empresa
            empresa = vacante.va_idEmpresa_fk
            empresa.em_total_postulaciones_turbo += 1
            empresa.save()
            
            # Si el aspirante activó turbo manualmente, descontar crédito
            if instance.pos_turbo_solicitado_por_aspirante and not vacante.va_modo_turbo:
                instance.pos_creditos_turbo_usados = 1
                aspirante.asp_creditos_turbo_usados += 1
                aspirante.asp_creditos_turbo_disponibles -= 1
                aspirante.save()
            
            instance.save()
            
            # Notificación especial para postulación Turbo
            usuario_aspirante = aspirante.asp_usuario_fk
            mensaje_turbo = ""
            
            if vacante.va_modo_turbo and instance.pos_turbo_solicitado_por_aspirante:
                mensaje_turbo = f"⚡⚡ Postulación TURBO PREMIUM enviada a '{vacante.va_titulo}'. ¡Prioridad máxima! Respuesta garantizada en {horas_limite} horas."
            elif vacante.va_modo_turbo:
                mensaje_turbo = f"⚡ Postulación TURBO enviada a '{vacante.va_titulo}'. Respuesta garantizada en {horas_limite} horas."
            else:
                mensaje_turbo = f"⚡ Solicitaste respuesta TURBO para '{vacante.va_titulo}'. Respuesta prioritaria en {horas_limite} horas. (Créditos restantes: {aspirante.asp_creditos_turbo_disponibles})"
            
            Notificacion.objects.create(
                not_usuario_fk=usuario_aspirante,
                not_contenido=mensaje_turbo,
                not_estado='No leída'
            )


@receiver(pre_save, sender=Postulacion)
def actualizar_score_turbo_empresa(sender, instance, **kwargs):
    """
    Actualiza el score de la empresa cuando responde a una postulación turbo.
    """
    if instance.pk and instance.pos_es_turbo:
        try:
            from django.utils import timezone
            
            postulacion_anterior = Postulacion.objects.get(pk=instance.pk)
            estado_anterior = postulacion_anterior.pos_estado
            estado_nuevo = instance.pos_estado
            
            # Si cambió de Pendiente a otro estado
            if estado_anterior == 'Pendiente' and estado_nuevo != 'Pendiente':
                # Verificar si respondió a tiempo
                if instance.pos_fecha_limite_respuesta and timezone.now() <= instance.pos_fecha_limite_respuesta:
                    instance.pos_respondida_a_tiempo = True
                    
                    # Incrementar respuestas a tiempo de la empresa
                    empresa = instance.pos_vacante_fk.va_idEmpresa_fk
                    empresa.em_respuestas_a_tiempo += 1
                    # Recalcular score
                    empresa.em_score_turbo = empresa.calcular_score_turbo()
                    empresa.save()
                else:
                    instance.pos_respondida_a_tiempo = False
                    # La empresa no respondió a tiempo, penalizar
                    empresa = instance.pos_vacante_fk.va_idEmpresa_fk
                    if empresa.em_score_turbo > 0:
                        empresa.em_score_turbo = max(0, empresa.em_score_turbo - 0.5)
                        empresa.save()
                        
        except Postulacion.DoesNotExist:
            pass
