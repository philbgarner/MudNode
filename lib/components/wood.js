const Component = require('./component')

class Wood extends Component {
    constructor (params) {
        super(params)

        this.type = 'wood'
    }

    Update () {
        this._update()
    }
}

module.exports = Wood
