const Forest = require('../../components/forest')
const randInt = require('../../random').randInt
const RoomTemplate = require('./RoomTemplate')

class EvergreenForest extends RoomTemplate {
    constructor(params) {
        super(params)

        this.template = params.template ? params.template : 'default'

        this.names = params.names ? params.names : ['Conifer Forest', 'Evergreen Forest', 'Woodlands', 'Forested Hills']
        this.descriptions = params.descriptions ? params.descriptions : ['the smells and sounds of the forest surround you.', 'the breeze carries the scent of wood and decaying needles.', 'the understory bustles with activity in the partial shade.', 'rays of sun illuminate the decaying needles of the forest floor.']
        this.randomComponents = params.components ? params.components : []

        let treeTypes = ['Pine', 'Cedar', 'Cypress', 'Spruce', 'Fir']
        this.components = []

        let numTypes = randInt(1, 3)
        let tr = []
        let c = 0
        for (let n = 0; n < numTypes || c > treeTypes.length; ) {
            let name = treeTypes[randInt(0, treeTypes.length - 1)]
            if (tr.filter(t => t.name === name).length === 0) {
                tr.push({ name: name, qty: randInt(5, 250) })
                n++
            }
            c++
        }
        this.components.push(new Forest({ props: { trees: tr }}))
    }
}

module.exports = EvergreenForest
