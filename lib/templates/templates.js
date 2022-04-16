let templateList = {}

const hasTemplate = (id) => {
    return templateList[id] ? true : false
}

const getTemplate = (id) => {
    return templateList[id]
}

const setTemplate = (template) => {
    if (!hasTemplate(template.name)) {
        templateList[template.name] = template.name
    }
}

export { hasTemplate, getTemplate, setTemplate }