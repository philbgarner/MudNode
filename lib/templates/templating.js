const randInt = require('../randomInt').randInt

function create (roomTemplate) {
    const tmp = require(`./${roomTemplate}`)
    if (tmp !== null) {    
        let template = new tmp({ template: roomTemplate })
        return template.NextRoom()
    } else {
        console.log('Could not import template', roomTemplate)
    }

    return null
}

function dig (fromRoom, toRoomTemplate, exitDir) {
    let toRoom = create(toRoomTemplate)
    if (!toRoom) {
        return null
    }

    if (!exitDir) {
        // Pick a random cardinal direction.
        let directions = ['North', 'East', 'South', 'West']
        let dirs = []
        let keys = Object.keys(fromRoom.exits)
        for (let d in directions) {
            if (!keys.includes(directions[d])) {
                dirs.push(directions[d])
            }
        }   
        exitDir = dirs[randInt(0, dirs.length - 1)]
    }

    // Determine opposite direction
    let opposites = {
        'North': 'South',
        'South': 'North',
        'West': 'East',
        'East': 'West',
    }
    let oppDir = opposites[exitDir]
    fromRoom.SetExit(exitDir, toRoom.uuid)
    toRoom.SetExit(oppDir, fromRoom.uuid)

    return toRoom
}

module.exports.dig = dig
module.exports.create = create