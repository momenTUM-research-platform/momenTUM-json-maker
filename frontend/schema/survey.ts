import { section } from "./section";

export const survey = (questions: any) => {
  return {
    title: "Survey",
    properties: {
      sections: section(questions),
      name: {
        $id: "#/properties/modules/items/properties/survey/name",
        type: "string",
        title: "Name",
        description:
          "The name of the module. Basic HTML supported.",
        default: "",
        examples: ["Welcome"],
      },
      shuffle: {
        $id: "#/properties/modules/items/properties/survey/shuffle",
        type: "boolean",
        title: "Shuffle sections?",
        description:
          "Used for counterbalancing. If true, the order of the sections will be randomised every time the module is accessed.",
        default: false,
        examples: [false, true],
      },
      type: {
        title: "Type",
        type: "string",
        readOnly: true,
        default: "survey",
      },
    },
    required: ["sections", "shuffle", "name", "type"],
    additionalProperties: false,
  };
};
