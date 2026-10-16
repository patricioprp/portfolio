import { describe, expect, it } from 'vitest'
import {
  dimensionesDeSvg,
  enlacesACapitulos,
  esNavegacionDeCapitulo,
  extraerDiagramas,
  extraerResumen,
  extraerTitulo,
  figuraDiagrama,
  hashDiagrama,
  infoDeArchivo,
  reescribirEnlace,
  textoPlano,
  tituloAccesible,
  transformarHtml,
  transformarMarkdown
} from './guia'

const REPO = 'https://github.com/patricioprp/portfolio'
const FENCE = '```'

describe('infoDeArchivo', () => {
  it('toma el número y el slug del nombre del capítulo', () => {
    expect(infoDeArchivo('01-de-chatear-a-un-agente')).toEqual({
      numero: 1,
      slug: 'de-chatear-a-un-agente'
    })
    expect(infoDeArchivo('docs/guia-ia/12-casos-y-demos.md')).toEqual({
      numero: 12,
      slug: 'casos-y-demos'
    })
  })

  it('ignora archivos que no son capítulos', () => {
    expect(infoDeArchivo('README')).toBeNull()
    expect(infoDeArchivo('_plantilla.md')).toBeNull()
  })
})

describe('título y resumen', () => {
  const md = [
    '# 4 · Permisos y hooks: lo que no puede fallar',
    '',
    '`CLAUDE.md` y las reglas son **instrucciones**: el modelo',
    '_debería_ seguirlas. Ver [capítulo 3](03-contexto.md).',
    '',
    '## 4.1 Otra sección'
  ].join('\n')

  it('el título es el primer encabezado sin el número', () => {
    expect(extraerTitulo(md)).toBe('Permisos y hooks: lo que no puede fallar')
  })

  it('el resumen es el primer párrafo en texto plano', () => {
    expect(extraerResumen(md)).toBe(
      'CLAUDE.md y las reglas son instrucciones: el modelo debería seguirlas. Ver capítulo 3.'
    )
  })

  it('textoPlano saca enlaces, código y énfasis', () => {
    expect(textoPlano('Usá **`/spec`** y [la guía](README.md).')).toBe(
      'Usá /spec y la guía.'
    )
  })
})

describe('reescribirEnlace', () => {
  it('un capítulo va a su página, con ancla si la tiene', () => {
    expect(reescribirEnlace('02-primeros-pasos.md')).toBe(
      '/guia/primeros-pasos/'
    )
    expect(reescribirEnlace('./06-specs.md#62-ciclo')).toBe(
      '/guia/specs/#62-ciclo'
    )
  })

  it('el README va al índice', () => {
    expect(reescribirEnlace('README.md')).toBe('/guia/')
    expect(reescribirEnlace('README.md#indice')).toBe('/guia/#indice')
  })

  it('un archivo del repo va a GitHub', () => {
    expect(reescribirEnlace('../../CLAUDE.md')).toBe(
      `${REPO}/blob/main/CLAUDE.md`
    )
    expect(reescribirEnlace('../specs/003-demo.md')).toBe(
      `${REPO}/blob/main/docs/specs/003-demo.md`
    )
    expect(reescribirEnlace('../../.claude/rules/')).toBe(
      `${REPO}/tree/main/.claude/rules/`
    )
  })

  it('casos borde: carpeta actual y un capítulo por ruta relativa', () => {
    expect(reescribirEnlace('./')).toBe('/guia/')
    expect(reescribirEnlace('../guia-ia/07-x.md')).toBe('/guia/x/')
  })

  it('no toca enlaces absolutos, anclas ni rutas del sitio', () => {
    for (const href of ['https://docs.claude.com', '#resumen', '/casos/x/']) {
      expect(reescribirEnlace(href)).toBe(href)
    }
  })
})

describe('esNavegacionDeCapitulo', () => {
  it('reconoce los enlaces de navegación del final de cada capítulo', () => {
    expect(esNavegacionDeCapitulo('Anterior: 5 · Skills ·')).toBe(true)
    expect(esNavegacionDeCapitulo('Siguiente: 2 · Primeros pasos')).toBe(true)
    expect(esNavegacionDeCapitulo('Volver al índice')).toBe(true)
    expect(esNavegacionDeCapitulo('Siguiente paso: abrir Claude')).toBe(false)
  })
})

describe('transformarMarkdown', () => {
  const md = [
    '# 1 · Título',
    '',
    'Texto.',
    '',
    `${FENCE}mermaid`,
    'flowchart LR',
    '    accTitle: Uno',
    '    A --> B',
    FENCE,
    '',
    `${FENCE}bash`,
    'Anterior: esto es código y se queda',
    FENCE,
    '',
    'Anterior: [1 · X](01-x.md) ·',
    'Siguiente: [3 · Y](03-y.md)',
    ''
  ].join('\n')
  const salida = transformarMarkdown(
    md,
    (codigo) => `<figure>${codigo.length}</figure>`
  )

  it('reemplaza cada diagrama por la figura, como bloque HTML aparte', () => {
    expect(salida).toContain('\n\n<figure>')
    expect(salida).not.toContain(`${FENCE}mermaid`)
  })

  it('quita el párrafo de navegación pero no el código', () => {
    expect(salida).not.toContain('Siguiente: [3')
    expect(salida).toContain('Anterior: esto es código y se queda')
  })

  it('solo quita la navegación si es el último párrafo', () => {
    const medio = ['# T', '', 'Siguiente: esto es contenido.', '', 'Fin.'].join(
      '\n'
    )
    expect(transformarMarkdown(medio, () => '')).toContain(
      'Siguiente: esto es contenido.'
    )
  })

  it('funciona con fines de línea de Windows', () => {
    const r = transformarMarkdown(md.replaceAll('\n', '\r\n'), () => '<f></f>')
    expect(r).toContain('<f></f>')
    expect(r).not.toContain('Siguiente: [3')
  })
})

describe('transformarHtml', () => {
  it('envuelve las tablas en una región desplazable', () => {
    expect(transformarHtml('<table><tr><td>1</td></tr></table>')).toBe(
      '<div class="tabla" tabindex="0" role="region" aria-label="Tabla desplazable"><table><tr><td>1</td></tr></table></div>'
    )
  })

  it('les da nombre accesible a las casillas de las listas de verificación', () => {
    expect(
      transformarHtml(
        '<input type="checkbox" disabled=""> <input type="checkbox" checked="" disabled="">'
      )
    ).toBe(
      '<input type="checkbox" disabled="" aria-label="Pendiente"> <input type="checkbox" checked="" disabled="" aria-label="Hecho">'
    )
  })

  it('reescribe los enlaces para el sitio', () => {
    expect(
      transformarHtml('<a href="02-primeros-pasos.md">x</a> <a href="#a">y</a>')
    ).toBe('<a href="/guia/primeros-pasos/">x</a> <a href="#a">y</a>')
  })

  it('no reescribe texto que parece un enlace dentro de código', () => {
    const html = '<code>&#x3C;a href="x.md"></code>'
    expect(transformarHtml(html)).toBe(html)
  })
})

describe('diagramas', () => {
  const codigo = 'flowchart LR\n  accTitle: Del chat al agente\n  A --> B\n'

  it('el hash es estable y no depende de los fines de línea', () => {
    expect(hashDiagrama(codigo)).toMatch(/^[0-9a-f]{8}$/)
    expect(hashDiagrama(codigo.replaceAll('\n', '\r\n'))).toBe(
      hashDiagrama(codigo)
    )
    expect(hashDiagrama(codigo + 'B --> C')).not.toBe(hashDiagrama(codigo))
  })

  it('el título accesible sale de accTitle', () => {
    expect(tituloAccesible(codigo)).toBe('Del chat al agente')
    expect(tituloAccesible('flowchart LR\n  A --> B')).toBeNull()
  })

  it('extraerDiagramas encuentra los mismos bloques que transformarMarkdown', () => {
    const md = [
      '# T',
      '',
      `${FENCE}mermaid`,
      'flowchart LR',
      '  accTitle: X',
      FENCE,
      ''
    ].join('\r\n')
    expect(extraerDiagramas(md)).toHaveLength(1)
    expect(transformarMarkdown(md, () => '<f></f>')).toContain('<f></f>')
  })

  it('dimensionesDeSvg lee ancho y alto, o null si faltan', () => {
    expect(dimensionesDeSvg('<svg id="a" width="640" height="200">')).toEqual({
      ancho: 640,
      alto: 200
    })
    expect(dimensionesDeSvg('<svg width="100%">')).toBeNull()
  })
})

describe('figuraDiagrama', () => {
  const codigo = 'flowchart LR\n  accTitle: Del "chat" al agente\n  A --> B\n'
  const conSvg = () => ({ ancho: 900, alto: 300 })

  it('arma la figura con las dos versiones, tamaño y texto alternativo', () => {
    const r = figuraDiagrama(codigo, conSvg)
    expect(r.tipo).toBe('ok')
    if (r.tipo !== 'ok') return
    expect(r.html).toContain('-claro.svg')
    expect(r.html).toContain('-oscuro.svg')
    expect(r.html).toContain('width="900" height="300"')
    expect(r.html).toContain('alt="Del &quot;chat&quot; al agente"')
  })

  it('sin accTitle no se puede publicar', () => {
    expect(figuraDiagrama('flowchart LR\n  A --> B', conSvg).tipo).toBe(
      'sin-acctitle'
    )
  })

  it('sin el SVG generado pide correr npm run diagramas', () => {
    expect(figuraDiagrama(codigo, () => null)).toEqual({
      tipo: 'sin-svg',
      alt: 'Del "chat" al agente'
    })
  })
})

describe('enlacesACapitulos', () => {
  it('lista los capítulos enlazados (para detectar enlaces rotos)', () => {
    expect(
      enlacesACapitulos('Ver [a](02-a.md) y [b](./03-b.md#x), no [c](../x.md).')
    ).toEqual(['02-a.md', '03-b.md'])
  })
})
