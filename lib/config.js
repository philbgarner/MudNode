import fs from 'fs'

const loadConfig = () => { return JSON.parse(fs.readFileSync('./lib/config.json')) }

export { loadConfig }
export default { loadConfig: loadConfig }