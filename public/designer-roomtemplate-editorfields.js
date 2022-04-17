const roomtmp_name = document.getElementById("roomtmp_name")
const roomtmp_desc = document.getElementById("roomtmp_description")
const roomtmp_id = document.getElementById("roomtmp_id")

function setupRoomTemplateFields(template) {
    console.log('>', template)
    if (template === undefined) {
        return
    }

    let ret = {
        id: roomtmp_id,
        name: roomtmp_name,
        description: roomtmp_desc,
        new_template: cloneNode(document.getElementById("new_template"))
    }
    
    const updateFields = (templateId) => {
        roomTemplate = roomtemplateslist[templateId] ? roomtemplateslist[templateId] : template
        return fetch('http://localhost:8080/api/rooms/template', { method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: roomTemplate.id,
                name: roomTemplate.name,
                description: roomTemplate.description,
                colour: roomTemplate.colour,
                props: roomTemplate.props,
                components: roomTemplate.components,
                mobiles: roomTemplate.mobiles,
                entities: roomTemplate.entities
            })
        })
    }

    ret.new_template.addEventListener("click", (e) => {
        console.log('Test')
        let key = prompt("Enter Template Id", "")
        if (roomtemplateslist[key]) {
            alert('Error: Template Id of ' + key + ' already exists.')
        } else {
            updateFields(template).then((response) => {
                if (response.ok) {
                    return response.json()
                } else {
                    return response.json().then(v => Promise.reject(response.message))
                }
            }).then((data) => {
                roomtemplateslist[data.id] = data
            })
        }
    })

    return ret
}