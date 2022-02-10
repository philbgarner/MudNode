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
        this.connections = params.connections ? params.connections : {}
        this.startRoomTemplate = params.startRoomTemplate ? params.startRoomTemplate : null
    }

    GenerateRooms () {
        if (this.startRoomTemplate) {
            this.Generate(undefined, this.startRoomTemplate, 'North')
        }
    }

    Generate (fromRoom, template, direction, depth) {
        let room = templating.dig(fromRoom, template, direction)
        if (room) {
            rooms.addRoom(room)
            // If the current room is in the connections list, roll a random float from 0 to 1 and
            // iterate the list ascending.  If it's higher than the chance in the array object, then
            // dig that template type in one of the cardinal directions.
            if (this.connections[template]) {
                let r = Math.random()
                for (let c in this.connections[template]) {
                    let con = this.connections[template][c]
                    if (r >= con.chance) {
                        depth--
                        // TODO: This needs to either pick a random direction or do all directions
                        // and don't try to dig back in the direction we just came from.
                        if (depth <= 0) {
                            this.Generate(room, con.name, direction, depth)
                        }
                        break;
                    }
                }
            }
        }
    }

}

module.exports = AreaTemplate
