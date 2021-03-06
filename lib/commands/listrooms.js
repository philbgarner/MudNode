import { Command, rooms } from '../mudnode.js'

class ListRooms extends Command {
    constructor (params) {
        super(params)
    }

    Help () {
        return 'room list'
    }

    _execute (params) {
        if (!params.command) {
            return false;
        }
        
        var rms = rooms.getRooms()
        params.ws.send("Rooms List:")
        for (let r in rms) {
            params.ws.send(`${rms[r].name} (${JSON.stringify(rms[r].location)}) ${rms[r].uuid}`)
        }

        return true
    }
}

export default  ListRooms