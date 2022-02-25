import Command from '../command'
import entities from '../entities'

class Impersonate extends Command {
    constructor (params) {
        super(params)
    }

    Help () {
        return 'impersonate <player uuid>'
    }

    _execute (params) {

        let cmd = params.command.split(' ')

        let currentPlayer = entities.getPlayer(params.userId)

        if (currentPlayer !== null) {
            currentPlayer.uuid = null
        }

        let player = entities.getPlayerByUuid(cmd[1])

        if (player !== null) {
            player.uuid = params.userId
            return true
        }

        return false
    }
}

module.exports = Impersonate