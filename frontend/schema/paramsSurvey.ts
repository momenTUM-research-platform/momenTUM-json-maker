export const paramsSurvey = (questions: SchemaEnum[]) => {
  return {
    $id: "#/properties/modules/items/properties/params/survey",
    type: "object",
    title: "Survey",
    description:
      "The parameters of the module. Can be a survey object or a PVT object, but not both.",
    properties: {
      id: {
        $id: "#/properties/modules/items/properties/params/survey/id",
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
        enum: ["survey"],
      },
      name: {
        $id: "#/properties/modules/items/properties/params/survey/name",
        type: "string",
        title: "Name",
        description: "The name of the module. Basic HTML supported.",
      },
      shuffle: {
        $id: "#/properties/modules/items/properties/params/survey/shuffle",
        type: "boolean",
        title: "Shuffle sections?",
        description:
          "Used for counterbalancing. If true, the order of the sections will be randomized every time the module is accessed.",
      },
    },
    required: ["sections", "type", "name", "shuffle"],
  };
};
