import Command from '../command.js'
import Entity from '../entity.js'
import { v4 } from 'uuid'

class CreateEntity extends Command {
    constructor (params) {
        super(params)
    }

    Help () {
        return 'create entity <name> <description>'
    }

    _execute (params) {
        if (!params.command) {
            return false
        }
        
        let player = params.player
        if (player !== null) {
            let cmd = params.command.split(' ')
            const id = v4();

            let desc = ''
            if (cmd.length >= 3) {
                for (let d = 3; d < cmd; d++) {
                    desc += cmd[d] + ' '
                }
            } else {
                desc = 'default entity'
            }

            let room = params.room
            if (room !== null) {
                let entity = new Entity({ name: cmd[2], description: desc, location: room.uuid, uuid: id })
                room.AddEntity(entity)
                params.ws.send(`Create entity '${cmd[2]}' successful: ${id}`)
                return true
            }
        }
        return false
    }
}

export default  CreateEntity