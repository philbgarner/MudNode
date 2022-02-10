const randInt = require('../random').randInt

function create (roomTemplate) {
    const tmp = require(`./rooms/${roomTemplate}`)
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

    if (!exitDir && fromRoom) {
        // TODO: Some of these directions should be excluded based on fromRoom's components that might have restrictions
        // IE: If this room is the outer edge of an interior space, then we don't want to create an exit that would
        // go through a wall (unless there's a door component in the room). Not sure yet how the system should handle this.

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
    if (fromRoom) {
        fromRoom.SetExit(exitDir, toRoom.uuid)
        if (['north', 'south'].includes(exitDir.toLowerCase())) {
            if (exitDir.toLowerCase() === 'north') {
                toRoom.location = fromRoom.location
                toRoom.location.z--;
            } else {
                toRoom.location = fromRoom.location
                toRoom.location.z++;
            }
        } else {
            if (exitDir.toLowerCase() === 'east') {
                toRoom.location = fromRoom.location
                toRoom.location.x++;
            } else {
                toRoom.location = fromRoom.location
                toRoom.location.x--;
            }
        }
        toRoom.SetExit(oppDir, fromRoom.uuid)
    }

    return toRoom
}

module.exports.dig = dig
module.exports.create = create