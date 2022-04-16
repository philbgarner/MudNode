const roomtmp_name = document.getElementById("roomtmp_name")
const roomtmp_desc = document.getElementById("roomtmp_description")

function setupRoomTemplateFields(template) {
    if (!template) {
        return
    }

    let ret = {
        name: roomtmp_name,
        description: roomtmp_desc
    }
    
    const updateFields = (templateId) => {
        // targetRoom = targetRoom ? targetRoom : room
        // return fetch('http://localhost:8080/api/room', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        // body: JSON.stringify({
        //     uuid: targetRoom.uuid,
        //     location: targetRoom.location,
        //     name: targetRoom.name,
        //     description: targetRoom.description,
        //     exits: targetRoom.exits,
        //     colour: targetRoom.colour,
        //     props: targetRoom.props
        // }) })
    }

    return ret
}