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
                room.Describe(params.ws)
                return true
            }
        }
        return false
    }
}

module.exports = Look