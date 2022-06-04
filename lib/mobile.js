import { Entity, Component } from './mudnode.js'

class Mobile extends Entity {
    constructor(params) {
        params = params ? params : {}
        super(params)

        this.type = 'mobile'
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
        mobile.components = mob
        return mobile
    }

    toJSON() {
        let json = {}
        json.uuid = this.uuid
        json.parent = this.parent
        json.location = this.location
        json.name = this.name
        json.description = this.description
        let cmp = []
        for (let c in this.components) {
            cmp.push(this.components[c].toJSON())
        }
        json.components = cmp
        return json
    }
    
    Move(exit) {
        let room = this.Room()
        if (room !== null) {
            room.SendMessage(`${this.name} leaves ${exit.direction.toLowerCase()}.`, this.uuid)
            let exitRoom = rooms.getRoom(exit.exitId)
            if (exitRoom !== null) {
                this.location = exitRoom.uuid
                this.room = rooms.getRoom(this.location)
                exitRoom.SendMessage(`${this.name} arrives.`, this.uuid)
                return true
            }
        }
        return false
    }
}

export default Mobile
