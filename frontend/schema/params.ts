import { pvt } from "./pvt";
import { survey } from "./survey";
import { section } from "./section";

export const params = (questions: SchemaEnum[]) => {
  return {
    $id: "#/properties/modules/items/properties/params",
    type: "object",
    title: "Module Type",
    description:
      "The parameters of the module. Can be a survey object or a pvt object, but not both.",
    required: [],
    properties: {},
    oneOf: [survey(questions), pvt],
  };
};
