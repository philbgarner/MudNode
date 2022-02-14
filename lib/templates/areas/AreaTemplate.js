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

    GenerateRooms (startTemplate, startLocation, depth) {
        let room = templating.create(startTemplate)
        if (room) {
            rooms.addRoom(room)
            room.location = { x: startLocation.x, y: startLocation.y, z: startLocation.z }
            this.Generate(room, startTemplate, 'North', depth)
        }
    }

    Generate (fromRoom, template, direction, depth) {
        let location = { x: fromRoom.location.x,
                         y: fromRoom.location.y,
                         z: fromRoom.location.z,
                        }
        if (direction === 'North') {
            location.z--
        }
        else if (direction === 'South') {
            location.z++
        }
        else if (direction === 'East') {
            location.x++
        }
        else if (direction === 'West') {
            location.x--
        }

        let room = templating.dig(fromRoom, template, direction)
        if (room) {
            rooms.addRoom(room)
            room.Area(this.area.uuid)
            if (this.connections[template]) {
                let r = Math.random()
                let selected = null
                let directions = ['North', 'East', 'West', 'South']
                for (let d in directions) {
                    for (let c in this.connections[template]) {
                        let con = this.connections[template][c]
                        if (r >= con.chance) {
                            selected = con.name
                            break;
                        }
                    }
                    if (selected === null) {
                        selected = this.connections[template][0].name
                    }
                    if (depth > 0) {
                        this.Generate(room, selected, directions[d], depth - 1)
                    }
                }
            }
        }
    }

}

module.exports = AreaTemplate
