import Command from '../command.js'
import entities from '../entities.js'
import rooms from '../rooms.js'

class RoomComponentProps extends Command {
    constructor (params) {
        super(params)
    }

    Help () {
        return 'room component props <name> <property> <value>(optional)'
    }

    _execute (params) {
        if (!params.command) {
            return false;
        }

        let cmd = params.command.split(' ')

        let player = entities.getPlayer(params.userId)
        
        if (player !== null) {
            let room = rooms.getRoom(player.location)
            if (room !== null) {
                let components = room.components.filter(f => f.type.toLowerCase() === cmd[3].toLowerCase())
                if (components.length > 0) {
                    if (cmd[5]) {
                        let value = cmd[5]
                        components[0].props[cmd[4]] = ['{', '['].includes(value.substring(0, 1)) ? value = JSON.parse(value) : isNaN(value) ? value : parseFloat(value)
                        params.ws.send(`Component property ${cmd[3]}.${cmd[4]} ${components[0].props[cmd[4]]} set to ${value}`)
                        return true
                    } else {
                        let prop = components[0].props[cmd[4]]
                        if (typeof prop === 'array' || typeof prop === 'object') {
                            params.ws.send(`Component property ${cmd[4]} = ${JSON.stringify(prop)}`)
                            return true
                        } else {
                            params.ws.send(`Component property ${cmd[4]} = ${prop}`)
                            return true
                        }
                    }
                }
            }
        }
        return false
    }
}

export default  RoomComponentProps
