import random from '../random.js'
import Component from './component.js'

class Wanderer extends Component {
    constructor (params) {
        super(params)

        this.type = 'Wanderer'
        this.props = {

        }
    }

    DelayMove(exit) {
        setTimeout(() => {
            let ent = this.Entity()
            if (ent) {
                ent.Move(exit)
                this.occupied = false
            }
        }, 15000)
    }

    Update() {
        this._update()
        let ent = this.Entity()
        if (ent) {
            let room = ent.Room()
            if (room) {
                if (ent.Move && !this.occupied) {
                    this.occupied = true
                    let exits = Object.keys(room.exits)
                    let index = random.randInt(0, exits.length - 1)
                    let dir = exits[index]
                    let exit = room.exits[dir]
                    if (room.areaid === ent.areaid) {
                        this.DelayMove({direction: dir, exitId: exit})
                    }
                }
            }
        }
    }
}

export default  Wanderer
