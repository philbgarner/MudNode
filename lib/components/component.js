const uuid = require('uuid')
const rooms = require('../rooms')
const entities = require('../entities')

class Component {
    constructor(params) {
        params = params ? params : {}

        this.type = params.type ? params.type : null
        this.parent = params.parent ? params.parent : null
        this.location = params.location ? params.location : null
        this.occupied = false

        this.room = this.location !== null ? rooms.getRoom(this.location) : null
        this.entity = this.parent !== null ? entities.getMobileByUuid(this.parent) : null
    }

    toJSON() {
        let json = {}
        json.parent = this.parent
        json.location = this.location
        json.type = this.type
        return json
    }

    fromJSON(json) {
        let name = json.type
        const comp = require(`./components/${name}`)
        return new comp({ parent: json.uuid, location: json.location, type: json.type })
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
