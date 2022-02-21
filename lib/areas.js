let areas = {}

module.exports.areas = function () {
    return areas
}
module.exports.getArea = function(uuid) {
    return areas[uuid] ? areas[uuid] : null
}
module.exports.addArea = function (area) {
    areas[area.uuid] = area
    return true
}
module.exports.removeArea = function (uuid) {
    // TODO: Iterate over any rooms that belong to this area and remove them also.
    areas[uuid] = undefined
}
module.exports.loadAreas = function (buffer) {
    const Area = require('./area')
    let alist = JSON.parse(buffer.toString())
    areas = {}
    for (let a in alist) {
        alist[a] = Area.fromJSON(alist[a])
    }
}