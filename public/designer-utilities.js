var mapScale = 10

var selectedKey = ''
var selectedRoom = ''
var selectedTemplate = ''
var selectedCell = { selected: false, x: 0, y: 0 }
var currentNavId = document.getElementsByClassName('selected-nav')[0].getAttribute('targetEditor')

var dictionary = {}
var roomslist = {}
var roomtemplateslist = {}
var mobslist = {}

function findRoomAt (x, y, z) {
    for (let r in roomslist) {
        if (roomslist[r].location.x === x && roomslist[r].location.y === y && roomslist[r].location.z === z) {
            return roomslist[r]
        }
    }
    return null
}

function drawRoomSelection() {
    ctx.beginPath()
    ctx.strokeStyle = selectedCell.selected ? '#f1f1f1' : '#515151'
    ctx.lineWidth = 2
    ctx.rect(selectedCell.x * mapScale, selectedCell.y * mapScale, mapScale, mapScale)
    ctx.stroke()
}

/**
 * Used to clear all set events on an element. It's OK to do this because we're only using it on leaf
 * nodes in the tree.
 * @param {HTMLElement} node 
 * @returns 
 */
function cloneNode(node) {
    let old_element = node;
    let new_element = old_element.cloneNode(true);
    old_element.parentNode.replaceChild(new_element, old_element);
    return new_element
}

/**
 * Gets the current room selected (selectedRoom string which is a room uuid)
 * @returns Instance of Room class.
 */
const currentRoom = () => {
    return roomslist[selectedRoom] ? roomslist[selectedRoom] : null
}

const currentTemplate = () => {
    return roomtemplateslist[selectedTemplate] ? roomtemplateslist[selectedTemplate] : null
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
    const rcontainer = document.getElementById("rcontainer")
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

/**
 * Refreshes the user interface for the room template panel.
 */
const refreshRoomTemplate = (selected) => {
    selectedTemplate = selected ? selected : selectedTemplate
    let template = 
    setupRoomTemplateFields(template)
}