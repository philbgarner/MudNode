import Command from '../command.js'
import Mobile from '../mobile.js'
import entities from '../entities.js'
import { v4 } from 'uuid'

class CreateMobile extends Command {
    constructor (params) {
        super(params)
    }

    Help () {
        return 'mobile create <name>'
    }

    _execute (params) {
        if (!params.command) {
            return false;
        }
        let player = entities.getPlayer(params.userId)
        if (player !== null) {
            let cmd = params.command.split(' ')
            const id = v4();

            let mobile = new Mobile({
                name: cmd[2], description: 'default mobile', location: player.location, uuid: id
            })
            entities.addMobile(mobile)
            
            params.ws.send(`Create mobile '${cmd[2]}' successful: ${id}.`)
            return true
        }

        return false
    }
}

export default  CreateMobile