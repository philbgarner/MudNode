const Component = require('./component')

class Wanderer extends Component {
    constructor (params) {
        super(params)

        this.type = 'wanderer'
        this.props = { roomIds: [ ] }
    }

    Update () {
        this._update()
    }
}

module.exports = Wanderer
