import Command from '../command.js'
import rooms from '../rooms.js'
import entities from '../entities.js'

class LinkExit extends Command {
    constructor (params) {
        super(params)
    }

    Help () {
        return 'link exit <direction> <room uuid>'
    }

    _execute (params) {
        if (!params.command) {
            return false;
        }
        
        let player = entities.getPlayer(params.userId)
        let room = rooms.getRoom(player.location)
        if (room !== null) {
            let cmd = params.command.split(' ')
            let dest = rooms.getRoom(cmd[3])    
            if (dest !== null) {
                room.SetExit(cmd[2], dest.uuid)
                return true
            }
        }
        return false
    }
}

export default  LinkExit