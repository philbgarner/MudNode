class MobileTemplate {
    constructor(params) {
        this.id = params.id ? params.id : ''
        this.name = params.name ? params.name : ''
        this.short_description = params.short_description ? params.short_description : ''
        this.description = params.description ? params.description : ''
        this.race = params.race ? params.race : ''
        this.size = params.size ? params.size : ''
        this.age = params.age ? params.age : ''
        this.props = params.props ? params.props : {}
        this.components = params.components ? params.components : ''
        this.location = params.location ? params.location : null
    }

    static fromJSON(json) {
        let template = new Template()
        for (let j in json) {
            template[j] = json[j]
        }
        return template
    }

    toJSON() {
        let json = {}
        json.id = this.id
        json.name = this.name
        json.description = this.description
        json.props = this.props
        json.components = this.components
        return json
    }
}

export default MobileTemplate
