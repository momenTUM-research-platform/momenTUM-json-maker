import { MuiForm5 as FormComponent } from "@rjsf/material-ui";
import { useStore } from "../state";
import { upload } from "../utils/actions";

export function Form() {
  const store = useStore();

  const uiSchema = {
    title: { "ui:widget": "date" },
  };

  return (
    <FormComponent
      onChange={({ formData }) => store.s(formData)}
      onSubmit={(e) => study && upload(study, schema)}
      //@ts-ignore
      schema={schema}
      formData={store.study}
      uiSchema={uiSchema}
      idPrefix="form"
    />
  );
}
