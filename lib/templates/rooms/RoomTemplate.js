import { Room, randInt } from '../../mudnode.js'

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

        let r = new Room({
            name: this.name,
            description: this.description
        })
        let comp = []
        for (let c in this.components) {
            this.components[c].parent = r.uuid
            comp.push(this.components[c])
        }
        r.components = comp
        return r
    }    

    NextComponent() {
        let c = this.randomComponents[randInt(0, this.randomComponents.length - 1)]
        return c
    }

    NextName() {
        return this.names[randInt(0, this.names.length - 1)]
    }

    NextDescription() {
        return this.descriptions[randInt(0, this.descriptions.length - 1)]
    }
}

export default RoomTemplate
