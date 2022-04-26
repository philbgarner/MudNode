const ctx = canvas.getContext('2d');

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

const drawAllRooms = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    for (let r in roomslist) {
        drawRoom(roomslist[r])
    }

    drawRoomSelection()
    drawGrid()
}
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
    const propertyContainer = document.getElementById("property_container")
    const roomExits = document.getElementById('room_exits')

    let selectedProp = null

    let ret = {
        id: document.getElementById('room_id'),
        name: cloneNode(document.getElementById('room_name')),
        description: cloneNode(document.getElementById('room_description')),
        roomExits: roomExits,
        colour: cloneNode(document.getElementById('room_colour')),
        newProperty: cloneNode(document.getElementById('new_property')),
        deleteProperty: cloneNode(document.getElementById('delete_property')),
        roomTemplate: cloneNode(document.getElementById("room_template"))
    }

    ret.roomTemplate.length = 0
    for (let r in roomtemplateslist) {
        let opt = document.createElement("option")
        opt.innerText = roomtemplateslist[r].id
        ret.roomTemplate.add(opt)
    }

    if (!room) {
        return
    }

    const updateFields = (targetRoom) => {
        targetRoom = targetRoom ? targetRoom : room
        return fetch('http://localhost:8080/api/room', { method: 'POST', headers: { 'Content-Type': 'application/json' },
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

    ret.name.addEventListener('blur', () => blurField(room))
    ret.description.addEventListener('blur', () => blurField(room))
    ret.colour.addEventListener('change', () => blurField(room))

    return ret
}