import { question } from "./question";

export const section = (questions: any) => {
  return {
    $id: "#/properties/modules/items/properties/survey/sections",
    type: "array",
    title: "Sections",
    default: [],
    description: "The section of a survey. It can be multiple entries",
    items: {
      $id: "#/properties/modules/items/properties/sections/items",
      type: "object",
      required: ["name", "questions", "shuffle"],
      properties: {
        name: {
          $id: "#/properties/modules/items/properties/sections/items/properties/name",
          type: "string",
          title: "Section name",
          description:
            "The title of this section, which is displayed at the top of the screen.",
          default: "",
          examples: ["Welcome"],
        },
        shuffle: {
          $id: "#/properties/modules/items/properties/sections/items/properties/shuffle",
          type: "boolean",
          title: "Shuffle Questions?",
          description:
            "Used for counterbalancing. If true, the order of the questions in this section will be randomised.",
          default: false,
          examples: [false],
        },
        questions: question(questions)
      },
    },
  };
};
