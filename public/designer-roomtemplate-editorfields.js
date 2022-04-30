function setupRoomTemplateFields(template) {
    let selectedProp = null

    let ret = {
        id: cloneNode(document.getElementById("roomtmp_selected")),
        name: cloneNode(document.getElementById("roomtmp_name")),
        description: cloneNode(document.getElementById("roomtmp_description")),
        colour: cloneNode(document.getElementById("roomtmp_colour")),
        components: cloneNode(document.getElementById("roomtmp_components")),
        mobiles: cloneNode(document.getElementById("roomtmp_mobiles")),
        entities: cloneNode(document.getElementById("roomtmp_entities")),
        
        remove_template: cloneNode(document.getElementById("remove_template")),
        new_template: cloneNode(document.getElementById("new_template")),
        new_property: cloneNode(document.getElementById("tmpnew_property")),
        delete_property: cloneNode(document.getElementById("tmpdelete_property"))
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
    
    ret.new_property.addEventListener('click', (e) => {
        let key = prompt("Property name:", "")
        if (key) {
            roomtemplateslist[template.id].props[key] = ''
            setupRoomTemplateFields(roomtemplateslist[template.id])
        }
        return
    })

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

    // Update Properties Elements
    const propertyContainer = document.getElementById('tmpproperty_container')
    propertyContainer.innerHTML = ''
    let props = roomtemplateslist[template.id].props
    if (props) {
        let propkeys = Object.keys(props)
        for (let pk in propkeys) {
            let key = propkeys[pk]
            let elKey = document.createElement('div')
            let elValue = document.createElement('div')
            elKey.innerText = key
            elValue.innerText = props[key]

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

            elKey.addEventListener('click', (e) => {
                let elKeyWrap = document.createElement('div')
                let elKeyEdit = document.createElement('input')
                elKeyEdit.value = elKey.innerText
                
                selectedProp = key
                if (selectedProp) {
                    ret.delete_property.innerText = `Delete Property '${key}'`
                    ret.delete_property.disabled = false
                }
    
                elKeyEdit.addEventListener('blur', (e) => {
                    elKey.style.color = 'black'
                    elValue.style.color = 'black'
                    if (elKey.innerText !== elKeyEdit.value) {
                        if (!template.props[elKeyEdit.value]) {
                            template.props[elKey.innerText] = undefined
                            delete template.props[elKey.innerText]
                            elKey.innerText = elKeyEdit.value
                            template.props[elKey.innerText] = elValue.innerText
                            updateFields(template).then((response) => {
                                if (response.ok) {
                                    return response.json()
                                } else {
                                    return response.json().then(v => Promise.reject(response.message))
                                }
                            }).then((data) => {
                                roomtemplateslist[data.id] = data
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
                let elValueEdit = document.createElement('div')
                elValueEdit.innerText = elValue.innerText
                elValueEdit.classList.add("editor")
                elValueEdit.contentEditable = true
                
                selectedProp = key
                if (selectedProp) {
                    ret.delete_property.innerText = `Delete Property '${key}'`
                    ret.delete_property.disabled = false
                }
    
                elValueEdit.addEventListener('blur', (e) => {
                    elKey.style.color = 'black'
                    elValue.style.color = 'black'
                    if (elValue.innerText !== elValueEdit.innerText) {
                        if (template.props[elKey.innerText] !== undefined) {
                            elValue.innerText = elValueEdit.innerText
                            template.props[elKey.innerText] = elValue.innerText
                            updateFields(template).then((response) => {
                                if (response.ok) {
                                    return response.json()
                                } else {
                                    return response.json().then(v => Promise.reject(response.message))
                                }
                            }).then((data) => {
                                roomtemplateslist[data.id] = data
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
    }

    return ret
}