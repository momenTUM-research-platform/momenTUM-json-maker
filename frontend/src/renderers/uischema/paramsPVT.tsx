import IntegerFieldWidget from "./components/IntegerFieldWidget";

export const ParamsPVtSchema: { [key: string]: any } = {
  trials: {
    "ui:widget": IntegerFieldWidget,
  },
  min_waiting: {
    "ui:widget": IntegerFieldWidget,
  },
  max_waiting: {
    "ui:widget": IntegerFieldWidget,
  },
  max_reaction: {
    "ui:widget": IntegerFieldWidget,
  },
  show: {
    "ui:widget": "radio",
  },
  exit: {
    "ui:widget": "radio",
  },
};
