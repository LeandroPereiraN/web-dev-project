# Historia de Usuario: Panel de administración para moderación (MVP)

## Título

Funcionalidad para que administradores revisen y eliminen contenido inapropiado manualmente.

## Descripción

"Como administrador de la plataforma, quiero poder revisar servicios reportados y eliminar contenido inapropiado para mantener la calidad y legalidad de la plataforma."

## Criterios de aceptación

- Debe existir el rol de Admin y Vendedor
- Debe existir un panel de administración accesible solo para usuarios administradores
- El panel debe mostrar:
  - Lista de todos los servicios, incluyendo los reportados por usuarios
  - Lista de vendedores con múltiples reportes
- Para cada servicio bajo revisión debe mostrar:
  - Información completa del servicio (título, descripción, imágenes)
  - Información del vendedo
  - Razón del reporte en caso de tenerlo
  - Fecha de creación y reporte
- El administrador debe poder realizar las siguientes acciones:
  - Aprobar el servicio (quitar reporte)
  - Eliminar el servicio permanentemente
  - Suspender al vendedor (bloquear cuenta)
  - Eliminar cuenta del vendedor permanentemente
  - Agregar nota interna sobre la decisión
- Cada acción debe requerir confirmación y justificación

## Prioridad

Alta

## Definition of Ready

- Diseño del panel de administración aprobado
- Se definieron los diferentes roles de administrador
- Se establecieron las políticas de moderación y sanciones

## Definition of Done

- Los administradores pueden acceder al panel de moderación
- Todas las acciones de moderación funcionan correctamente
- El sistema de roles funciona correctamente
