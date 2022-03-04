import { Area } from './mudnode.js'
let areas = {}

const getAreas = () => {
    return areas
}
const getArea = (uuid) => {
    return areas[uuid] ? areas[uuid] : null
}
const addArea = (area) => {
    //console.trace('addArea()', area.uuid)
    areas[area.uuid] = area
    console.log(areas)
    return true
}
const removeArea = (uuid) => {
    // TODO: Iterate over any rooms that belong to this area and remove them also.
    areas[uuid] = undefined
}
const loadAreas = (buffer) => {
    let alist = JSON.parse(buffer.toString())
    areas = {}
    for (let a in alist) {
        alist[a] = Area.fromJSON(alist[a])
    }
}
export { getAreas, getArea, addArea, removeArea, loadAreas}
export default { getAreas: getAreas, getArea: getArea, addArea: addArea, removeArea: removeArea, loadAreas: loadAreas } 