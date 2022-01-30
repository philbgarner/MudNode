const Entity = require('./entity')

class Mobile extends Entity {
    constructor (params) {
        params = params ? params : {}
        this.name = params.name ? params.name : "Mobile"
        this.description = params.description ? params.description : "Default mobile."
        this.uuid = params.uuid

        this.location = params.location ? params.location : null
    }

    hasAction(action) {
        if (this.actions.includes(action)) {
            return true
        }
    }

    Action(action, params) {
        if (!this.hasAction(action)) {
            return false
        }

        if (typeof this[Action] !== "function") {
            throw new Error(`Error in Entity.Action (${this.name}): Action '${action}' method not implemented.`)
        }

        return this[Action](params)
    }

}

module.exports = Mobile
