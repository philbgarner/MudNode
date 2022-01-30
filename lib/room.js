const Entity = require('./entity')
const entities = require('./entities')

class Room extends Entity {
    constructor (params) {
        params = params ? params : {}
        super(params)
        this.name = params.name ? params.name : ''
        this.description = params.description ? params.description : 'No description.'
        
        this.location = params.location ? params.location : {x: 0, y: 0, z: 0}

        this.uuid = params.uuid

        this.entities = []
        
        this.exits = {}
    }

    Describe (ws) {
        ws.send(`${this.name}, ${this.description}`)
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
    }

    AddEntity(entity) {
        this.entities.push(entity)
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
        this.exits[direction] = destId
    }
}

module.exports = Room
