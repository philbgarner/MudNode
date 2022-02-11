const path = require('path')
const fs = require('fs')

function save(saveplayers, saverooms, saveusers, savemobiles, saveareas) {
    return new Promise((resolve, reject) => {
        try {
            const config = require('./config.json')
            let dir = path.join(__dirname, '..', config.datafolder)
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir)
            }
            if (saveplayers) {
                let players = require('./entities').players()
                fs.writeFileSync(path.join(dir, config.playersfile), JSON.stringify(players, null, config.indentamt))
            }
            if (saverooms) {
                let rooms = require('./rooms').rooms()
                fs.writeFileSync(path.join(dir, config.roomsfile), JSON.stringify(rooms, null, config.indentamt))
            }
            if (saveusers) {
                let users = require('./users').users()
                fs.writeFileSync(path.join(dir, config.usersfile), JSON.stringify(users, null, config.indentamt))
            }
            if (savemobiles) {
                let mobiles = require('./entities').mobiles()
                let mobs = {}
                for (let m in mobiles) {
                    mobs[m] = mobiles[m].toJSON()
                }
                fs.writeFileSync(path.join(dir, config.mobilesfile), JSON.stringify(mobs, null, config.indentamt))
            }
            if (saveareas) {
                let areas = require('./areas').areas()
                let as = {}
                for (let a in areas) {
                    as[a] = areas[a].toJSON()
                }
                fs.writeFileSync(path.join(dir, config.areasfile), JSON.stringify(areas, null, config.indentamt))
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

            if (fs.existsSync(path.join(dir, config.mobilesfile))) {
                let mobilesBuf = fs.readFileSync(path.join(dir, config.mobilesfile))
                const entities = require('./entities')
                entities.loadMobiles(mobilesBuf)
            }

            if (fs.existsSync(path.join(dir, config.areasFile))) {
                let areasBuf = fs.readFileSync(path.join(dir, config.areasFile))
                const areas = require('./areas')
                areas.loadAreas(areasBuf)
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