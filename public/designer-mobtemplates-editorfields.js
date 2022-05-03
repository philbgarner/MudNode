function setupMobileEditorFields(mobile) {
    let element = document.getElementById("mpropcontainer")
    let ret = {
        id: document.getElementById("mobtmp_id"),
        name: cloneNode(document.getElementById("mobtmp_name")),
        shortDescription: cloneNode(document.getElementById("mobtmp_short_description")),
        description: cloneNode(document.getElementById("mobtmp_description")),
        race: cloneNode(document.getElementById("mobtmp_race")),
        size: cloneNode(document.getElementById("mobtmp_size")),
        age: cloneNode(document.getElementById("mobtmp_age")),
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
        if (mobstemplatelist[key]) {
            alert(`Error: Template Id of ${key} already exists.`)
        } else {
            let mobTemplate = {
                id: key,
                // name: ret.name.innerText,
                // shortDescription: ret.shortDescription.innerText,
                // description: ret.description.innerText,
                // race: ret.race.innerText,
                // size: ret.size.innerText,
                // age: ret.age.innerText,
                props: {},
                components: [],
            }
            fetch('http://localhost:8080/api/mobiles/template', { method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: key,
                    // name: mobTemplate.name,
                    // shortDescription: mobTemplate.shortDescription,
                    // description: mobTemplate.description,
                    // race: mobTemplate.race,
                    // size: mobTemplate.size,
                    // age: mobTemplate.age,
                    // props: mobTemplate.props,
                    // components: mobTemplate.components,
                })
            })
            .then((response) => {
                if (response.ok) {
                    return response.json()
                } else {
                    return response.json().then(v => Promise.reject(response.message))
                }
            }).then((data) => {
                mobstemplatelist[data.id] = data
                setupMobileEditorFields(data)
            })
        }
    })

    ret.selected.length = 0
    for (let m in mobstemplatelist) {
        let opt = document.createElement('option')
        opt.innerText = mobstemplatelist[m].id
        ret.selected.appendChild(opt)
    }
    ret.selected.addEventListener('change', (e) => {
        setupMobileEditorFields(mobstemplatelist[e.target.value])
        return
    })

    if (!mobile) {
        return false
    }

    ret.selected.value = mobile.id
    ret.id.innerText = mobile.id
    ret.name.innerText = mobile.name
    ret.shortDescription.innerText = mobile.shortDescription
    ret.description.innerText = mobile.description
    ret.race.innerText = mobile.race
    ret.size.innerText = mobile.size
    ret.age.innerText = mobile.age

   
    ret.newProperty.addEventListener('click', (e) => {
        console.log(e)
    })


    return ret
}