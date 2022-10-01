import { module } from "./module";
import { properties } from "./properties";

export const schema = {
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
      items: module,
    },
  },
};
