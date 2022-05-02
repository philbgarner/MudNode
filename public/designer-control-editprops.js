const EditPropsList = (params) => {
    let container = params.element
    container.innerHTML = ''
    
    let props = params.props
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
                    if (!props[elKeyEdit.value]) {
                        props[elKey.innerText] = undefined
                        delete props[elKey.innerText]
                        elKey.innerText = elKeyEdit.value
                        props[elKey.innerText] = elValue.innerText
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
                container.replaceChild(elKey, elKeyWrap)
            })

            elKeyWrap.appendChild(elKeyEdit)
            container.replaceChild(elKeyWrap, elKey)
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
                    if (props[elKey.innerText] !== undefined) {
                        elValue.innerText = elValueEdit.innerText
                        props[elKey.innerText] = elValue.innerText
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
                container.replaceChild(elValue, elValueWrap)
            })

            elValueWrap.appendChild(elValueEdit)
            container.replaceChild(elValueWrap, elValue)
            elValueEdit.focus()
        })

        container.appendChild(elKey)
        container.appendChild(elValue)
    }
}