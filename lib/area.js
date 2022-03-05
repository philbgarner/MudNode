import { v4 } from 'uuid'
// import rooms from './rooms.js'
// import entities from './entities.js'
// import RoadArea from './templates/areas/RoadArea.js'
import { RoadArea, rooms } from './mudnode.js'

class Area {
    constructor(params) {
        params = params ? params : {}
        this.uuid = params.uuid ? params.uuid : v4()
        this.name = params.name ? params.name : 'area'
        this.template = params.template ? params.template : null
    }

    Rooms() {
        return rooms.getRoomsByArea(this.uuid)
    }

    Mobiles() {
        return entities.getMobilesByArea(this.uuid)
    }

    RoadTo(fromBorder, area) {
        let roadArea = new RoadArea({ template: 'HamletStreet' })
        roadArea.startLocation = area.FurthestPoint(fromBorder)
        let opposites = {
            'North': 'South',
            'South': 'North',
            'West': 'East',
            'East': 'West',
        }
        roadArea.endLocation = area.FurthestPoint(opposites[fromBorder])
        return roadArea.GenerateRooms()
    }

    MidPoint() {
        let west = this.FurthestPoint('West')
        let east = this.FurthestPoint('East')
        let north = this.FurthestPoint('North')
        let south = this.FurthestPoint('South')
        return {
            x: parseInt((east.location.x - west.location.x) / 2),
            y: west.location.y,
            z: parseInt((north.location.z - south.location.z) / 2)
        }
    }

    IsEastOf(area) {
        let midpoint = this.MidPoint()
        let areaMid = area.MidPoint()
        return midpoint.location.x > areaMid.location.x
    }

    IsNorthOf(area) {
        let midpoint = this.MidPoint()
        let areaMid = area.MidPoint()
        return midpoint.location.z < areaMid.location.z
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

export default  Area
