const Component = require('./component')

class Wood extends Component {
    constructor (params) {
        super(params)

        this.type = 'tree'
    }

    Update () {
        this._update()
    }
}

module.exports = Wood
