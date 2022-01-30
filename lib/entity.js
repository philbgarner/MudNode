class Entity {
    constructor (params) {
        params = params ? params : {}
        this.name = params.name ? params.name : "Entity"
        this.description = params.description ? params.description : "Default entity."
        this.uuid = params.uuid

        this.actions = ['look']

    }
    
    static fromJSON(json) {
        let entity = new Entity()
        for (let j in json) {
            entity[j] = json[j]
        }
        return entity
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
}

module.exports = Entity
