import Delayed from './components/delayed.js'
import Forest from './components/forest.js'
import MobileSpawner from './components/mobilespawner.js'
import Mortal from './components/mortal.js'
import Wanderer from './components/wanderer.js'
import Weapon from './components/weapon.js'
import { components } from './mudnode.js'

const classList = { Delayed, Forest, MobileSpawner, Mortal, Wanderer, Weapon }

function getComponentList(className) {
    if (className) {
        return classList[className]
    }
    return classList
}

function Create(type, enabled, parent, props) {
    enabled = enabled !== undefined ? enabled : true
    props = props ? props : {}
    parent = parent ? parent : null
    let cmp = getComponentList(type)
    return new cmp({ type: type, enabled: enabled, parent: parent, props})
}

function CreatefromJSON(json) {
    let comp = Create(json.type, json.enabled, json.parent, json.props)
    return comp
}

export { Create, getComponentList, CreatefromJSON }
