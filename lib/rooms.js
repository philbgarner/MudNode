import Room from './room.js'

let roomlist = {}

const getRooms = () => {
    return roomlist
}
const addRoom = (room) => {
    let roomLoc = this.getRoomByLocation(room.location)
    if (roomLoc) {
        return false
    }
    roomlist[room.uuid] = room
    return true
}
const getRoom = (roomid) => {
    return roomlist[roomid] ? roomlist[roomid] : null
}
const getRoomByLocation = (location) => {
    for (let r in roomlist) {
        let loc = roomlist[r].location
        if (loc.x === location.x && loc.y === location.y && loc.z === location.z) {
            return roomlist[r]
        }
    }
    return null
}
const getRoomsByArea = (areaid) => {
    let rooms = []
    for (let r in roomlist) {
        if (roomlist[r].areaid == areaid) {
            rooms.push(roomlist[r])
        }
    }
    return rooms
}
const loadRooms = (buffer) => {
    let rlist = JSON.parse(buffer.toString())
    roomlist = {}
    for (let r in rlist) {
        roomlist[r] = Room.fromJSON(rlist[r])
    }
}

export { loadRooms, getRoomsByArea, getRoomByLocation, getRoom, addRoom, getRooms }
export default {
    getRooms: getRooms,
    addRoom: addRoom,
    getRoom: getRoom,
    getRoomByLocation: getRoomByLocation,
    getRoomsByArea: getRoomsByArea,
    loadRooms: loadRooms
}