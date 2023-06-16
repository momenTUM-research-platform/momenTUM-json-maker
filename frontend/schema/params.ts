import { pvt } from "./pvt";
import { survey } from "./survey";
import { section } from "./section";
import { paramsPVT } from './paramsPVT';
import { paramsSurvey } from "./paramsSurvey";

export const params = (questions: SchemaEnum[]) => {
  return {
    $id: "#/properties/modules/items/properties/params",
    type: "object",
    title: "Module Type",
    description:
      "The parameters of the module. Can be a survey object or a pvt object, but not both.",
    oneOf: [paramsPVT, paramsSurvey(questions)],
  };
};
