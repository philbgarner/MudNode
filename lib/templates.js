let templateList = {}

const hasTemplate = (id) => {
    return templateList[id] ? true : false
}

const getTemplate = (id) => {
    return templateList[id]
}

const setTemplate = (template) => {
    let tm = getTemplate(template.id)
    if (tm) {
        tm.id = template.id
    } else {
        return false
    }
    return tm
}

const getTemplates = () => {
    return templateList
}

export { hasTemplate, getTemplate, setTemplate, getTemplates }