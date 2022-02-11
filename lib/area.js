const uuid = require('uuid')

class Area {
    constructor(params) {
        this.uuid = params.uuid ? params.uuid : uuid.v4()
        this.name = params.name ? params.name : 'area'
        this.template = params.template ? params.template : null
    }

    static fromJSON(json) {
        let area = new Area()
        for (let j in json) {
            area[j] = json[j]
        }
        return area
    }

    toJSON() {
        let json = {}
        json.uuid = this.uuid
        json.name = this.name
        json.template = this.template
        return json
    }

}

module.exports = Area