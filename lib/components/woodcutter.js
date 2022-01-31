const Component = require('./component')
const Entity = require('../entity')
const rooms = require('../rooms')

class Woodcutter extends Component {
    constructor (params) {
        super(params)
        this.parent = params.entity ? params.entity : {}
        this.type = 'woodcutter'
        this.occupied = false
        this.progress = 0
    }

    Cut (entity, timeout) {
        setTimeout(() => {
            this.progress += 0.2
            let room = rooms.getRoom(entity.location)
            room.SendMessage(`A ${this.parent.name} cuts the ${entity.name} some more.`)
            if (this.progress > 1) {
                this.progress = 0
                this.occupied = false
                room.SendMessage(`A ${this.parent.name} cuts the ${entity.name} all the way down.`)
                let e = 0
                // TODO: Limit number created, either random or by tree's size somehow.
                for (e = 0; e < 3; e++) {
                    room.entities.push(new Entity({ name: 'Logs', description: `${entity.name} Logs` }))
                }
                room.SendMessage(`${e} ${e === 1 ? 'log' : 'logs'} lie on the ground.`)
            } else {
                this.Cut(entity, timeout)
            }
        }, timeout)
    }

    Update () {
        this._update()

        if (this.occupied)
            return
console.log('woodcutter update', this.progress)
        let room = rooms.getRoom(this.parent.location)
        if (room !== null) {
            for (let e in room.entities) {
                let entity = room.entities[e]
                for (let c in entity.components) {
                    let component = entity.components[c]
                    if (component.type === 'wood') {
                        this.progress = 0
                        this.occupied = true
                        room.SendMessage(`A ${this.parent.name} begins cutting through the ${entity.name}.`)
                        this.Cut(entity, 5)
                        return
                    }
                }
            }
        }
    }
}

module.exports = Woodcutter