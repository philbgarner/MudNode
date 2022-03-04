import { Command } from '../mudnode.js'

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

export default  Link
