# Historia de Usuario: Eliminar servicio (MVP)

## Título

Funcionalidad para que los vendedores puedan eliminar servicios de su catálogo.

## Descripción

"Como vendedor autenticado, quiero poder eliminar servicios que ya no ofrezco para mantener mi catálogo limpio y relevante."

## Criterios de aceptación

- El vendedor debe poder acceder a una lista de sus servicios publicados
- Cada servicio debe tener un botón "Eliminar" claramente identificado
- Al hacer clic en "Eliminar", se debe mostrar un diálogo de confirmación que incluya:
  - El título del servicio a eliminar
  - Mensaje: "¿Estás seguro de que deseas eliminar este servicio?"
  - Advertencia: "Esta acción no se puede deshacer"
  - Información sobre contactos pendientes si los hay
  - Botones "Confirmar eliminación" y "Cancelar"
- Solo se debe proceder con la eliminación si el vendedor confirma explícitamente
- Al eliminar el servicio:
  - Se debe remover inmediatamente del catálogo público
  - Se debe remover de la lista de servicios del vendedor
  - Los contactos relacionados deben ser marcados como "servicio eliminado" pero no borrados
- Se debe mostrar confirmación visual de la eliminación exitosa
- El servicio eliminado no debe aparecer en búsquedas ni filtros

## Prioridad

Media

## Definition of Ready

- Diseño del diálogo de confirmación aprobado
- Se definió el manejo de contactos relacionados

## Definition of Done

- Los vendedores pueden eliminar servicios con confirmación
- Los servicios eliminados no aparecen en el catálogo público
- Los contactos relacionados se preservan apropiadamente
- Se maneja correctamente la eliminación de imágenes asociadas
