import Command from '../command'
import entities from entities

class ListPlayers extends Command {
    constructor (params) {
        super(params)
    }

    Help () {
        return 'list players'
    }

    _execute (params) {
        if (!params.command) {
            return false;
        }
        
        var players = entities.players()
        params.ws.send("Players List:")
        for (let r in players) {
            params.ws.send(`${players[r].name} (${players[r].location}) ${r} (UserId: ${players[r].uuid})`)
        }

        return true
    }
}

module.exports = ListPlayers