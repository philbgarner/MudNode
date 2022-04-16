import { grammar } from '../lib/mudnode.js'

test('Generated text from grammer for template.', () => {
    grammar.set('Param Name 1', 'param name 1')
    grammar.set('Param Name 2', 'param name 2')
    expect(grammar.process('Test [*Param Name 1], test 2 [*Param Name 2].').sentence).toBe('Test param name 1, test 2 param name 2.')
})

test ('Single die rolling notation (1d8).', () => {
    let roll = grammar.roll('1d8')
    expect(roll).toBeLessThan(9)
    expect(roll).toBeGreaterThan(0)
})

test ('Multiple die rolling notation (2d8).', () => {
    let roll = grammar.roll('2d8')
    expect(roll).toBeLessThan(17)
    expect(roll).toBeGreaterThan(0)
})

test ('Multiple die rolling notation (1d8+1).', () => {
    let roll = grammar.roll('1d8+1')
    expect(roll).toBeLessThan(10)
    expect(roll).toBeGreaterThan(0)
})