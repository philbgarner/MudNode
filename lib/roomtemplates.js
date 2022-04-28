let templatelist = {}

const getRoomTemplate = (id) => {
    return templatelist[id] ? templatelist[id] : null
}

const getRoomTemplates = () => {
    let rt = []
    let keys = Object.keys(templatelist)
    for (let k in keys) {
        rt.push(keys[k])
    }
    return rt
}

const loadRoomTemplates = (buffer) => {
    let rlist = JSON.parse(buffer.toString())
    templatelist = {}
    for (let r in rlist) {
        templatelist[r] = Room.fromJSON(rlist[r])
    }
}

export { getRoomTemplate, getRoomTemplates, loadRoomTemplates }
export default {
    getRoomTemplate: getRoomTemplate,
    getRoomTemplates: getRoomTemplates,
    loadRoomTemplates: loadRoomTemplates
}