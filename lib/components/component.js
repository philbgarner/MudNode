import { rooms } from '../mudnode.js'

class Component {
    constructor(params) {
        params = params ? params : {}

        this.occupied = false

        // Serialized fields.
        this.type = params.type ? params.type : 'entity'
        this.parent = params.parent ? params.parent : null
        this.props = params.props ? params.props : {}
        this.enabled = params.enabled ? params.enabled : true
        //this.entity = this.parent !== null && this.type === 'entity' ? entities.getMobileByUuid(this.parent) : null
    }

    Location() {
        if (this.entity) {
            return this.entity.location ? this.entity.location : null
        }
    }

    Entity() {
        return this.parent !== null ? entities.getMobileByUuid(this.parent) : null
    }

    Room() {
        // if (this.type === 'entity' && this.entity) {
        //     return this.entity.location !== null ? rooms.getRoom(this.entity.location) : null
        // } else if (this.parent) {
        return this.parent !== null ? rooms.getRoom(this.parent) : null
        // }
    }

    toJSON() {
        let json = {}
        json.parent = this.parent
        json.location = this.Location()
        json.type = this.type
        json.props = this.props
        json.enabled = this.enabled
        return json
    }

    static fromJSON(json) {
        let comp = new Component()
        for (let j in json) {
            comp[j] = json[j]
        }
        return comp
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

export default Component
