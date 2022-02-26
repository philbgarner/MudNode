import RoomTemplate from './RoomTemplate.js'

class DirtRoad extends RoomTemplate {
    constructor(params) {
        super(params)

        this.template = params.template ? params.template : 'default'

        this.names = params.names ? params.names : ['Dirt Road', 'Dusty Road']
        this.descriptions = params.descriptions ? params.descriptions : ['the dusty dirt road.', 'dirt road.']
        this.randomComponents = params.components ? params.components : []

        this.components = []
        
    }
}

export default  DirtRoad
