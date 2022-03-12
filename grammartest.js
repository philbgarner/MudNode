import { grammar } from './lib/mudnode.js'

// Dictionary Values:
grammar.set('Strong Adverbs', ['overwhelmingly', 'unbelievably', 'unbearably', 'incredibly'])

// Evaluate Sentence
for (let i = 0; i < 20; i++) {
    console.log(grammar.text(`The light is [*Strong Adverbs] bright.`))
}