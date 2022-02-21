const Component = require('./component')
const random = require('../random')
const entities = require('../entities')

class MobileSpawner extends Component {
    constructor (params) {
        super(params)

        this.type = 'mobilespawner'
        this.props = {
            mobile: params.mobile ? params.mobile : params.props.mobile ? params.props.mobile : null,
            chance: params.chance ? params.chance : 0.01,
            timestarted: Math.floor(new Date().getTime() / 1000),
            timeending: params.delay ? Math.floor(new Date().getTime() / 1000) + params.delay : Math.floor(new Date().getTime() / 1000) + 60,
            delay: params.delay ? params.delay : 60
        }        
    }

    Update () {
        this._update()
        console.log(this.props.mobile, Math.floor(new Date().getTime() / 1000) > this.props.timeending, Math.floor(new Date().getTime() / 1000), this.props.timeending)
        if (this.props.mobile && Math.floor(new Date().getTime() / 1000) > this.props.timeending)
        {
            console.log('spawning chance')
            if (random.rand(0, 1) > 1 - this.props.chance) {
               const mob = require(`../mobiles/${this.props.mobile}`)
               entities.addMobile(new mob({ location: this.Room().uuid }))
               console.log('Spawn Mob!', this.props.mobile, mob)
            }
            this.props.timeending = this.props.delay ? Math.floor(new Date().getTime() / 1000) + this.props.delay : Math.floor(new Date().getTime() / 1000) + 60
        }
    }
}

module.exports = MobileSpawner
