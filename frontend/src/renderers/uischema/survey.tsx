import TextFieldWidget from "./components/TextFieldWidget";
import { CheckboxWidget } from "./components/CheckboxWidget";
export const surveySchema: { [key: string]: any } = {
  name: {
    "ui:widget": TextFieldWidget,
  },
  shuffle: { "ui:widget": "radio" },
};
