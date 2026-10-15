// QR ilustrativo (no escaneable) y código de cupón, ambos determinísticos a
// partir del id del comercio, para que la demo sea reproducible.

function hash(texto: string): number {
  let h = 2166136261
  for (let i = 0; i < texto.length; i++) {
    h ^= texto.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function aleatorio(semilla: number): () => number {
  let a = semilla
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Matriz de módulos con los tres patrones de posición de un QR. */
export function patronQr(semilla: string, n = 25): boolean[][] {
  const rnd = aleatorio(hash(semilla))
  const m = Array.from({ length: n }, () =>
    Array.from({ length: n }, () => rnd() > 0.52)
  )
  const buscador = (fila: number, col: number) => {
    for (let i = -1; i < 8; i++) {
      for (let j = -1; j < 8; j++) {
        const f = fila + i
        const c = col + j
        const celda = m[f]
        if (!celda || c < 0 || c >= n) continue
        const borde = i === 0 || i === 6 || j === 0 || j === 6
        const centro = i >= 2 && i <= 4 && j >= 2 && j <= 4
        celda[c] = i >= 0 && i <= 6 && j >= 0 && j <= 6 && (borde || centro)
      }
    }
  }
  buscador(0, 0)
  buscador(0, n - 7)
  buscador(n - 7, 0)
  return m
}

export function codigoCupon(semilla: string, fecha: Date): string {
  const base = hash(`${semilla}-${fecha.toDateString()}`)
    .toString(36)
    .toUpperCase()
    .padStart(6, '0')
  return `BEN-${base.slice(0, 3)}-${base.slice(3, 6)}`
}
