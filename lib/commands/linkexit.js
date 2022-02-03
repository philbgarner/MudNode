const Command = require('../command')

class LinkExit extends Command {
    constructor (params) {
        super(params)
    }

    Help () {
        return 'link exit <direction> <room uuid>'
    }

    _execute (params) {
        if (!params.command) {
            return false;
        }
        
        const getRoom = require('../rooms').getRoom
        const getPlayer = require('../entities').getPlayer
        const setExit = require('../rooms').setExit

        let player = getPlayer(params.userId)
        let room = getRoom(player.location)
        if (room !== null) {
            let cmd = params.command.split(' ')
            let dest = getRoom(cmd[3])    
            if (dest !== null) {
                room.SetExit(cmd[2], dest.uuid)
                return true
            }
        }
        return false
    }
}

module.exports = LinkExit