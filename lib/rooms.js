import Room from './room.js'

let roomlist = {}

function getRooms() {
    return roomlist
}
function addRoom(room) {
    let roomLoc = this.getRoomByLocation(room.location)
    if (roomLoc) {
        return false
    }
    roomlist[room.uuid] = room
    return true
}
function getRoom(roomid) {
    return roomlist[roomid] ? roomlist[roomid] : null
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
function loadRooms(buffer) {
    let rlist = JSON.parse(buffer.toString())
    roomlist = {}
    for (let r in rlist) {
        roomlist[r] = Room.fromJSON(rlist[r])
    }
}
function rooms () {
    return {
        getRooms: getRooms,
        addRoom: addRoom,
        getRoom: getRoom,
        getRoomByLocation: getRoomByLocation,
        getRoomsByArea: getRoomsByArea,
        loadRooms: loadRooms
    }
}

export { rooms, loadRooms, getRoomsByArea, getRoomByLocation, getRoom, addRoom, getRooms }