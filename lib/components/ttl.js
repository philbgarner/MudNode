const Component = require('./component')

class Ttl extends Component {
    constructor (params) {
        super(params)

        this.onEndEvent = params.OnEnd ? params.OnEnd : this.OnEnd

        this.type = 'ttl'
        this.props = {
            timestarted: Math.floor(new Date().getTime() / 1000),
            timeending: Math.floor(new Date().getTime() / 1000) + params.delay ? params.delay : 1
        }
    }

    /**
     * Overload this function with whatever you want to happen when the ttl expires.
     */
    OnEnd() {
        
    }

    Update () {
        this._update()

        if (Math.floor(new Date().getTime() / 1000) > this.props.timeending) {
            this.OnEnd()
        }
    }
}

module.exports.Ttl = Ttl
