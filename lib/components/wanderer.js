const Component = require('./component')

class Wanderer extends Component {
    constructor (params) {
        super(params)

        this.type = 'wanderer'
        this.props = { roomIds: [ ] }
    }

    DelayMove (exit) {
        setTimeout(() => {
            this.entity.Move(exit)
            this.occupied = false
        }, 15000)
    }

    Update () {
        this._update()
        if (this.Room() !== null) {
            for (let x in this.Room().exits) {
                let exit = this.Room().exits[x]
                if (this.entity.Move && !this.occupied) {
                    this.occupied = true
                    this.DelayMove({direction: x, exitId: exit})
                }
            }
        }
    }
}

module.exports = Wanderer
