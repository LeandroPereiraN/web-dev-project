# Historia de Usuario: Crear servicio (MVP)

## Título

Funcionalidad para que los vendedores puedan agregar nuevos servicios a su catálogo.

## Descripción

"Como vendedor autenticado, quiero poder agregar un nuevo servicio a mi catálogo para que los clientes puedan encontrarlo y contactarme."

## Criterios de aceptación

- El vendedor debe acceder a un formulario "Agregar servicio" desde su panel
- El vendedor debe poder ingresar los siguientes datos obligatorios:
  - Título del servicio (texto, máximo 100 caracteres)
  - Descripción detallada (texto, máximo 500 caracteres)
  - Categoría (selección de lista predefinida: Plomería, Electricidad, Carpintería, Limpieza, Jardinería, Pintura, Reparaciones, Desarrollo, Entre otros)
  - Precio base (número decimal, mayor a 0, en pesos uruguayos)
  - Tipo de precio (Por hora, Por proyecto, Por día, Otros)
- El vendedor puede opcionalmente agregar:
  - Hasta 3 imágenes del trabajo (formatos JPG, PNG, máximo 2MB cada una)
  - Tiempo estimado de realización (número de horas/días)
  - Materiales incluidos (texto, máximo 200 caracteres)
- Todos los campos obligatorios deben ser validados antes del envío
- Al guardar exitosamente, el servicio debe aparecer inmediatamente en el catálogo del vendedor
- El vendedor debe recibir confirmación visual del servicio creado

## Prioridad

Alta

## Definition of Ready

- Diseño de formulario de creación aprobado
- Lista de categorías definida y aprobada

## Definition of Done

- El formulario permite crear servicios correctamente
- Todas las validaciones funcionan apropiadamente
- Las imágenes se suben y almacenan correctamente
- Los servicios aparecen en el catálogo inmediatamente
