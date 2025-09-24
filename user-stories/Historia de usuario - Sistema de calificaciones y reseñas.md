# Historia de Usuario: Sistema de calificaciones y reseñas

## Título
Funcionalidad para que los clientes califiquen y escriban reseñas sobre los servicios recibidos, sin necesidad de registro.

## Descripción
"Como cliente que ha utilizado un servicio, quiero poder calificar mi experiencia y escribir una reseña para ayudar a otros usuarios a tomar mejores decisiones, sin tener que crear una cuenta en la plataforma."

## Criterios de aceptación
- Los clientes pueden acceder a la funcionalidad de calificación mediante un enlace único proporcionado tras el contacto con el vendedor
- La interfaz debe permitir calificar el servicio con:
  - Calificación general (1-5 estrellas)
  - Campo de texto para reseña detallada (mínimo 50, máximo 500 caracteres)
- El sistema debe validar que solo clientes que realmente contactaron puedan calificar, usando el enlace único
- El enlace único se debe generar una vez se haya finalizado el servicio
- Las calificaciones deben aparecer en el perfil del vendedor mostrando:
  - Promedio general de calificaciones
  - Número total de reseñas

## Prioridad
Media

## Definition of Ready
- Diseño del sistema de calificaciones aprobado

## Definition of Done
- Los clientes pueden calificar servicios exitosamente sin registro
- Las calificaciones se muestran correctamente en perfiles
- El sistema de acceso a la funcionalidad de calificación funciona correctamente