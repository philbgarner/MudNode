const Command = require('../command')

class Impersonate extends Command {
    constructor (params) {
        super(params)
    }

    Help () {
        return 'impersonate <player uuid>'
    }

    _execute (params) {

        let cmd = params.command.split(' ')

        let currentPlayer = require('../entities').getPlayer(params.userId)

        if (currentPlayer !== null) {
            currentPlayer.uuid = null
        }

        let player = require('../entities').getPlayerByUuid(cmd[1])

        if (player !== null) {
            player.uuid = params.userId
            return true
        }

        return false
    }
}

module.exports = Impersonate