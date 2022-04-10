import { randInt, rooms } from './mudnode.js'

let grammar = {}

/**
 * The value for the key specified as the id parameter. Value is either an array of strings or a string reference to an array of strings.
 * @param {string} id 
 * @returns {string|array} Returns either the value of the key matching 'id', or an empty string.
 */
const get = (id) => {
    if (!id) {
        return ''
    }
    if (typeof id === 'string') {
        id = id.replace('[*', '').replace(']', '')
    }
    let item = grammar[id]
    if (item) {
        if (typeof item === 'string') {
            return item
        } else if (typeof item === 'object') {
            return item[randInt(0, item.length - 1)]
        }
    }
    return id //`[not found:${id}]`
}

/**
 * Set the value for the key specified as the id parameter. Value is either an array of strings or a string reference to an array of strings.
 * @param {string} id 
 * @param {string|array} value 
 */
const set = (id, value) => {
    grammar[id] = value
}

/**
 * Processes any operators on the text about to be added to the sentence chain.
 * @param {string} txt 
 * @param {string} operator 
 * @returns 
 */
const operatorText = (txt, operator) => {
    if (operator === 'capital') {
        txt = txt.charAt(0).toUpperCase() + txt.slice(1)
    }
    return txt
}

const parseTokens = (template, context) => {
    if (template.includes('[')) {
        let startPos = 0
        let tokenMap = []
        if (template.indexOf('[', 0) > 0) {
            tokenMap.push({ start: 0, end: template.indexOf('[', startPos - 1), token: null, value: template.substring(0, template.indexOf('[', startPos - 1))})
        }
        while(template.includes('[', startPos)) {
            let paramStart = template.indexOf('[', startPos)
            let paramEnd = template.indexOf(']', startPos)
            let token = template.substring(paramStart, paramEnd + 1)
            tokenMap.push({ start: paramStart, end: paramEnd, token: token, value: null })
            startPos = paramEnd + 1
        }
        if (startPos < template.length) {
            tokenMap.push({ start: startPos, end: template.length - 1, token: null, value: template.substring(startPos, template.length - 1)})
        }
        return tokenMap
    } else {
        return [template]
    }
}

const compareOperation = (property, operation, operator, value) => {
    if (operation === "is") {
        if (operator === '=') {
            return property === value
        }
    } else if (operation === "has") {
        if (operator === "=") {
            return property[value] !== undefined
        }
    } else {
        if (operator === "=") {
            return property[operation] === value
        }
    }
    return false
}

const processTokenMap = (tokenMap, context) => {
    for (let t in tokenMap) {
        if (tokenMap[t].value === null) {
            if (tokenMap[t].token) {
                if (tokenMap[t].token.substring(0, 2) === '[*') {
                    tokenMap[t].token_type = 'lookup'
                    let id = tokenMap[t].token.substring(2, tokenMap[t].token.length - 1)
                    if (!id.includes('[')) {
                        tokenMap[t].value = get(id)
                    }
                } else if (tokenMap[t].token.substring(0, 2) === '[?') {
                    tokenMap[t].token_type = 'condition'
                    let id = tokenMap[t].token.substring(2, tokenMap[t].token.length - 1)
                    let paths = id.split('.')

                    let room = null
                    if (context.room) {
                        room = rooms.getRoom(context.room)
                    }
                    console.log(context)

                    if (paths.length === 3) {
                        let contextName = paths[0]
                        let contextProperty = paths[1]
                        let comparison = paths[2]

                        if (contextName === 'room' && room) {
                            if (room[contextProperty]) {
                                let comp = comparison.search(/[(=)(!=)(<)(>)(>=)(<=)]/)
                                if (comp >= 0) {
                                    let operation = comparison.substring(0, comp)
                                    let opEnd = comparison.slice(comp).search(/[A-Za-z0-9_-]/)
                                    if (opEnd < 0) {
                                        opEnd = 1
                                    }
                                    let operator = comparison.substring(comp, comp + opEnd)
                                    let value = comparison.substring(comp + 1, comparison.length)
                                    // console.log(`operation='${operation}' operator='${operator}' value='${value}' property='${room[contextProperty]}'`)
                                    // console.log('>', compareOperation(room[contextProperty], operation, operator, value))
                                    tokenMap[t].token_result = compareOperation(room[contextProperty], operation, operator, value)
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return tokenMap
}

/**
 * Get the generated text of the specified template text.
 * @param {string} template Template text to generate from the dictionary.
 * @param {object} context JSON containing the list of contexts and their objects to execute under.
 * @returns {string} Evaluated text result.
 */
const text = (template, context) => {
    let sentence = []
    let startPos = 0
    // If there are any tokens to process in this template.
    if (template.includes('[')) {
        let paramStart = 0
        let paramEnd = template.indexOf('[')
        while(template.includes('[', startPos)) {
            paramStart = template.indexOf('[', startPos)
            paramEnd = template.indexOf(']', startPos)
            //sentence.push(template.substring(startPos, paramStart))
            let id = template.substring(paramStart, paramEnd + 1)
            
            let operator
            if (id.includes('.')) {
                let parts = id.split('.')
                id = parts[0] + ']'
                operator = parts[1].toLowerCase().substring(0, parts[1].length - 1)
            }
            if (id !== template) {
                let txt = text(id)
                sentence.push(txt)
            } else {
                let txt = get(id)
                sentence.push(txt)
            }
            startPos = paramEnd + 1
        }
        if (startPos < template.length) {
            sentence.push(template.substring(startPos, template.length))
        }
    } else {
        let id = get(template)
        return id ? id : `[not found:${id}]` 
    }
    console.log('sentence', sentence)

    let ret = sentence.reduce((prev, next) => prev + next)
    return ret.includes('[*') ? text(ret) : ret
}

/**
 * Sets the whole dictionary object to the json parameter.
 * @param {object} json 
 */
const setDictionary = (json) => {
    grammar = json
}

/**
 * Loads the dictionary from a file buffer.
 * @param {buffer} buffer 
 */
const loadDictionary = (buffer) => {
    grammar = JSON.parse(buffer.toString())
}

export { text, get, set, grammar as dictionary, loadDictionary, setDictionary, parseTokens, processTokenMap }