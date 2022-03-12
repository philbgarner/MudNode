import { AreaTemplate, Area } from '../../mudnode.js'

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
        this.connections = {}
    }
}

export default  HamletArea
