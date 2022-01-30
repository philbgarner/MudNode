const Command = require('../command')

class ListPlayers extends Command {
    constructor (params) {
        super(params)
    }

    Help () {
        return 'list rooms'
    }

    _execute (params) {
        if (!params.command) {
            return false;
        }
        
        var players = require('../entities').players()
        params.ws.send("Players List:")
        for (let r in players) {
            params.ws.send(`${players[r].name} (${players[r].location}) ${r} (UserId: ${players[r].uuid})`)
        }

        return true
    }
}

module.exports = ListPlayers