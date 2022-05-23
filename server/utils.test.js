import { populateIds } from "./utils"

describe('The JSON-Generator API', () => {
    it("populates the schema with ids", () => {
        const populated = populateIds({
            properties: { study_id: "" },
            modules: [{
                uuid: "",
                sections: [{
                    questions: [{ id: "" }]
                }]
            }]
        })
        expect(populated.properties.study_id).toBeTruthy()
        expect(populated.modules[0].uuid).toBeTruthy()
        expect(populated.modules[0].sections[0].questions[0].id).toBeTruthy()
    })
    it("keeps existing ids", () => {
        const populated = populateIds({
            properties: { study_id: "id_1" },
            modules: [{
                uuid: "id_2",
                sections: [{
                    questions: [{ id: "id_3" }]
                }]
            }]
        })
        expect(populated.properties.study_id).toEqual("id_1")
        expect(populated.modules[0].uuid).toEqual("id_2")
        expect(populated.modules[0].sections[0].questions[0].id).toEqual("id_3")
    })
    it("Creates id properties if not present", () => {
        const populated = populateIds({
            properties: {},
            modules: [{
                sections: [{
                    questions: [{}]
                }]
            }]
        })
        expect(populated.properties.study_id).toBeTruthy()
        expect(populated.modules[0].uuid).toBeTruthy()
        expect(populated.modules[0].sections[0].questions[0].id).toBeTruthy()
    })
    it("rejects a schema that is invalid", () => {
        expect(() => populateIds({})).toThrow()
        expect(() => populateIds({ properties: { study_id: "" } })).toThrow()
        expect(() => populateIds({
            properties: { study_id: "" },
            modules: [{
                sections: [{}]
            }]
        })).toThrow()
        expect(() => populateIds({
            properties: { study_id: "" },
            modules: [{
                sections: {
                    questions: [{ id: "" }]
                }
            }]
        })).toThrow()
    })
})
