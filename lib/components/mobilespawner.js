const Component = require('./component')
const random = require('../random')

class MobileSpawner extends Component {
    constructor (params) {
        super(params)

        this.type = 'mobilespawner'
        this.props = {
            mobile: params.mobile ? params.mobile : null,
            chance: params.chance ? params.chance : 0.01
        }        
    }

    Update () {
        this._update()

        if (this.props.mobile)
        {
            if (random.rand(0, 1) > 1 - this.props.chance) {
               console.log('Spawn Mob!', this.props.mobile)
            }
        }
    }
}

module.exports = MobileSpawner
