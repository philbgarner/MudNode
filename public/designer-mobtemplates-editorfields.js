function setupMobileEditorFields(mobile) {
    let element = document.getElementById("mpropcontainer")
    let ret = {
        id: document.getElementById("mobile_id"),
        selected: cloneNode(document.getElementById("mobtmp_selected")),
        newMobile: cloneNode(document.getElementById("mobtmp_new")),
        deleteMobile: cloneNode(document.getElementById("mobtmp_delete")),
        element: element,
        newProperty: cloneNode(element.querySelectorAll('.footer > button')[0]),
        delProperty: cloneNode(element.querySelectorAll('.footer > button')[1]),
        props: EditPropsList({
            element: element.querySelector(`.property-prop-container`),
            props: mobile && mobile.props ? mobile.props : {}
        })
    }

    ret.newMobile.addEventListener('click', (e) => {
        let key = prompt("New Mobile Name", "")
        if (key) {
            
        }
    })

    if (!mobile) {
        return false
    }
   
    ret.newProperty.addEventListener('click', (e) => {
        console.log(e)
    })


    return ret
}