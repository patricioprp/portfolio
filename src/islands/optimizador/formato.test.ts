import { describe, expect, it } from 'vitest'
import { interpolar, parsearDecimal } from './formato'

describe('interpolar', () => {
  it('reemplaza las claves conocidas y deja las desconocidas', () => {
    expect(interpolar('{a} y {b}', { a: 1 })).toBe('1 y {b}')
  })
})

describe('parsearDecimal', () => {
  it('acepta coma y punto', () => {
    expect(parsearDecimal('4,40')).toBe(4.4)
    expect(parsearDecimal('4.40')).toBe(4.4)
  })

  it('devuelve NaN para vacío o texto', () => {
    expect(parsearDecimal('  ')).toBeNaN()
    expect(parsearDecimal('abc')).toBeNaN()
  })
})
