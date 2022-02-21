const Area = require('../../area')
const AreaTemplate = require('./AreaTemplate')

class FixedForestArea extends AreaTemplate {
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
        this.connections = params.connections ? params.connections : {
            'MixedForest': [
                { name: 'MixedForest', chance: 0.6},
                { name: 'ForestClearing', chance: 0.3},
                { name: 'EvergreenForest', chance: 0.1}
            ],
            'ForestClearing': [
                { name: 'ForestClearing', chance: 0.6},
                { name: 'MixedForest', chance: 0.3},
                { name: 'EvergreenForest', chance: 0.1}
            ],
            'EvergreenForest': [
                { name: 'EvergreenForest', chance: 0.6},
                { name: 'MixedForest', chance: 0.3},
                { name: 'ForestClearing', chance: 0.1}
            ]
        }
    }
}

module.exports = FixedForestArea