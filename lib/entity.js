// import Component from './components/component.js'
// import components from './components/components.js'
// import rooms from './rooms.js'
import { v4 } from 'uuid'
import { rooms, Component } from './mudnode.js'

class Entity {
    constructor (params) {
        params = params ? params : {}
        this.name = params.name ? params.name : "Entity"
        this.description = params.description ? params.description : "default entity"
        this.type = params.type ? params.type : 'entity'
        this.uuid = params.uuid ? params.uuid : v4()
        this.areaid = params.areaid ? params.areaid : null
        this.location = params.location ? params.location : null
        this.props = params.props ? params.props : {}
        this.components = params.components ? params.components : []

        this.room = this.location !== null ? rooms.getRoom(this.location) : null
    }
    
    static fromJSON(json) {
        let entity = new Entity()
        for (let j in json) {
            entity[j] = json[j]
        }
        let cmp = []
        for (let c in json.components) {
            cmp.push(Component.fromJSON(json.components[c]))
        }
        this.components = cmp
        return entity
    }

    Room() {
        this.room = this.location !== null ? rooms.getRoom(this.location) : null
        return this.room
    }

    Describe (ws) {
        let initial = this.name.substring(0, 1).toLowerCase()        
        let article = ['a', 'e', 'i', 'o', 'u'].includes(initial) ? 'You see an ' : 'You see a '
        ws.send(article + this.name + '.')

        initial = this.description.substring(0, 1).toLowerCase()        
        article = ['a', 'e', 'i', 'o', 'u'].includes(initial) ? 'an' : 'a'
        ws.send(`It is ${article} ${this.description}.`)
    }

    HasAction(action) {
        if (this.actions.includes(action.toLowerCase())) {
            return true
        }
    }

    Action(action, params) {
        if (!this.HasAction(action)) {
            return false
        }

        if (typeof this[action] !== "function") {
            throw new Error(`Error in Entity.Action (${this.name}): Action '${action}' method not implemented.`)
        }

        return this[action](params)
    }

    look(params) {
        this.Describe(params.ws)
    }

    Update () {
        for (let c in this.components) {
            try {
                this.components[c].Update()
            }
            catch (err) {
                console.log(`Error trying to execute component Update() method:`, err)
            }
        }
    }

}

export default Entity
