export const pvt = {
  properties: {
    type: {
      enum: ["pvt"],
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
      description: "How long until timeout when the user does not react? In milliseconds",
    },
    show: {
      type: "boolean",
      title: "Show results to the user?",
    },
    exit: {
      type: "boolean",
      title: "Enable exit from pvt?",
    },
  },
  required: ["trials", "min_waiting", "max_waiting", "max_reaction"],
};
