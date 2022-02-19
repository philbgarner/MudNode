const Component = require('./component')

class Delayed extends Component {
    constructor (params) {
        super(params)

        this.onEndEvent = params.OnEnd ? params.OnEnd : this.OnEnd

        this.type = 'delayed'
        this.props = {
            repeat: params.Repeat ? params.Repeat : true,
            delay: params.delay ? params.delay : 60,
            timestarted: Math.floor(new Date().getTime() / 1000),
            timeending: params.delay ? Math.floor(new Date().getTime() / 1000) + params.delay : Math.floor(new Date().getTime() / 1000) + 60
        }
    }

    OnEnd() {
        if (this.enabled) {
            setInterval(() => {this.onEndEvent(this.Room())}, 10)
        }
    }

    Update () {
        if (!this.enabled) {
            return
        }
        this._update()
        if (Math.floor(new Date().getTime() / 1000) > this.props.timeending) {
            if (this.props.repeat) {
                this.props.timestarted = Math.floor(new Date().getTime() / 1000)
                this.props.timeending = Math.floor(new Date().getTime() / 1000) + this.props.delay
            } else {
                this.enabled = false
            }
            this.OnEnd()
        }
    }
}

module.exports = Delayed
