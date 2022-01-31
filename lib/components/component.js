const uuid = require('uuid')

class Component {
    constructor(params) {
        params = params ? params : {}

        this.type = null
        this.parent = params.parent ? params.parent : null
        this.location = params.location ? params.location : null
        this.occupied = false
    }

    /**
     * Interface version of update: component code goes here. This gets called during the main game update ticks.
     */
    Update () {
        this._update()
    }

    /**
     * Internal core component features. Should not be overridden.
     */
    _update () {
         // TODO: Any core features as required...
    }
}

module.exports = Component
