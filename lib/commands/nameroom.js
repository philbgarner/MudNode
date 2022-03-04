import { Command } from '../mudnode.js'

class NameRoom extends Command {
    constructor (params) {
        super(params)
    }

    Help () {
        return 'room name <name>'
    }
    
    Match (command) {
        let cmd = command.toLowerCase().split(' ')
        if (this.name.toLowerCase() === `${cmd[0]} ${cmd[1]}`) {
            return true
        }
        return false
    }

    _execute (params) {
        if (!params.command) {
            return false
        }
        
        let player = entities.getPlayer(params.userId)

        if (player !== null) {
            let room = rooms.getRoom(player.location)
            if (room !== null) {
                let cmd = params.command.split(' ')

                let desc = ''
                for (let c = 2; c < cmd.length; c++) {
                    desc += cmd[c] + ' '
                }
                room.name = desc.trim()
                params.ws.send('Room name successfully updated.')
                return true
            }
        }

        return false
    }
}

export default  NameRoom
