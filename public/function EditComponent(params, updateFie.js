function EditComponent(params, updateFields, blurField) {
    this.updateFields = updateFields
    this.blurField = blurField

    let container = params.element
    container.innerHTML = "No Components"
}