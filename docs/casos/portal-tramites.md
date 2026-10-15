# Caso: Una plataforma, decenas de trámites, una sola experiencia

- **Autor:** Patricio Rolando Polito (Frontend Senior en Quadion Tech)
- **Slug:** `portal-tramites`
- **Fuente:** PDF "Experiencia en Quadion Tech" (el nombre que figuraba en el PDF era un error; el trabajo es de Patricio)
- **Cliente:** prepaga líder en Argentina — **siempre anónimo**. No nombrar al cliente ni detallar sistemas internos (nombres de servicios, endpoints, repositorios). El nombre interno de la librería compartida no se publica: en el sitio es "librería de componentes compartida".
- **Período:** diciembre 2023 – actualidad
- **Stack:** React, TypeScript, Next.js, Module Federation, Storybook, Figma, Firebase Remote Config, Jest → Vitest, Playwright, GitLab CI, Kubernetes
- **Terminología:** en el sitio se usa "contenedor principal (app shell)" en lugar de "shell container", para no coincidir con nombres internos.
- **Demo asociada:** `/demos/contingencias` (simulador de contingencias, reimplementación ilustrativa)

## En 30 segundos

| El contexto                                                                                                                                 | Lo que hice                                                                                                                                                   | El impacto                                                                                                                                                       |
| ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Migración del portal de socios legacy de una de las principales prepagas del país, con varias células de desarrollo trabajando en paralelo. | Componentes compartidos en Storybook (steppers, breadcrumbs, carga de archivos, analytics), contingencias en tiempo real y un mapa interactivo de beneficios. | Experiencia uniforme para socios y prestadores, una plataforma que se degrada de forma controlada ante fallas y una búsqueda de beneficios fluida en el celular. |

## La arquitectura

La migración comenzó con microfrontends con **Module Federation**: un shell
container orquestaba la autenticación, el layout y la navegación, y cada trámite
(reintegros, autorizaciones, facturación, discapacidad y muchos más) era un
microfrontend independiente. Más adelante, **por decisión del cliente**, se
consolidó en un **monolito modular**, donde cada trámite sigue siendo un módulo
independiente que se carga bajo demanda. Patricio vivió las dos arquitecturas.

Figura 1: shell container (autenticación, layout, navegación) que integra los
trámites como módulos independientes; header, footer y componentes comunes salen
de la librería compartida.

## Reto 1: que todo se vea y se comporte igual

Con varias células en paralelo, cada una corría el riesgo de construir sus propios
botones, formularios y patrones. Se creó una **librería compartida** que, como era
una migración, hubo que reconstruir desde cero. Patricio desarrolló muchos de sus
componentes en **Storybook**, en conjunto con diseño a partir de **Figma**:

- Steppers y breadcrumbs, presentes en todos los trámites.
- Carga de archivos que sube los documentos en dos pasos mediante URLs firmadas a la nube.
- Funciones de analytics centralizadas, para que todos los trámites midan sus eventos de la misma forma.

Figura 2: Figma (diseño UX/UI) → Storybook (librería) → pipeline GitLab (tests
unitarios y E2E) → trámites (socios y prestadores).

Figura 3: pantalla genérica de un trámite: breadcrumb, stepper, banner de
mantenimiento programado y carga de archivos.

## Reto 2: la resiliencia

Una plataforma con tantos trámites depende de muchos servicios; si uno falla, no
puede caerse todo. Se implementó un sistema de **contingencias con Firebase Remote
Config**: la aplicación consulta la configuración **cada minuto** y, según lo que
encuentre, **apaga un trámite puntual**, **muestra un aviso de mantenimiento con
fecha y horario**, o **pone toda la plataforma en mantenimiento** (por fecha o
forzado). Todo sin deployar.

Figura 4: una única configuración remota controla tres niveles de respuesta.

## Calidad y deploy

Tests unitarios (primero con Jest, luego migrados a Vitest), tests end-to-end con
Playwright y pipelines de GitLab con análisis de seguridad que deployan en
Kubernetes. El mismo build corre en todos los ambientes, porque la aplicación lee
su configuración al iniciar.

## También en Quadion: mapa interactivo de beneficios (desafío 5)

Con **Next.js** desarrolló la plataforma donde los socios encuentran y canjean
beneficios en comercios adheridos: búsqueda por provincia y localidad o por
ubicación actual, resultados en listado y en Google Maps, diseño mobile-first.
Casos resueltos:

- **Ubicaciones compartidas:** comercios en el mismo edificio agrupados por coordenadas; en lugar de una card, un carrusel.
- **Listado y mapa sincronizados:** "Ver en mapa" lleva al pin con la card abierta.
- **Densidad:** clusters con la cantidad y "buscar en esta zona".
- Recorrido: buscar → detalle → código QR → cupón de descuento.

En el sitio se usa como logro de la experiencia de Quadion, no como caso aparte.

## Resultados (cualitativos, reales)

- **Uniformidad:** socios y prestadores ven los mismos componentes en todos los trámites.
- **Resiliencia:** ante una falla se apaga un trámite, no la plataforma, y sin deploys.
- **Velocidad de equipo:** una mejora en un componente llega a todas las células a la vez.
- **Experiencia móvil:** un mapa que resuelve bien la densidad y las ubicaciones compartidas.

No hay cifras medidas: no inventar porcentajes.

## Demo del portfolio (ilustrativa)

Simulador de contingencias: un portal ficticio con trámites genéricos y una
configuración editable (mantenimiento total, trámites apagados, aviso programado).
Es una reimplementación simplificada para mostrar el concepto, no el código del
cliente.
