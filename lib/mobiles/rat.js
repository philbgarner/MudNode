const Mobile = require("../mobile");

class Rat extends Mobile {
    constructor(params) {
        super(params)

        this.name = 'Rat'
        this.description = 'A black rodent with a long tail.'

        this.props = {

        }

        this.components = [
            new Mortal()
        ]
    }
}