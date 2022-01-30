class Handler {
    constructor(params) {
        this.commands = []
    }

    DefaultHandler (ws, userId, command) {
        let player = require('./entities').getPlayer(userId)
        if (player !== null) {
            let room = require('./rooms').getRoom(player.location)
            if (room !== null) {
                if (room.HasExit(command)) {
                    let exit = room.GetExit(command)
                    player.Move(exit)
                    return true
                }
            }
        }
        return false
    }

    AddHandler (command) {
        if (!command) {
            throw new Error('Error: command parameter passed to AddHandler() must be a valid command object.')
        }
        if (this.commands.includes(command)) {
            console.log(`Warning: ignored adding command in AddHandler, command already exists.`)
        }
        this.commands.push(command)
    }

    HasCommand (command) {
        return this.commands.filter(c => c.Match(command)).length > 0
    }

    ExecuteCommand (ws, userId, command) {
        return this.commands.filter(c => c.Match(command))[0].Execute({ws : ws, userId: userId, command: command})
    }

    Parse (ws, userId, command) {
        let parts = command.split(' ')
        if (!ws) {
            throw new Error('Handler.Parse() requires a WebSocket object passed as the first parameter.')
        }
        if (this.HasCommand(command)) {
            if (!this.ExecuteCommand(ws, userId, command)) {
                ws.send(`Error executing command ${command}.`)
            } else {
                return true
            }
        }
        return false
    }
}

module.exports = Handler
