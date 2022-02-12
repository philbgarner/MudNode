const RoomTemplate = require('./RoomTemplate')

class ForestClearing extends RoomTemplate {
    constructor(params) {
        super(params)

        this.template = params.template ? params.template : 'default'

        this.names = params.names ? params.names : ['Forest Clearing', 'Forest Meadow']
        this.descriptions = params.descriptions ? params.descriptions : ['the forest opens up into an open area']
        this.randomComponents = params.components ? params.components : []

        this.components = []
    }
}

module.exports = ForestClearing
