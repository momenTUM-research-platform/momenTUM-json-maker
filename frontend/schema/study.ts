import { properties } from "./properties";
import { module } from "./module";

export const study = (conditions: string[], questions: SchemaEnum[], modules: SchemaEnum[]) => {
  console.log("Types: ", typeof(properties));
  console.log("Types: ", typeof(module(conditions, questions, modules)));
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
      modules: module(conditions, questions, modules),
    },
  };
};
