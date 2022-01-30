const Command = require('../command')

class Look extends Command {
    constructor (params) {
        super(params)
    }

    _execute (params) {
        var player = require('../entities').getPlayer(params.userId)

        if (player !== null) {
            var room = require('../rooms').getRoom(player.location)
            if (room !== null) {
                params.ws.send(`${room.name}, ${room.description}`)
                let exits = ''
                for (let e in room.exits) {
                    exits += e + ', '
                }
                params.ws.send(`Exits: ${exits.substring(0, exits.length - 2)}`)
                return true
            }
        }
        return false
    }
}

module.exports = Look