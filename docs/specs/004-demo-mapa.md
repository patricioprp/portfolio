# 004 · Demo: Mapa de beneficios

- **Estado:** Implementada
- **Roadmap:** Fase 7
- **Relacionado:** caso `docs/casos/mapa-beneficios.md`,
  [ADR 0004](../adr/0004-mapa-en-svg.md)

## Problema

El caso del mapa de beneficios trata de decisiones de UX mobile-first
(clusters, comercios en el mismo edificio, canje). Se entienden mejor
usándolas que leyéndolas.

## Objetivo

El visitante explora un mapa con comercios ficticios: acerca, arrastra, abre
clusters, ve el carrusel de un edificio compartido, filtra por zona visible y
recorre el canje hasta el cupón con QR.

## Alcance

- Mapa dibujado en SVG con zoom y arrastre (puntero y teclado).
- Agrupación por coordenadas y clusters con grilla de pantalla.
- Carrusel por edificio, listado sincronizado, pestañas Mapa/Listado en mobile.
- "Buscar en esta zona" que filtra por el área visible.
- Diálogo de canje: detalle → QR → cupón.

### Fuera de alcance

- Google Maps u otro proveedor con API key (ver ADR 0004).
- Comercios o datos reales.

## Diseño

- **Lógica:** `src/lib/mapa/mapa.ts` (agrupación, proyección, clusters,
  límites, distancia); datos ficticios en `src/lib/mapa/ejemplo.ts`.
- **UI:** `src/islands/mapa/` (`MapaBeneficios`, `Tarjetas`, `Canje`, `qr`).

## Criterios de aceptación

| #   | Criterio                                                                                 | Test                        |
| --- | ---------------------------------------------------------------------------------------- | --------------------------- |
| 1   | Los comercios del mismo edificio forman un solo pin                                      | `src/lib/mapa/mapa.test.ts` |
| 2   | Proyectar y desproyectar son inversas; cada nivel de zoom muestra la mitad del ancho     | `src/lib/mapa/mapa.test.ts` |
| 3   | Con poco zoom se agrupan pines cercanos con la cantidad; con zoom máximo no hay clusters | `src/lib/mapa/mapa.test.ts` |
| 4   | Solo se incluyen marcadores dentro de la vista                                           | `src/lib/mapa/mapa.test.ts` |
| 5   | Tocar un cluster acerca el mapa                                                          | `e2e/demo-mapa.spec.ts`     |
| 6   | "Ver en mapa" abre el carrusel de un edificio compartido                                 | `e2e/demo-mapa.spec.ts`     |
| 7   | El recorrido llega del detalle al cupón                                                  | `e2e/demo-mapa.spec.ts`     |
| 8   | "Buscar en esta zona" filtra por el área visible                                         | `e2e/demo-mapa.spec.ts`     |
| 9   | Carrusel y canje abiertos pasan axe                                                      | `e2e/demo-mapa.spec.ts`     |
