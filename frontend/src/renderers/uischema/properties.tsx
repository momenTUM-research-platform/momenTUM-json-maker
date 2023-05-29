import { properties } from "../../../schema/properties";
import { CheckboxWidget } from "./components/CheckboxWidget";
import DescriptionWidget from "./components/DescriptionWidget";
import { EmailWidget } from "./components/EmailWidget";
import { TextFieldWidget } from "./components/TextFieldWidget";
import TitleWidget from "./components/TitleWidget";

export const propertiesSchema: { [key: string]: any } = {
  study_name: {
    "ui:widget": TextFieldWidget,
  },
  study_id: {
    "ui:widget": TextFieldWidget,
  },
  created_by: {
    "ui:widget": TextFieldWidget,
  },
  instructions: {
    "ui:widget": TextFieldWidget,
  },
  post_url: {
    "ui:widget": TextFieldWidget,
  },
  empty_msg: {
    "ui:widget": TextFieldWidget,
  },
  banner_url: {
    "ui:widget": TextFieldWidget,
  },
  support_url: {
    "ui:widget": TextFieldWidget,
  },
  support_email: {
    "ui:widget": EmailWidget,
  },
  cache: {
    "ui:widget": CheckboxWidget,
  },
  ethics: {
    "ui:widget": TextFieldWidget,
  },
  pls: {
    "ui:widget": TextFieldWidget,
  },
  conditions: {
    "ui:title": <TitleWidget Title={properties.title} />,
    "ui:description": (
      <DescriptionWidget description={properties.description} />
    ),
    "ui:options": {
      addable: true, // Allow adding new items
      removable: true, // Allow removing items
    },
    items: {
      // Define the widget for each item in the array
      "ui:widget": TextFieldWidget, // Example: Use TextFieldWidget for each item
    },
  },
};
