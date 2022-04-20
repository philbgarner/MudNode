import RoomTemplate from './roomtemplate.js'

let templateList = {}

const hasTemplate = (id) => {
    return templateList[id] ? true : false
}

const getTemplate = (id) => {
    return templateList[id]
}

const addTemplate = (template) => {
    if (getTemplate(template.id)) {
        return false
    }
    let rt = new RoomTemplate(template)
    templateList[template.id] = rt
    return rt
}

const removeTemplate = (templateId) => {
    if (!templateList[templateId]) {
        return false
    } else {
        templateList[templateId] = undefined
        delete templateList[templateId]
        return true
    }
}

const setTemplate = (template) => {
    let tm = getTemplate(template.id)
    if (tm) {
        tm.id = template.id
        tm.name = template.name
        tm.description = template.description
        tm.colour = template.colour
        tm.props = template.props
        tm.components = template.components
        tm.mobiles = template.mobiles
        tm.entities = template.entities
    } else {
        return false
    }
    return tm
}

const setTemplates = (templates) => {
    templateList = templates
}

const getTemplates = () => {
    return templateList
}

const loadRoomTemplates = (templateBuf) => {
    templateList = JSON.parse(templateBuf.toString())
}

export { hasTemplate, getTemplate, setTemplate, addTemplate, setTemplates, getTemplates, removeTemplate, loadRoomTemplates }