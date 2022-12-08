import { question } from "./question";

export const section = {
  $id: "#/properties/modules/items/properties/sections/items",
  type: "object",
  required: ["name", "questions", "shuffle"],
  properties: {
    name: {
      $id: "#/properties/modules/items/properties/sections/items/properties/name",
      type: "string",
      title: "Section name",
      description: "The title of this section, which is displayed at the top of the screen.",
      default: "",
      examples: ["Welcome"],
    },
    shuffle: {
      $id: "#/properties/modules/items/properties/sections/items/properties/shuffle",
      type: "boolean",
      title: "Shuffle Sections?",
      description:
        "Used for counterbalancing. If true, the order of the questions in this section will be randomised.",
      default: false,
      examples: [false],
    },
    // questions: {
    //   $id: "#/properties/modules/items/properties/sections/items/properties/questions",
    //   type: "array",
    //   title: "Questions",
    //   description: "An array containing all of the questions for this section of the module.",
    //   default: [],
    //   examples: [
    //     [
    //       {
    //         id: "instruction-1wnjocfw",
    //         type: "instruction",
    //         text: "Hello! Welcome to the study! This module only shows for those enrolled in the control condition.",
    //         required: false,
    //         hide_id: "",
    //         hide_value: "",
    //         hide_if: true,
    //       },
    //     ],
    //   ],
    //   items: question,
    // },
  },
};
