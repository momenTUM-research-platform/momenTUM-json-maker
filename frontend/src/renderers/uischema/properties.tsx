import { properties } from "../../../schema/properties";
import DescriptionWidget from "./components/DescriptionWidget";
import ArrayFieldTemplate from "./components/ArrayFieldTemplate";
import TitleWidget from "./components/TitleWidget";

export const propertiesSchema: { [key: string]: any } = {
  cache: { "ui:widget": "radio" },
  radio: { "ui:widget": "radio" },
  required: { "ui:widget": "radio" },
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
