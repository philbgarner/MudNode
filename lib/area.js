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

    FurthestPoint(dir) {
        let rs = this.Rooms()
        if (rs.length === 0) {
            return null
        }
        let maxpoint = { x: rs[0].location.x, y: rs[0].location.y, z: rs[0].location.z }
        for (let r in rs) {
            let room = rs[r]
            if (dir.toLowerCase() === 'north') {
                if (maxpoint.z > room.location.z) {
                    maxpoint = room.location
                }
            } else if (dir.toLowerCase() === 'south') {
                if (maxpoint.z < room.location.z) {
                    maxpoint = room.location
                }
            } else if (dir.toLowerCase() === 'east') {
                if (maxpoint.x < room.location.x) {
                    maxpoint = room.location
                }
            } else if (dir.toLowerCase() === 'west') {
                if (maxpoint.x > room.location.x) {
                    maxpoint = room.location
                }
            }
        }
        return maxpoint
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