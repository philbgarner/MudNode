import Command from '../command'

class RemoveEntity extends Command {
    constructor (params) {
        super(params)
    }

    Help () {
        return 'entity remove <name>'
    }

    _execute (params) {
        if (!params.command) {
            return false
        }
        
        let player = params.player
        if (player !== null) {
            let cmd = params.command.split(' ')

            let room = params.room
            if (room !== null) {
                room.RemoveEntityByName(cmd[2])
                params.ws.send(`Entity '${cmd[2]}' removed.`)
                return true
            }
        }
        return false
    }
}

module.exports = RemoveEntity