# Historia de Usuario: Contactar a un Vendedor (MVP)

## Título

    Funcionalidad para que un cliente pueda contactar a un vendedor.

## Descripción

    "Como cliente que busca un servicio, quiero poder enviar una solicitud de contacto a un vendedor para explicarle mi necesidad, sin necesidad de registrarme en la plataforma."

## Criterios de aceptación

- Debe existir un formulario en la página de detalle del servicio con los siguientes campos obligatorios:
  - Nombre (texto, máximo 50 caracteres)
  - Apellido (texto, máximo 50 caracteres)
  - Celular (formato numérico, exactamente 9 dígitos, ej: 099123456)
  - Email (formato email válido, máximo 100 caracteres)
  - Descripción de la tarea (texto, máximo 500 caracteres, mínimo 20 caracteres)
- El formulario debe contar con un botón "Enviar contacto"
- El cliente debe recibir confirmación visual: "Tu mensaje fue enviado exitosamente. El vendedor te contactará pronto."
- El vendedor debe poder visualizar en su panel la lista de contactos recibidos, mostrando:
  - Nombre completo del cliente
  - Email y celular
  - Servicio consultado
  - Fecha de contacto
  - Estado (Nuevo, Visto, Respondido)
  - Preview de la descripción (primeras 50 palabras)
- El panel debe incluir opciones para:
  - Filtrar por servicio, fecha, estado
  - Ordenar por fecha (más reciente primero), nombre, servicio
  - Marcar como "Visto" o "Respondido"

## Prioridad

    Alta

## Notas adicionales

    Asegurar que la interfaz sea responsive y accesible mediante teclado y lectores de pantalla.

## Definition of Ready

- Los diseños de la pantalla de publicación de estado están aprobados por los integrantes del equipo.
- Los mensajes de notificación están definidos y revisados por los integrantes.

## Definition of Done

- La funcionalidad ha sido probada en dispositivos móviles y desktop.
- Se ha verificado la accesibilidad y usabilidad del flujo.
- Se realizaron pruebas exitosas de su funcionamiento.
