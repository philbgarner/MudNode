import fs from 'fs'

function loadConfig() { return JSON.parse(fs.readFileSync('./lib/config.json')) }

export { loadConfig }
export default { loadConfig: loadConfig }