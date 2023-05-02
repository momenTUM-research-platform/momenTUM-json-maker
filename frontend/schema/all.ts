export const studt_object = (
  conditions: string[],
  questions: SchemaEnum[],
  modules: SchemaEnum[]
) => {
  return {
    $schema: "http://json-schema.org/draft-07/schema",
    $id: "https://momenTUM.de/schema/v1/schema.json",
    type: "object",
    title: "MomenTUM survey creator",
    description:
      "This is the schema for the MomenTUM survey creator. For any questions/issues please see the repository: https://github.com/TUMChronobiology/momenTUM-json-maker. IDs must consist of ONLY lower-case letters, numbers, and underscores.",
    default: {},
    required: ["properties", "modules"],
    properties: {
      properties: {
        $id: "#/properties/properties",
        type: "object",
        title: "Properties",
        description: "Stores the metadata of the study",
        default: {},
        examples: [
          {
            study_name: "Demo",
            study_id: "3ZDOGAH",
            created_by: "Adrian Shatte",
            instructions: "This is a demo study showing the features of schema",
            post_url: "https://make.momentumresearch.eu/api/v1/response",
            empty_msg: "You're all up to date",
            banner_url: "https://getschema.app/img/schema_banner.png",
            support_url: "https://getschema.app",
            support_email: "hello@getschema.app",
            conditions: ["Control", "Treatment"],
            cache: false,
            ethics:
              "This study was approved by ethics body with approval #123456789",
            pls: "https://getschema.app/pls-file-link.pdf",
          },
        ],
        required: [
          "study_name",
          "study_id",
          "created_by",
          "post_url",
          "empty_msg",
          "banner_url",
          "conditions",
          "cache",
        ],
        properties: {
          study_name: {
            $id: "#/properties/properties/properties/study_name",
            type: "string",
            title: "Name",
            description: "The name of the current study.",
            default: "",
            examples: ["Demo"],
          },
          study_id: {
            $id: "#/properties/properties/properties/study_id",
            type: "string",
            pattern: "^[a-z0-9_]+$",
            title: "ID",
            description:
              "An identifier for the study which is sent to the server with response data.",
            default: "",
            examples: ["3ZDOGAH"],
          },
          created_by: {
            $id: "#/properties/properties/properties/created_by",
            type: "string",
            title: "Created by",
            description: "An explanation about the purpose of this instance.",
            default: "",
            examples: ["Adrian Shatte"],
          },
          instructions: {
            $id: "#/properties/properties/properties/instructions",
            type: "string",
            title: "Instructions",
            description:
              "Brief description/instructions for the study that is displayed in the app. Basic HTML supported.",
            default: "",
            examples: ["This is a demo study showing the features of schema"],
          },
          post_url: {
            $id: "#/properties/properties/properties/post_url",
            type: "string",
            title: "Post URL",
            description:
              "An endpoint to receive participant responses (POST data) from the app.",
            default: "https://tuspl22-momentum.srv.mwn.de/api/v1",
          },
          empty_msg: {
            $id: "#/properties/properties/properties/empty_msg",
            type: "string",
            title: "Empty Message",
            description:
              "A message displayed to the user when there are no tasks currently available to complete.",
            default: "",
            examples: ["You're all up to date"],
          },
          banner_url: {
            $id: "#/properties/properties/properties/banner_url",
            type: "string",
            title: "Banner URL",
            description:
              "The URL to an image that will be displayed on the home page of your study. It will be displayed at 100% width and maintain the aspect ratio of the original image.",
            default: "",
            examples: ["https://getschema.app/img/schema_banner.png"],
          },
          support_url: {
            $id: "#/properties/properties/properties/support_url",
            type: "string",
            title: "Support URL",
            description:
              "A web link to the study's homepage or support information that is linked to in the app.",
            default: "",
            examples: ["https://getschema.app"],
          },
          support_email: {
            $id: "#/properties/properties/properties/support_email",
            type: "string",
            title: "Support Email",
            description:
              "An email address that participants can contact for support with the study.",
            default: "",

            examples: ["hello@getschema.app"],
          },
          cache: {
            $id: "#/properties/properties/properties/cache",
            type: "boolean",
            title: "Cache Media?",
            description:
              "Indicates whether media elements will be cached for offline mode during study enrollment. Note: media should be optimised to reduce download times.",
            default: true,
          },
          ethics: {
            $id: "#/properties/properties/properties/ethics",
            type: "string",
            title: "Ethics Statement",
            description: "An ethics statement for the study.",
            default: "",
            examples: [
              "This study was approved by ethics body with approval #123456789",
            ],
          },
          pls: {
            $id: "#/properties/properties/properties/pls",
            type: "string",
            title: "Plain Language Statement",
            description:
              "A web URL to a PDF file containing the study's Plain Language Statement.",
            default: "",
            examples: ["https://getschema.app/pls-file-link.pdf"],
          },
          conditions: {
            $id: "#/properties/properties/properties/conditions",
            type: "array",
            title: "Conditions",
            description:
              "A list of conditions that participants can be randomised into.",
            default: ["Control", "Treatment"],
            examples: [["Control", "Treatment"]],
            items: {
              $id: "#/properties/properties/properties/conditions/items",
              type: "string",
            },
          },
        },
      },
      modules: {
        $id: "#/properties/modules",
        type: "array",
        title: "Modules",
        description:
          "Modules store the individual survey/intervention tasks that will be delivered to the participants.",
        default: [],
        items: {
          $id: "#/properties/modules/items",
          type: "object",
          required: [
            "name",
            "submit_text",
            "condition",
            "alerts",
            "graph",
            "id",
            "unlock_after",
            "params",
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
            params: {
              $id: "#/properties/modules/items/properties/params",
              type: "object",
              title: "Type",
              description:
                "The parameters of the module. Can be a survey object or a pvt object, but not both.",
              required: ["type"],
              dependencies: {
                type: {
                  oneOf: [
                    {
                      required: ["sections", "shuffle", "name"],
                      properties: {
                        type: {
                          enum: ["survey"],
                        },
                        sections: {
                          $id: "#/properties/modules/items/properties/survey/sections",
                          type: "array",
                          title: "Sections",
                          default: [],
                          description:
                            "The section of a survey. It can be multiple entries",
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
                              questions: {
                                $id: "#/properties/modules/items/properties/sections/items/properties/questions",
                                type: "array",
                                title: "Questions",
                                description:
                                  "An array containing all of the questions for this section of the module.",
                                default: [],
                                items: {
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
                                      description:
                                        "The label displayed alongside the question. Basic HTML supported.",
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
                                      oneOf: questions.map((q) => ({
                                        const: q.id,
                                        title: q.text,
                                      })),
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
                                        "Hide or show if answer equals hide value? ",
                                      description:
                                        "Indicates the branching behaviour. If true, the element will disappear if the value of the question equals hide_value. If false, the element will appear instead.",
                                      default: false,
                                      examples: [true],
                                      enumNames: ["Hide", "Show"],
                                    },
                                    rand_group: {
                                      $id: "#/properties/modules/items/properties/sections/items/properties/questions/items/anyOf/0/properties/rand_group",
                                      type: "string",
                                      title: "Random Group identifier",
                                      description:
                                        "An identifier that groups a set of elements together so that only one will randomly appear every time a module is accessed. Note: To identify which element was visible, it will be given a response value of 1. If the element can record a response this value will be replaced with that response. All hidden elements will record no response.",
                                      default: "",
                                      oneOf: [
                                        {
                                          const: "",
                                          title:
                                            "None (This will create an empty field, don't worry)",
                                        },
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
                                        "The primary type of this question. ",
                                      default: "instruction",
                                      enum: [
                                        "instruction",
                                        "datetime",
                                        "multi",
                                        "text",
                                        "slider",
                                        "media",
                                        "yesno",
                                      ],
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
                                            subtype: {
                                              type: "string",
                                              title: "Subtype",
                                              description:
                                                "The specific type of text input for this field.",
                                              enum: [
                                                "short",
                                                "long",
                                                "numeric",
                                              ],
                                            },
                                            type: {
                                              enum: ["text"],
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
                                              enum: [
                                                "date",
                                                "time",
                                                "datetime",
                                              ],
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
                                              description:
                                                "The label for a true/yes response.",
                                            },
                                            no_text: {
                                              type: "string",
                                              title: "No Text",
                                              description:
                                                "The label for a false/no response.",
                                            },
                                          },
                                        },
                                        {
                                          required: [
                                            "min",
                                            "max",
                                            "hint_left",
                                            "hint_right",
                                          ],
                                          properties: {
                                            type: {
                                              enum: ["slider"],
                                            },
                                            min: {
                                              type: "number",
                                              title: "Minimum",
                                              description:
                                                "The minimum value for the slider.",
                                            },
                                            max: {
                                              type: "number",
                                              title: "Maximum",
                                              description:
                                                "The maximum value for the slider.",
                                            },
                                            hint_left: {
                                              type: "string",
                                              title: "Hint Left",
                                              description:
                                                "The label for the left side of the slider.",
                                            },
                                            hint_right: {
                                              type: "string",
                                              title: "Hint Right",
                                              description:
                                                "The label for the right side of the slider.",
                                            },
                                          },
                                        },
                                        {
                                          required: [
                                            "radio",
                                            "modal",
                                            "shuffle",
                                            "options",
                                          ],
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
                                              description:
                                                "Denotes whether the selections should be shuffled.",
                                            },
                                            options: {
                                              type: "array",
                                              title: "Options",
                                              description:
                                                "The list of choices to display.",
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
                                              description:
                                                "The type of media. Accepted values are video, audio, and image.",
                                              enum: ["video", "audio", "image"],
                                              default: "video",
                                            },
                                            src: {
                                              type: "string",
                                              title: "Source",
                                              description:
                                                "A direct URL to the media source.",
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
                                },
                              },
                            },
                          },
                        },
                        name: {
                          $id: "#/properties/modules/items/properties/survey/name",
                          type: "string",
                          title: "Name",
                          description:
                            "The name of the module. Basic HTML supported.",
                          default: "",
                          examples: ["Welcome"],
                        },
                        shuffle: {
                          $id: "#/properties/modules/items/properties/survey/shuffle",
                          type: "boolean",
                          title: "Shuffle sections?",
                          description:
                            "Used for counterbalancing. If true, the order of the sections will be randomised every time the module is accessed.",
                          default: false,
                          examples: [false, true],
                        },
                      },
                    },
                  ],
                },
              },
              properties: {
                type: {
                  $id: "#/properties/modules/items/properties/params/type",
                  type: "string",
                  title: "Type",
                  description:
                    "The type of the module. Accepted values are survey, info or reaction-time-test.",
                  default: "survey",
                  enum: ["survey", "pvt"],
                },
              },
            },
            name: {
              $id: "#/properties/modules/items/properties/name",
              type: "string",
              title: "Name",
              description: "The name of the module. Basic HTML supported.",
              default: "",
              examples: ["Welcome"],
            },
            submit_text: {
              $id: "#/properties/modules/items/properties/submit_text",
              type: "string",
              title: "Submit Text",
              description:
                "The label of the submit button for this module. Note: this value appears only on the final section of a module.",
              default: "Submit",
              examples: ["Submit"],
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
            alerts: {
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
                "random", // TODO: conditionally display random interval depending on random
                "random_interval",
                "sticky", // Same for sticky label
                "sticky_label",
                "timeout",
                "timeout_after",
                "start_offset",
              ],
              properties: {
                title: {
                  $id: "#/properties/modules/items/properties/alerts/properties/title",
                  type: "string",
                  title: "Title",
                  description:
                    "The title that is displayed in the notification (main text).",
                  default: "",
                  examples: ["Welcome to the study"],
                },
                message: {
                  $id: "#/properties/modules/items/properties/alerts/properties/message",
                  type: "string",
                  title: "Message",
                  description:
                    "The message that is displayed in the notification (secondary text).",
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
                        description:
                          "The minute the alert should be displayed.",
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
            },
            graph: {
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
                      required: [
                        "variable",
                        "title",
                        "blurb",
                        "type",
                        "max_points",
                      ],
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
                          oneOf: questions.map((q) => ({
                            const: q.id,
                            title: q.text,
                          })),
                        },
                        title: {
                          $id: "#/properties/modules/items/properties/graph/properties/title",
                          type: "string",
                          title: "Title",
                          description:
                            "The title of the graph to be displayed in the Feedback tab.",
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
                          description:
                            "The type of graph to display. One of: bar or line",
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
            },
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
                oneOf: modules.map((m) => ({ const: m.id, title: m.text })),
              },
            },
          },
        },
      },
    },
  };
};
