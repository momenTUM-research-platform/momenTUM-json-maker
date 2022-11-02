import { MuiForm5 as FormComponent } from "@rjsf/material-ui";
import React, { useMemo } from "react";
import { module } from "../schema/module";
import { properties } from "../schema/properties";
import { question } from "../schema/question";
import { section } from "../schema/section";
import { State, useStore } from "./state";

export function Form({ id }: { id: string }) {
  const store = useStore();
  const [data, update, schema] = extractFormInformation(store, id);
  console.log(data, store.study.properties);

  const uiSchema = {
    "ui:submitButtonOptions": {
      norender: true,
    },
    title: { "ui:widget": "date" },
    id: { "ui:widget": "hidden" },
  };
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
function extractFormInformation(store: State, id: string): [any, any, any] {
  console.log("Running memoization");
  const data = store.modules[id] || store.sections[id] || store.questions[id] || store.study;
  if (store.modules[id]) return [data, store.setModule, module];
  if (store.sections[id]) return [data, store.setSection, section];
  if (store.questions[id]) return [data, store.setQuestion, question];
  return [data, store.setProperties, properties];
}
