# 003 · Demo: Simulador de contingencias

- **Estado:** Implementada
- **Roadmap:** Fase 7
- **Relacionado:** caso `docs/casos/portal-tramites.md`

## Problema

El caso del portal de trámites explica que una configuración remota permite
apagar trámites o poner el portal en mantenimiento sin deploys. Sin poder
tocarlo, es una afirmación más.

## Objetivo

El visitante usa un portal ficticio con seis trámites y un panel de
"configuración remota" donde activa mantenimiento total, apaga trámites o
programa un aviso, y mueve un reloj simulado para ver las ventanas entrar en
vigor.

## Alcance

- Mantenimiento total forzado o con ventana horaria.
- Trámites apagados individualmente.
- Aviso programado: se anuncia antes, se marca "en curso" y desaparece al terminar.
- Reloj simulado y vista del JSON de configuración.

### Fuera de alcance

- Cualquier dato, nombre de servicio o detalle del sistema real (confidencial).
- Conexión a un servicio de configuración remota real.

## Diseño

- **Lógica:** `src/lib/contingencias/evaluar.ts` — `evaluar(config, ahora)`
  devuelve el estado del portal; la hora entra por parámetro.
- **UI:** `src/islands/contingencias/Simulador.tsx` con `client:only="react"`
  porque depende de la hora del visitante.

## Criterios de aceptación

| #   | Criterio                                                                                 | Test                                        |
| --- | ---------------------------------------------------------------------------------------- | ------------------------------------------- |
| 1   | Una ventana incluye el inicio y excluye el fin; si termina antes de empezar, es inválida | `src/lib/contingencias/evaluar.test.ts`     |
| 2   | Sin contingencias, todo opera                                                            | `src/lib/contingencias/evaluar.test.ts`     |
| 3   | Apagar trámites afecta solo a los indicados                                              | unitario + `e2e/demo-contingencias.spec.ts` |
| 4   | El mantenimiento total forzado gana sobre todo lo demás                                  | unitario + `e2e/demo-contingencias.spec.ts` |
| 5   | El mantenimiento programado aplica solo dentro de su ventana                             | `src/lib/contingencias/evaluar.test.ts`     |
| 6   | El aviso se anuncia, entra en curso y desaparece al pasar la hora                        | unitario + `e2e/demo-contingencias.spec.ts` |
| 7   | Una ventana con fin anterior al inicio muestra un error en la UI                         | `e2e/demo-contingencias.spec.ts`            |
| 8   | La configuración se serializa con fechas ISO                                             | `src/lib/contingencias/evaluar.test.ts`     |
