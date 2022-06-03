import { grammar, rooms, entities, Mobile, components } from "./mudnode.js"

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

        let comps = []
        for (let c in this.components) {
            let component = components.Create(this.components[c].type, this.components[c].enabled, room.uuid)
            for (let p in this.components[c].props) {
                if (typeof this.components[c].props[p] === 'string' && this.components[c].props[p].includes('[')) {
                    component.props[p] = grammar.process(this.components[c].props[p], { 'room': room.uuid }).sentence
                } else {
                    component.props[p] = this.components[c].props[p]
                }
            }
            comps.push(component)
        }

        let mob = new Mobile({
            location: rm.location,
            props: props,
            id: this.id,
            name: grammar.process(this.name).sentence,
            shortDescription: grammar.process(this.shortDescription).sentence,
            description: grammar.process(this.description).sentence,
            race: grammar.process(this.race).sentence,
            name: grammar.process(this.name).sentence,
            size: grammar.process(this.size).sentence,
            age: grammar.process(this.age).sentence,
            components: comps
        })
        entities.addMobile(mob)
        
        return mob
    }
}

export default MobileTemplate
