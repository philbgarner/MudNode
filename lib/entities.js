import { Player, Mobile } from './mudnode.js'

let playerlist = {}
let moblist = {}

function getMobiles() {
    return moblist
}
function setMobiles(json) {
    moblist = json
}
function addMobile(mobile) {
    moblist[mobile.uuid] = mobile
    return true
}
/**
 * Returns mobiles in the location specified in uuid.
 * @param {uuid} uuid RoomId
 * @returns 
 */
function getMobilesByLocation(uuid) {
    let mlist = []
    for (let m in moblist) {
        if ((moblist[m].location === uuid)) {
            mlist.push(moblist[m])
        }
    }
    return mlist
}
function getMobilesByArea(uuid) {
    let mobs = []
    for (let m in moblist) {
        if (moblist[m].areaid === uuid) {
            mobs.push(moblist[m])
        }
    }
    return mobs
}
function getMobileByUuid(uuid) {
    for (let m in moblist) {
        if (moblist[m].uuid === uuid) {
            return moblist[m]
        }
    }
}
function removeMobile(mobile) {
    moblist[mobile.uuid] = undefined
    return true
}
function players() {
    return playerlist
}
function addPlayer(player) {
    playerlist[player.uuid] = player
    return true
}
function getPlayer(uuid) {
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
function getPlayerByUuid(uuid) {
    return playerlist[uuid] ? playerlist[uuid] : null
}

/**
 * Get Players that are in the room specified by the uuid parameter. If specified, results exclude the player with the matching uuid.
 * @param {uuid} uuid Room uuid (player.location)
 * @param {uuid} exceptPlayerUuid Player uuid
 * @returns Player list object
 */
function getPlayersByLocation(uuid, exceptPlayerUuid) {
    let plist = {}
    for (let p in playerlist) {
        if ((playerlist[p].location === uuid && exceptPlayerUuid === undefined) || (playerlist[p].location === uuid && playerlist[p].uuid !== exceptPlayerUuid)) {
            plist[p] = playerlist[p]
        }
    }
    return plist
}
function removePlayer(uuid) {
    playerlist[uuid] = undefined
}
function loadPlayers(buffer) {
    let plist = JSON.parse(buffer.toString())
    playerlist = {}
    for (let p in plist) {
        playerlist[p] = Player.fromJSON(plist[p])
    }
}
function loadMobiles(buffer) {
    let mlist = JSON.parse(buffer.toString())
    moblist = {}
    for (let m in mlist) {
        moblist[m] = Mobile.fromJSON(mlist[m])
    }
}

export { getMobiles, addMobile, getMobilesByLocation, getMobilesByArea, getMobileByUuid, removeMobile, players, addPlayer, getPlayer, getPlayerByUuid, getPlayersByLocation, removePlayer, loadPlayers, loadMobiles }
export default { addMobile: addMobile, getMobilesByLocation: getMobilesByLocation, getMobilesByArea: getMobilesByArea, getMobileByUuid: getMobileByUuid,
    removeMobile: removeMobile, players: players, addPlayer: addPlayer, getPlayer: getPlayer, getPlayerByUuid: getPlayerByUuid, getPlayersByLocation: getPlayersByLocation,
    removePlayer: removePlayer, loadPlayers: loadPlayers, loadMobiles: loadMobiles, setMobiles: setMobiles, getMobiles, getMobiles }