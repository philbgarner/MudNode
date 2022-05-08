import { rooms, Room, grammar, components } from './mudnode.js'

class RoomTemplate {
    constructor(params) {
        this.id = params.id ? params.id : ''
        this.name = params.name ? params.name : ''
        this.description = params.description ? params.description : ''
        this.colour = params.colour ? params.colour : ''
        this.props = params.props ? params.props : {}
        this.components = params.components ? params.components : ''
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
        console.log(rooms.getRoom(room.uuid))
        room.name = grammar.process(this.name, { 'room': room.uuid }).sentence
        room.description = grammar.process(this.description, { 'room': room.uuid }).sentence
        room.entities = [] // TODO: process template text and then split results into array of initialized objects.
        room.components = []
        let cmp = grammar.process(this.components, { 'room': room.uuid }).sentence.split('|')
        for (let c in cmp) {
            room.components.push(components.Create(cmp[c], true, room.uuid))
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
