# Historia de usuario: Ver información de contacto de clientes interesados (MVP)

## Título

Funcionalidad para que los vendedores vean información de usuarios interesados en sus servicios

## Descripción

"Como vendedor, quiero poder ver la información de contactos de los usuarios que se interesan en mis servicios, para poder comunicarme con ellos.”

## Criterios de aceptación

- El vendedor debe acceder a una sección llamada "Mis Contactos" en su panel de control.
- Debe mostrarse una tabla con lista de usuarios que han contactado, incluyendo:
  - Nombre completo del cliente (Nombre + Apellido)
  - Email de contacto (formato mailto: enlace)
  - Número de celular (formato clickeable para llamadas)
  - Título del servicio consultado con enlace al servicio
  - Descripción completa de la tarea solicitada
  - Fecha y hora exacta de contacto (formato: DD/MM/AAAA HH:MM)
  - Estado del contacto (Nuevo, Visto, En proceso, Completado, Sin interés)
  - Botones de acción: "Marcar como visto", "Responder", "Archivar"
- La tabla debe incluir funcionalidades de gestión:
  - Ordenamiento por: fecha (más reciente primero), nombre del cliente, servicio, estado
  - Filtrado por: servicio específico, rango de fechas (última semana, último mes, últimos 3 meses), estado del contacto
  - Búsqueda por nombre del cliente o email

## Prioridad

Media

## Definition of Ready

- Pantalla de interesados está aprobada
- Se definieron los campos a mostrar

## Definition of Done

- La lista de interesados se carga correctamente desde la base de datos
