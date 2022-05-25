import { rooms, Room, grammar, components } from './mudnode.js'

class RoomTemplate {
    constructor(params) {
        this.id = params.id ? params.id : ''
        this.name = params.name ? params.name : ''
        this.description = params.description ? params.description : ''
        this.colour = params.colour ? params.colour : ''
        this.props = params.props ? params.props : {}
        this.components = params.components ? params.components : []
        this.mobiles = params.mobiles ? params.mobiles : ''
        this.entities = params.entities ? params.entities : ''
        this.location = params.location ? params.location : null
    }

    static fromJSON(json) {
        let template = new Template()
        for (let j in json) {
            template[j] = json[j]
        }
        return template
    }

    GenerateRoom() {
        // Generate props first because core properties might depend on their values.
        let propkeys = Object.keys(this.props)
        let props = {}
        for (let key in propkeys) {
            props[propkeys[key]] = grammar.process(this.props[propkeys[key]]).sentence
        }
        
        let room = new Room({ location: this.location })
        room.props = props
        rooms.addRoom(room)
        room.name = grammar.process(this.name, { 'room': room.uuid }).sentence
        room.description = grammar.process(this.description, { 'room': room.uuid }).sentence
        room.entities = [] // TODO: process template text and then split results into array of initialized objects.
        room.components = []
        let cmp = this.components
        for (let c in cmp) {
            let component = components.Create(cmp[c].type, cmp[c].enabled, room.uuid)
            for (let p in cmp[c].props) {
                if (typeof cmp[c].props[p] === 'string' && cmp[c].props[p].includes('[')) {
                    component.props[p] = grammar.process(cmp[c].props[p], { 'room': room.uuid }).sentence
                    console.log(cmp[c].props[p], component.props[p])
                } else {
                    component.props[p] = cmp[c].props[p]
                }
            }
            room.components.push(component)
        }

        room.colour = this.colour
        // TODO: Handle exits.
        return room
    }

    toJSON() {
        let json = {}
        json.id = this.id
        json.name = this.name
        json.description = this.description
        json.colour = this.colour
        json.props = this.props
        json.mobiles = this.mobiles
        json.entities = this.entities
        json.components = this.components
        return json
    }
}

export default RoomTemplate
