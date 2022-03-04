import { Command } from '../mudnode.js'

class DescribeRoom extends Command {
    constructor (params) {
        super(params)
    }

    Help () {
        return 'describe room <description>'
    }

    _execute (params) {
        if (!params.command) {
            return false;
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
                room.description = desc.trim()
                params.ws.send('Room description successfully updated.')
                return true
            }
        }

        return false
    }
}

export default  DescribeRoom