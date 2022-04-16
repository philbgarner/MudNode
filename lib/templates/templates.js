let templateList = {}

const hasTemplate = (id) => {
    return templateList[id] ? true : false
}

const getTemplate = (id) => {
    return templateList[id]
}

const setTemplate = (template) => {
    if (!hasTemplate(template.id)) {
        templateList[template.id] = template.id
    }
}

export { hasTemplate, getTemplate, setTemplate }