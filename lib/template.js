class Template {
    constructor(params) {
        this.id = params.id ? params.id : ''
        this.name = params.name ? params.name : ''
        this.description = params.description ? params.description : ''
        this.colour = params.colour ? params.colour : ''
        this.props = params.props ? params.props : {}
        this.components = params.components ? params.components : ''
        this.mobiles = params.mobiles ? params.mobiles : ''
        this.entities = params.entities ? params.entities : ''
    }

    static fromJSON(json) {
        let template = new Template()
        for (let j in json) {
            template[j] = json[j]
        }
        return template
    }
}

export default Template
