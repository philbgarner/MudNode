const fs = require('fs')

module.exports.saveJSON = function (filename, object) {
    let data = JSON.stringify(object, null, 0)

    fs.writeFile(filename, data, (e) => {
        if (e) throw e

        // TODO: Send to all players 'saved' message.
        console.log('Saved data to ', filename)
    })
}