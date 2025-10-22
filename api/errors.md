# Errores Personalizados de la API

Esta documentación describe todos los errores personalizados utilizados. Cada error incluye un código HTTP, mensaje de error, descripción y un código de aplicación único.

## Formato de Respuesta de Error

Todos los errores tienen el este formato JSON:

```json
{
  "statusCode": 400,
  "error": "PETICION_INCORRECTA",
  "message": "La petición contiene datos incorrectos o incompletos. Revise los campos.",
  "appCode": "ERR_BAD_REQUEST"
}
```

## Lista de Errores

### Errores de Autenticación y Autorización

| Código de Aplicación | Mensaje | Código HTTP | Descripción |
|---------------------|---------|-------------|-------------|
| `ERR_UNAUTHORIZED` | No está autenticado o su sesión ha expirado. | 401 | El usuario no ha iniciado sesión o el token JWT es inválido/expirado. |
| `ERR_INVALID_CREDENTIALS` | Email o contraseña incorrectos. | 401 | Las credenciales proporcionadas no coinciden con ningún usuario registrado. |
| `ERR_INSUFFICIENT_PERMISSIONS` | No cumple con los permisos necesarios para realizar esta acción. | 403 | El usuario autenticado no tiene el rol requerido para la operación. |
| `ERR_SELLER_SUSPENDED` | Su cuenta está suspendida temporalmente. | 403 | La cuenta del vendedor ha sido suspendida por un administrador. |

### Errores de Validación y Datos

| Código de Aplicación | Mensaje | Código HTTP | Descripción |
|---------------------|---------|-------------|-------------|
| `ERR_BAD_REQUEST` | La petición contiene datos incorrectos o incompletos. Revise los campos. | 400 | Los datos enviados no cumplen con los requisitos de validación. |
| `ERR_RESOURCE_CONFLICT` | El recurso que intenta crear ya existe. Revise la información proporcionada. | 409 | Se intentó crear un recurso que ya existe (ej: email duplicado). |
| `ERR_EMAIL_ALREADY_EXISTS` | El email ya está registrado en el sistema. | 409 | El email proporcionado ya está en uso por otro usuario. |

### Errores de Recursos No Encontrados

| Código de Aplicación | Mensaje | Código HTTP | Descripción |
|---------------------|---------|-------------|-------------|
| `ERR_RESOURCE_NOT_FOUND` | El recurso solicitado no se ha encontrado. | 404 | El recurso solicitado no existe en la base de datos. |
| `ERR_USER_NOT_FOUND` | El usuario especificado no existe. | 404 | El ID de usuario proporcionado no corresponde a ningún usuario. |
| `ERR_SERVICE_NOT_FOUND` | El servicio especificado no existe. | 404 | El ID de servicio proporcionado no corresponde a ningún servicio. |
| `ERR_CATEGORY_NOT_FOUND` | La categoría especificada no existe. | 404 | El ID de categoría proporcionado no corresponde a ninguna categoría. |
| `ERR_CONTACT_REQUEST_NOT_FOUND` | La solicitud de contacto especificada no existe. | 404 | El ID de solicitud de contacto no existe. |
| `ERR_REPORT_NOT_FOUND` | El reporte especificado no existe. | 404 | El ID de reporte proporcionado no corresponde a ningún reporte. |
| `ERR_MODERATION_ACTION_NOT_FOUND` | La acción de moderación especificada no existe. | 404 | El ID de acción de moderación no existe. |

### Errores de Contactos y Calificaciones

| Código de Aplicación | Mensaje | Código HTTP | Descripción |
|---------------------|---------|-------------|-------------|
| `ERR_RATING_TOKEN_EXPIRED` | El enlace para calificar ha expirado. | 410 | El token único para calificar ha expirado (30 días después del contacto). |
| `ERR_RATING_TOKEN_INVALID` | El enlace para calificar no es válido. | 400 | El token proporcionado no es válido o no existe. |
| `ERR_SERVICE_INACTIVE` | El servicio no está disponible actualmente. | 410 | El servicio ha sido marcado como inactivo por el vendedor. |

### Errores del Sistema

| Código de Aplicación | Mensaje | Código HTTP | Descripción |
|---------------------|---------|-------------|-------------|
| `ERR_INTERNAL_SERVER` | Se ha producido un error interno en el servidor. | 500 | Error inesperado en el servidor. |
| `ERR_DATABASE_CONNECTION` | No se ha podido conectar con la base de datos. | 500 | Problemas de conectividad con la base de datos. |

## Notas Importantes

- **Códigos de Aplicación**: Los códigos `ERR_*` son únicos y pueden ser utilizados por el frontend para mostrar mensajes específicos al usuario o realizar acciones particulares.
- **Mensajes en Español**: Todos los mensajes están en español para mantener consistencia con la interfaz de usuario.
- **Códigos HTTP Estándar**: Se utilizan códigos HTTP estándar (400, 401, 403, 404, 409, 410, 500) según la semántica REST.
- **Validación**: Para errores de validación (400), se puede incluir información adicional sobre los campos específicos que fallaron.
- **Logging**: Todos los errores se registran en los logs del servidor para debugging y monitoreo.