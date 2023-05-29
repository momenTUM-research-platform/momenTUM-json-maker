export const paramsPVT = {
  $id: "#/properties/modules/items/properties/params/pvt",
  type: "object",
  title: "PVT",
  description:
    "The parameters of the module. Can be a survey object or a PVT object, but not both.",
  properties: {
    id: {
      $id: "#/properties/modules/items/properties/params/pvt/id",
      type: "string",
      pattern: "^[a-z0-9_]+$",
      title: "Unique identifier",
      description:
        "A unique identifier for this module. Will be generated if not provided. Must be lowercase and only letters, numbers and underscores. Cannot begin with a number",
      default: "",
      examples: [""],
    },
    type: {
      type: "string",
      readOnly: true,
      enum: ["pvt"],
    },
    trials: {
      $id: "#/properties/modules/items/properties/params/pvt/trials",
      type: "number",
      minimum: 0,
      title: "Number of trials",
      description: "How many trials should be displayed to the user?",
    },
    min_waiting: {
      $id: "#/properties/modules/items/properties/params/pvt/min_waiting",
      type: "number",
      minimum: 0,
      title: "Minimum waiting period",
      description:
        "How long should the user minimally have to wait before the trigger? In milliseconds",
    },
    max_waiting: {
      $id: "#/properties/modules/items/properties/params/pvt/max_waiting",
      type: "number",
      minimum: 0,
      title: "Maximum waiting period",
      description:
        "How long should the user maximally have to wait before the trigger? In milliseconds",
    },
    max_reaction: {
      $id: "#/properties/modules/items/properties/params/pvt/max_reaction",
      type: "number",
      minimum: 0,
      title: "Time to timeout",
      description:
        "How long until timeout when the user does not react? In milliseconds",
    },
    show: {
      $id: "#/properties/modules/items/properties/params/pvt/show",
      type: "boolean",
      title: "Show results to the user?",
    },
    exit: {
      $id: "#/properties/modules/items/properties/params/pvt/exit",
      type: "boolean",
      title: "Enable exit from PVT?",
    },
  },
  required: ["type", "trials", "min_waiting", "max_waiting", "max_reaction"],
};
