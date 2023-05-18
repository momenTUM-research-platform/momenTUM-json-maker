import { pvt } from "./pvt";
import { survey } from "./survey";
import { section } from "./section";

export const paramsPVT = () => {
  return {
    $id: "#/properties/modules/items/properties/params",
    type: "object",
    title: "PVT",
    description:
      "The parameters of the module. Can be a survey object or a pvt object, but not both.",
    required: [
      "type",
      "id",
      "trials",
      "min_waiting",
      "max_waiting",
      "max_reaction",
    ],
    properties: {
      id: {
        $id: "#/properties/modules/items/params/properties/pvt/id",
        type: "string",
        pattern: "^[a-z0-9_]+$",
        title: "Unique identifier",
        description:
          "A unique identifier for this module. Will be generated if not provided. Must be lowercase and only letters, numbers and underscores. Cannot begin with a number",
        default: "",
        examples: [""],
      },
      trials: {
        minimum: 0,
        type: "number",
        title: "Number of trials",
        description: "How many trials should be displayed to the user?",
      },
      min_waiting: {
        minimum: 0,
        type: "number",
        title: "Minimum waiting period",
        description:
          "How long should the user minimally have to wait before the trigger?  In milliseconds",
      },
      max_waiting: {
        type: "number",
        minimum: 0,
        title: "Maximum waiting period",
        description:
          "How long should the user maximally have to wait before the trigger? In milliseconds",
      },
      max_reaction: {
        type: "number",
        title: "Time to timeout",
        minimum: 0,
        description:
          "How long until timeout when the user does not react? In milliseconds",
      },
      show: {
        type: "boolean",
        title: "Show results to the user?",
      },
      exit: {
        type: "boolean",
        title: "Enable exit from pvt?",
      },
      type: {
        title: "Type",
        type: "string",
        readOnly: true,
        default: "pvt",
      },
    },

    additionalProperties: false,
  };
};
