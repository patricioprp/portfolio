# 0004 · Mapa de beneficios dibujado en SVG

- **Estado:** Aceptado

## Contexto

La demo del mapa de beneficios necesita zoom, arrastre y clusters. El
repositorio es público y el sitio es estático.

## Decisión

Dibujar el mapa en SVG con comercios ficticios y lógica propia de proyección
y clusters en `src/lib/mapa/`.

## Alternativas consideradas

- **Google Maps:** requiere una API key, que en un repositorio público queda
  expuesta, y agrega un tercero a la CSP.
- **Leaflet + teselas de OpenStreetMap:** más peso y dependencia de un
  servidor de teselas externo.

## Consecuencias

- Sin claves ni servicios externos; la CSP sigue en `'self'`.
- La lógica de clusters y proyección queda a la vista y con tests.
- El mapa no muestra calles reales: es una ilustración, y la demo lo aclara.
