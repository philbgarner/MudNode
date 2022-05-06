import Delayed from './components/delayed.js'
import Forest from './components/forest.js'
import MobileSpawner from './components/mobilespawner.js'
import Mortal from './components/mortal.js'
import Wanderer from './components/wanderer.js'
import Weapon from './components/weapon.js'

function getComponentList(className) {
    let ret = { Delayed, Forest, MobileSpawner, Mortal, Wanderer, Weapon }
    if (className) {
        return ret[className]
    }
    return ret
}

function fromJSON(json) {
    console.log(json)
    let name = json.type
    let cmp = components.getComponentList(name)
    rm.components.push(new cmp({ parent: rm.uuid }))
    return new comp({ parent: json.parent, location: json.location, type: json.type, props: json.props })
}

export { Delayed, Forest, MobileSpawner, Mortal, Wanderer, Weapon, getComponentList, fromJSON }
export default { Delayed: Delayed, Forest: Forest, MobileSpawner: MobileSpawner, Mortal: Mortal, Wanderer: Wanderer, Weapon: Weapon, getComponentList: getComponentList }