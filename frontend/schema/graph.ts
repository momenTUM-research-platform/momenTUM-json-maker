export const graph = (questions: SchemaEnum[]) => {
  return {
    $id: "#/properties/modules/items/properties/graph",
    type: "object",
    title: "Graph",
    description: "Graphs allow visualisation of study data.",
    default: {},
    examples: [
      {
        display: false,
      },
    ],
    required: ["display"],
    properties: {
      display: {
        $id: "#/properties/modules/items/properties/graph/properties/display",
        type: "boolean",
        title: "Display graph?",
        description:
          "Indicates whether this module displays a feedback graph in the Feedback tab. If the value is false, the remaining variables are ignored.",
        default: false,
        enum: [true, false],
      },
    },
    dependencies: {
      display: {
        oneOf: [
          {
            properties: {
              display: {
                enum: [false],
              },
            },
          },
          {
            required: ["variable", "title", "blurb", "type", "max_points"],
            properties: {
              display: {
                enum: [true],
              },
              variable: {
                $id: "#/properties/modules/items/properties/graph/properties/variable",
                type: "string",
                title: "Variable",
                description:
                  "The id of a question object to graph. It must match one of the module's question ids.",
                default: "none",

                oneOf: questions.map((q) => ({ const: q.id, title: q.text })),
              },
              title: {
                $id: "#/properties/modules/items/properties/graph/properties/title",
                type: "string",
                title: "Title",
                description: "The title of the graph to be displayed in the Feedback tab.",
                default: "",
                examples: [""],
              },
              blurb: {
                $id: "#/properties/modules/items/properties/graph/properties/blurb",
                type: "string",
                title: "Blurb",
                description:
                  "A brief description of the graph to be displayed below it in the feedback tab. Basic HTML supported.",
                default: "",
                examples: [""],
              },
              type: {
                $id: "#/properties/modules/items/properties/graph/properties/type",
                type: "string",
                title: "Type",
                description: "The type of graph to display. One of: bar or line",
                default: "bar",
                enum: ["bar", "line"],
                examples: ["bar", "line"],
              },
              max_points: {
                $id: "#/properties/modules/items/properties/graph/properties/max_points",
                type: "integer",
                title: "Max points",
                description:
                  "The maximum number of data points to display in the graph, e.g. 10 will only show the ten most recent responses.",
                default: 10,
                examples: [0, 10],
              },
            },
          },
        ],
      },
    },
  };
};
