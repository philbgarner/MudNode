let playerlist = {}

module.exports.players = function () {
    return playerlist
}
module.exports.addPlayer = function (player) {
    playerlist[player.uuid] = player
    return true
}
module.exports.getPlayer = function (uuid) {
    try {
        for (let id in playerlist) {
            if (playerlist[id].uuid === uuid) {
                return playerlist[id]
            }
        }
    }
    catch { }
    return null
}
module.exports.getPlayerByUuid = function (uuid) {
    return playerlist[uuid] ? playerlist[uuid] : null
}
module.exports.getPlayersByLocation = function (uuid) {
    let plist = {}
    for (let p in playerlist) {
        if (playerlist[p].location === uuid) {
            plist[p] = playerlist[p]
        }
    }
    return plist
}
module.exports.removePlayer = function (uuid) {
    playerlist[uuid] = undefined
}
module.exports.loadPlayers = function (buffer) {
    const Player = require('./player')
    let plist = JSON.parse(buffer.toString())
    playerlist = {}
    for (let p in plist) {
        playerlist[p] = Player.fromJSON(plist[p])
    }
}