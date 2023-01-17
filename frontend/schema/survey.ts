import { section } from "./section";

export const survey = {
  properties: {
    type: {
      enum: ["survey"],
    },
    // sections: {
    //   $id: "#/properties/modules/items/properties/sections",
    //   type: "array",
    //   title: "Sections",
    //   description: "Sections contain questions",
    //   default: [],
    //   examples: [
    //     [
    //       {
    //         name: "Welcome",
    //         questions: [
    //           {
    //             id: "instruction-1wnjocfw",
    //             type: "instruction",
    //             text: "Hello! Welcome to the study! This module only shows for those enrolled in the control condition.",
    //             required: false,
    //             hide_id: "",
    //             hide_value: "",
    //             hide_if: true,
    //           },
    //         ],
    //         shuffle: false,
    //       },
    //     ],
    //   ],
    //   items: section,
    // },
    shuffle: {
      $id: "#/properties/modules/items/properties/shuffle",
      type: "boolean",
      title: "Shuffle sections?",
      description:
        "Used for counterbalancing. If true, the order of the sections will be randomised every time the module is accessed.",
      default: false,
      examples: [false, true],
    },
  },
  required: ["sections", "shuffle"],
};
