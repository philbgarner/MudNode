(() => {
    const suggestions = document.getElementById("suggestions")
    const dKeys = document.getElementById("dKeys")
    const dValues = document.getElementById("dValues")
    const btnAddKey = document.getElementById("addKey")
    const btnRemoveKey = document.getElementById("removeKey")
    const btnProcess = document.getElementById("idprocess")
    const ofield = document.getElementById("ofield")
    const filterKeys = document.getElementById("filterKeys")
    const worldmap = document.getElementById("worldmap")
    const rooms = document.getElementById("roomslist")
    const rcontainer = document.getElementById("rcontainer")
    const addRoom = document.getElementById("addRoom")
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    var mapScale = 10

    var selectedKey = ''
    var selectedRoom = ''
    var selectedCell = { selected: false, x: 0, y: 0 }

    var dictionary = {}
    var roomslist = {}

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
    
    const getTextSelection = function (editor) {
        const selection = window.getSelection();
    
        if (selection != null && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
    
            return {
                start: getTextLength(editor, range.startContainer, range.startOffset),
                end: getTextLength(editor, range.endContainer, range.endOffset),
                range: range
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
                if (prevChar === '[') {
                    toggleSuggestions({ type: 'Token Types:', data: ['* = Key Search', '? = Condition'] }, false)
                } else if (word.includes('[*') && !word.includes(']')) {
                    let lookup = word.slice(2)
                    filterKeys.value = lookup
                    refreshKeys()
                    lookup += dictionary[lookup] ? ' found.' : ' <span style="color: #f00">not found</span>.'
                    toggleSuggestions({ type: 'Key Search:', data: [lookup] }, false)
                } else if (word.includes(']')) {
                    let lookup = word.slice(2, word.length - 1)
                    filterKeys.value = lookup
                    refreshKeys()
//                    lookup += dictionary[lookup] ? ' found.' : ' <span style="color: #f00">not found</span>.'
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

    editor = document.querySelector('.editor');

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
        fetch('http://localhost:8080/process', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ template: template.innerText })}).then((response) => {
            response.text().then((v) => ofield.innerText += v + '\n')
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
            let x = room.location.x * mapScale
            let z = room.location.z * mapScale
            ctx.fillStyle = '#0991c1'
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
    
    const refreshRoom = (selected) => {
        selectedRoom = selected ? selected : selectedRoom

        let room = currentRoom()
        if (room) {
            rcontainer.querySelector('#room_id').innerText = room.uuid
            rcontainer.querySelector('#room_name').innerText = room.name
            rcontainer.querySelector('#room_description').innerText = room.description
            rcontainer.querySelector('#room_location').innerText = JSON.stringify(room.location)
        } else {
            rcontainer.querySelector('#room_id').innerText = ''
            rcontainer.querySelector('#room_name').innerText = ''
            rcontainer.querySelector('#room_description').innerText = ''
            rcontainer.querySelector('#room_location').innerText = ''
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
            drawRoomSelection()
            //refreshRoom()
        })
        .catch((e) => {
            alert(e)
        })
    })

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
})()