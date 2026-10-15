# Producto: estrategia del portfolio

## Objetivo

Conseguir un **empleo estable a largo plazo** (no freelance). Que en menos de
30 segundos un recruiter o tech lead entienda **qué problemas resuelve
Patricio, con qué evidencia y cómo contactarlo**. El sitio actual muestra un
CV en formato web; el nuevo tiene que mostrar resultados.

## Públicos

| Público            | Qué busca                              | Qué le mostramos primero                                 |
| ------------------ | -------------------------------------- | -------------------------------------------------------- |
| Recruiter / RR.HH. | Seniority, stack, disponibilidad, CV   | Hero + stack + botón "Descargar CV"                      |
| Tech lead / CTO    | Criterio técnico, calidad, cómo piensa | Casos de estudio con decisiones técnicas + demos + tests |

## Propuesta de valor

> **Frontend Senior que convierte procesos operativos en software que ahorra
> tiempo y dinero.**
> Más de 10 años desarrollando software, hoy con React, Node y TypeScript y
> antes con Laravel: de la migración de sistemas legacy a la optimización
> matemática de la producción.

Cuatro pilares (se repiten en el hero y en los casos):

1. **Arquitectura frontend a escala**: plataformas con muchos módulos y varios
   equipos, con una librería de componentes compartida y resiliencia ante fallas.
2. **Migración y modernización**: de Laravel/Blade o sistemas de escritorio a
   React + Node, sin frenar la operación.
3. **Software que se configura, no se reprograma**: formularios y reglas
   dinámicas que el negocio cambia sin deploys.
4. **Optimización de procesos**: modelos matemáticos (investigación operativa)
   aplicados a stock, logística y producción.

## Estructura del sitio

### Home (`/`)

1. **Hero**: nombre, propuesta de valor, badge "Abierto a nuevas oportunidades",
   CTAs: "Ver casos" (primario), "Descargar CV", "Contactar". Íconos GitHub y LinkedIn.
2. **Franja de impacto** (solo métricas reales):
   - "+10 años" desarrollando software
   - "Hasta 3 días → 0" de espera de camiones (caso acopio)
   - "0 deploys" para crear o cambiar una planilla de calidad (caso formularios)
3. **Casos de estudio** (4 tarjetas → página propia cada uno): problema → solución → impacto.
4. **Demos en vivo**: Simulador de contingencias, Optimizador de cortes de viguetas y Formulario dinámico.
5. **Experiencia**: línea de tiempo compacta (empresa, rol, período, 1–2 logros, stack).
6. **Stack**: agrupado por categoría; la IA aparece como "Explorando" (es formación en curso).
7. **Formación**: Ingeniería en Sistemas de Información (UTN FRT, 2025), Técnico en Computación.
8. **Contacto**: formulario (Netlify Forms), botón de WhatsApp, email,
   LinkedIn, GitHub, ubicación (remoto desde Tucumán) e idiomas.

Sin sección de servicios ni CTA freelance: el objetivo es empleo en relación
de dependencia a largo plazo.

### Páginas de caso (`/casos/[slug]`)

Plantilla fija: Resumen en 30 segundos (problema / qué hice / impacto) →
Contexto → El reto técnico → Qué hice (etapas) → Diagrama → Resultados →
Stack → enlace a la demo si existe → CTA de contacto.

### Demos (`/demos/[slug]`)

Cada demo explica en dos líneas qué resuelve, tiene datos de ejemplo
precargados y enlaza al código en GitHub.

### Inglés (`/en/...`)

Misma estructura y contenido traducido. Selector de idioma en la navegación.

## Mejoras concretas respecto de la versión actual

| Actual                                                       | Problema                                   | Nueva versión                                       |
| ------------------------------------------------------------ | ------------------------------------------ | --------------------------------------------------- |
| Menú `hidden md:block` sin hamburguesa                       | En celular no hay navegación               | Menú móvil accesible                                |
| Hero centrado en el título del puesto                        | No dice qué problema resuelve              | Propuesta de valor + CTAs                           |
| Experiencia como lista de tareas                             | No muestra impacto                         | Casos de estudio con resultados                     |
| Sin demos                                                    | Nada que pruebe el criterio técnico        | Dos demos ejecutables con código abierto            |
| Tailwind por CDN, Font Awesome completo                      | Lento y no apto para producción            | Build con purga de CSS e íconos SVG sueltos         |
| Sin meta description, Open Graph ni favicon                  | Mala vista previa al compartir en LinkedIn | SEO + imagen OG + JSON-LD `Person`                  |
| Footer "Desarrollado para Netlify"                           | Ruido                                      | Footer con links y año dinámico                     |
| Sin CV descargable ni formulario                             | Fricción para contactar                    | Botón CV (ES/EN) + formulario                       |
| Solo en español                                              | Pierde ofertas remotas                     | Versión en inglés                                   |
| "Formación en IA" como skill                                 | Promete de más                             | "Explorando: n8n, Claude API, LangChain, LangGraph" |
| Fechas: Sertic hasta "Abril 2026" junto a Quadion desde 2023 | Parece un error                            | Confirmar en la Fase 0 del roadmap                  |

## Identidad visual

- Mantener la base actual (fondo slate-950/900, acento sky-500) para continuidad,
  más un modo claro.
- Tipografía: Inter (texto) + JetBrains Mono (detalles técnicos y métricas).
- Logo de texto `PRP.dev` (ya existente).
- Diagramas de los casos en SVG inline, coherentes con la paleta.

## Objetivos de calidad

- Lighthouse ≥ 95 en Performance, Accesibilidad, Buenas prácticas y SEO (móvil).
- JS en la home ≤ 50 KB comprimido (las demos cargan su JS solo en su página).
- WCAG 2.2 AA.

## Tono del texto

Primera persona, concreto, orientado a resultados. Verbos de acción ("migré",
"modelé", "reduje"). Sin adjetivos vacíos ("apasionado", "proactivo").
Cada afirmación de impacto tiene que poder explicarse en una entrevista.
