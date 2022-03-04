import { entities, Component } from '../mudnode.js'

class MobileSpawner extends Component {
    constructor (params) {
        params.props = params.props ? params.props : {}
        super(params)

        this.type = 'mobilespawner'
        this.props = {
            mobile: params.mobile ? params.mobile : params.props.mobile ? params.props.mobile : null,
            chance: params.chance ? params.chance : 0.01,
            timestarted: Math.floor(new Date().getTime() / 1000),
            timeending: params.delay ? Math.floor(new Date().getTime() / 1000) + params.delay : Math.floor(new Date().getTime() / 1000) + 60,
            delay: params.delay ? params.delay : 60,
            parent: params.parent ? params.parent : params.props.parent ? params.props.parent : null,
            maxMobiles: params.maxMobiles ? params.maxMobiles : params.props.maxMobiles ? params.props.maxMobiles : 10
        }
    }

    Update () {
        this._update()
        console.log(this.props.mobile, Math.floor(new Date().getTime() / 1000) > this.props.timeending, Math.floor(new Date().getTime() / 1000), this.props.timeending)
        if (this.props.mobile && Math.floor(new Date().getTime() / 1000) > this.props.timeending)
        {
            if (random.rand(0, 1) > 1 - this.props.chance && this.Room().Area().Mobiles().length < this.props.maxMobiles) {
               const mob = mobiles[this.props.mobile]
               let mobile = new mob({ location: this.Room().uuid, areaid: this.Room().areaid })
               entities.addMobile(mobile)
               console.log('Spawn Mob!', this.props.mobile, mob)
               this.Room().SendMessage(`You notice a ${mobile.name}.`)
            }
            this.props.timeending = this.props.delay ? Math.floor(new Date().getTime() / 1000) + this.props.delay : Math.floor(new Date().getTime() / 1000) + 60
        }
    }
}

export default  MobileSpawner
