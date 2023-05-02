import { pvt } from "./pvt";
import { survey } from "./survey";
import { section } from './section';

export const params = (questions: SchemaEnum[]) => {
  return {
    $id: "#/properties/modules/items/properties/params",
    type: "object",
    title: "Type",
    description:
      "The parameters of the module. Can be a survey object or a pvt object, but not both.",
    required: ["type"],
    dependencies: {
      type: {
        oneOf: [
          {
            required: ["sections", "shuffle", "name"],
            properties: {
              type: {
                enum: ["survey"],
              },
              sections: {
                $id: "#/properties/modules/items/properties/survey/sections",
                type: "array",
                title: "Sections",
                default: [],
                description:
                  "The section of a survey. It can be multiple entries",
                items: section(questions),
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
            },
          },
          pvt,
        ],
      },
    },
    properties: {
      type: {
        $id: "#/properties/modules/items/properties/params/type",
        type: "string",
        title: "Type",
        description:
          "The type of the module. Accepted values are survey, info or reaction-time-test.",
        default: "survey",
        enum: ["survey", "pvt"],
      },
    },
  };
};
