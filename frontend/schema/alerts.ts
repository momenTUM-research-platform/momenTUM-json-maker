export const alerts = {
  $id: "#/properties/modules/items/properties/alerts",
  type: "object",
  title: "Alerts",
  description: "Define alerts to be displayed to the user.",
  default: {},
  examples: [
    {
      title: "Welcome to the study",
      message: "Tap to open the app",
      duration: 1,
      times: [
        {
          hours: 8,
          minutes: 30,
        },
      ],
      random: true,
      random_interval: 30,
      sticky: true,
      sticky_label: "Start here",
      timeout: false,
      timeout_after: 0,
      start_offset: 0,
    },
  ],
  required: [
    "title",
    "message",
    "duration",
    "times",
    "random", // TODO: conditionally diplay random interval depending on random
    "random_interval",
    "sticky", // Same for sticky label
    "timeout",
    "timeout_after",
    "start_offset",
  ],
  properties: {
    title: {
      $id: "#/properties/modules/items/properties/alerts/properties/title",
      type: "string",
      title: "Title",
      description: "The title that is displayed in the notification (main text).",
      default: "",
      examples: ["Welcome to the study"],
    },
    message: {
      $id: "#/properties/modules/items/properties/alerts/properties/message",
      type: "string",
      title: "Message",
      description: "The message that is displayed in the notification (secondary text).",
      default: "",
      examples: ["Tap to open the app"],
    },
    duration: {
      $id: "#/properties/modules/items/properties/alerts/properties/duration",
      type: "integer",
      title: "Duration",
      description:
        "Indicates the number of consecutive days that the module should be scheduled to display. If 0, the module will not be shown.",
      default: 1,
      examples: [1],
    },
    times: {
      $id: "#/properties/modules/items/properties/alerts/properties/times",
      type: "array",
      title: "Scheduled times",
      description:
        "The times that this module should be scheduled for each day. For example, if the module is scheduled for 3 days, and times is set to [{hours: 8, minutes: 30}, {hours: 12, minutes: 0}], then the module will be scheduled 6 times on 3 consecutive days.",
      default: [],
      examples: [
        [
          {
            hours: 8,
            minutes: 30,
          },
        ],
      ],
      items: {
        type: "object",
        examples: [
          {
            hours: 8,
            minutes: 30,
          },
        ],
        required: ["hours", "minutes"],
        properties: {
          hours: {
            $id: "#/properties/modules/items/properties/alerts/properties/times/items/anyOf/0/properties/hours",
            type: "integer",
            title: "Hour",
            description: "The hour the alert should be displayed. ",
            default: 8,
            minimum: 0,
            maximum: 23,
            examples: [8],
          },
          minutes: {
            $id: "#/properties/modules/items/properties/alerts/properties/times/items/anyOf/0/properties/minutes",
            type: "integer",
            title: "Minute",
            description: "The minute the alert should be displayed.",
            default: 0,
            minimum: 0,
            maximum: 59,
            examples: [30],
          },
        },
      },
    },
    random: {
      $id: "#/properties/modules/items/properties/alerts/properties/random",
      type: "boolean",
      title: "Randomised alerts?",
      description:
        "Indicates whether the alert times should be randomised. If true, each value from times will be set using the value of random_interval.",
      default: false,
      examples: [true],
    },
    random_interval: {
      $id: "#/properties/modules/items/properties/alerts/properties/random_interval",
      type: "integer",
      title: "Random interval",
      description:
        "The number of minutes before and after that an alert time should be randomised. For example, if the alert is scheduled for 8.30am and the random_interval is 30, the alert will be scheduled randomly between 8 and 9am.",
      default: 0,
      examples: [30],
    },
    sticky: {
      $id: "#/properties/modules/items/properties/alerts/properties/sticky",
      type: "boolean",
      title: "Sticky?",
      description:
        "Indicates whether the module should remain available in the Tasks list upon response, allowing the user to access this module repeatedly.",
      default: false,
      examples: [true],
    },
    sticky_label: {
      $id: "#/properties/modules/items/properties/alerts/properties/sticky_label",
      type: "string",
      title: "Sticky label",
      description:
        "A title that appears above a sticky module on the home screen. Multiple sticky modules that are set to appear in succession will be grouped under this title.",
      default: "",
      examples: ["Start here"],
    },
    timeout: {
      $id: "#/properties/modules/items/properties/alerts/properties/timeout",
      type: "boolean",
      title: "Timeout?",
      description:
        "If timeout is true, the task will disappear from the list after the number of milliseconds specified in timeout_after have elapsed (if the module is not completed before this time).",
      default: false,
      examples: [false],
    },
    timeout_after: {
      $id: "#/properties/modules/items/properties/alerts/properties/timeout_after",
      type: "integer",
      title: "Timeout after",
      description:
        "The number of milliseconds after a task is displayed that it will disappear from the list. Timeout must be true for this to have any effect.",
      default: 0,
      examples: [0],
    },
    start_offset: {
      $id: "#/properties/modules/items/properties/alerts/properties/start_offset",
      type: "integer",
      title: "Start offset",
      description:
        "Indicates when the module should first be displayed to the user, where zero is the day that the participant enrolled.",
      default: 1,
      examples: [0],
    },
  },
};
