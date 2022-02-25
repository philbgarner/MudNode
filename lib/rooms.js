import Room from './room.js'

let roomlist = {}

module.exports.getRooms = function () {
    return roomlist
}
module.exports.addRoom = function (room) {
    let roomLoc = this.getRoomByLocation(room.location)
    if (roomLoc) {
        return false
    }
    roomlist[room.uuid] = room
    return true
}
module.exports.getRoom = function (roomid) {
    return roomlist[roomid] ? roomlist[roomid] : null
}
module.exports.getRoomByLocation = function (location) {
    for (let r in roomlist) {
        let loc = roomlist[r].location
        if (loc.x === location.x && loc.y === location.y && loc.z === location.z) {
            return roomlist[r]
        }
    }
    return null
}
module.exports.getRoomsByArea = function (areaid) {
    let rooms = []
    for (let r in roomlist) {
        if (roomlist[r].areaid == areaid) {
            rooms.push(roomlist[r])
        }
    }
    return rooms
}
module.exports.loadRooms = function (buffer) {
    let rlist = JSON.parse(buffer.toString())
    roomlist = {}
    for (let r in rlist) {
        roomlist[r] = Room.fromJSON(rlist[r])
    }
}

module.exports.rooms = {
    getRooms: module.exports.getRooms,
    addRoom: module.exports.addRoom,
    getRoom: module.exports.getRoom,
    getRoomByLocation: module.exports.getRoomByLocation,
    getRoomsByArea: module.exports.getRoomsByArea,
    loadRooms: module.exports.loadRooms
}