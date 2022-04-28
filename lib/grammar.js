import { randInt, rooms } from './mudnode.js'

let grammar = {}

const roll = (dice) => {
    dice = dice.toLowerCase();
    if (!dice.includes('d')) {
        throw new Error('At least one term must specify the number of dice.')
    } else {
        let dieterm = dice.split('d')
        let amt = 0
        for (let times = 0; times < dieterm[0]; times++) {
            amt += randInt(1, dieterm[1])
        }
        return amt
    }
}

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
        while(template.includes('[', startPos)) {
            let paramStart = template.indexOf('[', startPos)
            if (paramStart > startPos) {
                tokenMap.push({ start: startPos, end: paramStart, token: null, value: template.substring(startPos, paramStart) })    
            }
            let paramEnd = template.indexOf(']', startPos)
            let token = template.substring(paramStart, paramEnd + 1)
            tokenMap.push({ start: paramStart, end: paramEnd, token: token, value: null })
            startPos = paramEnd + 1
        }
        if (startPos < template.length) {
            tokenMap.push({ start: startPos, end: template.length - 1, token: null, value: template.substring(startPos, template.length)})
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
        if (typeof property === 'object' && ["=", "!=", ">=", "<=", "<", ">"].includes(operator)) {
            if (["=", "!="].includes(operator)) {
                return operator === "=" ? property[operation] === value : property[operation] !== value
            } else if ([">=", "<="].includes(operator)) {
                return operator === ">=" ? property[operation] >= value : property[operation] <= value
            } else if ([">", "<"].includes(operator)) {
                return operator === ">" ? property[operation] > value : property[operation] < value
            }            
        } else if (typeof property === 'number' && ["=", "!=", ">=", "<=", "<", ">"].includes(operator)) {
            if (["=", "!="].includes(operator)) {
                return operator === "=" ? property === value : property !== value
            } else if ([">=", "<="].includes(operator)) {
                return operator === ">=" ? property >= value : property <= value
            } else if ([">", "<"].includes(operator)) {
                return operator === ">" ? property > value : property < value
            }            
        }
    }
    return false
}

const process = (template, context) => {
    if (!template.includes('[')) {
        return {
            'tokenmap': {},
            'sentence': template,
            'sentenceHTML': template
        }
    }
    context = context ? context : {}
    let tokenMap = processTokenMap(parseTokens(template, context), context)
    let sentence = ''
    let sentenceHTML = ''
    let map = tokenMap
    for (let m in map) {
        if (m > 0) {
            let prev = map[m - 1]
            if ((prev.token_type === 'condition' && prev.token_result) || (prev.token_type !== 'condition' && map[m].value)) {
                if (map[m].token) {
                    prev.value = map[m].value
                    sentenceHTML += `<mark title='${m > 0 ? JSON.stringify(prev) : map[m].token}'>${map[m].value}</mark>`
                    sentence += map[m].value
                } else {
                    sentenceHTML += map[m].value
                    sentence += map[m].value
                }
            }
        } else {
            if (map[m].token && map[m].value) {
                sentenceHTML += `<mark title='${map[m].token}'>${map[m].value}</mark>`
                sentence += map[m].value
            } else if (map[m].value) {
                    sentenceHTML += map[m].value
                    sentence += map[m].value
            }
        }
    }
    if (!sentence.includes('[')) {
        return {
            'tokenmap': tokenMap,
            'sentence': sentence,
            'sentenceHTML': sentenceHTML
        }
    } else {
        return process(sentence, context)
    }
}

const processTokenMap = (tokenMap, context) => {
    let activeConditional = -1
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
                    activeConditional = t
                    let id = tokenMap[t].token.substring(2, tokenMap[t].token.length - 1)
                    let paths = id.split('.')

                    let room = null
                    if (context.room) {
                        room = rooms.getRoom(context.room)
                    }

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
                                    tokenMap[t].token_operation = operation
                                    tokenMap[t].token_operator = operator
                                    tokenMap[t].token_compare_to = value
                                    tokenMap[t].token_property = room[contextProperty]
                                    tokenMap[t].token_result = compareOperation(room[contextProperty], operation, operator, value)
                                }
                            }
                        }
                    }
                    else if (paths.length === 1) {
                        // If there's no path, try a die roll notation.
                        let comparison = paths[0]
                        let comp = comparison.search(/[(=)(!=)(<)(>)(>=)(<=)]/)
                        if (comp >= 0) {
                            let operation = comparison.substring(0, comp)
                            let opEnd = comparison.slice(comp).search(/[A-Za-z0-9_-]/)
                            if (opEnd < 0) {
                                opEnd = 1
                            }
                            let operator = comparison.substring(comp, comp + opEnd)
                            let value = parseInt(comparison.substring(comp + 1, comparison.length))
                            let rl = roll(operation)
                            tokenMap[t].die_roll = rl
                            tokenMap[t].token_operation = operation
                            tokenMap[t].token_operator = operator
                            tokenMap[t].token_compare_to = value
                            tokenMap[t].token_property = rl
                            tokenMap[t].token_result = compareOperation(rl, operation, operator, value)
                        }
                    }
                } else if (tokenMap[t].token.toLowerCase() === "[else]") {
                    if (activeConditional >= 0) {
                        tokenMap[t].token_operation = tokenMap[activeConditional].token_operation
                        tokenMap[t].token_operator = tokenMap[activeConditional].token_operator
                        tokenMap[t].token_compare_to = tokenMap[activeConditional].token_compare_to
                        tokenMap[t].token_property = tokenMap[activeConditional].token_property
                        tokenMap[t].token_type = 'condition'
                        tokenMap[t].token_result = !compareOperation(tokenMap[t].token_property, tokenMap[t].token_operation, tokenMap[t].token_operator, tokenMap[t].token_compare_to)
                        activeConditional = -1
                    }
                } else if (tokenMap[t].token.substring(0, 1) === '[') {
                    tokenMap[t].value = tokenMap[t].token.replace('[', '').replace(']', '')
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

export { text, get, set, grammar as dictionary, loadDictionary, setDictionary, parseTokens, processTokenMap, process, roll }