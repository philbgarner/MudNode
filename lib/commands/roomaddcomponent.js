import Command from '../command.js'
import entities from '../entities.js'
import rooms from '../rooms.js'

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

export default  RoomAddComponent
