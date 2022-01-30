const req = require("express/lib/request")

let roomlist = {}

module.exports.rooms = function () {
    return roomlist
}
module.exports.addRoom = function (room) {
    roomlist[room.uuid] = room
    return true
}
module.exports.getRoom = function (roomid) {
    return roomlist[roomid] ? roomlist[roomid] : null
}
module.exports.loadRooms = function (buffer) {
    const Room = require('./room')
    let rlist = JSON.parse(buffer.toString())
    roomlist = {}
    for (let r in rlist) {
        roomlist[r] = Room.fromJSON(rlist[r])
    }
}
