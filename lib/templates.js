import RoomTemplate from './roomtemplate.js'
import MobileTemplate from './mobiletemplate.js'

let templateList = {}
let mobileList = {}

/**
 * Mobile Template Functions
 */

function hasMobileTemplate(id) {
    return mobileList[id] ? true : false
}

function getMobileTemplate(id) {
    return mobileList[id]
}

function addMobileTemplate(template) {
    if (hasMobileTemplate(template.id)) {
        return false
    }
    let rt = new MobileTemplate(template)
    mobileList[template.id] = rt
    return rt
}

function removeMobileTemplate(templateId) {
    if (!mobileList[templateId]) {
        return false
    } else {
        mobileList[templateId] = undefined
        delete mobileList[templateId]
        return true

    }
}

function setMobileTemplate(template) {
    let tm = getMobileTemplate(template.id)
    if (tm) {
        tm.id = template.id
        tm.name = template.name
        tm.description = template.description
        tm.colour = template.colour
        tm.props = template.props
        tm.components = template.components
        tm.mobiles = template.mobiles
        tm.entities = template.entities
        tm.location = template.location
    } else {
        return false
    }
    return tm
}

function setMobileTemplates(templates) {
    mobileList = templates
}

function getMobileTemplates() {
    return mobileList
}

function loadMobileTemplates(templateBuf) {
    let list = JSON.parse(templateBuf.toString())
    for (let l in list) {
        mobileList[l] = new MobileTemplate(list[l])
    }
}

export { hasMobileTemplate, getMobileTemplate, setMobileTemplate, addMobileTemplate, setMobileTemplates, getMobileTemplates, removeMobileTemplate, loadMobileTemplates }

/**
 * Room Template Functions
 */

function hasRoomTemplate(id) {
    return templateList[id] ? true : false
}

function getRoomTemplate(id) {
    return templateList[id]
}

function addRoomTemplate(template) {
    if (hasRoomTemplate(template.id)) {
        return false
    }
    let rt = new RoomTemplate(template)
    templateList[template.id] = rt
    return rt
}

function removeRoomTemplate(templateId) {
    if (!templateList[templateId]) {
        return false
    } else {
        templateList[templateId] = undefined
        delete templateList[templateId]
        return true
    }
}

function setRoomTemplate(template) {
    let tm = getRoomTemplate(template.id)
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

function setRoomTemplates(templates) {
    templateList = templates
}

function getRoomTemplates() {
    return templateList
}

function loadRoomTemplates(templateBuf) {
    templateList = JSON.parse(templateBuf.toString())
}

export { hasRoomTemplate, getRoomTemplate, setRoomTemplate, addRoomTemplate, setRoomTemplates, getRoomTemplates, removeRoomTemplate, loadRoomTemplates }