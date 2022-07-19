import { nanoid as uid } from "nanoid"
import { readdirSync, readFileSync } from 'fs'

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
export function getLatestStudies() {

    const files = readdirSync("./surveys/")
    console.log(files[0].slice(-18, -5))
    const studies = files.filter(file => Number(file.slice(-18, -5))) //check if file ends with timestamp

        .sort((a, b) => a.slice(-18, -5) > b.slice(-18, -5))
        //   .splice(3)
        .map(file => readFileSync("./surveys/" + file, { encoding: "utf-8" }))
        .map(JSON.parse)
    console.log(studies)
    return studies

}