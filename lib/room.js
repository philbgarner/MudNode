import Entity from './entity.js'
import entities from './entities.js'
import uuid from 'uuid'
import areas from './areas.js'
import rooms from './rooms.js'
import components from './components/components.js'

class Room extends Entity {
    constructor (params) {
        params = params ? params : {}
        super(params)
        this.name = params.name ? params.name : ''
        this.description = params.description ? params.description : 'No description.'
        
        this.location = params.location ? params.location : {x: 0, y: 0, z: 0}

        this.entities = []
        
        this.exits = {}

        this.uuid = params.uuid ? params.uuid : uuid.v4()

        this.Area(params.areaid ? params.areaid : null)

        this.components = params.components ? params.components : this.components
    }

    Area(areaid) {
        if (areaid) {
            this.areaid = areaid
        }
        if (!this.area) {
            this.area = this.areaid ? areas.getArea(this.areaid) : null
        }
        return this.area
    }

    Describe(ws) {
        ws.send(`${this.name}, ${this.description}`)
        
        let componentDescriptions = ''
        for (let c in this.components) {
            componentDescriptions += this.components[c].Description ? this.components[c].Description() : '' + ' '
        }
        ws.send(componentDescriptions)

        let exits = ''
        for (let e in this.exits) {
            exits += e + ', '
        }
        if (this.entities.length > 0) {
            let entities = 'There is '
            for (let e = 0; e < this.entities.length; e++) {
                let sep = ','
                if (e === this.entities.length - 2) {
                    sep = ' and'
                }
                entities += ['a', 'e', 'i', 'o', 'u'].includes(this.entities[e].name.substring(0, 1).toLowerCase()) ? 'an ' + this.entities[e].name + sep + ' ': 'a ' + this.entities[e].name + sep + ' '
            }
            ws.send(entities.substring(0, entities.length - 2) + '.')
        }
        ws.send(`Exits: ${exits.substring(0, exits.length - 2)}`)

        let mobiles = entities.getMobilesByLocation(this.uuid)
        for (let m in mobiles) {
            let name = ['a', 'e', 'i', 'o', 'u'].includes(mobiles[m].name.toLowerCase().substring(0, 1)) ? 'an ' + mobiles[m].name.toLowerCase() : 'a ' + mobiles[m].name.toLowerCase()
            ws.send(`There is ${name} here.`)
        }
    }

    AddEntity(entity) {
        this.entities.push(entity)
    }
    GetEntity(name) {
        let ent = this.entities.filter(f => f.name.toLowerCase().includes(name.toLowerCase()))
        return ent.length > 0 ? ent[0] : null
    }
    GetEntityByUuid(uuid) {
        let ent = this.entities.filter(f => f.uuid === uuid)
        return ent.length > 0 ? ent[0] : null
    }
    RemoveEntity(uuid) {
        this.entities = this.entities.filter(f => f.uuid !== uuid)
    }
    RemoveEntityByName(name) {
        this.entities = this.entities.filter(f => !f.name.toLowerCase().includes(name.toLowerCase()))
    }

    static fromJSON(json) {
        let room = new Room()
        for (let j in json) {
            room[j] = json[j]
        }
        let ent = []
        for (let e in room.entities) {
            ent.push(Entity.fromJSON(room.entities[e]))
        }
        room.entities = ent
        let cmp = []
        for (let c in room.components) {
            try {
                const comp = components[room.components[c].type]
                if (comp) {    
                    cmp.push(new comp(room.components[c]))
                } else {
                    console.log('Room fromJSON(): AddComponent Error: Could not load', room.components[c].type)
                }
            }
            catch {}
        }
        room.components = cmp
        return room
    }

    /**
     * Sends message to every player in the current room, except any uuid's matching the one passed in excludeUuid. If not passed, all players in that room are messaged.
     * @param {string} message
     * @param {bool|undefined} excludeUuid
     */
    SendMessage (message, excludeUuid) {
        let players = entities.getPlayersByLocation(this.uuid)
        for (let p in players) {
            if ((excludeUuid && p !== excludeUuid) || excludeUuid === undefined) {
                players[p].SendMessage(message)
            }
        }
    }

    HasExit(direction) {
        for (let dir in this.exits) {
            if (dir.toLowerCase().includes(direction.toLowerCase())) {
                return true
            }
        }
        return false
    }
    
    GetExit(direction) {
        for (let dir in this.exits) {
            if (dir.toLowerCase().includes(direction.toLowerCase())) {
                return { direction: dir, exitId: this.exits[dir] }
            }
        }
        return null
    }

    SetExit(direction, destId) {
        // TODO: Have some kind of direction embargo system
        // so we can prevent the procedural generation in
        // templating from tunnelling through walls when it shouldn't.

        let opposites = {
            'North': 'South',
            'South': 'North',
            'West': 'East',
            'East': 'West',
        }
    
        let oppExit = rooms.getRoom(destId)
        if (oppExit) {
            this.exits[direction] = destId
            if (oppExit.exits[opposites[direction]]) {
                return
            }
            oppExit.SetExit(opposites[direction], this.uuid)
        }
    }
}

export default  Room
