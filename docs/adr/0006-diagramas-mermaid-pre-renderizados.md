# 0006 · Diagramas Mermaid pre-renderizados a SVG

- **Estado:** Aceptado

## Contexto

La guía (`docs/guia-ia/`) usa diagramas Mermaid porque GitHub los muestra sin
configuración. Para publicarla en el sitio (spec 006) hay que convertirlos en
imágenes que respeten el tema claro/oscuro, tengan texto alternativo y no
agreguen JavaScript.

## Decisión

Un script local (`npm run diagramas`) dibuja cada diagrama con Mermaid en
Chromium (Playwright, que ya se usa para los e2e) y guarda dos SVG por
diagrama, claro y oscuro, en `public/guia/diagramas/`, nombrados por un hash
del código. Los SVG se versionan. Un plugin de remark reemplaza cada bloque
por los dos `<img>` y el CSS muestra el que corresponde al tema. Si un
diagrama cambió y no se regeneró, el build falla.

## Alternativas consideradas

- **Render en el build (`rehype-mermaid`):** el build de Netlify necesitaría
  instalar Chromium en cada deploy: más lento y frágil.
- **Render en el cliente (librería `mermaid`):** cientos de KB de JavaScript
  en cada capítulo y diagramas que aparecen tarde (salto de layout).
- **Dibujar los diagramas a mano en SVG:** se pierde la fuente única que GitHub
  muestra, y cada cambio cuesta mucho más.

## Consecuencias

- Cero JavaScript nuevo y SVG livianos que se cargan en diferido.
- Hay que correr `npm run diagramas` al cambiar un diagrama; el build lo exige.
- Cada diagrama necesita `accTitle` (texto alternativo); el script lo exige.
- `mermaid` queda como dependencia de desarrollo.
