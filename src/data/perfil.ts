// Datos de contacto públicos. Fuente de verdad: docs/contenido/perfil.md
export const perfil = {
  nombre: 'Patricio R. Polito',
  nombreCompleto: 'Patricio Rolando Polito',
  email: 'patricioprp06@gmail.com',
  telefono: '+54 9 381 498 6358',
  whatsapp: '5493814986358',
  linkedin: 'https://www.linkedin.com/in/patricio-polito-88099a134',
  github: 'https://github.com/patricioprp',
  // Repositorio público; si es null no se muestran los enlaces "Ver el código".
  repositorio: 'https://github.com/patricioprp/portfolio' as string | null,
  localidad: 'San Miguel de Tucumán',
  pais: 'AR',
  cv: {
    es: '/cv/CV_Patricio_Polito_ES.pdf',
    en: '/cv/CV_Patricio_Polito_EN.pdf'
  }
} as const

export function enlaceWhatsapp(mensaje: string): string {
  return `https://wa.me/${perfil.whatsapp}?text=${encodeURIComponent(mensaje)}`
}
