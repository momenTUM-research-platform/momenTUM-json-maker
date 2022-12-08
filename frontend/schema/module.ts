import { useStore } from "../src/state";
import { alerts } from "./alerts";
import { graph } from "./graph";
import { pvt } from "./pvt";
import { survey } from "./survey";

export const module = (conditions: string[]) => {
  return {
    $id: "#/properties/modules/items",
    type: "object",
    required: [
      "type",
      "name",
      "submit_text",
      "alerts",
      "graph",
      "sections",
      "shuffle",
      "condition",
      "id",
      "unlock_after",
    ],
    dependencies: {
      type: {
        oneOf: [
          // Info/video/audio/video implementation is not specified
          {
            properties: {
              type: {
                enum: ["info", "video", "audio"],
              },
              placeholder: {
                type: "string",
                title: "Not implemented yet",
                description: "Something will be here in the future",
              },
            },
          },
          pvt,
          survey,
        ],
      },
    },
    properties: {
      id: {
        $id: "#/properties/modules/items/properties/id",
        type: "string",
        pattern: "^[a-z][a-z0-9_]+$",
        title: "Unique identifier",
        description:
          "A unique identifier for this module. Will be generated if not provided. Must be lowercase and only letters, numbers and underscores. Cannot begin with a number",
        default: "",
        examples: [""],
      },
      type: {
        $id: "#/properties/modules/items/properties/type",
        type: "string",
        title: "Type",
        description:
          "The type of the module. Accepted values are survey, info, video, and audio or reaction-time-test.",
        default: "survey",
        enum: ["survey", "info", "video", "audio", "pvt"],
      },
      name: {
        $id: "#/properties/modules/items/properties/name",
        type: "string",
        title: "Name",
        description: "The name of the module. Basic HTML supported.",
        default: "",
        examples: ["Welcome"],
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
      graph: graph,
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
          pattern: "^[a-zA-Z0-9_]+$",
          enum: [""],
        },
      },
    },
  };
};
