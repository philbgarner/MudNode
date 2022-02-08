const Command = require('../command')
const entities = require('../entities')
const uuid = require('uuid')
const rooms = require('../rooms')

class RoomAddComponent extends Command {
    constructor (params) {
        super(params)
    }

    Help () {
        return 'add component <name>'
    }

    _execute (params) {
        if (!params.command) {
            return false;
        }

        let cmd = params.command.split(' ')

        let player = require('../entities').getPlayer(params.userId)
        
        if (player !== null) {
            let room = rooms.getRoom(player.location)
            if (room !== null) {
                try {
                    room.AddComponent(cmd[2])
                    params.ws.send(`Added component ${cmd[2]} to room.`)
                    return true
                } catch {
                    params.ws.send(`Error: Could not add component ${cmd[2]} to room.`)
                    return false
                }
            }
        }
        return false
    }
}

module.exports = RoomAddComponent