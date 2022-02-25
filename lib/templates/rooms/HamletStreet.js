import RoomTemplate from './RoomTemplate'

class HamletStreet extends RoomTemplate {
    constructor(params) {
        super(params)

        this.template = params.template ? params.template : 'default'

        this.names = params.names ? params.names : ['Dirt Path', 'Open Square', 'Village Dirt Street']
        this.descriptions = params.descriptions ? params.descriptions : ['the dusty dirt path.', 'open dirt square.', 'dirt street in a village flanked by buildings.']
        this.randomComponents = params.components ? params.components : []

        this.components = []
        
    }
}

module.exports = HamletStreet
