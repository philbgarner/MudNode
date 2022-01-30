const Command = require('../command')

class DescribeMe extends Command {
    constructor (params) {
        super(params)
    }

    Help () {
        return 'describe me <description>'
    }

    _execute (params) {
        if (!params.command) {
            return false;
        }
        
        let player = require('../entities').getPlayer(params.userId)
        
        if (player !== null) {
            let cmd = params.command.split(' ')

            let desc = ''
            for (let c = 2; c < cmd.length; c++) {
                desc += cmd[c] + ' '
            }
            player.description = desc.trim()
            params.ws.send('Your character description successfully updated.')
            return true
        }

        return false
    }
}

module.exports = DescribeMe