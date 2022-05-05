import Component from './component.js'

class Mortal extends Component {
    constructor (params) {
        params = params ? params : {}
        super(params)

        this.type = 'mortal'
        this.props = {
            hp: params.hp ? params.hp : 1,
            maxhp: params.hp ? params.hp : 1,
            hunger: params.hunger ? params.hunger : 1,
            maxhunger: params.hunger ? params.hunber : 1,
            stamina: params.stamina ? params.stamina : 1,
            maxstamina: params.stamina ? params.stamina : 1
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

export default  Mortal
