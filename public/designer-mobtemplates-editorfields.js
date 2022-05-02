function setupMobileEditorFields(mobile) {

    if (!mobile) {
        return false
    }

    let element = document.getElementById("mpropcontainer")
    let ret = {
        id: document.getElementById("mobile_id"),
        selected: cloneNode(document.getElementById("mobtmp_selected")),
        newMobile: cloneNode(document.getElementById("mobtmp_new")),
        deleteMobile: cloneNode(document.getElementById("mobtmp_delete")),
        element: element,
        props: EditPropsList({
            container: element.querySelector(`.${property-prop-container}`),
            props: mobile.props
        })
    }

    ret.newMobile.addEventListener('click', (e) => {
        let key = prompt("New Mobile Name", "")
        if (key) {
            
        }
    })

    return ret
}