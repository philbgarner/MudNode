import { Command } from '../mudnode.js'

class Save extends Command {
    constructor (params) {
        super(params)
    }

    Help () {
        return 'save <all|players|rooms>'
    }

    _execute (params) {
        
        const save = data.save

        let player = entities.getPlayer(params.userId)

        if (player !== null) {
            let cmd = params.command.split(' ')
            let savesection = cmd[1]
            
            if ('all'.includes(savesection) || savesection == undefined) {
                params.ws.send(`Saving all...`)
                save({ all: true }).then(() => params.ws.send('Save complete.')).catch(() => params.ws.send('Save failed.'))
            } else if ('players'.includes(savesection)) {               
                params.ws.send(`Saving players...`)
                save({ saveplayers: true }).then(() => params.ws.send('Save complete.')).catch(() => params.ws.send('Save failed.'))
            } else if ('rooms'.includes(savesection)) {
                params.ws.send(`Saving rooms...`)
                save({ saverooms: true }).then(() => params.ws.send('Save complete.')).catch(() => params.ws.send('Save failed.'))
            } else {
                return false
            }

            return true
        }

        return false
    }
}

export default  Save