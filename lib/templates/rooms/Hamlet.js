const randInt = require('../../random').randInt
const RoomTemplate = require('./RoomTemplate')

class Hamlet extends RoomTemplate {
    constructor(params) {
        super(params)

        this.template = params.template ? params.template : 'default'

        this.names = params.names ? params.names : ['Dirt Path']
        this.descriptions = params.descriptions ? params.descriptions : ['the dusty dirt path.']
        this.randomComponents = params.components ? params.components : []

        this.components = []
    }
}

module.exports = Hamlet
