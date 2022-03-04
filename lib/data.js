import path from 'path'
import fs from 'fs'
import entities from './entities.js'
import rooms from './rooms.js'
import users from './users.js'
import areas from './areas.js'
import config from './config.js'

const save = (saveplayers, saverooms, saveusers, savemobiles, saveareas) => {
    return new Promise((resolve, reject) => {
        try {
            //const config ('./config.json')
            let dir = path.join(__dirname, '..', config.datafolder)
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir)
            }
            if (saveplayers) {
                let plrs = entities.players()
                fs.writeFileSync(path.join(dir, config.playersfile), JSON.stringify(plrs, null, config.indentamt))
            }
            if (saverooms) {
                let rms = rooms.rooms()
                fs.writeFileSync(path.join(dir, config.roomsfile), JSON.stringify(rms, null, config.indentamt))
            }
            if (saveusers) {
                let urs = users.users()
                fs.writeFileSync(path.join(dir, config.usersfile), JSON.stringify(urs, null, config.indentamt))
            }
            if (savemobiles) {
                let mobiles = entities.mobiles()
                let mobs = {}
                for (let m in mobiles) {
                    mobs[m] = mobiles[m].toJSON()
                }
                fs.writeFileSync(path.join(dir, config.mobilesfile), JSON.stringify(mobs, null, config.indentamt))
            }
            if (saveareas) {
                let ars = areas.areas()
                let as = {}
                for (let a in areas) {
                    as[a] = ars[a].toJSON()
                }
                fs.writeFileSync(path.join(dir, config.areasfile), JSON.stringify(ars, null, config.indentamt))
            }

            resolve()
        }
        catch (err) {
            console.log(err)
            reject()
        }
    })
}

const load = () => {
    return new Promise((resolve, reject) => {
        try {
            let dir = path.join(__dirname, '..', config.datafolder)
            if (!fs.existsSync(dir)) {
                reject()
            }

            if (fs.existsSync(path.join(dir, config.playersfile))) {
                let playerBuf = fs.readFileSync(path.join(dir, config.playersfile))
                entities.loadPlayers(playerBuf)
            }

            if (fs.existsSync(path.join(dir, config.roomsfile))) {
                let roomsBuf = fs.readFileSync(path.join(dir, config.roomsfile))
                rooms.loadRooms(roomsBuf)
            }

            if (fs.existsSync(path.join(dir, config.usersfile))) {
                let usersBuf = fs.readFileSync(path.join(dir, config.usersfile))
                users.loadUsers(usersBuf)
            }

            if (fs.existsSync(path.join(dir, config.mobilesfile))) {
                let mobilesBuf = fs.readFileSync(path.join(dir, config.mobilesfile))
                entities.loadMobiles(mobilesBuf)
            }

            if (fs.existsSync(path.join(dir, config.areasfile))) {
                let areasBuf = fs.readFileSync(path.join(dir, config.areasfile))
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

export { save, load }
export default  {
    save: save,
    load: load
}