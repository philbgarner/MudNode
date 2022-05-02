(() => {

    const suggestions = document.getElementById("suggestions")
    const template = document.getElementById("template")
    const dKeys = document.getElementById("dKeys")
    const dValues = document.getElementById("dValues")
    const btnAddKey = document.getElementById("addKey")
    const btnRemoveKey = document.getElementById("removeKey")
    const btnProcess = document.getElementById("idprocess")
    const ofield = document.getElementById("ofield")
    const filterKeys = document.getElementById("filterKeys")
    const addRoom = document.getElementById("addRoom")
    const canvas = document.getElementById('canvas');
    const navitems = document.querySelectorAll('#navbar > ul > li[targetEditor]')

    const toggleButtonOpen = document.getElementById("toggleButtonOpen")
    const toggleButton = document.getElementById("toggleButton")
    const tcontainer = document.getElementById("tcontainer")
    const ocontainer = document.getElementById("ocontainer")
    const dcontainer = document.getElementById("dcontainer")
    const ccontainer = document.getElementById("ccontainer")

    toggleButtonOpen.addEventListener('click', (e) => {
        toggleButtonOpen.style.display = 'none'
        toggleButton.style.display = 'flex'
        tcontainer.style.display = 'flex'
        ocontainer.style.display = 'block'
        dcontainer.style.display = 'block'
    })
    toggleButton.addEventListener('click', (e) => {
        toggleButtonOpen.style.display = 'flex'
        toggleButton.style.display = 'none'
        tcontainer.style.display = 'none'
        ocontainer.style.display = 'none'
        dcontainer.style.display = 'none'
    })
    
    toggleButton.click()

    var suggestion = {
        type: '',
        data: []
    }
    var showSuggestion = false
    
    for (let item of navitems) {
        item.addEventListener('click', () => {
            currentNavId = item.getAttribute("targetEditor")
            refreshNavItems()
            item.classList.add('selected-nav')
        })
    }

    const refreshNavItems = () => {
        for (let item of navitems) {
            let el = document.getElementById(item.getAttribute('targetEditor'))
            if (el) {
                el.style.display = el.id === currentNavId ? 'flex' : 'none'
            }
            item.classList.remove('selected-nav')
        }
    }

    const toggleSuggestions = (sugg, turnOff) => {
        suggestions.style.display = 'none'
        return
        // TODO: Until the syntax menu can be fixed let's just disable it for now.

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
            suggestions.innerHTML = `${suggestion.type}<br>${suggestion.data.length > 0 ? suggestion.data.reduce((prev, next) => prev + '<br/>' + next) : ''}`
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
            var range = sel.getRangeAt(0).cloneRange()
            if(range.getClientRects()) {
            range.collapse(true);
            var rect = range.getClientRects()[0]
            if(rect) {
                y = rect.top + window.scrollY
                x = rect.left + window.scrollX
            }
            }
        }
        return {
            x: x,
            y: y
        };
    }

    const getTextSelection = function (editor) {
        const selection = window.getSelection()
    
        if (selection != null && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0)
    
            return {
                start: getTextLength(editor, range.startContainer, range.startOffset),
                end: getTextLength(editor, range.endContainer, range.endOffset),
                range: range
            };
        } else
            return null
    }
    
    const getTextLength = function (parent, node, offset) {
        var textLength = 0;
    
        if (node.nodeName == '#text')
            textLength += offset;
        else for (var i = 0; i < offset; i++)
            textLength += getNodeTextLength(node.childNodes[i])
    
        if (node != parent)
            textLength += getTextLength(parent, node.parentNode, getNodeOffset(node));
    
        return textLength
    }
    
    const getNodeTextLength = function (node) {
        var textLength = 0;
    
        if (node.nodeName == 'BR')
            textLength = 1
        else if (node.nodeName == '#text')
            textLength = node.nodeValue.length;
        else if (node.childNodes != null)
            for (var i = 0; i < node.childNodes.length; i++)
                textLength += getNodeTextLength(node.childNodes[i])
    
        return textLength
    }
    
    const getNodeOffset = function (node) {
        return node == null ? -1 : 1 + getNodeOffset(node.previousSibling);
    }
    
    const getWordAt = (str, pos) => {
        if (str.length === 0 || pos < 0) {
            return ''
        }

        // Perform type conversions.
        str = String(str);
        pos = Number(pos) >>> 0;
    
        // Search for the word's beginning and end.
        var left = 0
        if (pos > 0) {
            for (let p = pos; p >= 0; p--) {
                if (str[p] === '[') {
                    left = p
                    break
                } else if (str[p] === ']') {
                    return ''
                }
            }
        }

        var right = str.indexOf(']', left) + 1
    
        // The last word in the string is a special case.
        if (right < 0) {
            return str.slice(left)
        }
    
        // Return the word, using the located bounds to extract it from the string.
        return str.slice(left, right === 0 ? pos + 1 : right)
    
    }

    const handleSelectionChange = function () {
        if (isEditor(document.activeElement)) {
            const textSelection = getTextSelection(document.activeElement);
            if (textSelection != null) {
                const text = document.activeElement.innerText;
                const selection = text.slice(textSelection.start, textSelection.end);
                const prevChar = text.slice(textSelection.start - 1, textSelection.start)
                const word = getWordAt(text, textSelection.start - 1)
                if (prevChar === '[') {
                    toggleSuggestions({ type: 'Token Types:', data: ['* = Key Search', '? = Condition'] }, false)
                } else if (word.includes('[*') && !word.includes(']')) {
                    let lookup = word.slice(2)
                    filterKeys.value = lookup
                    refreshKeys()
                    lookup += dictionary[lookup] ? ' found.' : ' <span style="color: #f00">not found</span>.'
                    toggleSuggestions({ type: 'Key Search:', data: [lookup] }, false)
                } else if (word.includes('[?') && !word.includes(']')) {
                    let lookup = word.slice(2)
                    let contextlist = ['room', 'area', 'world']
                    let flist = []
                    let ctype = 'Condition Contexts:'
                    if (!lookup.includes('.')) {
                        for (let c in contextlist) {
                            if (lookup === '') {
                                flist.push(contextlist[c])
                            } else if (contextlist[c].includes(lookup)) {
                                flist.push(contextlist[c])
                            }
                        }
                        if (flist.length === 1) {
                            ctype = 'Context: ' + flist[0] + '.'
                        }
                    } else {
                        let contextPath = lookup.split('.')
                        let operations = {
                            'is': ['=', '<', '>', '>=', '<=', '!='],
                            'count': ['=', '<', '>', '>=', '<=', '!='],
                            'has': ['='],
                            'between': ['=']
                        }
                        if (contextPath.length === 2) {
                            ctype = 'Context: ' + contextPath[0] + '.' + contextPath[1]
                            let paths = {
                                'room': ['name', 'location', 'props', 'components', 'entities'],
                                'area': ['name', 'props'],
                                'world': ['date', 'time', 'season', 'day', 'month', 'year', 'ordinalday']
                            }
                            for (let c in paths[contextPath[0]]) {
                                let path = paths[contextPath[0]][c]
                                if (lookup === '') {
                                    flist.push(path)
                                } else if (path.includes(contextPath[1])) {
                                    flist.push(path)
                                }
                            }
                            if (flist.length === 1) {
                                ctype = 'Context: ' + contextPath[0] + '.' + flist[0] + '.'
                            }
                        } else if (contextPath.length === 3) {
                            ctype = 'Context: ' + contextPath[0] + '.' + contextPath[1] + '.' + contextPath[2]
                            let actions = {
                                'name': ['is'],
                                'location': ['is'],
                                'props': ['count', 'has'],
                                'components': ['count', 'has'],
                                'entities': ['count', 'has'],
                                'date': ['is', 'between'],
                                'time': ['is', 'between'],
                                'season': ['is', 'between'],
                                'day': ['is', 'between'],
                                'month': ['is', 'between'],
                                'year': ['is', 'between'],
                                'ordinalday': ['is', 'between'],
                            }
                            for (let c in actions[contextPath[1]]) {
                                let path = actions[contextPath[1]][c]
                                let lookup = contextPath[2]
                                if (lookup === '') {
                                    flist.push(path)
                                } else if (path.includes(lookup)) {
                                    flist.push(path)
                                }
                            }
                            if (flist.length === 1) {
                                ctype = 'Context: ' + contextPath[0] + '.' + contextPath[1] + '.' + flist[0]
                                let lookup = flist[0]
                                flist = []
                                for (let o in operations[lookup]) {
                                    flist.push(lookup + operations[lookup][o])
                                }
                            }
                            let index = lookup.search(/[(=)(!=)(<)(>)]/)
                            if (index >= 0) {
                                ctype = 'Context: ' + contextPath[0] + '.' + contextPath[1] + '.' + lookup
                                flist = ['Comparison value.']
                            }
                        }
                    }
                    toggleSuggestions({ type: ctype, data: flist }, false)
                } else if (word.includes(']')) {
                    let lookup = word.slice(2, word.length - 1)
                    filterKeys.value = lookup
                    refreshKeys()
                    let keys = Object.keys(dictionary)
                    lookup += keys.filter(f => dictionary[f].includes(lookup)) ? ' found.' : ' <span style="color: #f00">not found</span>.'
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

    const currentValue = () => {
        let vals = document.getElementsByClassName('selected-value')
        if (vals.length === 1) {
            return vals[0]
        }
        return null
    }

    const saveDictionary = () => {
        return fetch('http://localhost:8080/api/dictionary', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ dictionary: dictionary }) })
    }

    const refreshKeys = (selected) => {
        selectedKey = selected ? selected : selectedKey
        let keys = Object.keys(dictionary)
        dKeys.innerHTML = ''
        for (let k in keys) {
            let key
            key = document.createElement('li')
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
                selectedKey = currentKey()

                refreshValues(selected, 0)                
            })
            if (filterKeys.value.length > 0 && key.innerText.includes(filterKeys.value)) {
                dKeys.appendChild(key)
            } else if (filterKeys.value.length === 0) {
                dKeys.appendChild(key)
            }
        }

        if (currentKey()) {
            currentKey().dispatchEvent(new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
          }))
        }
    }

    const refreshValues = (key, index) => {
        selectedKey = key ? key : selectedKey
        selected = selectedKey.innerText
        dValues.innerHTML = ''
        if (selectedKey.length === 0) {
            return
        }
        let selEl = null
        for (let v in dictionary[selected]) {
            let el = addKeyValueEl(dictionary[selected][v], (e) => {
                dictionary[selected][v] = e.target.innerText.slice(-1) === '\n' ? e.target.innerText.slice(0, e.target.innerText.length - 1) : e.target.innerText
            },
            (val) => {
                dictionary[selected][v] = val.target.innerText.slice(-1) === '\n' ? val.target.innerText.slice(0, val.target.innerText.length - 1) : val.target.innerText
                saveDictionary().catch(e => {
                    console.log(`Error editing value for key '${keys[selected]}', revering to '${val.target.getAttribute('oldval')}'.`, e)
                    dictionary[selected][v] = val.target.getAttribute('oldval')
                    val.target.innerText = val.target.getAttribute('oldval')
                    e.target.removeAttribute('oldval')
                }).then(e => {
                    if (!e.ok) {
                        console.log(`Error editing value for key '${keys[selected]}', revering to '${val.target.getAttribute('oldval')}'.`, e)
                        val.target.innerText = val.target.getAttribute('oldval')
                        dictionary[selected][v] = val.target.getAttribute('oldval')
                    }
                    val.target.removeAttribute('oldval')
                })
            })
            if (index === parseInt(v)) {
                selEl = el
            }
        }
        let addValue = document.createElement('input')
        addValue.type = 'button'
        addValue.value = 'Add'
        addValue.title = `Add new potential value to the array stored in dictionary key "${selected}".`
        
        let removeValue = document.createElement('input')
        removeValue.type = 'button'
        removeValue.value = 'Remove'
        removeValue.title - `Remove selected value from the array for dictionary key "${selected}".`

        removeValue.addEventListener('click', () => {
            for (var c in dValues.children) {
                let child = dValues.children[c]
                if (child.nodeName === 'LI') {
                    if (child.childNodes[0].classList.contains('selected-value')) {
                        console.log('deleting', c, dictionary[selected])
                        dictionary[selected] = [...dictionary[selected].slice(0, c), ...dictionary[selected].slice(c + 1)]
                        console.log('deleted', c, dictionary[selected])
                        c--;
                        if (c < 0) {
                            c = 0
                        }
                        break;
                    }
                }
            }
            refreshValues(currentKey(), c) 
        })

        addValue.addEventListener('click', () => {
            let newIndex = dictionary[selected].length
            dictionary[selected][newIndex] = ''
            refreshValues(currentKey(), newIndex)
        })

        if (selEl) {
            selEl.focus()
        }
        dValues.appendChild(addValue)
        dValues.appendChild(removeValue)
    }

    const addKeyValueEl = (text, onChange, onBlur) => {
        let val = document.createElement('li')
        let p = document.createElement('p')
        p.addEventListener('input', (e) => onChange(e))
        if (onBlur) {
            p.addEventListener('blur', (e) => onBlur(e))
            p.addEventListener('focus', (e) => {
                let val = currentValue()
                if (val) {
                    val.classList.remove('selected-value')
                }
                e.target.setAttribute('oldval', p.innerText)
                e.target.classList.add('selected-value')
            })
        }
        p.contentEditable = true
        p.innerText = text
        p.classList.add('editor')
        val.appendChild(p)
        dValues.appendChild(val)
        return p
    }

    const refreshDictionary = (selected) => {        
        refreshKeys(selected)
    }

    btnRemoveKey.addEventListener('click', () => {
        let key = currentKey().innerText
        if (key) {
            dictionary[key] = undefined
            delete dictionary[key]
            saveDictionary().catch(e => {
                console.log('Error: ', e)
            }).then((response) => {
                refreshKeys()
                dValues.innerHTML = ''
            })            
        }
    })

    btnAddKey.addEventListener('click', () => {
        let key = prompt('New Dictionary Key:', '')
        if (key) {
            dictionary[key] = ['']
            saveDictionary().catch(e => {
                console.log('Error: ', e)
            }).then((response) => {
                //refreshDictionary(key)
                refreshKeys(key)
            })            
        }
    })

    filterKeys.addEventListener('input', (e) => {
        selectedKey = ''
        refreshKeys()
        refreshValues()
    })

    btnProcess.addEventListener('click', () => {
        fetch('http://localhost:8080/api/process', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ 
                template: template.innerText,
                context: {
                    room: currentRoom() ? selectedRoom : null
                }
            })}).then((response) => {
            response.json().then((v) => {
                ofield.innerHTML = v.sentenceHTML
            })
        })
    })

    document.addEventListener('selectionchange', handleSelectionChange)
    window.addEventListener('resize', (e) => {
        canvas.width = canvas.clientWidth
        canvas.height = canvas.clientHeight
        drawAllRooms()
        drawGrid()
    })

    addRoom.addEventListener('click', (e) => {
        let roomTemplate = cloneNode(document.getElementById("room_template"))
        if (!roomTemplate.value) {
            return false
        }
        let data = roomtemplateslist[selectedTemplate]
        data.templateid = selectedTemplate
        data.location = { x: selectedCell.x, y: 0, z: selectedCell.y }
        fetch('http://localhost:8080/api/room', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
        .then((response) => {
            if (response.ok) {
                return response.json()
            } else {
                return response.json().then(v => Promise.reject(v.message))
            }
        })
        .then((data) => {
            selectedRoom = data.uuid
            roomslist[data.uuid] = data
            drawRoom(roomslist[data.uuid])
            refreshRoom(data.uuid)
            drawRoomSelection()
        })
        .catch((e) => {
            alert(e)
        })
    })

    // Hook up hide/show toggle behaviour on any property container header elements.
    const customProps = document.getElementsByClassName("property-container-header")
    for (let c in customProps) {
        if (customProps[c].nodeType === 1) {
            customProps[c].setAttribute('targetDisplay', customProps[c].style.display)
            customProps[c].setAttribute('text', customProps[c].innerText)
            if (customProps[c].getAttribute("open") === "true") {
                customProps[c].innerText = '▼ ' + customProps[c].getAttribute('text')
            } else {
                customProps[c].innerText = '► ' + customProps[c].getAttribute('text')
            }
            let el = document.getElementById(customProps[c].getAttribute("targetContainer"))
            if (el) {
                customProps[c].setAttribute('targetDisplay', el.style.display)
                customProps[c].addEventListener('click', (e) => {
                    if (customProps[c].getAttribute("open") === "true") {
                        customProps[c].setAttribute("open", false)
                        el.style.display = 'none'
                        customProps[c].innerText = '► ' + customProps[c].getAttribute('text')
                    } else {
                        customProps[c].setAttribute("open", true)
                        el.style.display = customProps[c].getAttribute('targetDisplay')
                        customProps[c].innerText = '▼ ' + customProps[c].getAttribute('text')
                    }
                })
            }
        }
    }

    // Load initial rooms list.
    fetch('http://localhost:8080/api/rooms', { method: 'POST', headers: { 'Content-Type': 'application/json' } })
    .then((response) => {
        if (!response.ok) {
            return Promise.reject(response)
        } else {
            return response.json()
        }
    })
    .catch((response) => {
        response.text().then(error => {
            const errorEl = document.getElementById("error")
            errorEl.innerText += `Error on ${response.url}:\n` + error + '\n'
            errorEl.style.display = 'block'
        })
    })
    .then((data) => {
        roomslist = data
        drawAllRooms()
    })

    // Mobile templates list.
    fetch('http://localhost:8080/api/mobiles', { method: 'POST', headers: { 'Content-Type': 'application/json' } })
    .then((response) => {
        if (!response.ok) {
            return Promise.reject(response)
        } else {
            return response.json()
        }
    })
    .catch((response) => {
        response.text().then(error => {
            const errorEl = document.getElementById("error")
            errorEl.innerText += `Error on ${response.url}:\n` + error + '\n'
            errorEl.style.display = 'block'
        })
    })
    .then((data) => {
        mobslist = data
    })

    // Load initial dictionary data.
    fetch('http://localhost:8080/api/dictionary', { method: 'POST', headers: { 'Content-Type': 'application/json' } })
    .then((response) => {
        if (!response.ok) {
            return Promise.reject(response)
        } else {
            return response.json()
        }
    })
    .catch((response) => {
        response.text().then(error => {
            const errorEl = document.getElementById("error")
            errorEl.innerText += `Error on ${response.url}:\n` + error + '\n'
            errorEl.style.display = 'block'
        })
    })
    .then((data) => {
        dictionary = data
        refreshDictionary()
    })

    // Load room templates list
    fetch('http://localhost:8080/api/rooms/templates', { method: 'POST', headers: { 'Content-Type': 'application/json' } })
    .then((response) => {
        if (!response.ok) {
            return Promise.reject(response)
        } else {
            return response.json()
        }
    })
    .catch((response) => {
        response.text().then(error => {
            const errorEl = document.getElementById("error")
            errorEl.innerText += `Error on ${response.url}:\n` + error + '\n'
            errorEl.style.display = 'block'
        })
    })
    .then((data) => {
        roomtemplateslist = data
        let keys = Object.keys(data)
        setupRoomTemplateFields(data[keys[0]])
        setupRoomEditorFields()
    })

    //setupRoomTemplateFields(selectedTemplate)

    refreshNavItems()

})()