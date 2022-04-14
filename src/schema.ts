export  const schema = {
    "$schema": "http://json-schema.org/draft-07/schema",
    "$id": "http://example.com/example.json",
    "type": "object",
    "title": "MomenTUM survey creator",
    "description": "This is the schema for the MomenTUM survey creator. For any questions/issues please see the repository: https://github.com/TUMChronobiology/momenTUM-json-maker",
    "default": {},
    "examples": [
      {
        "properties": {
          "study_name": "Demo",
          "study_id": "3ZDOGAH",
          "created_by": "Adrian Shatte",
          "instructions": "This is a demo study showing the features of schema",
          "post_url": "https://tuspl22-momentum.srv.mwn.de/post.php",
          "empty_msg": "You're all up to date",
          "banner_url": "https://getschema.app/img/schema_banner.png",
          "support_url": "https://getschema.app",
          "support_email": "hello@getschema.app",
          "conditions": [
            "Control",
            "Treatment"
          ],
          "cache": false,
          "ethics": "This study was approved by ethics body with approval #123456789",
          "pls": "https://getschema.app/pls-file-link.pdf"
        },
        "modules": [
          {
            "type": "info",
            "name": "Welcome",
            "submit_text": "Submit",
            "alerts": {
              "title": "Welcome to the study",
              "message": "Tap to open the app",
              "duration": 1,
              "times": [
                {
                  "hours": 8,
                  "minutes": 30
                }
              ],
              "random": true,
              "random_interval": 30,
              "sticky": true,
              "sticky_label": "Start here",
              "timeout": false,
              "timeout_after": 0,
              "start_offset": 0
            },
            "graph": {
              "display": false
            },
            "sections": [
              {
                "name": "Welcome",
                "questions": [
                  {
                    "id": "instruction-1wnjocfw",
                    "type": "instruction",
                    "text": "Hello! Welcome to the study! This module only shows for those enrolled in the control condition.",
                    "required": false,
                    "hide_id": "",
                    "hide_value": "",
                    "hide_if": true
                  }
                ],
                "shuffle": false
              }
            ],
            "shuffle": false,
            "condition": "Control",
            "uuid": "3fb09fcd-4fca-4074-a395-34d65ee5a521",
            "unlock_after": []
          },
          {
            "type": "survey",
            "name": "Elements",
            "submit_text": "Submit",
            "alerts": {
              "title": "Elements Demo",
              "message": "Tap to open app",
              "duration": 5,
              "times": [
                {
                  "hours": 9,
                  "minutes": 30
                },
                {
                  "hours": 12,
                  "minutes": 30
                },
                {
                  "hours": 15,
                  "minutes": 30
                },
                {
                  "hours": 18,
                  "minutes": 30
                }
              ],
              "random": true,
              "random_interval": 30,
              "sticky": false,
              "sticky_label": "",
              "timeout": true,
              "timeout_after": 30,
              "start_offset": 1
            },
            "graph": {
              "display": true,
              "title": "Slider Graph",
              "blurb": "This graph displays the values from the slider element as a bar graph, displaying the past 7 responses.",
              "variable": "slider-0yih1evt",
              "type": "bar",
              "max_points": 7
            },
            "sections": [
              {
                "name": "Section 1",
                "questions": [
                  {
                    "id": "instruction-pvke1yey",
                    "type": "instruction",
                    "text": "This is an instruction type.",
                    "required": false,
                    "hide_id": "",
                    "hide_value": "",
                    "hide_if": true
                  },
                  {
                    "id": "text-71nnpqzi",
                    "type": "text",
                    "text": "This is a text input type.",
                    "required": true,
                    "hide_id": "",
                    "hide_value": "",
                    "hide_if": true,
                    "subtype": "short"
                  },
                  {
                    "id": "datetime-79ygddzl",
                    "type": "datetime",
                    "text": "This is a date input type (date only).",
                    "required": true,
                    "hide_id": "",
                    "hide_value": "",
                    "hide_if": true,
                    "subtype": "date"
                  },
                  {
                    "id": "multi-q8bohlar",
                    "type": "multi",
                    "text": "This is a multiple choice type with branching demo.",
                    "required": true,
                    "hide_id": "",
                    "hide_value": "",
                    "hide_if": true,
                    "modal": false,
                    "radio": true,
                    "shuffle": true,
                    "options": [
                      "apple",
                      "orange",
                      "banana"
                    ]
                  },
                  {
                    "id": "instruction-mof4ymv4",
                    "type": "instruction",
                    "text": "This will only show if the user selects banana from the previous question",
                    "required": false,
                    "hide_id": "multi-q8bohlar",
                    "hide_value": "banana",
                    "hide_if": false
                  }
                ],
                "shuffle": false
              },
              {
                "name": "Section 2",
                "questions": [
                  {
                    "id": "media-o3p069gi",
                    "type": "media",
                    "text": "This is a media type.",
                    "required": false,
                    "hide_id": "",
                    "hide_value": "",
                    "hide_if": true,
                    "subtype": "image",
                    "src": "https://getschema.app/img/schema_banner.jpg",
                    "thumb": ""
                  },
                  {
                    "id": "slider-0yih1evt",
                    "type": "slider",
                    "text": "This is a slider type",
                    "required": true,
                    "hide_id": "",
                    "hide_value": "",
                    "hide_if": true,
                    "min": 0,
                    "max": 10,
                    "hint_left": "less",
                    "hint_right": "more"
                  },
                  {
                    "id": "yesno-mv09ggb1",
                    "type": "yesno",
                    "text": "This is a switch",
                    "required": true,
                    "hide_id": "",
                    "hide_value": "",
                    "hide_if": true,
                    "yes_text": "Yes",
                    "no_text": "No"
                  }
                ],
                "shuffle": false
              }
            ],
            "shuffle": false,
            "condition": "*",
            "uuid": "dee87a08-8616-453a-9a6e-9e8f8ea9c942",
            "unlock_after": []
          }
        ]
      }
    ],
    "required": [
      "properties",
      "modules"
    ],
    "properties": {
      "properties": {
        "$id": "#/properties/properties",
        "type": "object",
        "title": "Properties",
        "description": "Stores the metadata of the study",
        "default": {},
        "examples": [
          {
            "study_name": "Demo",
            "study_id": "3ZDOGAH",
            "created_by": "Adrian Shatte",
            "instructions": "This is a demo study showing the features of schema",
            "post_url": "https://tuspl22-momentum.srv.mwn.de/post.php",
            "empty_msg": "You're all up to date",
            "banner_url": "https://getschema.app/img/schema_banner.png",
            "support_url": "https://getschema.app",
            "support_email": "hello@getschema.app",
            "conditions": [
              "Control",
              "Treatment"
            ],
            "cache": false,
            "ethics": "This study was approved by ethics body with approval #123456789",
            "pls": "https://getschema.app/pls-file-link.pdf"
          }
        ],
        "required": [
          "study_name",
          "study_id",
          "created_by",
          "instructions",
          "post_url",
          "empty_msg",
          "banner_url",
          "support_url",
          "support_email",
          "conditions",
          "cache",
          "ethics",
          "pls"
        ],
        "properties": {
          "study_name": {
            "$id": "#/properties/properties/properties/study_name",
            "type": "string",
            "title": "Name",
            "description": "The name of the current study.",
            "default": "",
            "examples": [
              "Demo"
            ]
          },
          "study_id": {
            "$id": "#/properties/properties/properties/study_id",
            "type": "string",
            "title": "ID",
            "description": "An identifier for the study which is sent to the server with response data.",
            "default": "",
            "examples": [
              "3ZDOGAH"
            ]
          },
          "created_by": {
            "$id": "#/properties/properties/properties/created_by",
            "type": "string",
            "title": "The created_by schema",
            "description": "An explanation about the purpose of this instance.",
            "default": "",
            "examples": [
              "Adrian Shatte"
            ]
          },
          "instructions": {
            "$id": "#/properties/properties/properties/instructions",
            "type": "string",
            "title": "Instructions",
            "description": "Brief description/instructions for the study that is displayed in the app. Basic HTML supported.",
            "default": "",
            "examples": [
              "This is a demo study showing the features of schema"
            ]
          },
          "post_url": {
            "$id": "#/properties/properties/properties/post_url",
            "type": "string",
            "title": "Post URL",
            "description": "An endpoint to receive participant responses (POST data) from the app.",
            "default": "https://tuspl22-momentum.srv.mwn.de/post.php",
            "examples": [
              "https://tuspl22-momentum.srv.mwn.de/post.php"
            ]
          },
          "empty_msg": {
            "$id": "#/properties/properties/properties/empty_msg",
            "type": "string",
            "title": "The empty_msg schema",
            "description": "An explanation about the purpose of this instance.",
            "default": "",
            "examples": [
              "You're all up to date"
            ]
          },
          "banner_url": {
            "$id": "#/properties/properties/properties/banner_url",
            "type": "string",
            "title": "Banner URL",
            "description": "The URL to an image that will be displayed on the home page of your study. It will be displayed at 100% width and maintain the aspect ratio of the original image.",
            "default": "",
            "examples": [
              "https://getschema.app/img/schema_banner.png"
            ]
          },
          "support_url": {
            "$id": "#/properties/properties/properties/support_url",
            "type": "string",
            "title": "Support URL",
            "description": "A web link to the study's homepage or support information that is linked to in the app.",
            "default": "",
            "examples": [
              "https://getschema.app"
            ]
          },
          "support_email": {
            "$id": "#/properties/properties/properties/support_email",
            "type": "string",
            "title": "Support Email",
            "description": "An email address that participants can contact for support with the study.",
            "default": "",
            "examples": [
              "hello@getschema.app"
            ]
          },
          "conditions": {
            "$id": "#/properties/properties/properties/conditions",
            "type": "array",
            "title": "Conditions",
            "description": "A list of conditions that participants can be randomised into.",
            "default": [],
            "examples": [
              [
                "Control",
                "Treatment"
              ]
            ],
            "additionalItems": true,
            "items": {
              "$id": "#/properties/properties/properties/conditions/items",
              "anyOf": [
                {
                  "$id": "#/properties/properties/properties/conditions/items/anyOf/0",
                  "type": "string",
                  "title": "The first anyOf schema",
                  "description": "An explanation about the purpose of this instance.",
                  "default": "",
                  "examples": [
                    "Control",
                    "Treatment"
                  ]
                }
              ]
            }
          },
          "cache": {
            "$id": "#/properties/properties/properties/cache",
            "type": "boolean",
            "title": "Cache Media?",
            "description": "Indicates whether media elements will be cached for offline mode during study enrollment. Note: media should be optimised to reduce download times.",
            "default": false,
            "examples": [
              false
            ]
          },
          "ethics": {
            "$id": "#/properties/properties/properties/ethics",
            "type": "string",
            "title": "Ethics Statement",
            "description": "An ethics statement for the study.",
            "default": "",
            "examples": [
              "This study was approved by ethics body with approval #123456789"
            ]
          },
          "pls": {
            "$id": "#/properties/properties/properties/pls",
            "type": "string",
            "title": "Plain Language Statement",
            "description": "A web URL to a PDF file containing the study's Plain Language Statement.",
            "default": "",
            "examples": [
              "https://getschema.app/pls-file-link.pdf"
            ]
          }
        }
      },
      "modules": {
        "$id": "#/properties/modules",
        "type": "array",
        "title": "Modules",
        "description": "Modules store the individual survey/intervention tasks that will be delivered to the participants.",
        "default": [],
        "examples": [
          [
            {
              "type": "info",
              "name": "Welcome",
              "submit_text": "Submit",
              "alerts": {
                "title": "Welcome to the study",
                "message": "Tap to open the app",
                "duration": 1,
                "times": [
                  {
                    "hours": 8,
                    "minutes": 30
                  }
                ],
                "random": true,
                "random_interval": 30,
                "sticky": true,
                "sticky_label": "Start here",
                "timeout": false,
                "timeout_after": 0,
                "start_offset": 0
              },
              "graph": {
                "display": false
              },
              "sections": [
                {
                  "name": "Welcome",
                  "questions": [
                    {
                      "id": "instruction-1wnjocfw",
                      "type": "instruction",
                      "text": "Hello! Welcome to the study! This module only shows for those enrolled in the control condition.",
                      "required": false,
                      "hide_id": "",
                      "hide_value": "",
                      "hide_if": true
                    }
                  ],
                  "shuffle": false
                }
              ],
              "shuffle": false,
              "condition": "Control",
              "uuid": "3fb09fcd-4fca-4074-a395-34d65ee5a521",
              "unlock_after": []
            },
            {
              "type": "survey",
              "name": "Elements",
              "submit_text": "Submit",
              "alerts": {
                "title": "Elements Demo",
                "message": "Tap to open app",
                "duration": 5,
                "times": [
                  {
                    "hours": 9,
                    "minutes": 30
                  },
                  {
                    "hours": 12,
                    "minutes": 30
                  },
                  {
                    "hours": 15,
                    "minutes": 30
                  },
                  {
                    "hours": 18,
                    "minutes": 30
                  }
                ],
                "random": true,
                "random_interval": 30,
                "sticky": false,
                "sticky_label": "",
                "timeout": true,
                "timeout_after": 30,
                "start_offset": 1
              },
              "graph": {
                "display": true,
                "title": "Slider Graph",
                "blurb": "This graph displays the values from the slider element as a bar graph, displaying the past 7 responses.",
                "variable": "slider-0yih1evt",
                "type": "bar",
                "max_points": 7
              },
              "sections": [
                {
                  "name": "Section 1",
                  "questions": [
                    {
                      "id": "instruction-pvke1yey",
                      "type": "instruction",
                      "text": "This is an instruction type.",
                      "required": false,
                      "hide_id": "",
                      "hide_value": "",
                      "hide_if": true
                    },
                    {
                      "id": "text-71nnpqzi",
                      "type": "text",
                      "text": "This is a text input type.",
                      "required": true,
                      "hide_id": "",
                      "hide_value": "",
                      "hide_if": true,
                      "subtype": "short"
                    },
                    {
                      "id": "datetime-79ygddzl",
                      "type": "datetime",
                      "text": "This is a date input type (date only).",
                      "required": true,
                      "hide_id": "",
                      "hide_value": "",
                      "hide_if": true,
                      "subtype": "date"
                    },
                    {
                      "id": "multi-q8bohlar",
                      "type": "multi",
                      "text": "This is a multiple choice type with branching demo.",
                      "required": true,
                      "hide_id": "",
                      "hide_value": "",
                      "hide_if": true,
                      "modal": false,
                      "radio": true,
                      "shuffle": true,
                      "options": [
                        "apple",
                        "orange",
                        "banana"
                      ]
                    },
                    {
                      "id": "instruction-mof4ymv4",
                      "type": "instruction",
                      "text": "This will only show if the user selects banana from the previous question",
                      "required": false,
                      "hide_id": "multi-q8bohlar",
                      "hide_value": "banana",
                      "hide_if": false
                    }
                  ],
                  "shuffle": false
                },
                {
                  "name": "Section 2",
                  "questions": [
                    {
                      "id": "media-o3p069gi",
                      "type": "media",
                      "text": "This is a media type.",
                      "required": false,
                      "hide_id": "",
                      "hide_value": "",
                      "hide_if": true,
                      "subtype": "image",
                      "src": "https://getschema.app/img/schema_banner.jpg",
                      "thumb": ""
                    },
                    {
                      "id": "slider-0yih1evt",
                      "type": "slider",
                      "text": "This is a slider type",
                      "required": true,
                      "hide_id": "",
                      "hide_value": "",
                      "hide_if": true,
                      "min": 0,
                      "max": 10,
                      "hint_left": "less",
                      "hint_right": "more"
                    },
                    {
                      "id": "yesno-mv09ggb1",
                      "type": "yesno",
                      "text": "This is a switch",
                      "required": true,
                      "hide_id": "",
                      "hide_value": "",
                      "hide_if": true,
                      "yes_text": "Yes",
                      "no_text": "No"
                    }
                  ],
                  "shuffle": false
                }
              ],
              "shuffle": false,
              "condition": "*",
              "uuid": "dee87a08-8616-453a-9a6e-9e8f8ea9c942",
              "unlock_after": []
            }
          ]
        ],
        "additionalItems": true,
        "items": {
          "$id": "#/properties/modules/items",
          "type": "object",
          "required": [
            "type",
            "name",
            "submit_text",
            "alerts",
            "graph",
            "sections",
            "shuffle",
            "condition",
            "uuid",
            "unlock_after"
          ],
          "properties": {
            "type": {
              "$id": "#/properties/modules/items/anyOf/0/properties/type",
              "type": "string",
              "title": "Type",
              "description": "The type of the module. Accepted values are survey, info, video, and audio.",
              "default": "",
              "examples": [
                "info",
                "video",
                "audio",
                "survey"
              ]
            },
            "name": {
              "$id": "#/properties/modules/items/anyOf/0/properties/name",
              "type": "string",
              "title": "Name",
              "description": "The name of the module. Basic HTML supported.",
              "default": "",
              "examples": [
                "Welcome"
              ]
            },
            "submit_text": {
              "$id": "#/properties/modules/items/anyOf/0/properties/submit_text",
              "type": "string",
              "title": "Submit Text",
              "description": "The label of the submit button for this module. Note: this value appears only on the final section of a module.",
              "default": "",
              "examples": [
                "Submit"
              ]
            },
            "alerts": {
              "$id": "#/properties/modules/items/anyOf/0/properties/alerts",
              "type": "object",
              "title": "Alerts",
              "description": "Define alerts to be displayed to the user.",
              "default": {},
              "examples": [
                {
                  "title": "Welcome to the study",
                  "message": "Tap to open the app",
                  "duration": 1,
                  "times": [
                    {
                      "hours": 8,
                      "minutes": 30
                    }
                  ],
                  "random": true,
                  "random_interval": 30,
                  "sticky": true,
                  "sticky_label": "Start here",
                  "timeout": false,
                  "timeout_after": 0,
                  "start_offset": 0
                }
              ],
              "required": [
                "title",
                "message",
                "duration",
                "times",
                "random",
                "random_interval",
                "sticky",
                "sticky_label",
                "timeout",
                "timeout_after",
                "start_offset"
              ],
              "properties": {
                "title": {
                  "$id": "#/properties/modules/items/anyOf/0/properties/alerts/properties/title",
                  "type": "string",
                  "title": "Title",
                  "description": "The title that is displayed in the notification (main text).",
                  "default": "",
                  "examples": [
                    "Welcome to the study"
                  ]
                },
                "message": {
                  "$id": "#/properties/modules/items/anyOf/0/properties/alerts/properties/message",
                  "type": "string",
                  "title": "Message",
                  "description": "The message that is displayed in the notification (secondary text).",
                  "default": "",
                  "examples": [
                    "Tap to open the app"
                  ]
                },
                "duration": {
                  "$id": "#/properties/modules/items/anyOf/0/properties/alerts/properties/duration",
                  "type": "integer",
                  "title": "Duration",
                  "description": "Indicates the number of consecutive days that the module should be scheduled to display.",
                  "default": 0,
                  "examples": [
                    1
                  ]
                },
                "times": {
                  "$id": "#/properties/modules/items/anyOf/0/properties/alerts/properties/times",
                  "type": "array",
                  "title": "Scheduled times",
                  "description": "The times that this module should be scheduled for each day. hours indicates the hours (24-hour time) and minutes indicates the minutes (so should be between 0 and 59).",
                  "default": [],
                  "examples": [
                    [
                      {
                        "hours": 8,
                        "minutes": 30
                      }
                    ]
                  ],
                  "additionalItems": true,
                  "items": {
                    "$id": "#/properties/modules/items/anyOf/0/properties/alerts/properties/times/items",
                    "anyOf": [
                      {
                        "$id": "#/properties/modules/items/anyOf/0/properties/alerts/properties/times/items/anyOf/0",
                        "type": "object",
                        "title": "The first anyOf schema",
                        "description": "An explanation about the purpose of this instance.",
                        "default": {},
                        "examples": [
                          {
                            "hours": 8,
                            "minutes": 30
                          }
                        ],
                        "required": [
                          "hours",
                          "minutes"
                        ],
                        "properties": {
                          "hours": {
                            "$id": "#/properties/modules/items/anyOf/0/properties/alerts/properties/times/items/anyOf/0/properties/hours",
                            "type": "integer",
                            "title": "The hours schema",
                            "description": "An explanation about the purpose of this instance.",
                            "default": 0,
                            "examples": [
                              8
                            ]
                          },
                          "minutes": {
                            "$id": "#/properties/modules/items/anyOf/0/properties/alerts/properties/times/items/anyOf/0/properties/minutes",
                            "type": "integer",
                            "title": "The minutes schema",
                            "description": "An explanation about the purpose of this instance.",
                            "default": 0,
                            "examples": [
                              30
                            ]
                          }
                        },
                        "additionalProperties": true
                      }
                    ]
                  }
                },
                "random": {
                  "$id": "#/properties/modules/items/anyOf/0/properties/alerts/properties/random",
                  "type": "boolean",
                  "title": "Randomised alerts?",
                  "description": "Indicates whether the alert times should be randomised. If true, each value from times will be set using the value of random_interval.",
                  "default": false,
                  "examples": [
                    true
                  ]
                },
                "random_interval": {
                  "$id": "#/properties/modules/items/anyOf/0/properties/alerts/properties/random_interval",
                  "type": "integer",
                  "title": "Random interval",
                  "description": "The number of minutes before and after that an alert time should be randomised. For example, if the alert is scheduled for 8.30am and the random_interval is 30, the alert will be scheduled randomly between 8 and 9am.",
                  "default": 0,
                  "examples": [
                    30
                  ]
                },
                "sticky": {
                  "$id": "#/properties/modules/items/anyOf/0/properties/alerts/properties/sticky",
                  "type": "boolean",
                  "title": "Sticky?",
                  "description": "Indicates whether the module should remain available in the Tasks list upon response, allowing the user to access this module repeatedly.",
                  "default": false,
                  "examples": [
                    true
                  ]
                },
                "sticky_label": {
                  "$id": "#/properties/modules/items/anyOf/0/properties/alerts/properties/sticky_label",
                  "type": "string",
                  "title": "Sticky label",
                  "description": "A title that appears above a sticky module on the home screen. Multiple sticky modules that are set to appear in succession will be grouped under this title.",
                  "default": "",
                  "examples": [
                    "Start here"
                  ]
                },
                "timeout": {
                  "$id": "#/properties/modules/items/anyOf/0/properties/alerts/properties/timeout",
                  "type": "boolean",
                  "title": "Timeout?",
                  "description": "If timeout is true, the task will disappear from the list after the number of milliseconds specified in timeout_after have elapsed (if the module is not completed before this time).",
                  "default": false,
                  "examples": [
                    false
                  ]
                },
                "timeout_after": {
                  "$id": "#/properties/modules/items/anyOf/0/properties/alerts/properties/timeout_after",
                  "type": "integer",
                  "title": "Timeout after",
                  "description": "The number of milliseconds after a task is displayed that it will disappear from the list. timeout must be true for this to have any effect.",
                  "default": 0,
                  "examples": [
                    0
                  ]
                },
                "start_offset": {
                  "$id": "#/properties/modules/items/anyOf/0/properties/alerts/properties/start_offset",
                  "type": "integer",
                  "title": "Start offset",
                  "description": "Indicates when the module should first be displayed to the user, where zero is the day that the participant enrolled.",
                  "default": 0,
                  "examples": [
                    0
                  ]
                }
              },
              "additionalProperties": true
            },
            "graph": {
              "$id": "#/properties/modules/items/anyOf/0/properties/graph",
              "type": "object",
              "title": "Graph",
              "description": "Graphs allow visualisation of study data.",
              "default": {},
              "examples": [
                {
                  "display": false
                }
              ],
              "required": [
                "display"
              ],
              "properties": {
                "display": {
                  "$id": "#/properties/modules/items/anyOf/0/properties/graph/properties/display",
                  "type": "boolean",
                  "title": "Display graph?",
                  "description": "Indicates whether this module displays a feedback graph in the Feedback tab. If the value is false, the remaining variables are ignored.",
                  "default": false,
                  "examples": [
                    false
                  ]
                },
                "variable": {
                  "$id": "#/properties/modules/items/anyOf/0/properties/graph/properties/variable",
                  "type": "string",
                  "title": "Variable",
                  "description": "The id of a question object to graph. It must match one of the module's question ids.",
                  "default": "",
                  "examples": [
                    ""
                  ]
                },
                "title": {
                  "$id": "#/properties/modules/items/anyOf/0/properties/graph/properties/title",
                  "type": "string",
                  "title": "Title",
                  "description": "The title of the graph to be displayed in the Feedback tab.",
                  "default": "",
                  "examples": [
                    ""
                  ]
                },
                "blurb": {
                  "$id": "#/properties/modules/items/anyOf/0/properties/graph/properties/blurb",
                  "type": "string",
                  "title": "Blurb",
                  "description": "A brief description of the graph to be displayed below it in the feedback tab. Basic HTML supported.",
                  "default": "",
                  "examples": [
                    ""
                  ]
                },
                "type": {
                  "$id": "#/properties/modules/items/anyOf/0/properties/graph/properties/type",
                  "type": "string",
                  "title": "Type",
                  "description": "The type of graph to display. One of: bar or line",
                  "default": "",
                  "examples": [
                    "bar",
                    "line"
                  ]
                },
                "max_points": {
                  "$id": "#/properties/modules/items/anyOf/0/properties/graph/properties/max_points",
                  "type": "integer",
                  "title": "Max points",
                  "description": "The maximum number of data points to display in the graph, e.g. 10 will only show the ten most recent responses.",
                  "default": 10,
                  "examples": [
                    0,
                    10
                  ]
                }
              }
            },
            "additionalProperties": true
          },
          "sections": {
            "$id": "#/properties/modules/items/anyOf/0/properties/sections",
            "type": "array",
            "title": "Sections",
            "description": "Sections contain questions",
            "default": [],
            "examples": [
              [
                {
                  "name": "Welcome",
                  "questions": [
                    {
                      "id": "instruction-1wnjocfw",
                      "type": "instruction",
                      "text": "Hello! Welcome to the study! This module only shows for those enrolled in the control condition.",
                      "required": false,
                      "hide_id": "",
                      "hide_value": "",
                      "hide_if": true
                    }
                  ],
                  "shuffle": false
                }
              ]
            ],
            "additionalItems": true,
            "items": {
              "$id": "#/properties/modules/items/anyOf/0/properties/sections/items",
              "required": [
                "name",
                "questions",
                "shuffle"
              ],
              "properties": {
                "name": {
                  "$id": "#/properties/modules/items/anyOf/0/properties/sections/items/anyOf/0/properties/name",
                  "type": "string",
                  "title": "Section name",
                  "description": "The title of this section, which is displayed at the top of the screen.",
                  "default": "",
                  "examples": [
                    "Welcome"
                  ]
                },
                "questions": {
                  "$id": "#/properties/modules/items/anyOf/0/properties/sections/items/anyOf/0/properties/questions",
                  "type": "array",
                  "title": "Questions",
                  "description": "An array containing all of the questions for this section of the module.",
                  "default": [],
                  "examples": [
                    [
                      {
                        "id": "instruction-1wnjocfw",
                        "type": "instruction",
                        "text": "Hello! Welcome to the study! This module only shows for those enrolled in the control condition.",
                        "required": false,
                        "hide_id": "",
                        "hide_value": "",
                        "hide_if": true
                      }
                    ]
                  ],
                  "additionalItems": true,
                  "items": {
                    "required": [
                      "id",
                      "type",
                      "text",
                      "required",
                      "hide_id",
                      "hide_value",
                      "hide_if"
                    ],
                    "properties": {
                      "id": {
                        "$id": "#/properties/modules/items/anyOf/0/properties/sections/items/anyOf/0/properties/questions/items/anyOf/0/properties/id",
                        "type": "string",
                        "title": "Question ID",
                        "description": "A unique id to identify this question. This id is sent to the server along with any response value. Note: Every element in the entire study protocol must have a unique id for some features to function correctly.",
                        "default": "",
                        "examples": [
                          "instruction-1wnjocfw"
                        ]
                      },
                      "type": {
                        "$id": "#/properties/modules/items/anyOf/0/properties/sections/items/anyOf/0/properties/questions/items/anyOf/0/properties/type",
                        "type": "string",
                        "title": "Type",
                        "description": "The primary type of this question. Accepted values are instruction, datetime, multi, text, slider, video, audio, and yesno.",
                        "default": "",
                        "enum": [
                          "instruction",
                          "datetime",
                          "multi",
                          "text",
                          "slider",
                          "video",
                          "audio",
                          "yesno"
                        ]
                      },
                      "text": {
                        "$id": "#/properties/modules/items/anyOf/0/properties/sections/items/anyOf/0/properties/questions/items/anyOf/0/properties/text",
                        "type": "string",
                        "title": "Text",
                        "description": "The label displayed alongside the question. Basic HTML supported.",
                        "default": "",
                        "examples": [
                          "Hello! Welcome to the study! This module only shows for those enrolled in the control condition."
                        ]
                      },
                      "required": {
                        "$id": "#/properties/modules/items/anyOf/0/properties/sections/items/anyOf/0/properties/questions/items/anyOf/0/properties/required",
                        "type": "boolean",
                        "title": "Required",
                        "description": "Denotes whether this question is required to be answered. The app will force the participant to answer all required questions that are not hidden by branching.",
                        "default": false,
                        "examples": [
                          false,
                          true
                        ]
                      },
                      "hide_id": {
                        "$id": "#/properties/modules/items/anyOf/0/properties/sections/items/anyOf/0/properties/questions/items/anyOf/0/properties/hide_id",
                        "type": "string",
                        "title": "Hide/Show for ID",
                        "description": "The id of the question that will trigger this question to dynamically show/hide. To use branching, you need to add two additional properties to the question object that is to be dynamically shown/hidden. Currently, branching is supported by the multi, yesno, and slider question types.",
                        "default": "",
                        "examples": [
                          ""
                        ]
                      },
                      "hide_value": {
                        "$id": "#/properties/modules/items/anyOf/0/properties/sections/items/anyOf/0/properties/questions/items/anyOf/0/properties/hide_value",
                        "type": "string",
                        "title": "Hide/show value",
                        "description": "The value that needs to be selected in the question denoted by hide_id which will make this question appear. When using sliders, the value should be prefixed with a direction and is inclusive, e.g. >50 or <50.",
                        "default": "",
                        "examples": [
                          ""
                        ]
                      },
                      "hide_if": {
                        "$id": "#/properties/modules/items/anyOf/0/properties/sections/items/anyOf/0/properties/questions/items/anyOf/0/properties/hide_if",
                        "type": "boolean",
                        "title": "Hide or show?",
                        "description": "Indicates the branching behaviour. If true, the element will disappear if the value of the question equals hide_value. If false, the element will appear appear instead.",
                        "default": false,
                        "examples": [
                          true
                        ]
                      },
                      "rand_group": {
                        "§id": "#/properties/modules/items/anyOf/0/properties/sections/items/anyOf/0/properties/questions/items/anyOf/0/properties/rand_group",
                        "type": "string",
                        "title": "Random Group identifier",
                        "description": "An identifier that groups a set of elements together so that only one will randomly appear every time a module is accessed. Note: To identify which element was visible, it will be given a response value of 1. If the element can record a response this value will be replaced with that response. All hidden elements will record no response."
                      }
                    },
                    "dependencies": {
                      "type": {
                        "oneOf": [
                          {
                            "properties": {
                              "type": {
                                "enum": [
                                  "text"
                                ]
                              },
                              "subtype": {
                                "type": "string",
                                "title": "Subtype",
                                "description": "The specific type of text input for this field. Accepted values are short, long, and numeric."
                              }
                            }
                          },
                          {
                            "properties": {
                              "type": {
                                "enum": [
                                  "datetime"
                                ]
                              },
                              "subtype": {
                                "type": "string",
                                "title": "Subtype",
                                "description": "The specific type of date/time input for this field. Accepted values are date (datepicker only), time (timepicker only), and datetime (both)."
                              }
                            }
                          },
                          {
                            "properties": {
                              "type": {
                                "enum": [
                                  "yesno"
                                ]
                              },
                              "yes_text": {
                                "type": "string",
                                "title": "Yes Text",
                                "description": "The label for a true/yes response."
                              },
                              "no_text": {
                                "type": "string",
                                "title": "No Text",
                                "description": "The label for a false/no response."
                              }
                            }
                          },
                          {
                            "properties": {
                              "type": {
                                "enum": [
                                  "slider"
                                ]
                              },
                              "min": {
                                "type": "number",
                                "title": "Minimum",
                                "description": "The minimum value for the slider."
                              },
                              "max": {
                                "type": "number",
                                "title": "Maximum",
                                "description": "The maximum value for the slider."
                              },
                              "hint_left": {
                                "type": "string",
                                "title": "Hint Left",
                                "description": "The label for the left side of the slider."
                              },
                              "hint_right": {
                                "type": "string",
                                "title": "Hint Right",
                                "description": "The label for the right side of the slider."
                              }
                            }
                          },
                          {
                            "properties": {
                              "type": {
                                "enum": [
                                  "multi"
                                ]
                              },
                              "radio": {
                                "type": "boolean",
                                "title": "Radio buttons?",
                                "description": "Denotes whether the multiple choice should be radio buttons (one selection only) or checkboxes (multiple selections allowed)."
                              },
                              "modal": {
                                "type": "boolean",
                                "title": "Modal?",
                                "description": "Denotes whether the selections should appear in a modal popup (good for longer lists)"
                              },
                              "shuffle": {
                                "type": "boolean",
                                "title": "Shuffle?",
                                "description": "Denotes whether the selections should be shuffled."
                              },
                              "options": {
                                "type": "array",
                                "title": "Options",
                                "description": "The list of choices to display.",
                                "items": {
                                  "type": "string"
                                }
                              }
                            }
                          },
                          {
                            "properties": {
                              "type": {
                                "enum": [
                                  "media"
                                ]
                              },
                              "subtype": {
                                "type": "string",
                                "title": "Subtype",
                                "description": "The type of media. Accepted values are video, audio, and image."
                              },
                              "src": {
                                "type": "string",
                                "title": "Source",
                                "description": "A direct URL to the media source."
                              },
                              "thumb": {
                                "type": "string",
                                "title": "Thumbnail",
                                "description": "Required for video elements. A direct URL to the placeholder image that is displayed in the video player while loading."
                              }
                            }
                          }
                        ]
                      }
                    },
                    "additionalProperties": true
                  }
                },
                "shuffle": {
                  "$id": "#/properties/modules/items/anyOf/0/properties/sections/items/anyOf/0/properties/shuffle",
                  "type": "boolean",
                  "title": "Shuffle?",
                  "description": "Used for counterbalancing. If true, the order of the questions in this section will be randomised.",
                  "default": false,
                  "examples": [
                    false
                  ]
                }
              },
              "additionalProperties": true
            }
          },
          "shuffle": {
            "$id": "#/properties/modules/items/anyOf/0/properties/shuffle",
            "type": "boolean",
            "title": "Shuffle",
            "description": "Used for counterbalancing. If true, the order of the sections will be randomised every time the module is accessed.",
            "default": false,
            "examples": [
              false,
              true
            ]
          },
          "condition": {
            "$id": "#/properties/modules/items/anyOf/0/properties/condition",
            "type": "string",
            "title": "Condition",
            "description": "The condition that this module belongs to. It must match one of the values from the conditions array from the study properties, or have the value * to be scheduled for all participants.",
            "default": "",
            "examples": [
              "Control",
              "Trial"
            ]
          },
          "uuid": {
            "$id": "#/properties/modules/items/anyOf/0/properties/uuid",
            "type": "string",
            "title": "Unique identifier",
            "description": "A unique identifier for this module. Will be generated if not provided.",
            "default": "",
            "examples": [
              ""
            ]
          },
          "unlock_after": {
            "$id": "#/properties/modules/items/anyOf/0/properties/unlock_after",
            "type": "array",
            "title": "Unlock after",
            "description": "A list of UUIDs of modules that must be completed before this module will appear on the task list.",
            "default": [],
            "examples": [
              []
            ],
            "additionalItems": true,
            "items": {
              "$id": "#/properties/modules/items/anyOf/0/properties/unlock_after/items"
            }
          }
        },
        "additionalProperties": true
      }
    }
  }