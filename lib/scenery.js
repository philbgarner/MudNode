const Entity = require('./entity')

class Scenery extends Entity {
    constructor (params) {
        params = params ? params : {}
        this.name = params.name ? params.name : "Scene Prop"
        this.description = params.description ? params.description : "Default scenery."
        this.uuid = params.uuid

        this.location = params.location ? params.location : null
    }

}

module.exports = Scenery
