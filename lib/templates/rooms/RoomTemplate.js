const Room = require('../../room')
const randInt = require('../../random').randInt

class RoomTemplate extends Room {
    constructor(params) {
        super(params)

        this.template = params.template ? params.template : 'default'

        this.names = params.names ? params.names : ['Default room']
        this.descriptions = params.descriptions ? params.descriptions : ['default room description']
        this.randomComponents = params.components ? params.components : []
    }

    NextRoom() {
        this.name = this.NextName()
        this.description = this.NextDescription()
        //this.components = []

        let r = new Room({
            name: this.name,
            description: this.description,
            components: this.components
        })
        return r
    }    

    NextComponent() {
        return this.randomComponents[randInt(0, this.randomComponents.length - 1)]
    }

    NextName() {
        return this.names[randInt(0, this.names.length - 1)]
    }

    NextDescription() {
        return this.descriptions[randInt(0, this.descriptions.length - 1)]
    }
}

module.exports = RoomTemplate
