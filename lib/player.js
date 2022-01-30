const Entity = require('./entity')
const Users = require('./users')

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

    SendMessage (message) {
        let ws = Users.getUserWs(this.uuid)
        ws.send(message)
        return true
    }

    Move(exit) {
        let exitRoom = require('./rooms').getRoom(exit.exitId)
        if (exitRoom !== null) {
            this.location = exitRoom.uuid
            this.SendMessage(`You move ${exit.direction.toLowerCase()}.`)
            return true
        }
        return false
    }
}

module.exports = Player
