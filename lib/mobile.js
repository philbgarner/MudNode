const Entity = require('./entity')

class Mobile extends Entity {
    constructor(params) {
        params = params ? params : {}
        super(params)

        this.actions = ['look']

        this.uuid = params.uuid
    }

    static fromJSON(json) {
        let mobile = new Mobile()
        for (let j in json) {
            mobile[j] = json[j]
        }
        return mobile
    }

    Move(exit) {
        let room = rooms.getRoom(this.location)
        if (room !== null) {
            room.SendMessage(`${this.name} leaves ${exit.direction.toLowerCase()}.`, this.uuid)
            let exitRoom = rooms.getRoom(exit.exitId)
            if (exitRoom !== null) {
                this.location = exitRoom.uuid
                exitRoom.SendMessage(`${this.name} arrives.`, this.uuid)
                return true
            }
        }
        return false
    }
}

module.exports = Mobile
