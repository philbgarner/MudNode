const rooms = require('../rooms')
const entities = require('../entities')

class Component {
    constructor(params) {
        params = params ? params : {}

        this.occupied = false

        // Serialized fields.
        this.type = params.type ? params.type : null
        this.parent = params.parent ? params.parent : null
        this.location = params.location ? params.location : null
        this.props = params.props ? params.props : {}

        
        this.entity = this.parent !== null ? entities.getMobileByUuid(this.parent) : null
    }

    Room() {
        return this.entity.location !== null ? rooms.getRoom(this.entity.location) : null
    }

    toJSON() {
        let json = {}
        json.parent = this.parent
        json.location = this.location
        json.type = this.type
        json.props = this.props
        return json
    }

    static fromJSON(json) {
        let name = json.type
        const comp = require(`./${name}`)
        return new comp({ parent: json.parent, location: json.location, type: json.type, props: json.props })
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
