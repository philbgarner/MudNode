import { Player, Mobile } from './mudnode.js'

let playerlist = {}
let moblist = {}

const mobiles = () => {
    return moblist
}
const addMobile = (mobile) => {
    moblist[mobile.uuid] = mobile
    return true
}
/**
 * Returns mobiles in the location specified in uuid.
 * @param {uuid} uuid RoomId
 * @returns 
 */
const getMobilesByLocation = (uuid) => {
    let mlist = []
    for (let m in moblist) {
        if ((moblist[m].location === uuid)) {
            mlist.push(moblist[m])
        }
    }
    return mlist
}
const getMobilesByArea = (uuid) => {
    let mobs = []
    for (let m in moblist) {
        if (moblist[m].areaid === uuid) {
            mobs.push(moblist[m])
        }
    }
    return mobs
}
const getMobileByUuid = (uuid) => {
    for (let m in moblist) {
        if (moblist[m].uuid === uuid) {
            return moblist[m]
        }
    }
}
const removeMobile = (mobile) => {
    moblist[mobile.uuid] = undefined
    return true
}
const players = () => {
    return playerlist
}
const addPlayer = (player) => {
    playerlist[player.uuid] = player
    return true
}
const getPlayer = (uuid) => {
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
const getPlayerByUuid = (uuid) => {
    return playerlist[uuid] ? playerlist[uuid] : null
}

/**
 * Get Players that are in the room specified by the uuid parameter. If specified, results exclude the player with the matching uuid.
 * @param {uuid} uuid Room uuid (player.location)
 * @param {uuid} exceptPlayerUuid Player uuid
 * @returns Player list object
 */
const getPlayersByLocation = (uuid, exceptPlayerUuid) => {
    let plist = {}
    for (let p in playerlist) {
        if ((playerlist[p].location === uuid && exceptPlayerUuid === undefined) || (playerlist[p].location === uuid && playerlist[p].uuid !== exceptPlayerUuid)) {
            plist[p] = playerlist[p]
        }
    }
    return plist
}
const removePlayer = (uuid) => {
    playerlist[uuid] = undefined
}
const loadPlayers = (buffer) => {
    let plist = JSON.parse(buffer.toString())
    playerlist = {}
    for (let p in plist) {
        playerlist[p] = Player.fromJSON(plist[p])
    }
}
const loadMobiles = (buffer) => {
    let mlist = JSON.parse(buffer.toString())
    moblist = {}
    for (let m in mlist) {
        moblist[m] = Mobile.fromJSON(mlist[m])
    }
}

export { mobiles, addMobile, getMobilesByLocation, getMobilesByArea, getMobileByUuid, removeMobile, players, addPlayer, getPlayer, getPlayerByUuid, getPlayersByLocation, removePlayer, loadPlayers, loadMobiles }
export default { mobiles: mobiles, addMobile: addMobile, getMobilesByLocation: getMobilesByLocation, getMobilesByArea: getMobilesByArea, getMobileByUuid: getMobileByUuid,
    removeMobile: removeMobile, players: players, addPlayer: addPlayer, getPlayer: getPlayer, getPlayerByUuid: getPlayerByUuid, getPlayersByLocation: getPlayersByLocation,
    removePlayer: removePlayer, loadPlayers: loadPlayers, loadMobiles: loadMobiles }