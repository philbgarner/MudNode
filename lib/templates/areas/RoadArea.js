import Area from '../../area.js'
import areas from '../../areas.js'
import rooms from '../../rooms.js'
import templating from '../templating.js'
import AreaTemplate from './AreaTemplate.js'

class RoadArea extends AreaTemplate {
    constructor(params) {
        super(params)
        this.template = params.template ? params.template : 'area template'

        this.area = params.area ? params.area : new Area()
        this.startLocation = params.startLocation ? params.startLocation : { x: 0, y:0, z:0 }
        this.endLocation = params.endLocation ? params.endLocation : { x: 0, y:0, z:0 }

        /*
         *Example Format for connections:
         *
            {
                'TemplateName': [{ name: 'TemplateName', chance: 0.1 }]
            }
         */
        this.connections = {
            'HamletStreet': [
                { name: 'HamletStreet', chance: 1}
            ]
        }
    }

    GenerateRooms (startArea, endArea, endLocation) {
        let area = this.area
        return new Promise((resolve, reject) => {
            let x2 = this.endLocation.x
            let z2 = this.endLocation.z
            let location = { x: this.startLocation.x, y: this.startLocation.y, z: this.startLocation.z }
            let x1 = location.x
            let z1 = location.z
            while (location.x !== this.endLocation.x || location.y !== this.endLocation.y || location.z !== this.endLocation.z) {
                let room = templating.create('dirtroad')
                if (room) {
                    room.location = { x: location.x, y: location.y, z: location.z }
                    room.Area(area.uuid)
                    if (x2 > x1) {
                        location = { x: location.x + 1, y: location.y, z: location.z }
                    } else if (x2 < x1) {
                        location = { x: location.x - 1, y: location.y, z: location.z }
                    }
                    rooms.addRoom(room)
                }
                room = templating.create('dirtroad')
                if (room) {
                    room.location = { x: location.x, y: location.y, z: location.z }
                    room.Area(area.uuid)
                    if (z2 > z1) {
                        location = { x: location.x, y: location.y, z: location.z + 1 }
                    } else if (z2 < z1) {
                        location = { x: location.x, y: location.y, z: location.z - 1 }
                    }
                    rooms.addRoom(room)
                }
                x1 = location.x
                z1 = location.z
            }
            this.SetRoomExits()
            areas.addArea(area)
            resolve(area)
        })
    }
}

module.exports = RoadArea
