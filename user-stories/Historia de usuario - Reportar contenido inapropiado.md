# Historia de Usuario: Reportar contenido inapropiado

## Título
Funcionalidad para que los usuarios reporten servicios con contenido inapropiado.

## Descripción
"Como usuario de la plataforma, quiero poder reportar servicios que considero inapropiados o sospechosos para ayudar a mantener la calidad y seguridad de la plataforma."

## Criterios de aceptación
- Cada servicio publicado debe tener un botón "Reportar"
- Al hacer clic en "Reportar" se debe abrir un formulario con:
  - Razón del reporte (selección múltiple):
    - Contenido ilegal (drogas, armas, etc.)
    - Información falsa o engañosa
    - Contenido ofensivo o inapropiado
    - Spam o duplicado
    - Estafa
    - Otros (campo de texto libre)
  - Campo opcional para detalles adicionales (máximo 300 caracteres)
- Al enviar el reporte:
  - Se debe mostrar confirmación: "Gracias por tu reporte. Lo revisaremos pronto."
  - El reporte debe enviarse al sistema de moderación
  - Se debe crear un ticket con información del servicio y reporte
- Los reportes deben incluir:
  - ID del servicio reportado
  - Información del vendedor
  - Fecha del reporte
  - Razones seleccionadas y detalles

## Prioridad
Media

## Definition of Ready
- Diseño del formulario de reporte aprobado
- Se definieron las categorías de reporte

## Definition of Done
- Los usuarios pueden reportar servicios exitosamente
- Los reportes llegan correctamente al sistema de moderación
- Se mantiene la privacidad del reportante