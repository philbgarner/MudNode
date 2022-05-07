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

function Create(type) {
    return getComponentList(type)
}

function CreatefromJSON(json) {
    let cmp = classList[json.type]
    console.log('CreatefromJson:', cmp)
    let comp = new cmp({ parent: rm.uuid, props: json.props })
    rm.components.push(comp)
    console.log('result:', comp)
    return comp
}

export { Create, getComponentList, CreatefromJSON }
