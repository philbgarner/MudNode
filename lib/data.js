import path from 'path'
import fs from 'fs'
import { entities, config, users, grammar, rooms, areas, templates } from './mudnode.js'

/**
 * Save game data objects, specify which one to save by passing its name as true in the params object. Leave blank or specify { all: true } to save all.
 * @param {object} params Options are either true/false (leaving out assumes false) all, saveplayers, saverooms, saveusers, savemobiles, saveareas, savegrammar
 * @returns Promise
 */
function save(params) {
    params = params ? params : { all: true }
    return new Promise((resolve, reject) => {
        try {
            const configData = config.loadConfig()
            let dir = path.join(configData.datafolder)
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir)
            }
            if (params.saveplayers || params.all) {
                let plrs = entities.players()
                fs.writeFileSync(path.join(dir, configData.playersfile), JSON.stringify(plrs, null, configData.indentamt))
            }
            if (params.saverooms || params.all) {
                let rms = rooms.getRooms()
                fs.writeFileSync(path.join(dir, configData.roomsfile), JSON.stringify(rms, null, configData.indentamt))
            }
            if (params.saveusers || params.all) {
                let urs = users.getUsers()
                fs.writeFileSync(path.join(dir, configData.usersfile), JSON.stringify(urs, null, configData.indentamt))
            }
            if (params.savemobiles || params.all) {
                let mobiles = entities.getMobiles()
                let mobs = {}
                for (let m in mobiles) {
                    mobs[m] = mobiles[m].toJSON()
                }
                fs.writeFileSync(path.join(dir, configData.mobilesfile), JSON.stringify(mobs, null, configData.indentamt))
            }
            if (params.saveareas || params.all) {
                let ars = areas.getAreas()
                let as = {}
                for (let a in ars) {
                    as[a] = ars[a].toJSON()
                }
                fs.writeFileSync(path.join(dir, configData.areasfile), JSON.stringify(ars, null, configData.indentamt))
            }
            if (params.savegrammar || params.all) {
                fs.writeFileSync(path.join(dir, configData.grammarfile), JSON.stringify(grammar.dictionary, null, configData.indentamt))
            }
            if (params.saveroomtemplates || params.all) {
                fs.writeFileSync(path.join(dir, configData.saveRoomTemplates), JSON.stringify(templates.getTemplates(), null, configData.indentamt))
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
            const configData = config.loadConfig()
            let dir = path.join(configData.datafolder)
            if (!fs.existsSync(dir)) {
                reject()
            }

            if (fs.existsSync(path.join(dir, configData.playersfile))) {
                let playerBuf = fs.readFileSync(path.join(dir, configData.playersfile))
                entities.loadPlayers(playerBuf)
            }

            if (fs.existsSync(path.join(dir, configData.roomsfile))) {
                let roomsBuf = fs.readFileSync(path.join(dir, configData.roomsfile))
                rooms.loadRooms(roomsBuf)
            }

            if (fs.existsSync(path.join(dir, configData.usersfile))) {
                let usersBuf = fs.readFileSync(path.join(dir, configData.usersfile))
                users.loadUsers(usersBuf)
            }

            if (fs.existsSync(path.join(dir, configData.mobilesfile))) {
                let mobilesBuf = fs.readFileSync(path.join(dir, configData.mobilesfile))
                entities.loadMobiles(mobilesBuf)
            }

            if (fs.existsSync(path.join(dir, configData.areasfile))) {
                let areasBuf = fs.readFileSync(path.join(dir, configData.areasfile))
                areas.loadAreas(areasBuf)
            }

            if (fs.existsSync(path.join(dir, configData.grammarfile))) {
                let grammarBuf = fs.readFileSync(path.join(dir, configData.grammarfile))
                grammar.loadDictionary(grammarBuf)
            }

            if (fs.existsSync(path.join(dir, configData.saveRoomTemplates))) {
                let templateBuf = fs.readFileSync(path.join(dir, configData.saveRoomTemplates))
                templates.loadRoomTemplates(templateBuf)
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