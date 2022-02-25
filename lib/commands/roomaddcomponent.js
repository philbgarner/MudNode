import Command from '../command'
import entities from '../entities'
import rooms from '../rooms'

class RoomAddComponent extends Command {
    constructor (params) {
        super(params)
    }

    Help () {
        return 'room add component <name>'
    }

    _execute (params) {
        if (!params.command) {
            return false;
        }

        let cmd = params.command.split(' ')

        let player = entities.getPlayer(params.userId)
        
        if (player !== null) {
            let room = rooms.getRoom(player.location)
            if (room !== null) {
                try {
                    room.AddComponent(cmd[3])
                    params.ws.send(`Added component ${cmd[3]} to room.`)
                    return true
                } catch {
                    params.ws.send(`Error: Could not add component ${cmd[3]} to room.`)
                    return false
                }
            }
        }
        return false
    }
}

module.exports = RoomAddComponent
