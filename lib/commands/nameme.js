import Command from '../command'
import entities from '../entities'

class NameMe extends Command {
    constructor (params) {
        super(params)
    }

    Help () {
        return 'me name <name>'
    }

    _execute (params) {
        if (!params.command) {
            return false;
        }
        
        let player = entities.getPlayer(params.userId)
        
        if (player !== null) {
            let cmd = params.command.split(' ')

            let desc = ''
            for (let c = 2; c < cmd.length; c++) {
                desc += cmd[c] + ' '
            }
            player.name = desc.trim()
            params.ws.send('Your character name successfully updated.')
            return true
        }

        return false
    }
}

module.exports = NameMe