const Command = require('../command')
const Mobile = require('../mobile')
const entities = require('../entities')
const uuid = require('uuid')

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
            const id = uuid.v4();

            let mobile = new Mobile({
                name: cmd[2], description: 'default mobile', location: player.location
            })
            mobile.AddComponent('woodcutter')
            entities.addMobile(mobile)
            
            params.ws.send(`Create mobile '${cmd[2]}' successful: ${id}.`)
            return true
        }

        return false
    }
}

module.exports = CreateMobile