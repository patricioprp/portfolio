# Caso: Beneficios en el mapa

- **Autor:** Patricio Rolando Polito (Frontend Senior en Quadion Tech)
- **Slug:** `mapa-beneficios`
- **Fuente:** PDF "Experiencia en Quadion Tech", desafío 5 (el nombre que figuraba en el PDF era un error; el trabajo es de Patricio)
- **Cliente:** el mismo del caso `portal-tramites`, **siempre anónimo**: "prepaga líder a nivel nacional". No publicar el nombre del cliente ni el nombre comercial de la plataforma de beneficios.
- **Período:** dentro de diciembre 2023 – actualidad (fecha exacta no confirmada)
- **Stack:** Next.js, React, TypeScript, Google Maps; diseño mobile-first
- **Demo asociada:** `/demos/mapa-beneficios` (reimplementación ilustrativa con un mapa en SVG y comercios ficticios; sin Google Maps para no exponer una API key)

## En 30 segundos

| El problema                                                                                                                                              | Lo que hice                                                                                                                         | El impacto                                                                                                                           |
| -------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Los socios tenían que encontrar y canjear beneficios en comercios adheridos desde el celular, con muchos resultados y comercios que comparten ubicación. | Desarrollé con Next.js la plataforma de beneficios: búsqueda, listado y mapa sincronizados, y resolví los casos difíciles del mapa. | Un mapa que resuelve bien la densidad y las ubicaciones compartidas, y un recorrido de la búsqueda al cupón pensado para el celular. |

## Contexto

Con **Next.js** Patricio desarrolló la plataforma donde los socios encuentran y
canjean beneficios en comercios adheridos. Se busca **por provincia y localidad o
por la ubicación actual**, y los resultados se ven en un **listado** y en un **mapa
de Google Maps**. El diseño es **mobile-first**.

## Los casos difíciles del mapa (resueltos por Patricio)

- **Ubicaciones compartidas.** Cuando varios comercios están en el mismo edificio o
  shopping, sus pines se superponen y no se pueden tocar por separado. Los agrupó
  **por coordenadas** y, en lugar de una card, se despliega un **carrusel**.
- **Listado y mapa sincronizados.** Desde cualquier comercio del listado, "Ver en
  mapa" lleva directo a su pin con la card abierta (estado compartido con el
  comercio seleccionado).
- **Densidad.** Con muchos resultados, los pines se agrupan en **clusters con la
  cantidad**, y el socio puede mover el mapa y **buscar en esa zona**.

Figura 5: los dos comportamientos del mapa con comercios ficticios: card para un
pin y carrusel para una ubicación compartida.

## El recorrido del socio

Buscar (mapa o listado) → Detalle (comercio y sede) → se abre el **código QR** →
**cupón** de descuento listo.

Figura 6: recorrido del socio, de la búsqueda al cupón.

## Código de referencia (agrupar por coordenadas)

```js
const grupos = comercios.reduce((acc, c) => {
  const clave = `${c.lat},${c.lng}`
  ;(acc[clave] ||= []).push(c)
  return acc
}, {})
```

## Resultados (cualitativos, reales)

- **Experiencia móvil:** un mapa que resuelve bien la densidad y las ubicaciones compartidas.
- Recorrido completo de la búsqueda al cupón desde el celular.

No hay cifras medidas: no inventar porcentajes ni cantidades de comercios o usuarios.

## Demo del portfolio (ilustrativa)

Ciudad y comercios ficticios. Mapa en SVG con zoom y arrastre, clusters con la
cantidad, carrusel para comercios en el mismo edificio, listado ordenado por
distancia a una ubicación simulada, "Ver en mapa", "Buscar en esta zona" y el
recorrido detalle → QR → cupón (QR ilustrativo, no escaneable).
