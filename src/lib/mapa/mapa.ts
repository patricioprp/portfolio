// Lógica del mapa de beneficios: agrupar comercios que comparten ubicación,
// proyectar coordenadas a la vista, agrupar pines cercanos en clusters y
// filtrar por la zona visible. Reimplementación ilustrativa para el portfolio
// (docs/casos/mapa-beneficios.md); no depende de ninguna librería de mapas.

export interface Punto {
  lat: number
  lng: number
}

export interface Comercio extends Punto {
  id: string
  nombre: string
  rubro: string
  descuento: number
  zona: string
  direccion: string
}

/** Comercios que comparten exactamente la misma ubicación (edificio, shopping). */
export interface Grupo extends Punto {
  clave: string
  comercios: Comercio[]
}

export function claveDeUbicacion(p: Punto): string {
  return `${p.lat.toFixed(6)},${p.lng.toFixed(6)}`
}

/** Agrupa por coordenadas: un pin por ubicación, aunque haya varios comercios. */
export function agruparPorUbicacion(comercios: readonly Comercio[]): Grupo[] {
  const grupos = new Map<string, Grupo>()
  for (const c of comercios) {
    const clave = claveDeUbicacion(c)
    const grupo = grupos.get(clave)
    if (grupo) grupo.comercios.push(c)
    else grupos.set(clave, { clave, lat: c.lat, lng: c.lng, comercios: [c] })
  }
  return [...grupos.values()]
}

/** Distancia en km (fórmula de haversine). */
export function distanciaKm(a: Punto, b: Punto): number {
  const R = 6371
  const rad = (g: number) => (g * Math.PI) / 180
  const dLat = rad(b.lat - a.lat)
  const dLng = rad(b.lng - a.lng)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

export interface Vista {
  centro: Punto
  /** 0 = vista general; cada nivel muestra la mitad del área. */
  zoom: number
}

/** Tamaño (en grados) del área visible con zoom 0. */
export interface Encuadre {
  spanLat: number
  spanLng: number
  zoomMaximo: number
}

export interface Limites {
  norte: number
  sur: number
  este: number
  oeste: number
}

export function limitesDeVista(vista: Vista, encuadre: Encuadre): Limites {
  const factor = 2 ** vista.zoom
  const medioLat = encuadre.spanLat / factor / 2
  const medioLng = encuadre.spanLng / factor / 2
  return {
    norte: vista.centro.lat + medioLat,
    sur: vista.centro.lat - medioLat,
    este: vista.centro.lng + medioLng,
    oeste: vista.centro.lng - medioLng
  }
}

export function dentro(p: Punto, l: Limites): boolean {
  return (
    p.lat <= l.norte && p.lat >= l.sur && p.lng <= l.este && p.lng >= l.oeste
  )
}

/** Posición relativa (0 a 1) dentro de la vista: x desde el oeste, y desde el norte. */
export function proyectar(
  p: Punto,
  vista: Vista,
  encuadre: Encuadre
): { x: number; y: number } {
  const l = limitesDeVista(vista, encuadre)
  return {
    x: (p.lng - l.oeste) / (l.este - l.oeste),
    y: (l.norte - p.lat) / (l.norte - l.sur)
  }
}

/** Punto geográfico de una posición relativa de la vista (inversa de proyectar). */
export function desproyectar(
  pos: { x: number; y: number },
  vista: Vista,
  encuadre: Encuadre
): Punto {
  const l = limitesDeVista(vista, encuadre)
  return {
    lat: l.norte - pos.y * (l.norte - l.sur),
    lng: l.oeste + pos.x * (l.este - l.oeste)
  }
}

export type Marcador =
  | { tipo: 'grupo'; id: string; x: number; y: number; grupo: Grupo }
  | {
      tipo: 'cluster'
      id: string
      x: number
      y: number
      cantidad: number
      centro: Punto
    }

/**
 * Pines de la vista. Fuera del zoom máximo, los grupos que caen en la misma
 * celda de una grilla de pantalla se unen en un cluster con la cantidad de
 * comercios; con el zoom máximo se muestra cada ubicación por separado.
 */
export function calcularMarcadores(
  grupos: readonly Grupo[],
  vista: Vista,
  encuadre: Encuadre,
  celda = 0.24
): Marcador[] {
  const limites = limitesDeVista(vista, encuadre)
  const visibles = grupos
    .filter((g) => dentro(g, limites))
    .map((g) => ({ g, ...proyectar(g, vista, encuadre) }))

  if (vista.zoom >= encuadre.zoomMaximo) {
    return visibles.map(({ g, x, y }) => ({
      tipo: 'grupo',
      id: g.clave,
      x,
      y,
      grupo: g
    }))
  }

  const celdas = new Map<string, typeof visibles>()
  for (const v of visibles) {
    const clave = `${Math.floor(v.x / celda)}:${Math.floor(v.y / celda)}`
    const lista = celdas.get(clave)
    if (lista) lista.push(v)
    else celdas.set(clave, [v])
  }

  return [...celdas.entries()].map(([clave, lista]): Marcador => {
    const [unico] = lista
    if (lista.length === 1 && unico) {
      return {
        tipo: 'grupo',
        id: unico.g.clave,
        x: unico.x,
        y: unico.y,
        grupo: unico.g
      }
    }
    const promedio = (f: (v: (typeof lista)[number]) => number) =>
      lista.reduce((s, v) => s + f(v), 0) / lista.length
    return {
      tipo: 'cluster',
      id: `cluster-${vista.zoom}-${clave}`,
      x: promedio((v) => v.x),
      y: promedio((v) => v.y),
      cantidad: lista.reduce((s, v) => s + v.g.comercios.length, 0),
      centro: { lat: promedio((v) => v.g.lat), lng: promedio((v) => v.g.lng) }
    }
  })
}
