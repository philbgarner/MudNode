import { Area, rooms, templating, MobileSpawner, areas } from '../../mudnode.js'

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

        /**
         * Example format for spawners:
         * [
         *      { name: 'MobileName', chance: 0.1, spawnerChance: 0.1 }
         * ]
         */
        this.spawners = params.spawners ? params.spawners : []

        this.area = params.area ? params.area : new Area()
    }

    Rooms() {
        return this.area.Rooms()
    }

    SetRoomExits() {
        // Iterate over the rooms we just generated and set the exits.
        let rs = this.Rooms()
        for (let r in rs) {
            let directions = ['North', 'East', 'South', 'West']
            let opposites = {
                'North': 'South',
                'South': 'North',
                'West': 'East',
                'East': 'West',
            }
        
            for (let d in directions) {
                let dirLoc
                if (directions[d].toLowerCase() === 'north') {
                    dirLoc = { x: rs[r].location.x, y: rs[r].location.y, z: rs[r].location.z - 1}
                } else if (directions[d].toLowerCase() === 'south') {
                    dirLoc = { x: rs[r].location.x, y: rs[r].location.y, z: rs[r].location.z + 1}
                } else if (directions[d].toLowerCase() === 'east') {
                    dirLoc = { x: rs[r].location.x + 1, y: rs[r].location.y, z: rs[r].location.z}
                } else if (directions[d].toLowerCase() === 'west') {
                    dirLoc = { x: rs[r].location.x - 1, y: rs[r].location.y, z: rs[r].location.z}
                }        
                let oppDir = opposites[directions[d]]
                let dirRoom = rooms.getRoomByLocation(dirLoc)
                if (dirRoom) {
                    dirRoom.SetExit(oppDir, rs[r].uuid)
                }
            }
        }
    }

    GenerateRooms (startTemplate, startLocation, depth) {
        let area = this.area
        return new Promise((resolve, reject) => {
            let room = templating.create(startTemplate)
            if (room) {
                room.location = { x: startLocation.x, y: startLocation.y, z: startLocation.z }
                room.Area(area.uuid)
                for (let s in this.spawners) {
                    let r = Math.random()
                    if (r >= this.spawners[s].chance) {
                        console.log('adding spawner to', JSON.stringify(room.location))
                        room.components.push(new MobileSpawner({ parent: room.uuid, mobile: this.spawners[s].name, chance: this.spawners[s].spawnerChance }))
                    }
                }

                rooms.addRoom(room)
                this.Generate(room, startTemplate, 'North', depth)
                this.Generate(room, startTemplate, 'South', depth)
                this.Generate(room, startTemplate, 'East', depth)
                this.Generate(room, startTemplate, 'West', depth)

                this.SetRoomExits()

                areas.addArea(area)
                resolve(area)
            }
            reject()
        })
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
            room.Area(this.area.uuid)
            rooms.addRoom(room)
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

export default  AreaTemplate
