import { Command, rooms, entities } from '../mudnode.js'

class Tp extends Command {
    constructor (params) {
        super(params)
    }

    Help () {
        return 'tp <room uuid>'
    }

    _execute (params) {
        
        var player = entities.getPlayer(params.userId)

        let cmd = params.command.split(' ')

        var room = rooms.getRoom(cmd[1])

        if (room !== null && player !== null) {
            player.location = room.uuid
            params.ws.send(`You teleported to ${room.name}.`)
            // TODO: Utility method to send to all players in a room a message. Use it to tell them the player bamfed away.
            return true
        }

        return false
    }
}

export default  Tp