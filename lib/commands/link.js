const Command = require('../command')

class Link extends Command {
    constructor (params) {
        super(params)
    }

    Help () {
        return 'link'
    }

    _execute (params) {
        if (!params.command) {
            return false;
        }
        
        var rooms = require('../rooms').rooms()

        let cmd = params.command.split(' ')



        return true
    }
}

module.exports = ListRooms