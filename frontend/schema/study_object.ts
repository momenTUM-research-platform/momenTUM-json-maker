import { alerts } from "./alerts";
import { graph } from "./graph";
import { paramsPVT } from "./paramsPVT";
import { properties } from "./properties";
import { question } from "./question";

export const study_object = (
  conditions: string[],
  questions: SchemaEnum[],
  modules: SchemaEnum[]
) => {
  return {
    $schema: "http://json-schema.org/draft-07/schema",
    $id: "https://momenTUM.de/schema/v1/schema.json",
    type: "object",
    title: "MomenTUM survey creator",
    description:
      "This is the schema for the MomenTUM survey creator. For any questions/issues please see the repository: https://github.com/TUMChronobiology/momenTUM-json-maker. IDs must consist of ONLY lower-case letters, numbers, and underscores.",
    default: {},
    required: ["properties", "modules"],
    properties: {
      properties: properties,
      modules: {
        $id: "#/properties/modules",
        type: "array",
        title: "Modules",
        description:
          "Modules store the individual survey/intervention tasks that will be delivered to the participants.",
        default: [],
        items: {
          $id: "#/properties/modules/items",
          type: "object",
          required: [
            "name",
            "condition",
            "alerts",
            "graph",
            "id",
            "unlock_after",
            "params",
          ],
          properties: {
            id: {
              $id: "#/properties/modules/items/properties/id",
              type: "string",
              pattern: "^[a-z0-9_]+$",
              title: "Unique identifier",
              description:
                "A unique identifier for this module. Will be generated if not provided. Must be lowercase and only letters, numbers and underscores. Cannot begin with a number",
              default: "",
              examples: [""],
            },
            params: {
              $id: "#/properties/modules/items/properties/params",
              type: "object",
              title: "Module Type",
              description:
                "The parameters of the module. Can be a survey object or a pvt object, but not both.",
              properties: {},
              oneOf: [
                {
                  $id: "#/properties/modules/items/properties/params/survey",
                  title: "Survey",
                  type: "object",
                  required: ["sections", "submit_text", "shuffle", "type"],
                  description:
                    "The parameters of the module. Can be a survey object or a PVT object, but not both.",
                  properties: {
                    id: {
                      $id: "#/properties/modules/items/properties/params/survey/id",
                      type: "string",
                      pattern: "^[a-z0-9_]+$",
                      title: "Unique identifier",
                      description:
                        "A unique identifier for this module. Will be generated if not provided. Must be lowercase and only letters, numbers and underscores. Cannot begin with a number",
                      default: "",
                      examples: [""],
                    },
                    sections: {
                      $id: "#/properties/modules/items/properties/survey/sections",
                      type: "array",
                      title: "Sections",
                      default: [],
                      description:
                        "The section of a survey. It can be multiple entries",
                      items: {
                        $id: "#/properties/modules/items/properties/sections/items",
                        type: "object",
                        required: ["name", "questions", "shuffle"],
                        properties: {
                          name: {
                            $id: "#/properties/modules/items/properties/sections/items/properties/name",
                            type: "string",
                            title: "Section name",
                            description:
                              "The title of this section, which is displayed at the top of the screen.",
                            default: "",
                            examples: ["Welcome"],
                          },
                          shuffle: {
                            $id: "#/properties/modules/items/properties/sections/items/properties/shuffle",
                            type: "boolean",
                            title: "Shuffle Questions?",
                            description:
                              "Used for counterbalancing. If true, the order of the questions in this section will be randomised.",
                            default: false,
                            examples: [false],
                          },
                          questions: {
                            $id: "#/properties/modules/items/properties/sections/items/properties/questions",
                            type: "array",
                            title: "Questions",
                            description:
                              "An array containing all of the questions for this section of the module.",
                            default: [],
                            items: question(questions),
                          },
                        },
                      },
                    },
                    submit_text: {
                      $id: "#/properties/modules/items/properties/submit_text",
                      type: "string",
                      title: "Submit Text",
                      description:
                        "The label of the submit button for this module. Note: this value appears only on the final section of a module.",
                      default: "Submit",
                      examples: ["Submit"],
                    },
                    shuffle: {
                      $id: "#/properties/modules/items/properties/params/survey/shuffle",
                      type: "boolean",
                      title: "Shuffle sections?",
                      description:
                        "Used for counterbalancing. If true, the order of the sections will be randomized every time the module is accessed.",
                    },
                    type: {
                      type: "string",
                      enum: ["survey"],
                    },
                  },
                },
                paramsPVT,
              ],
            },
            name: {
              $id: "#/properties/modules/items/properties/name",
              type: "string",
              title: "Name",
              description: "The name of the module. Basic HTML supported.",
              default: "",
              examples: ["Welcome"],
            },
            condition: {
              $id: "#/properties/modules/items/properties/condition",
              type: "string",
              title: "Condition",
              description:
                "The condition that this module belongs to. It must match one of the values from the conditions array from the study properties, or have the value * to be scheduled for all participants.",
              default: "",
              enum: conditions,
            },
            alerts: alerts,
            graph: graph(questions),
            unlock_after: {
              $id: "#/properties/modules/items/properties/unlock_after",
              type: "array",
              title: "Unlock after",
              description:
                "A list of IDs of modules that must be completed before this module will appear on the task list. If you cannot see any ids, please remove the field and add it again. Self-reference will exclude the module.",
              examples: [[]],
              items: {
                $id: "#/properties/modules/items/properties/unlock_after/items",
                type: "string",
                pattern: "^[a-z0-9_]+$",

                oneOf:
                  modules.length === 0
                    ? [{ const: "", title: "" }]
                    : modules!.map((m) => ({ const: m.id, title: m.text })),
              },
            },
          },
        },
      },
    },
  };
};
