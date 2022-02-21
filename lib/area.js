const uuid = require('uuid')
const rooms = require('./rooms')
const entities = require('./entities')

class Area {
    constructor(params) {
        params = params ? params : {}
        this.uuid = params.uuid ? params.uuid : uuid.v4()
        this.name = params.name ? params.name : 'area'
        this.template = params.template ? params.template : null
    }

    Rooms() {
        return rooms.getRoomsByArea(this.uuid)
    }

    Mobiles() {
        return entities.getMobilesByArea(this.uuid)
    }

    static fromJSON(json) {
        let area = new Area()
        for (let j in json) {
            area[j] = json[j]
        }
        return area
    }

    toJSON() {
        let json = {}
        json.uuid = this.uuid
        json.name = this.name
        json.template = this.template
        return json
    }

}

module.exports = Area