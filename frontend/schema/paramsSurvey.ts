import { pvt } from "./pvt";
import { survey } from "./survey";
import { section } from "./section";

export const paramsSurvey = (questions: SchemaEnum[]) => {
  return {
    $id: "#/properties/modules/items/properties/params",
    type: "object",
    title: "Survey",
    description:
      "The parameters of the module. Can be a survey object or a pvt object, but not both.",
    required: ["id", "sections", "shuffle", "name", "type"],
    additionalProperties: false,
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
      name: {
        $id: "#/properties/modules/items/properties/survey/name",
        type: "string",
        title: "Name",
        description: "The name of the module. Basic HTML supported.",
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
  };
};
