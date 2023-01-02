export const question = (questions: QuestionEnum[]) => {
  return {
    $id: "#/properties/modules/items/properties/sections/items/properties/questions/items",
    type: "object",
    required: ["id", "type", "text", "required"],
    properties: {
      id: {
        $id: "#/properties/modules/items/properties/sections/items/properties/questions/items/anyOf/0/properties/id",
        type: "string",
        pattern: "^[a-z0-9_]+$",
        title: "Question ID",
        description:
          "A unique id to identify this question. This id is sent to the server along with any response value. Note: Every element in the entire study protocol must have a unique id for some features to function correctly.",
        default: "",
        examples: ["instruction-1wnjocfw"],
      },
      text: {
        $id: "#/properties/modules/items/properties/sections/items/properties/questions/items/anyOf/0/properties/text",
        type: "string",
        title: "Text",
        description: "The label displayed alongside the question. Basic HTML supported.",
        default: "",
        examples: [
          "Hello! Welcome to the study! This module only shows for those enrolled in the control condition.",
        ],
      },
      required: {
        $id: "#/properties/modules/items/properties/sections/items/properties/questions/items/anyOf/0/properties/required",
        type: "boolean",
        title: "Required",
        description:
          "Denotes whether this question is required to be answered. The app will force the participant to answer all required questions that are not hidden by branching.",
        default: false,
        examples: [false, true],
      },
      hide_id: {
        $id: "#/properties/modules/items/properties/sections/items/properties/questions/items/anyOf/0/properties/hide_id",
        type: "string",
        pattern: "^[a-z0-9_]+$",
        title: "Hide/Show for ID",
        description:
          "The id of the question that will trigger this question to dynamically show/hide. To use branching, you need to add two additional properties to the question object that is to be dynamically shown/hidden. Currently, branching is supported by the multi, yesno, and slider question types.",
        default: "none",
        oneOf: questions.map((q) => ({ const: q.id, title: q.text })),
      },
      hide_value: {
        $id: "#/properties/modules/items/properties/sections/items/properties/questions/items/anyOf/0/properties/hide_value",
        type: "string",
        title: "Hide/show value",
        description:
          "The value that needs to be selected in the question denoted by hide_id which will make this question appear. When using sliders, the value should be prefixed with a direction and is inclusive, e.g. >50 or <50.",
        default: "",
        examples: [""],
      },
      hide_if: {
        $id: "#/properties/modules/items/properties/sections/items/properties/questions/items/anyOf/0/properties/hide_if",
        type: "boolean",
        title:
          "Hide or show if answer equals hide value? Indicates the branching behaviour. If true, the element will disappear if the value of the question equals hide_value. If false, the element will appear instead.",
        description:
          "Indicates the branching behaviour. If true, the element will disappear if the value of the question equals hide_value. If false, the element will appear instead.",
        default: false,
        examples: [true],
      },
      rand_group: {
        $id: "#/properties/modules/items/properties/sections/items/properties/questions/items/anyOf/0/properties/rand_group",
        type: "string",
        title: "Random Group identifier",
        description:
          "An identifier that groups a set of elements together so that only one will randomly appear every time a module is accessed. Note: To identify which element was visible, it will be given a response value of 1. If the element can record a response this value will be replaced with that response. All hidden elements will record no response.",
        default: "",
        oneOf: [
          { const: "", title: "None (This will create an empty field, don't worry)" },
          { const: "A", title: "A" },
          { const: "B", title: "B" },
          { const: "C", title: "C" },
          { const: "D", title: "D" },
          { const: "E", title: "E" },
          { const: "F", title: "F" },
        ],
      },
      type: {
        $id: "#/properties/modules/items/properties/sections/items/properties/questions/items/anyOf/0/properties/type",
        type: "string",
        title: "Type",
        description:
          "The primary type of this question. Accepted values are instruction, datetime, multi, text, slider, video, audio, and yesno.",
        default: "instruction",
        enum: ["instruction", "datetime", "multi", "text", "slider", "media", "yesno"],
      },
    },
    dependencies: {
      type: {
        oneOf: [
          {
            properties: {
              type: {
                const: "instruction",
              },
            },
          },
          {
            required: ["subtype"],
            properties: {
              type: {
                enum: ["text"],
              },
              subtype: {
                type: "string",
                title: "Subtype",
                description:
                  "The specific type of text input for this field. Accepted values are short, long, and numeric.",
              },
            },
          },
          {
            required: ["subtype"],
            properties: {
              type: {
                enum: ["datetime"],
              },
              subtype: {
                type: "string",
                title: "Subtype",
                enum: ["date", "time", "datetime"],
                description:
                  "The specific type of date/time input for this field. Accepted values are date (datepicker only), time (timepicker only), and datetime (both).",
              },
            },
          },
          {
            required: ["yes_text", "no_text"],
            properties: {
              type: {
                enum: ["yesno"],
              },
              yes_text: {
                type: "string",
                title: "Yes Text",
                description: "The label for a true/yes response.",
              },
              no_text: {
                type: "string",
                title: "No Text",
                description: "The label for a false/no response.",
              },
            },
          },
          {
            required: ["min", "max", "hint_left", "hint_right"],
            properties: {
              type: {
                enum: ["slider"],
              },
              min: {
                type: "number",
                title: "Minimum",
                description: "The minimum value for the slider.",
              },
              max: {
                type: "number",
                title: "Maximum",
                description: "The maximum value for the slider.",
              },
              hint_left: {
                type: "string",
                title: "Hint Left",
                description: "The label for the left side of the slider.",
              },
              hint_right: {
                type: "string",
                title: "Hint Right",
                description: "The label for the right side of the slider.",
              },
            },
          },
          {
            required: ["radio", "modal", "shuffle", "options"],
            properties: {
              type: {
                enum: ["multi"],
              },
              radio: {
                type: "boolean",
                title: "Radio buttons?",
                description:
                  "Denotes whether the multiple choice should be radio buttons (one selection only) or checkboxes (multiple selections allowed).",
              },
              modal: {
                type: "boolean",
                title: "Modal?",
                description:
                  "Denotes whether the selections should appear in a modal popup (good for longer lists)",
              },
              shuffle: {
                type: "boolean",
                title: "Shuffle?",
                description: "Denotes whether the selections should be shuffled.",
              },
              options: {
                type: "array",
                title: "Options",
                description: "The list of choices to display.",
                items: {
                  type: "string",
                },
              },
            },
          },
          {
            required: ["subtype", "src"],
            properties: {
              type: {
                enum: ["media"],
              },
              subtype: {
                type: "string",
                title: "Subtype",
                description: "The type of media. Accepted values are video, audio, and image.",
                enum: ["video", "audio", "image"],
                default: "video",
              },
              src: {
                type: "string",
                title: "Source",
                description: "A direct URL to the media source.",
              },
            },
            dependencies: {
              subtype: {
                oneOf: [
                  {
                    properties: {
                      subtype: {
                        const: "video",
                      },
                      thumb: {
                        type: "string",
                        title: "Thumbnail",
                        description:
                          "Required for video elements. A direct URL to the placeholder image that is displayed in the video player while loading.",
                      },
                    },
                    required: ["thumb"],
                  },
                  {
                    properties: {
                      subtype: {
                        const: "audio",
                      },
                    },
                  },
                  {
                    properties: {
                      subtype: {
                        const: "image",
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    },
  };
};
