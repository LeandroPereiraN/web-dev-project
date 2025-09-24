# Historia de Usuario: Búsqueda y filtro de servicios disponibles

## Título
    Funcionalidad para que compradores busquen y filtren servicios

## Descripción
    "Como comprador, quiero buscar y filtrar servicios por categoría, vendedor, precio o palabra 
    clave para encontrar rápidamente lo que necesito"

## Criterios de aceptación
- Debe haber una barra de búsqueda prominente en la página principal con:
  - Campo de texto para búsqueda libre
  - Botón "Buscar"
- Los filtros deben incluir las siguientes opciones específicas:
  - Categoría (selección de lista predefinida: Plomería, Electricidad, Carpintería, Limpieza, Jardinería, Pintura, Reparaciones, Desarrollo, Entre otros)
  - Rango de precio (Entre X e Y).
  - Calificación mínima: 1 estrella, 2 estrellas, 3 estrellas, 4 estrellas, 5 estrellas, Sin filtro
- Los resultados deben incluir opciones de ordenamiento:
  - Precio: menor a mayor
  - Precio: mayor a menor
  - Fecha: más recientes primero
  - Calificación: menor a mayor
  - Calificación: mayor a menor
- Debe mostrar información de resultados: "Mostrando X de Y servicios" 
- Implementar paginación: máximo 20 resultados por página

## Prioridad
  Alta

## Definition of Ready
- Diseño de pantalla de búsqueda y filtro aprobados
- Se definió la priorización de resultados

## Definition of Done
- Los filtros y búsqueda funcionando
- Los resultados se ordenan correctamente