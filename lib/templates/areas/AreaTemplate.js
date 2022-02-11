const Area = require('../../area')
const rooms = require('../../rooms')
const templating = require('../templating')

class AreaTemplate {
    constructor(params) {
        this.template = params.template ? params.template : 'area template'

        /*
         *Example Format for connections:
         *
            {
                'TemplateName': [{ name: 'TemplateName', chance: 0.1 }]
            }
         */
        this.area = params.area ? params.area : new Area()
        this.connections = params.connections ? params.connections : {}
    }

    GenerateRooms (startTemplate, startLocation) {
        let room = templating.create(startTemplate)
        if (room) {
            room.location = { x: startLocation.x, y: startLocation.y, z: startLocation.z }
            this.Generate(room, this.startRoomTemplate, 'North', 3)
        }
        return room
    }

    Generate (fromRoom, template, direction, depth) {
        let location = { x: fromRoom.location.x + direction === 'East' ? 1 : direction === 'West' ? -1 : 0,
                         y: fromRoom.location.y + direction === 'Up' ? 1 : direction === 'Down' ? -1 : 0,
                         z: fromRoom.location.z + direction === 'South' ? 1 : direction === 'North' ? -1 : 0
                        }
        let existingRooms = rooms.getRoomByLocation(location)
        if (existingRooms === null) {
            return
        }

        let room = templating.dig(fromRoom, template, direction)
        if (room) {
            rooms.addRoom(room)
            room.Area(this.area.uuid)
            // If the current room is in the connections list, roll a random float from 0 to 1 and
            // iterate the list ascending.  If it's higher than the chance in the array object, then
            // dig that template type in one of the cardinal directions.
            if (this.connections[template]) {
                let r = Math.random()
                let selected = null
                for (let c in this.connections[template]) {
                    let con = this.connections[template][c]
                    if (r >= con.chance) {
                        depth--
                        if (depth <= 0) {
                            selected = this.Generate(room, con.name, 'North', depth)
                            selected = this.Generate(room, con.name, 'South', depth)
                            selected = this.Generate(room, con.name, 'East', depth)
                            selected = this.Generate(room, con.name, 'West', depth)
                        }
                        break;
                    }
                }
                if (selected === null) {
                    selected = this.connections[template][0].name
                }

            }
        }
    }

}

module.exports = AreaTemplate
