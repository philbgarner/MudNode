import { Command } from '../mudnode.js'

class EntityAddComponent extends Command {
    constructor (params) {
        super(params)
    }

    Help () {
        return 'entity <name> <number (optional)> add component <name>'
    }

    Match(command) {
        let cmd = command.split(' ')
        let hasNumber = !isNaN(cmd[2])

        if ('entity'.includes(cmd[0].toLowerCase())) {
            if (isNaN(cmd[1])) {
                if (hasNumber) {
                    if ('add'.includes(cmd[3].toLowerCase()) && 'component'.includes(cmd[4].toLowerCase()) && isNaN(cmd[5])) {
                        return true
                    }
                } else {
                    if ('add'.includes(cmd[2].toLowerCase()) && 'component'.includes(cmd[3].toLowerCase()) && isNaN(cmd[4])) {
                        return true
                    }
                }
            }
        }
        return false
    }

    _execute (params) {
        if (!params.command) {
            return false;
        }

        let cmd = params.command.split(' ')
        if (cmd.length < 5) {
            params.ws.send('Error: incorrect number of parameters:')
            params.ws.send(this.Help())
            return false
        }

        let player = entities.getPlayer(params.userId)
        
        if (player !== null) {
            let hasNumber = !isNaN(cmd[2])
            let cmpindex = 4
            if (hasNumber) {
                cmpindex += 1
            }
            let room = rooms.getRoom(player.location)
            if (room !== null) {
                let ents = room.entities
                if (ents.length > 0) {
                    let ret = false
                    try {
                        ents[0 + hasNumber ? parseInt(cmd[2]) - 1: 0].AddComponent(cmd[cmpindex])
                        ret = true
                    } catch {
                        params.ws.send(`Error: Could not find entity '${cmd[1]}' #${0 + hasNumber ? parseInt(cmd[2]) - 1: 0}`)
                        return false
                    }
                    if (ret) {
                        params.ws.send(`Component '${cmd[cmpindex]}' added to mobile ${cmd[1]}.`)
                        return true
                    }
                    else {
                        params.ws.send(`Error adding component: Unknown.`)
                        return false
                    }
                }
                else {
                    params.ws.send(`Error: No mobiles found matching '${cmd[1]}'.`)
                    return false
                }
            }
        }
        return false
    }
}

export default  EntityAddComponent