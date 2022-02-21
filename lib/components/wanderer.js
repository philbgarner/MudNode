const Component = require('./component')

class Wanderer extends Component {
    constructor (params) {
        super(params)

        this.type = 'wanderer'
        this.props = {

        }
    }

    DelayMove (exit) {
        setTimeout(() => {
            let ent = this.Entity()
            if (ent) {
                ent.Move(exit)
                this.occupied = false
            }
        }, 15000)
    }

    Update () {
        this._update()
        let ent = this.Entity()
        if (ent) {
            let room = ent.Room()
            if (room) {
                for (let x in room.exits) {
                    let exit = room.exits[x]
                    if (ent.Move && !this.occupied) {
                        this.occupied = true
                        this.DelayMove({direction: x, exitId: exit})
                    }
                }
            }
        }
    }
}

module.exports = Wanderer
