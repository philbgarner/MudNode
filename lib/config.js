import fs from 'fs'

const config = JSON.parse(fs.readFileSync('./lib/config.json'))

export default config
