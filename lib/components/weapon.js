import Component from './component.js'

class Weapon extends Component {
    constructor (params) {
        super(params)

        this.type = 'Weapon'
        this.props = {
            name: 'Sword',
            atk: 10
        }       
    }

    Update () {
        this._update()

        if (this.props.hp <= 0)
        {
            if (this.Room() !== null && this.entity !== null) {
                let article = ['a', 'e', 'i', 'o', 'u'].includes(this.entity.name.substring(0, 1).toLowerCase()) ? 'an' : 'a'
                this.Room().SendMessage(`${article} ${this.entity.name} has died.`)
                // TODO: Delete mobile from list and add a corpse entity.
            }
        }
    }
}

export default  Weapon
