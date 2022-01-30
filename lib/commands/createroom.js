const Command = require('../command')
const uuid = require('uuid')

class CreateRoom extends Command {
    constructor (params) {
        super(params)
    }

    Help () {
        return 'create room <name>'
    }

    _execute (params) {
        if (!params.command) {
            return false;
        }
        
        var Room = require('../room')
        var addRoom = require('../rooms').addRoom

        let cmd = params.command.split(' ')
        const id = uuid.v4();

        addRoom(new Room({
            name: cmd[2],
            uuid: id
        }))

        params.ws.send(`Create room '${cmd[2]}' successful: ${id}`)
        return true
    }
}

module.exports = CreateRoom