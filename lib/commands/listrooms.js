import Command from '../command'
import rooms from '../rooms'

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
        
        var rooms = rooms.rooms()
        params.ws.send("Rooms List:")
        for (let r in rooms) {
            params.ws.send(`${rooms[r].name} (${JSON.stringify(rooms[r].location)}) ${rooms[r].uuid}`)
        }

        return true
    }
}

module.exports = ListRooms