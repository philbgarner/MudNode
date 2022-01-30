class Command {
    constructor (name) {
        this.name = name
    }

    Help () {
        return 'Default command help. Replace this.'
    }

    Match (command) {
        return command.toLowerCase().includes(this.name.toLowerCase())
    }

    _execute (cmd) {
        return false
    }

    Execute (params) {
        if (!params.ws) {
            throw new Error('Error: Command requires a valid websocket object in the params as "ws".')
        }
        let ret = null
        try {
            ret = this._execute(params)
        } catch (err) {
            console.log('Command Execution Error:', err)
            ret = null
        }
        return ret
    }
}

module.exports = Command
