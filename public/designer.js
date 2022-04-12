(() => {

    const suggestions = document.getElementById("suggestions")
    const dKeys = document.getElementById("dKeys")
    const dValues = document.getElementById("dValues")
    const btnAddKey = document.getElementById("addKey")
    const btnRemoveKey = document.getElementById("removeKey")
    const btnProcess = document.getElementById("idprocess")
    const ofield = document.getElementById("ofield")
    const filterKeys = document.getElementById("filterKeys")
    const rcontainer = document.getElementById("rcontainer")
    const addRoom = document.getElementById("addRoom")
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const navitems = document.querySelectorAll('#navbar > ul > li[targetEditor]')

    const toggleButtonOpen = document.getElementById("toggleButtonOpen")
    const toggleButton = document.getElementById("toggleButton")
    const tcontainer = document.getElementById("tcontainer")
    const ocontainer = document.getElementById("ocontainer")
    const dcontainer = document.getElementById("dcontainer")
    const ccontainer = document.getElementById("ccontainer")
    const propertyContainer = document.getElementById("property_container")

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

    var mapScale = 10
    var selectedProp = null

    var selectedKey = ''
    var selectedRoom = ''
    var selectedCell = { selected: false, x: 0, y: 0 }
    var currentNavId = document.getElementsByClassName('selected-nav')[0].getAttribute('targetEditor')

    var dictionary = {}
    var roomslist = {}

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

    const currentRoom = () => {
        return roomslist[selectedRoom] ? roomslist[selectedRoom] : null
    }

    const saveDictionary = () => {
        return fetch('http://localhost:8080/dictionary', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ dictionary: dictionary }) })
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
        fetch('http://localhost:8080/process', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ 
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

    const drawGrid = () => {
        ctx.beginPath()
        for (let j = 0; j < canvas.clientHeight; j += mapScale) {
            for (let i = 0; i < canvas.clientWidth; i += mapScale) {
                ctx.strokeStyle = '#515151'
                ctx.setLineDash([1, 2])
                ctx.rect(i, j, mapScale, mapScale)
            }
        }
        ctx.stroke()
    }

    const drawRoom = (room) => {
        let curRoom = currentRoom()
        if (room) {
            // Draw on canvas.
            ctx.beginPath()
            let x = room.location.x * mapScale
            let z = room.location.z * mapScale
            ctx.fillStyle = room.colour
            ctx.lineWidth = 1
            if (curRoom && curRoom.uuid === room.uuid) {
                ctx.strokeStyle = '#b1ffb1'
            } else {
                ctx.strokeStyle = '#f1f1f1'
            }
            ctx.clearRect(x, z, mapScale, mapScale)
            ctx.rect(x, z, mapScale, mapScale)
            ctx.fill()
            //ctx.stroke()
        }
    }

    const drawRoomSelection = () => {
        ctx.beginPath()
        ctx.strokeStyle = selectedCell.selected ? '#f1f1f1' : '#515151'
        ctx.lineWidth = 2
        ctx.rect(selectedCell.x * mapScale, selectedCell.y * mapScale, mapScale, mapScale)
        ctx.stroke()
    }

    const drawAllRooms = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        
        for (let r in roomslist) {
            drawRoom(roomslist[r])
        }

        drawRoomSelection()
        drawGrid()
    }
    
    /**
     * Refreshes the user interface for the room panel.
     * @param {string} uuid The room's uuid.
     * @returns 
     */
    const refreshRoom = (selected) => {
        selectedRoom = selected ? selected : selectedRoom

        let room = currentRoom()
        setupRoomEditorFields(room)
        if (room) {
            rcontainer.querySelector('#room_id').innerText = room.uuid
            rcontainer.querySelector('#room_name').innerText = room.name
            rcontainer.querySelector('#room_description').innerText = room.description
            rcontainer.querySelector('#room_location').innerText = JSON.stringify(room.location)
            rcontainer.querySelector('#room_colour').value = room.colour
        } else {
            rcontainer.querySelector('#room_id').innerText = ''
            rcontainer.querySelector('#room_name').innerText = ''
            rcontainer.querySelector('#room_description').innerText = ''
            rcontainer.querySelector('#room_location').innerText = ''
            rcontainer.querySelector('#room_colour').value = '#a0a0a0'
        }
    }

    const findRoomAt = (x, y, z) => {
        for (let r in roomslist) {
            if (roomslist[r].location.x === x && roomslist[r].location.y === y && roomslist[r].location.z === z) {
                return roomslist[r]
            }
        }
        return null
    }

    document.addEventListener('selectionchange', handleSelectionChange)
    window.addEventListener('resize', (e) => {
        canvas.width = canvas.clientWidth
        canvas.height = canvas.clientHeight
        drawAllRooms()
        drawGrid()
    })

    const getMouseX = (e) => {
        return e.clientX - e.target.offsetLeft + window.scrollX
    }

    const getMouseY = (e) => {
        return e.clientY - e.target.offsetTop + window.scrollY
    }

    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight

    canvas.addEventListener('mousemove', (e) => {
        ctx.scale(1, 1)
        let cellx = Math.floor(getMouseX(e) / mapScale)
        let celly = Math.floor(getMouseY(e) / mapScale)
        document.getElementById("status").innerText = `Client X/Y: ${cellx}, ${celly} Sel X/Y: ${selectedCell.x}, ${selectedCell.y}`
    })

    canvas.addEventListener('click', (e) => {
        let cellx = Math.floor(getMouseX(e) / mapScale)
        let celly = Math.floor(getMouseY(e) / mapScale)
        selectedCell.selected = false
        drawRoomSelection()
        selectedCell = { selected: true, x: cellx, y: celly }
        let room = findRoomAt(cellx, 0, celly)
        if (room) {
            selectedRoom = room.uuid
        } else {
            selectedRoom = ''
        }
        refreshRoom()
        drawRoomSelection()
    })

    addRoom.addEventListener('click', (e) => {
        fetch('http://localhost:8080/room', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: { x: selectedCell.x, y: 0, z: selectedCell.y } }) })
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

    const cloneNode = (node) => {
        let old_element = node;
        let new_element = old_element.cloneNode(true);
        old_element.parentNode.replaceChild(new_element, old_element);
        return new_element
    }

    function setupRoomExitField(room, el) {
        if (el.getAttribute('nonExistant')) {
            el.removeAttribute('nonExistant')
        }
        if (el.getAttribute('useExit')) {
            el.removeAttribute('useExit')
        }

        if (room.exits[el.innerText]) {
            let exitRoom = roomslist[room.exits[el.innerText]]
            if (!exitRoom) {
                el.setAttribute('nonExistant', true)
            } else {
                el.setAttribute('useExit', true)
            }
        }
    }
    
    function setupRoomEditorFields(room) {
        if (!room) {
            return
        }
        const roomExits = document.getElementById('room_exits')

        let ret = {
            id: document.getElementById('room_id'),
            name: cloneNode(document.getElementById('room_name')),
            description: cloneNode(document.getElementById('room_description')),
            roomExits: roomExits,
            colour: cloneNode(document.getElementById('room_colour')),
            newProperty: cloneNode(document.getElementById('new_property')),
            deleteProperty: cloneNode(document.getElementById('delete_property'))
        }
        
        const updateFields = (targetRoom) => {
            targetRoom = targetRoom ? targetRoom : room
            return fetch('http://localhost:8080/room', { method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                uuid: targetRoom.uuid,
                location: targetRoom.location,
                name: targetRoom.name,
                description: targetRoom.description,
                exits: targetRoom.exits,
                colour: targetRoom.colour,
                props: targetRoom.props
            }) })
        }

        const blurField = (room) => {
            room.name = ret.name.innerText
            room.description = ret.description.innerText
            room.colour = ret.colour.value
            updateFields(room).then((response) => {
                if (response.ok) {
                    return response.json()
                } else {
                    return response.json().then(v => Promise.reject(response.message))
                }
            }).then((data) => {
                roomslist[data.uuid] = data
                drawRoom(data)
            })
        }

        propertyContainer.innerHTML = ''

        for (let p in room.props) {
            let elKey = document.createElement('div')
            elKey.innerText = p
            let elValue = document.createElement('div')
            elValue.innerText = room.props[p]

            elKey.addEventListener('mouseenter', (e) => {
                elKey.style.color = 'yellow'
                elValue.style.color = 'yellow'
            })
            elKey.addEventListener('mouseleave', (e) => {
                elKey.style.color = 'black'
                elValue.style.color = 'black'
            })
            elValue.addEventListener('mouseenter', (e) => {
                elKey.style.color = 'yellow'
                elValue.style.color = 'yellow'
            })
            elValue.addEventListener('mouseleave', (e) => {
                elKey.style.color = 'black'
                elValue.style.color = 'black'
            })

            if (!selectedProp) {
                ret.deleteProperty.innerText = `Delete Property`
                ret.deleteProperty.disabled = true
            }

            elKey.addEventListener('click', (e) => {
                let elKeyWrap = document.createElement('div')
                let elKeyEdit = document.createElement('input')
                elKeyEdit.value = elKey.innerText
                
                selectedProp = p
                if (selectedProp) {
                    ret.deleteProperty.innerText = `Delete Property '${p}'`
                    ret.deleteProperty.disabled = false
                }

                elKeyEdit.addEventListener('blur', (e) => {
                    elKey.style.color = 'black'
                    elValue.style.color = 'black'
                    if (elKey.innerText !== elKeyEdit.value) {
                        if (!room.props[elKeyEdit.value]) {
                            room.props[elKey.innerText] = undefined
                            delete room.props[elKey.innerText]
                            elKey.innerText = elKeyEdit.value
                            room.props[elKey.innerText] = elValue.innerText
                            updateFields(room).then((response) => {
                                if (response.ok) {
                                    return response.json()
                                } else {
                                    return response.json().then(v => Promise.reject(response.message))
                                }
                            }).then((data) => {
                                roomslist[data.uuid] = data
                            })
                        } else {
                            alert(`Error: Key '${elKeyEdit.value}' already exists!`)
                        }
                    }
                    propertyContainer.replaceChild(elKey, elKeyWrap)
                })

                elKeyWrap.appendChild(elKeyEdit)
                propertyContainer.replaceChild(elKeyWrap, elKey)
                elKeyEdit.focus()
            })
            elValue.addEventListener('click', (e) => {
                let elValueWrap = document.createElement('div')
                let elValueEdit = document.createElement('input')
                elValueEdit.value = elValue.innerText
                
                selectedProp = p
                if (selectedProp) {
                    ret.deleteProperty.innerText = `Delete Property '${p}'`
                    ret.deleteProperty.disabled = false
                }

                elValueEdit.addEventListener('blur', (e) => {
                    elKey.style.color = 'black'
                    elValue.style.color = 'black'
                    if (elValue.innerText !== elValueEdit.value) {
                        if (room.props[elKey.innerText] !== undefined) {
                            elValue.innerText = elValueEdit.value
                            room.props[elKey.innerText] = elValue.innerText
                            updateFields(room).then((response) => {
                                if (response.ok) {
                                    return response.json()
                                } else {
                                    return response.json().then(v => Promise.reject(response.message))
                                }
                            }).then((data) => {
                                roomslist[data.uuid] = data
                            })
                        } else {
                            alert(`Error: Key '${elKey.innerText}' does not exist!`)
                        }
                    }
                    propertyContainer.replaceChild(elValue, elValueWrap)
                })

                elValueWrap.appendChild(elValueEdit)
                propertyContainer.replaceChild(elValueWrap, elValue)
                elValueEdit.focus()
            })
            
            propertyContainer.appendChild(elKey)
            propertyContainer.appendChild(elValue)
        }
        ret.newProperty.addEventListener('click', (e) => {
            console.log('newprop')
            let key = prompt('Enter property name (key name):', '')
            if (room.props[key]) {
                alert(`Error: Key by name '${key}' already exists.`)
            } else {
                room.props[key] = ''
                selectedProp = key
                updateFields(room).then((response) => {
                    if (response.ok) {
                        return response.json()
                    } else {
                        return response.json().then(v => Promise.reject(response.message))
                    }
                }).then((data) => {
                    roomslist[data.uuid] = data
                    refreshRoom(room.uuid)
                })
            }
        })
        ret.deleteProperty.addEventListener('click', (e) => {
            if (selectedProp) {
                if (room.props[selectedProp] === undefined) {
                    alert(`Error: Cannot delete key '${selectedProp}', it does not exist.`)
                } else {
                    room.props[selectedProp] = undefined
                    delete room.props[selectedProp]
                    selectedProp = null
                    updateFields(room).then((response) => {
                        if (response.ok) {
                            return response.json()
                        } else {
                            return response.json().then(v => Promise.reject(response.message))
                        }
                    }).then((data) => {
                        roomslist[data.uuid] = data
                        refreshRoom(room.uuid)
                    })
                }
            }
        })

        let directions = { 'North': { x: 0, y: 0, z: -1 }, 'South': { x: 0, y: 0, z: 1 }, 'East': { x: 1, y: 0, z: 0 }, 'West': { x: -1, y: 0, z: 0 }}
        let opposites = {
            'North': 'South',
            'South': 'North',
            'West': 'East',
            'East': 'West',
        }

        for (let child of roomExits.childNodes) {
            if (child.nodeType === 1) {
                child = cloneNode(child)
                if (room) {
                    let dir = directions[child.innerText]
                    let loc = { x: room.location.x + dir.x, y: room.location.y + dir.y, z: room.location.z + dir.z }
                    let dirRoom = findRoomAt(loc.x, loc.y, loc.z)
        
                    setupRoomExitField(room, child)
                    child.addEventListener('click', (e) => {
                            if (e.target.getAttribute('useExit')) {
                                if (dirRoom) {
                                    delete room.exits[child.innerText]
                                    e.target.removeAttribute('useExit')
                                    updateFields(room).then((response) => {
                                        if (response.ok) {
                                            return response.json()
                                        } else {
                                            return response.json().then(v => Promise.reject(response.message))
                                        }
                                    }).then((data) => {
                                        roomslist[data.uuid] = data
                                    })
                                    dirRoom.exits[opposites[child.innerText]] = undefined
                                    updateFields(dirRoom).then((response) => {
                                        if (response.ok) {
                                            return response.json()
                                        } else {
                                            return response.json().then(v => Promise.reject(response.message))
                                        }
                                    }).then((data) => {
                                        roomslist[data.uuid] = data
                                    })
                                }
                            } else {
                                if (dirRoom) {
                                    room.exits[child.innerText] = dirRoom.uuid
                                    e.target.setAttribute('useExit', true)
                                    updateFields(room).then((response) => {
                                        if (response.ok) {
                                            return response.json()
                                        } else {
                                            return response.json().then(v => Promise.reject(response.message))
                                        }
                                    }).then((data) => {
                                        roomslist[data.uuid] = data
                                    })
                                    dirRoom.exits[opposites[child.innerText]] = room.uuid
                                    updateFields(dirRoom).then((response) => {
                                        if (response.ok) {
                                            return response.json()
                                        } else {
                                            return response.json().then(v => Promise.reject(response.message))
                                        }
                                    }).then((data) => {
                                        roomslist[data.uuid] = data
                                    })
                                }
                            }
                            setupRoomExitField(room, child)
                        })
                } else {
                    child.removeAttribute('useExit')
                }
            }
        }

        if (room) {
            ret.name.addEventListener('blur', () => blurField(room))
            ret.description.addEventListener('blur', () => blurField(room))
            ret.colour.addEventListener('change', () => blurField(room))
        }

        return ret
    }

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
    fetch('http://localhost:8080/rooms', { method: 'POST', headers: { 'Content-Type': 'application/json' } }).then((response) => {
        return response.json()
    }).then((data) => {
        roomslist = data
        //refreshRoom()
        drawAllRooms()
    })

    // Load initial dictionary data.
    fetch('http://localhost:8080/dictionary', { method: 'POST', headers: { 'Content-Type': 'application/json' } }).then((response) => {
        return response.json()
    }).then((data) => {
        dictionary = data
        refreshDictionary()
    })

    refreshNavItems()

})()