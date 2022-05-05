import delayed from './components/delayed.js'
import forest from './components/forest.js'
import mobilespawner from './components/mobilespawner.js'
import mortal from './components/mortal.js'
import wanderer from './components/wanderer.js'
import weapon from './components/weapon.js'

function getComponentList() {
    return { delayed, forest, mobilespawner, mortal, wanderer, weapon }
}

export { delayed, forest, mobilespawner, mortal, wanderer, weapon, getComponentList }
export default { delayed: delayed, forest: forest, mobilespawner: mobilespawner, mortal: mortal, wanderer: wanderer, weapon: weapon, getComponentList: getComponentList }