import { Command } from '../mudnode.js'

class Reload extends Command {
    constructor (params) {
        super(params)
    }

    Help () {
        return 'reload'
    }

    _execute (params) {
        
        const load = data.load

        let player = entities.getPlayer(params.userId)

        if (player !== null) {
                params.ws.send(`Reloading data...`)
                load().then(() => params.ws.send('Reload complete.')).catch(() => params.ws.send('Reload failed.'))
            return true
        }

        return false
    }
}

export default  Reload