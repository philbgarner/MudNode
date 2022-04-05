import Room from './room.js'

let roomlist = {}

const getRooms = () => {
    return roomlist
}
const addRoom = (room) => {
    let roomLoc = getRoomByLocation(room.location)
    if (roomLoc) {
        return false
    }
    roomlist[room.uuid] = room
    return true
}
const getRoom = (roomid) => {
    return roomlist[roomid] ? roomlist[roomid] : null
}
const setRoom = (room) => {
    let rm = getRoom(room.uuid)
    if (rm) {
        rm.name = room.name
        rm.description = room.description
        rm.exits = room.exits
        rm.colour = room.colour
    } else {
        return false
    }
    return rm
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

const setRooms = (json) => {
    roomlist = json
}

const loadRooms = (buffer) => {
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