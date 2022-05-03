import Room from './room.js'

let roomlist = {}

function getRooms() {
    return roomlist
}
function addRoom(room) {
    let roomLoc = getRoomByLocation(room.location)
    if (roomLoc) {
        return false
    }
    roomlist[room.uuid] = room
    return true
}
function getRoom(roomid) {
    return roomlist[roomid] ? roomlist[roomid] : null
}
function setRoom(room) {
    let rm = getRoom(room.uuid)
    if (rm) {
        rm.name = room.name
        rm.description = room.description
        rm.exits = room.exits
        rm.colour = room.colour
        rm.props = room.props
    } else {
        return false
    }
    return rm
}
function getRoomByLocation(location) {
    for (let r in roomlist) {
        let loc = roomlist[r].location
        if (loc.x === location.x && loc.y === location.y && loc.z === location.z) {
            return roomlist[r]
        }
    }
    return null
}
function getRoomsByArea(areaid) {
    let rooms = []
    for (let r in roomlist) {
        if (roomlist[r].areaid == areaid) {
            rooms.push(roomlist[r])
        }
    }
    return rooms
}

function setRooms(json) {
    roomlist = json
}

function loadRooms(buffer) {
    let rlist = JSON.parse(buffer.toString())
    roomlist = {}
    for (let r in rlist) {
        roomlist[r] = Room.fromJSON(rlist[r])
    }
}

export { loadRooms, getRoomsByArea, getRoomByLocation, getRoom, addRoom, getRooms, setRooms, setRoom }
export default {
    getRooms: getRooms,
    addRoom: addRoom,
    getRoom: getRoom,
    getRoomByLocation: getRoomByLocation,
    getRoomsByArea: getRoomsByArea,
    loadRooms: loadRooms,
    setRooms: setRooms,
    setRoom: setRoom
}