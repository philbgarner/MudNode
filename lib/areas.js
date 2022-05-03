import { Area } from './mudnode.js'
let areas = {}

function getAreas() {
    return areas
}
function getArea(uuid) {
    return areas[uuid] ? areas[uuid] : null
}
function addArea(area) {
    areas[area.uuid] = area
    return true
}
function removeArea(uuid) {
    // TODO: Iterate over any rooms that belong to this area and remove them also.
    areas[uuid] = undefined
}
function loadAreas(buffer) {
    let alist = JSON.parse(buffer.toString())
    areas = {}
    for (let a in alist) {
        alist[a] = Area.fromJSON(alist[a])
    }
}
export { getAreas, getArea, addArea, removeArea, loadAreas}
export default { getAreas: getAreas, getArea: getArea, addArea: addArea, removeArea: removeArea, loadAreas: loadAreas } 