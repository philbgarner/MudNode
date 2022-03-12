import { randInt } from './mudnode.js'

let grammar = {}

/**
 * The value for the key specified as the id parameter. Value is either an array of strings or a string reference to an array of strings.
 * @param {string} id 
 * @returns {string|array}
 */
const get = (id) => {
    id = id.replace('[*', '').replace(']', '')
    let item = grammar[id]
    if (item) {
        if (typeof item === 'string') {
            return item
        } else if (typeof item === 'object') {
            return item[randInt(0, item.length - 1)]
        }
    }
    return `[not found:${id}]`
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
 * Get the generated text of the specified template text.
 * @param {string} template Template text to generate from the grammar. 
 * @returns {string} Evaluated text result.
 */
const text = (template) => {
    let sentence = []
    // If there are any links to process in this template.
    if (template.includes('[*')) {
        let startPos = 0
        let paramStart = 0
        let paramEnd = template.indexOf('[*')
        while(template.includes('[*', startPos)) {
            paramStart = template.indexOf('[*', startPos)
            paramEnd = template.indexOf(']', startPos)
            sentence.push(template.substring(startPos, paramStart))
            let id = template.substring(paramStart, paramEnd + 1)
            if (id !== template) {
                sentence.push(text(id))
            } else {
                sentence.push(get(id))
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

export { text, get, set, grammar as dictionary }