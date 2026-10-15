import type { Comercio, Encuadre, Punto } from './mapa'

// Ciudad y comercios ficticios para la demo. Las coordenadas son un plano de
// ejemplo; no representan comercios reales.
export const CENTRO: Punto = { lat: -34.6, lng: -58.45 }
export const UBICACION_SOCIO: Punto = { lat: -34.6032, lng: -58.4478 }

export const ENCUADRE: Encuadre = {
  spanLat: 0.05,
  spanLng: 0.064,
  zoomMaximo: 3
}

const en = (dLat: number, dLng: number) => ({
  lat: Number((CENTRO.lat + dLat).toFixed(6)),
  lng: Number((CENTRO.lng + dLng).toFixed(6))
})

// Dos ubicaciones compartidas: un shopping y una galería.
const PASEO_CENTRAL = en(0.0012, 0.0021)
const GALERIA_DEL_SOL = en(-0.0118, 0.0142)

type Base = Omit<Comercio, 'lat' | 'lng'>

const lista: [Base, Punto][] = [
  [
    {
      id: 'optica-norte',
      nombre: 'Óptica Norte',
      rubro: 'optica',
      descuento: 20,
      zona: 'norte',
      direccion: 'Av. Principal 1200'
    },
    en(0.0145, -0.0061)
  ],
  [
    {
      id: 'cafe-central',
      nombre: 'Café Central',
      rubro: 'gastronomia',
      descuento: 15,
      zona: 'centro',
      direccion: 'Paseo Central, local 4'
    },
    PASEO_CENTRAL
  ],
  [
    {
      id: 'deportes-pc',
      nombre: 'Deportes del Paseo',
      rubro: 'deportes',
      descuento: 25,
      zona: 'centro',
      direccion: 'Paseo Central, local 12'
    },
    PASEO_CENTRAL
  ],
  [
    {
      id: 'farmacia-pc',
      nombre: 'Farmacia del Paseo',
      rubro: 'farmacia',
      descuento: 10,
      zona: 'centro',
      direccion: 'Paseo Central, local 2'
    },
    PASEO_CENTRAL
  ],
  [
    {
      id: 'libreria-pc',
      nombre: 'Librería Páginas',
      rubro: 'libreria',
      descuento: 15,
      zona: 'centro',
      direccion: 'Paseo Central, local 18'
    },
    PASEO_CENTRAL
  ],
  [
    {
      id: 'heladeria-sol',
      nombre: 'Heladería del Sol',
      rubro: 'gastronomia',
      descuento: 20,
      zona: 'sur',
      direccion: 'Galería del Sol, local 1'
    },
    GALERIA_DEL_SOL
  ],
  [
    {
      id: 'ropa-sol',
      nombre: 'Moda del Sol',
      rubro: 'indumentaria',
      descuento: 30,
      zona: 'sur',
      direccion: 'Galería del Sol, local 7'
    },
    GALERIA_DEL_SOL
  ],
  [
    {
      id: 'farmacia-plaza',
      nombre: 'Farmacia Plaza',
      rubro: 'farmacia',
      descuento: 15,
      zona: 'centro',
      direccion: 'Calle 9 de Julio 450'
    },
    en(-0.0021, -0.0034)
  ],
  [
    {
      id: 'gimnasio-centro',
      nombre: 'Gimnasio Movimiento',
      rubro: 'deportes',
      descuento: 20,
      zona: 'centro',
      direccion: 'Calle Mitre 870'
    },
    en(0.0038, -0.0012)
  ],
  [
    {
      id: 'optica-centro',
      nombre: 'Óptica Visión',
      rubro: 'optica',
      descuento: 25,
      zona: 'centro',
      direccion: 'Calle Belgrano 310'
    },
    en(-0.0044, 0.0052)
  ],
  [
    {
      id: 'pizzeria-norte',
      nombre: 'Pizzería La Esquina',
      rubro: 'gastronomia',
      descuento: 10,
      zona: 'norte',
      direccion: 'Calle Las Heras 2100'
    },
    en(0.0118, 0.0049)
  ],
  [
    {
      id: 'libreria-norte',
      nombre: 'Librería del Parque',
      rubro: 'libreria',
      descuento: 20,
      zona: 'norte',
      direccion: 'Av. del Parque 540'
    },
    en(0.0172, 0.0098)
  ],
  [
    {
      id: 'farmacia-norte',
      nombre: 'Farmacia Norte',
      rubro: 'farmacia',
      descuento: 10,
      zona: 'norte',
      direccion: 'Av. Principal 1650'
    },
    en(0.0161, -0.0102)
  ],
  [
    {
      id: 'deportes-norte',
      nombre: 'Running Club',
      rubro: 'deportes',
      descuento: 15,
      zona: 'norte',
      direccion: 'Calle Colón 1980'
    },
    en(0.0094, -0.0141)
  ],
  [
    {
      id: 'resto-sur',
      nombre: 'Parrilla El Molino',
      rubro: 'gastronomia',
      descuento: 15,
      zona: 'sur',
      direccion: 'Av. del Sur 760'
    },
    en(-0.0152, -0.0058)
  ],
  [
    {
      id: 'optica-sur',
      nombre: 'Óptica del Sur',
      rubro: 'optica',
      descuento: 20,
      zona: 'sur',
      direccion: 'Av. del Sur 1120'
    },
    en(-0.0171, 0.0037)
  ],
  [
    {
      id: 'indumentaria-centro',
      nombre: 'Tienda Urbana',
      rubro: 'indumentaria',
      descuento: 25,
      zona: 'centro',
      direccion: 'Calle San Martín 95'
    },
    en(0.0009, -0.0078)
  ],
  [
    {
      id: 'cafe-sur',
      nombre: 'Café de la Estación',
      rubro: 'gastronomia',
      descuento: 10,
      zona: 'sur',
      direccion: 'Plaza Estación s/n'
    },
    en(-0.0089, -0.0152)
  ],
  [
    {
      id: 'farmacia-sur',
      nombre: 'Farmacia Estación',
      rubro: 'farmacia',
      descuento: 15,
      zona: 'sur',
      direccion: 'Calle Rivadavia 2300'
    },
    en(-0.0128, -0.0119)
  ],
  [
    {
      id: 'libreria-centro',
      nombre: 'Librería Mundo',
      rubro: 'libreria',
      descuento: 10,
      zona: 'centro',
      direccion: 'Calle Corrientes 640'
    },
    en(-0.0058, -0.0009)
  ]
]

export const COMERCIOS: Comercio[] = lista.map(([c, p]) => ({ ...c, ...p }))

export const RUBROS = [
  'gastronomia',
  'farmacia',
  'optica',
  'deportes',
  'indumentaria',
  'libreria'
] as const
export const ZONAS = ['centro', 'norte', 'sur'] as const
