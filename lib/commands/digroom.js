import { Command } from '../mudnode.js'

class DigRoom extends Command {
    constructor (params) {
        super(params)
    }

    Help () {
        return 'room dig <direction> <template filename>'
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
        if (player) {
            let room = rooms.getRoom(player.location)
            if (room) {
                let cmd = params.command.split(' ')
                let gennedRoom = templating.dig(room, cmd[3], cmd[2])
                params.ws.send(`Successfully created a new room to the ${cmd[2]} using ${cmd[3]}.`)
                return rooms.addRoom(gennedRoom)
            }
        }
        return false
    }
}

export default  DigRoom
