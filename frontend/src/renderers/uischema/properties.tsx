import { properties } from "../../../schema/properties";
import { CheckboxWidget } from "./components/CheckboxWidget";
import DescriptionWidget from "./components/DescriptionWidget";
import ArrayFieldTemplate from "./components/ArrayFieldTemplate";
import TextFieldWidget from "./components/TextFieldWidget";
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
    "ui:widget": TextFieldWidget,
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
    "ui:title": <TitleWidget Title={properties.properties.conditions.title} />,
    "ui:description": (
      <DescriptionWidget
        description={properties.properties.conditions.description}
      />
    ),
    "ui:ArrayFieldTemplate": ArrayFieldTemplate, // Use custom ArrayFieldTemplate component
    "ui:options": {
      addable: true, // Allow adding new items
      removable: true, // Allow removing items
    },
    items: {
      "ui:widget": TextFieldWidget, // Example: Use TextFieldWidget for each item
    },
  },
};
