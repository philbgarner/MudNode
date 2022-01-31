const Command = require('../command')
const Entity = require('../entity')
const uuid = require('uuid')
const entities = require('../entities')
const rooms = require('../rooms')

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
        
        let player = entities.getPlayer(params.userId)
        if (player !== null) {
            let cmd = params.command.split(' ')
            const id = uuid.v4();

            let desc = ''
            if (cmd.length >= 3) {
                for (let d = 3; d < cmd; d++) {
                    desc += cmd[d] + ' '
                }
            } else {
                desc = 'default entity'
            }

            let room = rooms.getRoom(player.location)
            if (room !== null) {
                console.log('>', room)
                let entity = new Entity({ name: cmd[2], description: desc, location: room.uuid, uuid: id })
                room.AddEntity(entity)
                params.ws.send(`Create entity '${cmd[2]}' successful: ${id}`)
                return true
            }
        }
        return false
    }
}

module.exports = CreateEntity