function EditComponent(params, updateFields, blurField) {
    this.updateFields = updateFields
    this.blurField = blurField

    if (!params.entity || !params.element || !params.entity.components) {
        return
    }
    let container = params.element
    container.innerHTML = params.entity.components.length === 0 ? 'No Components' : ''

    function ComponentControl(component) {
        let div = document.createElement('div')
        div.classList.add('component-list-item')
        let chk = document.createElement('span')
        let chkBox = document.createElement('input')
        chkBox.type = 'checkbox'
        chkBox.checked = component.enabled
        chk.title = component.enabled ? 'Enabled' : 'Disabled'
        chk.appendChild(chkBox)
        let type = document.createElement('b')
        type.innerText = component.type

        let del = document.createElement('button')
        del.innerText = 'Delete'

        div.appendChild(type)
        div.appendChild(chk)
        div.appendChild(del)

        let propscontainer = document.createElement('div')
        propscontainer.classList.add('custom-property-container')
        let propslist = EditPropsList({
            entity: component,
            element: propscontainer,
            refresh: () => { params.refresh(params.entity) },
            update: () => { params.blurField(params.entity) },
        }, updateFields, blurField)
        div.appendChild(propscontainer)
        return div
    }

    for (let c in params.entity.components) {
        container.appendChild(ComponentControl(params.entity.components[c]))
    }

    return {
        entity: params.entity,
        components: params.components
    }
}