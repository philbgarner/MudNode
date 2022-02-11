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
            room.location = startLocation
            this.Generate(room, this.startRoomTemplate, 'North', 3)
            this.Generate(room, this.startRoomTemplate, 'East', 3)
            this.Generate(room, this.startRoomTemplate, 'South', 3)
            this.Generate(room, this.startRoomTemplate, 'West', 3)
        }
        return room
    }

    Generate (fromRoom, template, direction, depth) {
        
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
                        // TODO: This needs to either pick a random direction or do all directions
                        // and don't try to dig back in the direction we just came from.
                        if (depth <= 0) {
                            selected = this.Generate(room, con.name, direction, depth)
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
