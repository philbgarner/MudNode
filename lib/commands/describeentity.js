import Command from '../command.js'
import entities from '../entities.js'
import rooms from '../rooms.js'

class DescribeRoom extends Command {
    constructor (params) {
        super(params)
    }

    Help () {
        return 'entity describe <entity> <entity number|description>'
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

                let roomEntities = room.entities
                let c = 1
                let ment = []
                for (let r in roomEntities) {
                    if (roomEntities[r].name.toLowerCase().includes(cmd[2].toLowerCase())) {
                        ment.push(roomEntities[r])
                    }
                }
                if (ment.length > 1 && !isNaN(cmd[3])) {
                    let desc = ''
                    for (let c = 4; c < cmd.length; c++) {
                        desc += cmd[c] + ' '
                    }
                    try {
                        ment[parseInt(cmd[3]) - 1].description = desc.trim()
                        params.ws.send(`Entity ${ment[parseInt(cmd[3]) - 1].name} (#${parseInt(cmd[3])}) description set to '${desc.trim()}'.`)
                    }
                    catch { return false }
                    return true
                } else if (ment.length > 1 && isNaN(cmd[3])) {
                    let desc = ''
                    for (let c = 3; c < cmd.length; c++) {
                        desc += cmd[c] + ' '
                    }
                    ment[0].description = desc.trim()
                    params.ws.send(`Entity ${ment[0].name} description set to '${desc.trim()}'.`)
                    return true
                }
            }
        }

        return false
    }
}

export default  DescribeRoom