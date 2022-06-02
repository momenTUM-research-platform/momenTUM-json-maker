import { nanoid as uid } from "nanoid"

export function populateIds(form) {
    try {
        form.properties.study_id = form.properties.study_id || uid()
        form.modules.forEach(module => {
            module.uuid = module.uuid || uid()
            module.sections.forEach(section => {
                section.questions.forEach(question => {
                    question.id = question.id || uid()
                })
            })
        })
        return form
    } catch (error) {
        throw new Error("Form does not fit expected structure and can't be populated with uuids: " + error)
    }
}

