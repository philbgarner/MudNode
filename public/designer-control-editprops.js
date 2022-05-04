function EditPropsList(params, updateFields, blurField) {
    this.updateFields = updateFields
    this.blurField = blurField

    let container = params.element
    container.innerHTML = ''

    let props = params.entity ? params.entity.props : {}
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
            elKey.style.backgroundColor = 'rgba(106, 106, 106, 0.51)'
            elValue.style.backgroundColor = 'rgba(106, 106, 106, 0.51)'
        })
        elKey.addEventListener('mouseleave', (e) => {
            elKey.style.color = 'black'
            elValue.style.color = 'black'
            elKey.style.backgroundColor = 'unset'
            elValue.style.backgroundColor = 'unset'
        })
        elValue.addEventListener('mouseenter', (e) => {
            elKey.style.color = 'yellow'
            elValue.style.color = 'yellow'
            elKey.style.backgroundColor = 'rgba(106, 106, 106, 0.51)'
            elValue.style.backgroundColor = 'rgba(106, 106, 106, 0.51)'
        })
        elValue.addEventListener('mouseleave', (e) => {
            elKey.style.color = 'black'
            elValue.style.color = 'black'
            elKey.style.backgroundColor = 'unset'
            elValue.style.backgroundColor = 'unset'
        })

        elKey.addEventListener('click', (e) => {
            let elKeyWrap = document.createElement('div')
            let elKeyEdit = document.createElement('input')
            elKeyEdit.value = elKey.innerText

            elKeyEdit.addEventListener('blur', (e) => {
                elKey.style.color = 'black'
                elValue.style.color = 'black'
                if (elKey.innerText !== elKeyEdit.value) {
                    if (!props[elKeyEdit.value]) {
                        props[elKey.innerText] = undefined
                        delete props[elKey.innerText]
                        elKey.innerText = elKeyEdit.value
                        props[elKey.innerText] = elValue.innerText
                        this.blurField(params.entity)
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

            elValueEdit.addEventListener('blur', (e) => {
                elKey.style.color = 'black'
                elValue.style.color = 'black'
                if (elValue.innerText !== elValueEdit.innerText) {
                    if (props[elKey.innerText] !== undefined) {
                        elValue.innerText = elValueEdit.innerText
                        props[elKey.innerText] = elValue.innerText
                        console.log('blur on', elValue.innerText)
                        blurField(params.entity)
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
    return {
        entity: params.entity,
        element: container,
        addProp: () => {
            let key = prompt('Property Name:')
            if (!props[key]) {
                props[key] = ''
                params.refresh(params.entity ? params.entity : null)
            }
        }
    }
}