function setupRoomTemplateFields(template) {
    let ret = {
        id: cloneNode(document.getElementById("roomtmp_selected")),
        name: cloneNode(document.getElementById("roomtmp_name")),
        description: cloneNode(document.getElementById("roomtmp_description")),
        colour: cloneNode(document.getElementById("roomtmp_colour")),
        components: cloneNode(document.getElementById("roomtmp_components")),
        mobiles: cloneNode(document.getElementById("roomtmp_mobiles")),
        entities: cloneNode(document.getElementById("roomtmp_entities")),
        
        remove_template: cloneNode(document.getElementById("remove_template")),
        new_template: cloneNode(document.getElementById("new_template"))
    }

    ret.remove_template.addEventListener("click", (e) => {
        fetch('http://localhost:8080/api/rooms/template', { method: 'DELETE', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: template.id
            })
        }).then((response) => {
            if (response.ok) {
                roomtemplateslist[template.id] = undefined
                delete roomtemplateslist[template.id]
                setupRoomTemplateFields(template)
                return
            } else {
                alert(`Error deleting ${template.id}.`)
            }
        })
    })

    ret.new_template.addEventListener("click", (e) => {
        let key = prompt("Enter Template Id", "")
        if (roomtemplateslist[key]) {
            alert('Error: Template Id of ' + key + ' already exists.')
        } else {
            let roomTemplate = {
                id: key,
                name: ret.name.innerText,
                description: ret.description.innerText,
                colour: ret.colour.value,
                components: ret.components.innerText,
                mobiles: ret.mobiles.innerText,
                entities: ret.entities.innerText
            }
            fetch('http://localhost:8080/api/rooms/template', { method: 'POST', headers: { 'Content-Type': 'application/json' },
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
            .then((response) => {
                if (response.ok) {
                    return response.json()
                } else {
                    return response.json().then(v => Promise.reject(response.message))
                }
            }).then((data) => {
                roomtemplateslist[data.id] = data
                setupRoomTemplateFields(data)
            })
        }
    })

    ret.id.length = 0
    for (let r in roomtemplateslist) {
        let opt = document.createElement("option")
        opt.innerText = roomtemplateslist[r].id
        ret.id.add(opt)
    }

    ret.id.addEventListener('change', (e) => {
        setupRoomTemplateFields(roomtemplateslist[e.target.value])
        return
    })

    if (template === undefined) {
        return
    }
    
    ret.id.value = template.id
    ret.name.innerText = template.name
    ret.description.innerText = template.description
    ret.colour.value = template.colour
    ret.components.innerText = template.components
    ret.mobiles.innerText = template.mobiles
    ret.entities.innerText = template.entities

    const updateFields = (roomTemplate) => {
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

    const blurField = (template) => {
        template.id = ret.id.value
        template.name = ret.name.innerText
        template.description = ret.description.innerText
        template.colour = ret.colour.value
        template.components = ret.components.innerText
        template.mobiles = ret.mobiles.innerText
        template.entities = ret.entities.innerText
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

    ret.name.addEventListener('blur', (e) => blurField(template))
    ret.description.addEventListener('blur', (e) => blurField(template))
    ret.colour.addEventListener('blur', (e) => blurField(template))
    ret.components.addEventListener('blur', (e) => blurField(template))
    ret.mobiles.addEventListener('blur', (e) => blurField(template))
    ret.entities.addEventListener('blur', (e) => blurField(template))

    return ret
}