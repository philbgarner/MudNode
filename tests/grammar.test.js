import { grammar } from '../lib/mudnode.js'

test('Generated text from grammer for template.', () => {
    grammar.set('Param Name 1', 'param name 1')
    grammar.set('Param Name 2', 'param name 2')
    expect(grammar.text('Test [*Param Name 1], test 2 [*Param Name 2].')).toBe('Test param name 1, test 2 param name 2.')
})