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
          survey(questions),
          pvt
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
