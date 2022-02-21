const Area = require('../../area')
const AreaTemplate = require('./AreaTemplate')

class HamletArea extends AreaTemplate {
    constructor(params) {
        super(params)
        this.template = params.template ? params.template : 'area template'

        /*
         *Example Format for connections:
         *
            {
                'TemplateName': [{ name: 'TemplateName', chance: 0.1 }]
            }
         */
        this.area = params.area ? params.area : new Area()
        this.connections = {}
    }
}

module.exports = HamletArea
