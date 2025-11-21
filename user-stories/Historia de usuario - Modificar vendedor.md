# Historia de Usuario: Modificar vendedor (MVP)

## Título

Funcionalidad para que los vendedores puedan modificar su información personal y profesional.

## Descripción

"Como vendedor registrado, quiero poder modificar mis datos personales y profesionales para mantener mi información actualizada en la plataforma."

## Criterios de aceptación

- El vendedor debe acceder a "Editar perfil" desde su panel de control
- Se debe abrir un formulario con su información actual conteniendo:
  - **Datos básicos (editables):**
    - Nombre (texto, máximo 50 caracteres, solo letras y espacios)
    - Apellido (texto, máximo 50 caracteres, solo letras y espacios)
    - Celular (formato numérico, 10 dígitos)
    - Dirección (texto, máximo 200 caracteres)
    - Foto de perfil (JPG, PNG, máximo 2MB)
  - **Datos de cuenta:**
    - Email (mostrado, no editable directamente)
    - Enlace separado "Cambiar contraseña" que requiera contraseña actual
  - **Información profesional (nueva sección):**
    - Descripción profesional (texto, máximo 300 caracteres)
    - Años de experiencia (número)
    - Especialidades (selección múltiple de categorías)
- Debe haber botones:
  - "Guardar cambios" (solo habilitado si hay cambios)
  - "Cancelar" (descarta cambios sin guardar)
- Al guardar exitosamente:
  - Los cambios deben reflejarse inmediatamente en el perfil público
  - Se debe mostrar confirmación: "Tu perfil se actualizó correctamente"

## Prioridad

Alta

## Notas adicionales

- Permitir deshacer cambios antes de guardar definitivamente

## Definition of Ready

- Diseño de formulario de edición aprobado
- Se establecieron las validaciones para cada campo

## Definition of Done

- Los vendedores pueden editar su perfil exitosamente
- Todas las validaciones funcionan correctamente
- Los cambios se reflejan inmediatamente en el perfil público
- El historial de cambios se registra correctamente
