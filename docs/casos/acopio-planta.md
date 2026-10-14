# Caso: Optimización del acopio y la carga en una planta de premoldeados

- **Autor:** Patricio Rolando Polito
- **Slug:** `acopio-planta`
- **Empresa:** Tensolite S.A. / Sitenso (empresa constructora) — en el texto del caso se la describe como "empresa de premoldeados para la construcción". Fue empleador directo (no cliente), así que la experiencia la nombra y enlaza al caso (confirmado por Patricio)
- **Rol:** integrante del equipo desde el análisis; desarrollo de la planificación de producción
- **Stack:** Laravel, React, jQuery, API REST

## En 30 segundos

| El problema                                                                                                                                       | Lo que hice                                                                                                                                                      | El impacto                                                                                                                           |
| ------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Los camiones esperaban hasta 3 días para cargar y el puente grúa hacía recorridos largos porque la mercadería no estaba ubicada según la demanda. | Analizamos la rotación de productos con el historial de ventas y desarrollé la planificación de producción, el stock por cuadrante y el plan de carga por turno. | La espera de los camiones se redujo a cero si llegaban en su turno, y el tiempo de carga dentro de la planta bajó considerablemente. |

## Contexto

La empresa fabricaba una gran variedad de productos para la construcción:
viguetas, bloques, bovedillas y muchos más. La producción se acopiaba en unos
**128 cuadrantes** distribuidos a lo largo de **tres calles internas**, parecidas
a los pasillos de un supermercado. Los clientes retiraban la mercadería con
turnos y los operarios cargaban los camiones con un puente grúa.

## El problema

1. Los camiones podían esperar días enteros, a veces hasta tres, para ser atendidos.
2. La mercadería no estaba ubicada según la demanda, así que el puente grúa
   hacía recorridos largos y la carga se demoraba.

## Lo que hicimos

- **Análisis de la rotación.** A partir del historial de ventas en Excel
  hicimos una clasificación ABC (curva de Pareto) que mostró qué productos
  tenían mayor rotación: A = alta, B = media, C = baja. (Antes decía "curva de
  Gauss"; Patricio pidió reemplazarlo por el análisis ABC.)
- **Acopio por rotación.** Alta rotación cerca de la entrada y de las calles de
  circulación; rotación media en una zona intermedia; baja rotación en los
  sectores más alejados.
- **Planificación de producción (desarrollo propio).** Como los turnos se sacaban
  con tres meses de anticipación, el sistema sabía qué había que producir y, al
  registrar la producción, indicaba en qué cuadrante con lugar disponible
  convenía depositarla para que el cliente la retirara rápido en su turno.
- **Stock por cuadrante y por fila.** Si un cuadrante tenía cuatro filas de
  viguetas y el cliente se llevaba una, se descontaba esa fila y el cuadrante
  seguía ocupado con las otras tres; si se vaciaba, quedaba liberado.
- **Plan de carga.** Al llegar cada turno, el sistema le armaba al operario un
  plan que indicaba de qué cuadrante retirar cada producto y en qué orden.

Diagrama: vista superior de la planta: entrada con camiones a la izquierda,
calles 1–3, cuadrantes coloreados por rotación (alta → media → baja desde la
entrada) y puente grúa sobre rieles. Se muestra una parte de los 128 cuadrantes.

## Resultados (reales)

- **Espera de camiones: de hasta 3 días a cero.** Si llegaban en el horario de su turno, se los atendía de inmediato.
- **Menor tiempo de carga** dentro de la planta, porque la mercadería ya estaba en los cuadrantes más convenientes (sin cifra medida: no inventar un porcentaje).
