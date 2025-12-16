# Registro de Consentimientos Otorgados en TurboEmpleo

## ¿Qué se implementó?
Se añadió una funcionalidad sencilla y legalmente robusta para registrar los consentimientos otorgados por los usuarios al momento de su registro en la plataforma TurboEmpleo.

## ¿Por qué es importante?
El registro de consentimientos es obligatorio por normativas de protección de datos (Habeas Data, GDPR, etc.). Permite demostrar que el usuario aceptó la política de privacidad y el tratamiento de sus datos personales.

## ¿Cómo funciona?
- Se creó un modelo `Consentimiento` en Django que almacena:
  - El usuario que otorgó el consentimiento.
  - El tipo de consentimiento (por ejemplo, "privacidad").
  - El texto exacto y la versión del consentimiento aceptado.
  - La fecha y hora en que se otorgó.
  - Si fue aceptado o no.

- Cada vez que un usuario se registra (aspirante o empresa):
  - Se crea el usuario y sus datos asociados.
  - Automáticamente se registra un consentimiento de tipo "privacidad" con el texto y la fecha correspondiente.

## ¿Dónde se implementó?
- **Modelo:** `usuarios/models.py` → clase `Consentimiento`.
- **Registro automático:** `usuarios/serializers.py` → en el método `create` de `UsuarioRegistroSerializer`.

## ¿Qué ventajas tiene?
- Cumplimiento legal automático.
- Trazabilidad: puedes consultar en cualquier momento qué usuario aceptó, cuándo y bajo qué texto.
- Fácil de extender para otros consentimientos (marketing, cookies, etc.).

## ¿Qué sigue?
- Si necesitas consultar los consentimientos de un usuario, puedes hacerlo desde el admin de Django o crear un endpoint sencillo para exponerlos.
- Si en el futuro cambian los textos legales, solo actualiza el texto y la versión en el registro.

---

**Implementación realizada por GitHub Copilot (GPT-4.1) a solicitud del usuario.**