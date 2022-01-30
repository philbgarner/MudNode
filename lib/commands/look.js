const Command = require('../command')
const entities = require('./../entities')

class Look extends Command {
    constructor (params) {
        super(params)
    }

    Help () {
        return 'look <null|player|entity>'
    }

    _execute (params) {
        let player = require('../entities').getPlayer(params.userId)

        if (player !== null) {
            let cmd = params.command.split(' ')
            
            if (cmd.length > 1) {
                let room = require('../rooms').getRoom(player.location)
                if (room !== null) {
                    let roomPlayers = entities.getPlayersByLocation(player.location, player.uuid)
                    if (roomPlayers.length > 0) {
                        for (let p in roomPlayers[p]) {
                            roomPlayers[p].Describe(params.ws)
                            return true
                        }
                    }
                    let roomEntities = room.entities
                    let c = 1
                    for (let r in roomEntities) {
                        if (roomEntities[r].name.toLowerCase().includes(cmd[1].toLowerCase()) && roomEntities[r].HasAction(cmd[0])) {
                            if (cmd[2] !== undefined && c == parseInt(cmd[2])) {
                                roomEntities[r].Action(cmd[0], params)
                                return true
                            } else if (cmd[2] === undefined) {
                                roomEntities[r].Action(cmd[0], params)
                                return true
                            }
                            c++
                        }
                    }
                    return false
                }
            }
            else {
                let room = require('../rooms').getRoom(player.location)
                if (room !== null) {
                    room.Describe(params.ws)
                    return true
                }
            }
        }
        return false
    }
}

module.exports = Look