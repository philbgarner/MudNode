let templateList = {}

const hasTemplate = (id) => {
    return templateList[id] ? true : false
}

const getTemplate = (id) => {
    return templateList[id]
}

const setTemplate = (template) => {
    templateList[template.id] = template.id
}

const getTemplates = () => {
    return templateList
}

export { hasTemplate, getTemplate, setTemplate, getTemplates }