# Historia de Usuario: Darse de baja del sistema

## Título
Funcionalidad para que los vendedores puedan eliminar su cuenta de la plataforma.

## Descripción
"Como vendedor registrado, quiero poder darme de baja del sistema para eliminar mi cuenta y toda mi información personal cuando ya no desee usar la plataforma."

## Criterios de aceptación
- El vendedor debe poder acceder a la opción "Eliminar cuenta" desde su panel de usuario
- Al hacer clic en "Eliminar cuenta", se debe mostrar un proceso de confirmación que incluya:
  - Explicación clara de las consecuencias de eliminar la cuenta
  - Lista de lo que se eliminará: perfil, servicios publicados, historial de contactos
  - Advertencia: "Esta acción es irreversible"
  - Campo para ingresar la contraseña actual como confirmación
  - Checkbox: "Confirmo que deseo eliminar permanentemente mi cuenta"
  - Botones "Eliminar cuenta definitivamente" y "Cancelar"
- Solo se debe proceder si el vendedor:
  - Ingresa su contraseña correcta
  - Marca el checkbox de confirmación
  - Hace clic en "Eliminar cuenta definitivamente"
- Al eliminar la cuenta se debe:
  - Eliminar el perfil del vendedor
  - Eliminar todos los servicios publicados por el vendedor
  - Marcar los contactos recibidos como "vendedor inactivo" (preservar para clientes)
  - Eliminar todas las imágenes y archivos asociados
  - Invalidar todas las sesiones activas
- Se debe enviar email de confirmación de eliminación de cuenta
- La cuenta debe ser eliminada inmediatamente y no aparecer en ninguna búsqueda

## Prioridad
Media

## Definition of Ready
- Diseño del flujo de eliminación de cuenta aprobado

## Definition of Done
- Los vendedores pueden eliminar su cuenta exitosamente
- Toda la información personal se elimina correctamente
- Los servicios del vendedor ya no aparecen en la plataforma
- Se preservan contactos para referencia de clientes