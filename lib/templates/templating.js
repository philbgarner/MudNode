import { templates, rooms } from '../mudnode.js'

function create(roomTemplate) {
    const tmp = templates[roomTemplate]
    if (tmp) {
        let template = new tmp({ template: roomTemplate })
        return template
    } else {
        console.log('Could not import template', roomTemplate)
    }

    return null
}

function dig(fromRoom, toRoomTemplate, exitDir) {
    let toTemplate = create(toRoomTemplate)
    let toRoom = toTemplate.NextRoom()

    if (fromRoom) {
        if (exitDir.toLowerCase() === 'north') {
            toRoom.location = { x: fromRoom.location.x, y: fromRoom.location.y, z: fromRoom.location.z - 1 }
        } else if (exitDir.toLowerCase() === 'south') {
            toRoom.location = { x: fromRoom.location.x, y: fromRoom.location.y, z: fromRoom.location.z + 1 }
        } else if (exitDir.toLowerCase() === 'east') {
            toRoom.location = { x: fromRoom.location.x + 1, y: fromRoom.location.y, z: fromRoom.location.z }
        } else if (exitDir.toLowerCase() === 'west') {
            toRoom.location = { x: fromRoom.location.x - 1, y: fromRoom.location.y, z: fromRoom.location.z }
        }
    }

    if (!toRoom) {
        return null
    }
    if (!rooms.addRoom(toRoom)) {
        return false
    }
    let directions = ['North', 'East', 'South', 'West']
    let opposites = {
        'North': 'South',
        'South': 'North',
        'West': 'East',
        'East': 'West',
    }

    for (let d in directions) {
        let dirLoc
        if (directions[d].toLowerCase() === 'north') {
            dirLoc = { x: fromRoom.location.x, y: fromRoom.location.y, z: fromRoom.location.z - 1 }
        } else if (directions[d].toLowerCase() === 'south') {
            dirLoc = { x: fromRoom.location.x, y: fromRoom.location.y, z: fromRoom.location.z + 1 }
        } else if (directions[d].toLowerCase() === 'east') {
            dirLoc = { x: fromRoom.location.x + 1, y: fromRoom.location.y, z: fromRoom.location.z }
        } else if (directions[d].toLowerCase() === 'west') {
            dirLoc = { x: fromRoom.location.x - 1, y: fromRoom.location.y, z: fromRoom.location.z }
        }
        let oppDir = opposites[directions[d]]
        let dirRoom = rooms.getRoomByLocation(dirLoc)
        if (dirRoom) {
            dirRoom.SetExit(oppDir, fromRoom.uuid)
        }
    }

    return toRoom
}

export { dig, create }
export default { dig: dig, create: create }