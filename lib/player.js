import Entity from './entity'
import users from './users'
import Look from './commands/look'
import rooms from './rooms'

class Player extends Entity {
    constructor(params) {
        params = params ? params : {}
        super(params)

        this.uuid = params.uuid
    }

    static fromJSON(json) {
        let player = new Player()
        for (let j in json) {
            player[j] = json[j]
        }
        return player
    }

    /**
     * Sends a message to this user's socket connection.
     * @param {string} message 
     * @returns bool
     */
    SendMessage (message) {
        let ws = users.getUserWs(this.uuid)
        ws.send(message)
        return true
    }

    Move(exit) {
        let room = rooms.getRoom(this.location)
        if (room !== null) {
            room.SendMessage(`${this.name} leaves ${exit.direction.toLowerCase()}.`, this.uuid)
            let exitRoom = rooms.getRoom(exit.exitId)
            if (exitRoom !== null) {
                this.location = exitRoom.uuid
                this.SendMessage(`You move ${exit.direction.toLowerCase()}.`)
                let look = new Look('Look')
                let ws = users.getUserWs(this.uuid)
                if (look.Execute({ ws: ws, userId: this.uuid, command: 'look' })) {
                    exitRoom.SendMessage(`${this.name} arrives.`, this.uuid)
                }
                return true
            }
        }
        return false
    }
}

module.exports = Player
