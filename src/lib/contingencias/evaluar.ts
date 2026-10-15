// Contingencias de un portal de trámites: una única configuración remota
// decide si toda la plataforma está en mantenimiento, qué trámites están
// apagados y qué aviso de mantenimiento programado se muestra.
// Reimplementación ilustrativa para el portfolio (docs/casos/portal-tramites.md).

export interface Ventana {
  desde: Date
  hasta: Date
}

export interface ConfigContingencia {
  mantenimientoTotal: {
    /** Pone toda la plataforma en mantenimiento ya, sin fecha. */
    forzado: boolean
    /** Mantenimiento total programado. */
    ventana: Ventana | null
  }
  /** Ids de los trámites apagados. */
  tramitesApagados: readonly string[]
  /** Mantenimiento programado que se anuncia con un banner. */
  aviso: Ventana | null
}

export type EstadoPortal =
  | { tipo: 'mantenimiento-total'; hasta: Date | null }
  | {
      tipo: 'operativo'
      apagados: ReadonlySet<string>
      aviso: (Ventana & { enCurso: boolean }) | null
    }

export function ventanaValida(v: Ventana): boolean {
  return (
    !Number.isNaN(v.desde.getTime()) &&
    !Number.isNaN(v.hasta.getTime()) &&
    v.hasta.getTime() > v.desde.getTime()
  )
}

export function enVentana(v: Ventana, ahora: Date): boolean {
  return (
    ventanaValida(v) &&
    ahora.getTime() >= v.desde.getTime() &&
    ahora.getTime() < v.hasta.getTime()
  )
}

/**
 * Prioridades: el mantenimiento total (forzado o dentro de su ventana) gana
 * sobre todo lo demás; si no, la plataforma opera con los trámites apagados y,
 * mientras no haya terminado, el aviso de mantenimiento programado.
 */
export function evaluar(config: ConfigContingencia, ahora: Date): EstadoPortal {
  const { forzado, ventana } = config.mantenimientoTotal
  if (forzado) return { tipo: 'mantenimiento-total', hasta: null }
  if (ventana && enVentana(ventana, ahora)) {
    return { tipo: 'mantenimiento-total', hasta: ventana.hasta }
  }

  const { aviso } = config
  const avisoVigente =
    aviso && ventanaValida(aviso) && ahora.getTime() < aviso.hasta.getTime()
      ? { ...aviso, enCurso: enVentana(aviso, ahora) }
      : null

  return {
    tipo: 'operativo',
    apagados: new Set(config.tramitesApagados),
    aviso: avisoVigente
  }
}

/** Forma en que la configuración viajaría como JSON (Remote Config). */
export function aJson(config: ConfigContingencia): string {
  const ventana = (v: Ventana | null) =>
    v ? { desde: v.desde.toISOString(), hasta: v.hasta.toISOString() } : null
  return JSON.stringify(
    {
      mantenimientoTotal: {
        forzado: config.mantenimientoTotal.forzado,
        ventana: ventana(config.mantenimientoTotal.ventana)
      },
      tramitesApagados: config.tramitesApagados,
      aviso: ventana(config.aviso)
    },
    null,
    2
  )
}
