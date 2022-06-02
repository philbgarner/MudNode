import { entities, Component, rand, templates, rooms } from '../mudnode.js'

class MobileSpawner extends Component {
    constructor (params) {
        params.props = params.props ? params.props : {}
        super(params)

        this.type = 'MobileSpawner'
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
        if (this.props.mobile && Math.floor(new Date().getTime() / 1000) > this.props.timeending)
        {
            if (rand(0, 1) > 1 - this.props.chance /*&& this.Room().Area().Mobiles().length < this.props.maxMobiles*/) {
                let tmp = templates.getMobileTemplate(this.props.mobile)
                if (tmp) {
                    let rm = rooms.getRoom(this.props.parent)
                    if (rm) {
                        let mb = tmp.GenerateMobile(rm)
                        if (mb) {
                            this.Room().SendMessage(`You notice a ${mb.name}.`)
                        } else {
                            console.loq(`Error: GenerateMobile() failed.`)
                        }
                    } else {
                        console.log(`Couldn't find room id ${this.props.parent}.`)
                    }
                } else {
                    console.log(`Couldn't spawn mob ${mb}: Template not found.`)
                }
            }
            this.props.timeending = this.props.delay ? Math.floor(new Date().getTime() / 1000) + this.props.delay : Math.floor(new Date().getTime() / 1000) + 60
        }
    }
}

export default  MobileSpawner
