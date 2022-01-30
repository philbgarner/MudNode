const Command = require('../command')

class Me extends Command {
    constructor (params) {
        super(params)
    }

    Help () {
        return 'me'
    }

    _execute (params) {
        
        let player = require('../entities').getPlayer(params.userId)
        params.ws.send(`Current UserId: ${params.userId}`)
        if (player !== null) {
            let room = require('../rooms').getRoom(player.location)
            params.ws.send(`-= ${player.name} =-`)
            params.ws.send(`${player.description}`)
            if (room !== null) {
                params.ws.send(`Location: ${room.name} (${JSON.stringify(room.location)})`)
            } else {
                params.ws.send(`Location: ${player.location}`)
            }
            return true
        } else {
            params.ws.send(`Error: You do not have a player associated with your userId (${params.userId}).`)
            return true
        }

        return false
    }
}

module.exports = Me