import { properties } from "../../../schema/properties";
import { CheckboxWidget } from "./components/CheckboxWidget";
import DescriptionWidget from "./components/DescriptionWidget";
import ArrayFieldTemplate from "./components/ArrayFieldTemplate";
import TitleWidget from "./components/TitleWidget";

export const propertiesSchema: { [key: string]: any } = {

  cache: {
    "ui:widget": CheckboxWidget,
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

  },
};
