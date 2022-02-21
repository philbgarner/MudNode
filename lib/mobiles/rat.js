const Mobile = require("../mobile");
const Wanderer = require('../components/wanderer')
const Mortal = require('../components/mortal')

class Rat extends Mobile {
    constructor(params) {
        super(params)

        this.name = 'Rat'
        this.description = 'A black rodent with a long tail.'

        this.props = {

        }

        this.components = [
            new Mortal({ parent: this.uuid }), new Wanderer({ parent: this.uuid })
        ]
    }
}

module.exports = Rat
