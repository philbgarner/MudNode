let playerlist = {}
let moblist = {}

module.exports.mobiles = function () {
    return moblist
}

module.exports.addMobile = function (mobile) {
    moblist[mobile.uuid] = mobile
    return true
}

module.exports.removeMobile = function (mobile) {
    moblist[mobile.uuid] = undefined
    return true
}

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

/**
 * Get Players that are in the room specified by the uuid parameter. If specified, results exclude the player with the matching uuid.
 * @param {uuid} uuid Room uuid (player.location)
 * @param {uuid} exceptPlayerUuid Player uuid
 * @returns Player list object
 */
module.exports.getPlayersByLocation = function (uuid, exceptPlayerUuid) {
    let plist = {}
    for (let p in playerlist) {
        if ((playerlist[p].location === uuid && exceptPlayerUuid === undefined) || (playerlist[p].location === uuid && playerlist[p].uuid !== exceptPlayerUuid)) {
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