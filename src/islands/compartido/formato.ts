/** Reemplaza `{clave}` por su valor. */
export function interpolar(
  plantilla: string,
  valores: Record<string, string | number>
): string {
  return plantilla.replace(/\{(\w+)\}/g, (_, clave: string) =>
    String(valores[clave] ?? `{${clave}}`)
  )
}

/** Acepta coma o punto como separador decimal. */
export function parsearDecimal(texto: string): number {
  const limpio = texto.trim().replace(',', '.')
  return limpio === '' ? NaN : Number(limpio)
}
