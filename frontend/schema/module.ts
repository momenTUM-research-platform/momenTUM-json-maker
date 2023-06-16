import { alerts } from "./alerts";
import { graph } from "./graph";
import { params } from "./params";

export const module = (
  conditions: string[],
  questions: SchemaEnum[],
  modules: SchemaEnum[]
) => {
  return {
    $id: "#/properties/modules/items",
    type: "object",
    title: "Module",
    description: "This is the schema for the module.",
    required: [
      "name",
      "condition",
      "alerts",
      "graph",
      "id",
      "unlock_after"
    ],
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
        $id: "#/properties/modules/items/properties/name",
        type: "string",
        title: "Name",
        description: "The name of the module. Basic HTML supported.",
        default: "",
        examples: ["Welcome"],
        minLength: 3,
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
      graph: graph(questions!),
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
          pattern: "^[a-z0-9_]+$",
          oneOf: modules.length === 0 ? [{ const: "", title: "" }] : modules!.map((m) => ({ const: m.id, title: m.text })),
        },
      },
    },
  };
};
