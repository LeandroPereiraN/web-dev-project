# Historia de Usuario: Registro de vendedor (MVP)

## Título

Funcionalidad para que los vendedores puedan registrarse en la plataforma.

## Descripción

"Como vendedor de servicios, quiero poder registrarme en la aplicación para crear mi cuenta y ofrecer mis servicios a los usuarios interesados."

## Criterios de aceptación

- Debe existir un formulario de registro exclusivo para vendedores
- El vendedor debe poder ingresar los siguientes datos obligatorios:
  - Nombre (texto, máximo 50 caracteres)
  - Apellido (texto, máximo 50 caracteres)
  - Email (formato email válido, único en el sistema)
  - Contraseña (mínimo 8 caracteres, al menos una mayúscula, una minúscula y un número)
  - Confirmación de contraseña (debe coincidir con la contraseña)
  - Celular (formato numérico, 10 dígitos)
  - Dirección (texto, máximo 200 caracteres)
  - Especialidad (ej: "Plomero certificado", máximo 50 caracteres)
  - Años de experiencia (número)
  - Fecha de registro en la plataforma (asignada automáticamente)
- El vendedor puede opcionalmente agregar:
  - Foto de perfil (formatos JPG, PNG, máximo 2MB)
  - Descripción profesional (mínimo 100, máximo 800 caracteres)
  - Métodos de contacto preferidos (llamada, whatsapp, email)
  - Fotos de trabajos realizados para portafolio (formatos JPG, PNG, máximo 2MB por foto)
    - Cada foto puede tener una descripción opcional (máximo 200 caracteres)
    - Posibilidad de marcar hasta 3 fotos como "destacadas"
- El sistema debe validar que el email no esté ya registrado
- El sistema debe validar el formato del email y celular
- La contraseña debe ser cifrada antes de almacenarse
- Tras el registro exitoso, el vendedor debe recibir un mensaje de confirmación
- El vendedor debe ser redirigido a la pantalla de login tras registro exitoso

## Prioridad

Alta

## Notas adicionales

- Implementar validación en tiempo real de los campos
- Mostrar mensajes de error específicos para cada campo
- Considerar captcha para evitar registros automatizados

## Definition of Ready

- Diseño de pantalla de registro aprobado
- Se definieron todos los mensajes de error y validación
- Se establecieron los criterios de seguridad para contraseñas

## Definition of Done

- El formulario de registro funciona correctamente
- Todas las validaciones están implementadas
- Los datos se guardan correctamente en la base de datos
- Las contraseñas están cifradas
- Se manejan todos los casos de error
- Los datos registrados permiten mostrar el perfil público completo del vendedor
