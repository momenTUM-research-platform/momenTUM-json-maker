import { module } from "../../../schema/module";
import TitleWidget from "./components/TitleWidget";
import ArrayFieldTemplate from "./components/ArrayFieldTemplate";
import { alerts } from "../../../schema/alerts";
import DescriptionWidget from "./components/DescriptionWidget";
import { graph } from "../../../schema/graph";

export const modulesSchema: { [key: string]: any } = {
  modal: { "ui:widget": "radio" },
  hide_if: { "ui:widget": "radio" },
  alerts: {
    random: { "ui:widget": "radio" },
    sticky: { "ui:widget": "radio" },
    timeout: { "ui:widget": "radio" },
    times: {
      "ui:ArrayFieldTemplate": ArrayFieldTemplate, // Use custom ArrayFieldTemplate component
      "ui:title": <TitleWidget Title={alerts.properties.times.title} />,
      "ui:description": (
        <DescriptionWidget description={alerts.properties.times.description} />
      ),
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
