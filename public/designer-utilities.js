var mapScale = 10
var selectedProp = null

var selectedKey = ''
var selectedRoom = ''
var selectedCell = { selected: false, x: 0, y: 0 }
var currentNavId = document.getElementsByClassName('selected-nav')[0].getAttribute('targetEditor')

var dictionary = {}
var roomslist = {}

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

function cloneNode(node) {
    let old_element = node;
    let new_element = old_element.cloneNode(true);
    old_element.parentNode.replaceChild(new_element, old_element);
    return new_element
}
