class MobileTemplate {
    constructor(params) {
        this.id = params.id ? params.id : ''
        this.name = params.name ? params.name : ''
        this.shortDescription = params.shortDescription ? params.shortDescription : ''
        this.description = params.description ? params.description : ''
        this.race = params.race ? params.race : ''
        this.size = params.size ? params.size : ''
        this.age = params.age ? params.age : ''
        this.props = params.props ? params.props : {}
        this.components = params.components ? params.components : []
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
        json.shortDescription = this.shortDescription
        json.description = this.description
        json.race = this.race
        json.size = this.size
        json.age = this.age
        json.props = this.props
        json.components = this.components
        return json
    }
}

export default MobileTemplate
