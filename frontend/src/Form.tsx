import { MuiForm5 as FormComponent } from "@rjsf/material-ui";
import { JSONSchemaType } from "ajv";
import React, { useMemo } from "react";
import { module } from "../schema/module";
import { properties } from "../schema/properties";
import { question } from "../schema/question";
import { section } from "../schema/section";
import { State, useStore } from "./state";

export function Form({ id }: { id: string }) {
  const [data, update, schema] = useForm(id);


  let uiSchema = {
    title: { "ui:widget": "date" },
    "ui:submitButtonOptions": {
      norender: true,
    },
  };

  const hiddenFields = ["id", "study_id", "post_url"]
  hiddenFields.forEach(field => uiSchema[field] = { "ui:widget": "hidden" })

  return (
    <FormComponent
      onChange={({ formData }) => update(formData)}
      // onSubmit={(e) => study && upload(study, schema)}
      //@ts-ignore
      schema={schema}
      formData={data}
      uiSchema={uiSchema}
      idPrefix="form"
    />
  );
}
function useForm(id: string): [Properties | Module | Section | Question, (from: any) => void, Object] { // Returns [ current form data, changehandler to update data, schema for form ]
  const store = useStore.getState()
  const data = store.modules.get(id) || store.sections.get(id) || store.questions.get(id) || store.study.properties;
  if (store.modules.get(id)) return [data, store.setModule, module];
  if (store.sections.get(id)) return [data, store.setSection, section];
  if (store.questions.get(id)) return [data, store.setQuestion, question];
  return [data, store.setProperties, properties];
}
