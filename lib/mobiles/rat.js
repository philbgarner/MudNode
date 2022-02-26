import Mobile from "../mobile.js"
import Wanderer from '../components/wanderer.js'
import Mortal from '../components/mortal.js'

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

export default  Rat
