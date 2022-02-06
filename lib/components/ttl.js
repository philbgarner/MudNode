const Component = require('./component')

class Ttl extends Component {
    constructor (params) {
        super(params)

        this.type = 'ttl'
        this.props = {
            timestarted: Math.floor(new Date().getTime() / 1000),
            timeending: Math.floor(new Date().getTime() / 1000) + params.delay ? params.delay : 1
        }        
    }

    Update () {
        this._update()

        if (Math.floor(new Date().getTime() / 1000) > this.props.timeending) {
            // TODO remove entity from room.
        }
    }
}

module.exports.Ttl = Ttl
