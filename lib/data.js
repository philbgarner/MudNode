const path = require('path')
const fs = require('fs')

function save(saveplayers, saverooms, saveusers) {
    return new Promise((resolve, reject) => {
        try {
            const config = require('./config.json')
            let dir = path.join(__dirname, '..', config.datafolder)
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir)
            }
            if (saveplayers) {
                let players = require('./entities').players()
                fs.writeFileSync(path.join(dir, config.playersfile), JSON.stringify(players))
            }
            if (saverooms) {
                let rooms = require('./rooms').rooms()
                fs.writeFileSync(path.join(dir, config.roomsfile), JSON.stringify(rooms))
            }
            if (saveusers) {
                let users = require('./users').users()
                fs.writeFileSync(path.join(dir, config.usersfile), JSON.stringify(users))
            }
            resolve()
        }
        catch (err) {
            console.log(err)
            reject()
        }
    })
}

function load() {
    return new Promise((resolve, reject) => {
        try {
            const config = require('./config.json')
            let dir = path.join(__dirname, '..', config.datafolder)
            if (!fs.existsSync(dir)) {
                reject()
            }

            if (fs.existsSync(path.join(dir, config.playersfile))) {
                let playerBuf = fs.readFileSync(path.join(dir, config.playersfile))
                const entities = require('./entities')
                entities.loadPlayers(playerBuf)
            }

            if (fs.existsSync(path.join(dir, config.roomsfile))) {
                let roomsBuf = fs.readFileSync(path.join(dir, config.roomsfile))
                const rooms = require('./rooms')
                rooms.loadRooms(roomsBuf)
            }

            if (fs.existsSync(path.join(dir, config.usersfile))) {
                let usersBuf = fs.readFileSync(path.join(dir, config.usersfile))
                const users = require('./users')
                users.loadUsers(usersBuf)
            }

            resolve()
        }
        catch (err) {
            console.log(err)
            reject()
        }
    })
}

module.exports = {
    save: save,
    load: load
}