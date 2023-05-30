import { module } from "../../../schema/module";
import TextFieldWidget from "./components/TextFieldWidget";
import TitleWidget from "./components/TitleWidget";
import ArrayFieldTemplate from "./components/ArrayFieldTemplate";
import { alerts } from "../../../schema/alerts";
import DescriptionWidget from "./components/DescriptionWidget";
import { graph } from "../../../schema/graph";
import IntegerFieldWidget from "./components/IntegerFieldWidget";

export const modulesSchema: { [key: string]: any } = {
  name: {
    "ui:widget": TextFieldWidget,
  },
  submit_text: {
    "ui:widget": TextFieldWidget,
  },
  // condition: {
  //   "ui:widget": TextFieldWidget,
  // },
  alerts: {
    random: { "ui:widget": "radio" },
    sticky: { "ui:widget": "radio" },
    timeout: { "ui:widget": "radio" },
    title: {
      "ui:widget": TextFieldWidget,
    },
    message: {
      "ui:widget": TextFieldWidget,
    },
    duration: {
      "ui:widget": IntegerFieldWidget,
    },
    times: {
      "ui:ArrayFieldTemplate": ArrayFieldTemplate, // Use custom ArrayFieldTemplate component
      "ui:title": <TitleWidget Title={alerts.properties.times.title} />,
      "ui:description": (
        <DescriptionWidget description={alerts.properties.times.description} />
      ),
      items: {
        hours: {
          "ui:widget": IntegerFieldWidget,
        },
        minutes: {
          "ui:widget": IntegerFieldWidget,
        },
      },
    },
    random_interval: {
      "ui:widget": IntegerFieldWidget,
    },
    sticky_label: {
      "ui:widget": TextFieldWidget,
    },
    timeout_after: {
      "ui:widget": IntegerFieldWidget,
    },
    start_offset: {
      "ui:widget": IntegerFieldWidget,
    },
    "ui:title": <TitleWidget Title={alerts.title} />,
    "ui:description": <DescriptionWidget description={alerts.description} />,
  },

  graph: {
    display: { "ui:widget": "radio" },
    "ui:title": <TitleWidget Title={graph([]).title} />,
    "ui:description": <DescriptionWidget description={graph([]).description} />,
  },
  unlock_after: {
    "ui:title": (
      <TitleWidget Title={module([], [], []).properties.unlock_after.title} />
    ),
    "ui:description": (
      <DescriptionWidget
        description={module([], [], []).properties.unlock_after.description}
      />
    ),
    "ui:ArrayFieldTemplate": ArrayFieldTemplate, // Use custom ArrayFieldTemplate component
    "ui:options": {
      addable: true, // Allow adding new items
      removable: true, // Allow removing items
    },
    // items: {
    //   "ui:widget": TextFieldWidget, // Example: Use TextFieldWidget for each item
    // },
  },
};
