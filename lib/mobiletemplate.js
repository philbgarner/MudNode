import { grammar, rooms, entities, Mobile } from "./mudnode"

class MobileTemplate {
    constructor(params) {
        this.id = params.id ? params.id : ''
        this.name = params.name ? params.name : ''
        this.shortDescription = params.shortDescription ? params.shortDescription : ''
        this.description = params.description ? params.description : ''
        this.race = params.race ? params.race : ''
        this.size = params.size ? params.size : ''
        this.age = params.age ? params.age : ''
        this.props = params.props ? params.props : {}
        this.components = params.components ? params.components : []
    }

    static fromJSON(json) {
        let template = new Template()
        for (let j in json) {
            template[j] = json[j]
        }
        return template
    }

    toJSON() {
        let json = {}
        json.id = this.id
        json.name = this.name
        json.shortDescription = this.shortDescription
        json.description = this.description
        json.race = this.race
        json.size = this.size
        json.age = this.age
        json.props = this.props
        json.components = this.components
        return json
    }

    GenerateMobile(room) {
        if (!room) {
            return false
        }
        let rm = rooms.getRoom(room.uuid)
        if (!rm) {
            return false
        }

        // Generate props first because core properties might depend on their values.
        let propkeys = Object.keys(this.props)
        let props = {}
        for (let key in propkeys) {
            props[propkeys[key]] = grammar.process(this.props[propkeys[key]]).sentence
        }

        let mob = new Mobile({ location: rm.location })
        entities.addMobile(mob)
        
        return mob
    }
}

export default MobileTemplate
