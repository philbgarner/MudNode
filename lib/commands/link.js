import Command from '../command'

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
        
        return true
    }
}

module.exports = Link
