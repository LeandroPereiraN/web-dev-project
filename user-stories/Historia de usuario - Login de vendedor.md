# Historia de Usuario: Login de vendedor (MVP)

## Título

Funcionalidad para que los vendedores puedan iniciar sesión en la plataforma.

## Descripción

"Como vendedor registrado, quiero poder iniciar sesión en la aplicación para acceder a mi panel de control y gestionar mis servicios."

## Criterios de aceptación

- Debe existir un formulario de login con los siguientes campos:
  - Email (formato email válido)
  - Contraseña (texto)
- El sistema debe validar las credenciales en la base de datos
- En caso de credenciales correctas:
  - El vendedor debe ser redirigido a su panel de control
  - Se debe crear una sesión válida para el vendedor
  - El vendedor debe poder visualizar su perfil con la información registrada
- En caso de credenciales incorrectas:
  - Se debe mostrar un mensaje de error claro: "Email o contraseña incorrectos"
  - No se debe especificar cuál campo es incorrecto por seguridad

## Prioridad

Alta

## Notas adicionales

- Implementar sesiones seguras con JWT

## Definition of Ready

- Diseño de pantalla de login aprobado
- Se definieron los mensajes de error
- Se estableció el mecanismo de manejo de sesiones

## Definition of Done

- El login funciona correctamente con credenciales válidas
- Se manejan correctamente los errores de autenticación
- Las sesiones se crean y mantienen apropiadamente
- Se validó la seguridad del proceso de autenticación
