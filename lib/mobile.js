const Entity = require('./entity')
const Component = require('./components/component')

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
        let mob = []
        for (let c in mobile.components) {
            mob.push(Component.fromJSON(mobile.components[c]))
        }
        this.components = mob
        return mobile
    }
    
    Move(exit) {
        let room = this.room
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
