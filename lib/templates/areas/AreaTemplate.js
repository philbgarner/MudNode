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
            rooms.addRoom(room)
            room.location = { x: startLocation.x, y: startLocation.y, z: startLocation.z }
            this.Generate(room, startTemplate, 'North', 3)
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

        // If we already have a room at that location then set the exit in that room back to where we came from.
        let existingRooms = rooms.getRoomByLocation(location)
        if (existingRooms !== null) {
            let opposites = {
                'North': 'South',
                'South': 'North',
                'West': 'East',
                'East': 'West',
            }
            let oppDir = opposites[direction]
            fromRoom.SetExit(oppDir, existingRooms.uuid)
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
