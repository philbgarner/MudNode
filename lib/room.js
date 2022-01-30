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

    static fromJSON(json) {
        let room = new Room()
        for (let j in json) {
            room[j] = json[j]
        }
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
