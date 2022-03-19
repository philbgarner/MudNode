(() => {
    const suggestions = document.getElementById("suggestions")
    const dKeys = document.getElementById("dKeys")
    const dValues = document.getElementById("dValues")
    const btnAddKey = document.getElementById("addKey")
    
    var selectedKey = ''

    var dictionary = {}

    var suggestion = {
        type: '',
        data: []
    }
    var showSuggestion = false

    const toggleSuggestions = (sugg, turnOff) => {
        suggestion = sugg
        if (turnOff !== undefined) {
            showSuggestion = turnOff
        }
        if (!showSuggestion) {
            let loc = getCaretLocation()
            loc.y += 16
            suggestions.style.left = (loc.x).toFixed(2) + 'px'
            suggestions.style.top = (loc.y).toFixed(2) + `px`
            suggestions.style.display = 'block'
            suggestions.innerHTML = `${suggestion.type}<br>${suggestion.data.reduce((prev, next) => prev + '<br/>' + next)}`
            showSuggestion = true
        } else {
            suggestion.type = ''
            suggestions.style.display = 'none'
            showSuggestion = false
        }
    }

    const getCaretLocation = () => {
        var x = 0;
        var y = 0;
        var sel = window.getSelection();
        if(sel.rangeCount) {
            var range = sel.getRangeAt(0).cloneRange();
            if(range.getClientRects()) {
            range.collapse(true);
            var rect = range.getClientRects()[0];
            if(rect) {
                y = rect.top;
                x = rect.left;
            }
            }
        }
        return {
            x: x,
            y: y
        };
    }

    var editor = null;
    var output = null;
    
    const getTextSelection = function (editor) {
        const selection = window.getSelection();
    
        if (selection != null && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
    
            return {
                start: getTextLength(editor, range.startContainer, range.startOffset),
                end: getTextLength(editor, range.endContainer, range.endOffset)
            };
        } else
            return null;
    }
    
    const getTextLength = function (parent, node, offset) {
        var textLength = 0;
    
        if (node.nodeName == '#text')
            textLength += offset;
        else for (var i = 0; i < offset; i++)
            textLength += getNodeTextLength(node.childNodes[i]);
    
        if (node != parent)
            textLength += getTextLength(parent, node.parentNode, getNodeOffset(node));
    
        return textLength;
    }
    
    const getNodeTextLength = function (node) {
        var textLength = 0;
    
        if (node.nodeName == 'BR')
            textLength = 1;
        else if (node.nodeName == '#text')
            textLength = node.nodeValue.length;
        else if (node.childNodes != null)
            for (var i = 0; i < node.childNodes.length; i++)
                textLength += getNodeTextLength(node.childNodes[i]);
    
        return textLength;
    }
    
    const getNodeOffset = function (node) {
        return node == null ? -1 : 1 + getNodeOffset(node.previousSibling);
    }
    
    const getWordAt = (str, pos) => {
        if (str.length === 0) {
            return ''
        }

        // Perform type conversions.
        str = String(str);
        pos = Number(pos) >>> 0;
    
        // Search for the word's beginning and end.
        var left = 0
        for (let p = pos; p >= 0; p--) {
            if (str[p] === '[') {
                left = p
                break
            } else if (str[p] === ']') {
                return ''
            }
        }

        var right = str.indexOf(']', left) + 1
    
        // The last word in the string is a special case.
        if (right < 0) {
            return str.slice(left);
        }
    
        // Return the word, using the located bounds to extract it from the string.
        return str.slice(left, right === 0 ? pos + 1 : right);
    
    }

    const handleSelectionChange = function () {
        if (isEditor(document.activeElement)) {
            const textSelection = getTextSelection(document.activeElement);
            if (textSelection != null) {
                const text = document.activeElement.innerText;
                const selection = text.slice(textSelection.start, textSelection.end);
                const prevChar = text.slice(textSelection.start - 1, textSelection.start)
                const word = getWordAt(text, textSelection.start - 1)
                console.log('>', word)
                if (prevChar === '[') {
                    toggleSuggestions({ type: 'Token Types:', data: ['* = Key Search', '? = Condition'] }, false)
                } else if (word.includes('[*') && !word.includes(']')) {
                    let lookup = word.slice(2)
                    lookup += dictionary[lookup] ? ' found.' : ' <span style="color: #f00">not found</span>.'
                    toggleSuggestions({ type: 'Key Search:', data: [lookup] }, false)
                } else if (word.includes(']')) {
                    let lookup = word.slice(2, word.length - 1)
                    lookup += dictionary[lookup] ? ' found.' : ' <span style="color: #f00">not found</span>.'
                    toggleSuggestions({ type: 'Key Search:', data: [lookup] }, false)
                }
                else {
                    toggleSuggestions({ }, true)
                }
            }
        }
    }
    
    const isEditor = function (element) {
        return element != null && element.classList.contains('editor');
    }

    const currentKey = () => {
        let keys = document.getElementsByClassName('selected-key')
        if (keys.length === 1) {
            return keys[0]
        }
        return null
    }

    const refreshDictionary = () => {

        const addKeyValueEl = (text, onChange) => {
            let val = document.createElement('li')
            let p = document.createElement('p')
            p.addEventListener('input', (e) => onChange(e))
            p.contentEditable = true
            p.innerText = text
            val.appendChild(p)
            dValues.appendChild(val)
        }

        dKeys.innerHTML = ''
        let keys = Object.keys(dictionary)
        for (let k in keys) {
            let key = document.createElement('li')
            key.innerText = keys[k]
            if (key.innerText === selectedKey) {
                key.classList.add('selected-key')
            }
            key.addEventListener('click', () => {
                selectedKey = currentKey()
                if (selectedKey) {
                    selectedKey.classList.remove('selected-key')
                }
                key.classList.add('selected-key')
                dValues.innerHTML = ''
                for (let v in dictionary[keys[k]]) {
                    addKeyValueEl(dictionary[keys[k]][v], (e) => dictionary[keys[k]][v] = e.target.innerText)
                }
                let addValue = document.createElement('input')
                addValue.type = 'button'
                addValue.value = '+'
                addValue.title = `Add new potential value to the array stored in dictionary key "${keys[k]}".`
                addValue.addEventListener('click', () => {
                    let newIndex = dictionary[keys[k]].length
                    dictionary[keys[k]][newIndex] = ''
                    addKeyValueEl('', (e) => dictionary[keys[k]][newIndex] = e.target.innerText)
                    dValues.appendChild(addValue)
                })
                dValues.appendChild(addValue)
            })
            dKeys.appendChild(key)
        }
    }

    editor = document.querySelector('.editor');

    btnAddKey.addEventListener('click', () => {
        let key = prompt('New Dictionary Key:', '')
        if (key) {
            dictionary[key] = [key]
            refreshDictionary()
        }
    })

    document.addEventListener('selectionchange', handleSelectionChange);    
    fetch('http://localhost:8080/dictionary', { method: 'POST' }).then((response) => {
        return response.json()
    }).then((data) => dictionary = data)
})()