const fs = require('fs')

const { config } = JSON.parse(fs.readFileSync('./config.json'))

export default  config
