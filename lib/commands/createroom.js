import Command from '../command.js'
import { v4 } from 'uuid'
import Room from '../room.js'
import rooms from '../rooms.js'

class CreateRoom extends Command {
    constructor (params) {
        super(params)
    }

    Help () {
        return 'room create <name>'
    }

    _execute (params) {
        if (!params.command) {
            return false;
        }
        
        var addRoom = rooms.addRoom

        let cmd = params.command.split(' ')
        const id = v4();

        addRoom(new Room({
            name: cmd[2],
            uuid: id
        }))

        params.ws.send(`Create room '${cmd[2]}' successful: ${id}`)
        return true
    }
}

export default  CreateRoom