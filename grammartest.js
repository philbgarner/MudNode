import { grammar } from './lib/mudnode.js'

grammar.set('Sizes Comparison', ['smaller', 'average', 'larger'])
grammar.set('Larch Descriptors', [`its straight and strong trunk gives support to many branches, brought out horizontally away from it in quite regular fashion`,
    `green needle-like leaves grow out in tufts from thousands of fragile looking, greyish-brown twigs, completing tree's crown`,
    `there is an abundance of green cones, scattered all over, attached to thin branch offshoots`,
    `you notice some of the previous season's cones, dry and dark, remain here and there`,
    `colours of the finely cracked and irregularly wrinkled bark on the lower part of the trunk are mostly brown and grey, with some occasional silvery patches`])


for (let i = 0; i < 10; i++) {
    console.log(`#${i}`, grammar.text(`You are looking at an [*Sizes Comparison]-sized larch tree. [*Larch Descriptors], and [*Larch Descriptors].\n`))
}